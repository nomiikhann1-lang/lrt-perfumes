<?php
/** Native WooCommerce CSV columns. Loaded by the existing bridge, not a separate plugin. */
if (!defined('ABSPATH')) exit;
function lrt_csv_fields() {
 return ['brand'=>'Brand','collection'=>'Collection','family'=>'Legacy family','scentFamily'=>'Scent family','gender'=>'Audience','color'=>'Bottle colour','tag'=>'Badge','occasion'=>'Occasion','season'=>'Season','concentration'=>'Concentration','ingredients'=>'Ingredients','care'=>'Care','top'=>'Top notes','heart'=>'Heart notes','base'=>'Base notes','sizes'=>'Sizes (ml)','prices'=>'All market prices (JSON)','variation_AED'=>'Variation price AED','variation_QAR'=>'Variation price QAR'];
}
function lrt_csv_columns($columns) {
 foreach(lrt_csv_fields() as $key=>$label)$columns['lrt_'.$key]='LRT Perfumes '.$label;
 foreach(['AED','QAR'] as $c)foreach([50,100,200] as $size)$columns['lrt_price_'.$c.'_'.$size]='LRT Perfumes '.$size.'ml '.$c;
 return $columns;
}
function lrt_csv_mapping($mapping) {foreach(lrt_csv_columns([]) as $key=>$label){$mapping[$label]=$key;$mapping[strtolower($label)]=$key;}return $mapping;}
function lrt_csv_export($p,$key) {
 $d=lrt_data($p);$key=substr($key,4);
 if(str_starts_with($key,'variation_'))return $p->is_type('variation')?$p->get_meta('_lrt_price_'.substr($key,10)):'';
 if(preg_match('/^price_(AED|QAR)_(\d+)$/',$key,$m))return $d['prices'][$m[1]][(int)$m[2]]??'';
 if($key==='prices')return isset($d['prices'])?wp_json_encode($d['prices'],JSON_UNESCAPED_UNICODE):'';
 if($key==='sizes')return implode(', ',$d['sizes']??[]);
 $index=array_search($key,['top','heart','base'],true);if($index!==false)return $d['notes'][$index]??'';
 return $d[$key]??'';
}
function lrt_csv_price($raw) {
 if($raw===''||$raw===null)return null;
 $n=lrt_number($raw);if($n===null)throw new Exception('LRT market prices must be non-negative numbers using a decimal point.');return $n;
}
function lrt_csv_import($p,$row) {
 $d=lrt_data($p);$touched=false;
 foreach(lrt_csv_fields() as $key=>$label){$column='lrt_'.$key;if(!array_key_exists($column,$row))continue;$touched=true;$raw=$row[$column];
  if(str_starts_with($key,'variation_')){if($p->is_type('variation')){$value=lrt_csv_price($raw);$p->update_meta_data('_lrt_price_'.substr($key,10),$value===null?'':$value);}continue;}
  if($key==='prices'){
   if($raw==='')continue;$prices=json_decode($raw,true);if(!is_array($prices))throw new Exception('Invalid LRT market prices JSON.');
   foreach($prices as $c=>$sizes){if(!in_array($c,['AED','QAR'],true)||!is_array($sizes))throw new Exception('Invalid LRT market currency.');foreach($sizes as $size=>$value){if(!ctype_digit((string)$size)||(int)$size<1||(int)$size>2000)throw new Exception('Invalid LRT market size.');$d['prices'][$c][(int)$size]=lrt_csv_price($value);}}continue;
  }
  if($key==='sizes'){$sizes=array_filter(array_map('trim',explode(',',$raw)),fn($v)=>$v!=='');foreach($sizes as $size)if(!ctype_digit($size)||(int)$size<1||(int)$size>2000)throw new Exception('LRT sizes must be whole millilitres from 1 to 2000.');$d['sizes']=array_values(array_unique(array_map('intval',$sizes)));continue;}
  $index=array_search($key,['top','heart','base'],true);if($index!==false){$d['notes'][$index]=sanitize_text_field($raw);continue;}
  $d[$key]=in_array($key,['ingredients','care'],true)?sanitize_textarea_field($raw):sanitize_text_field($raw);
 }
 foreach(['AED','QAR'] as $c)foreach([50,100,200] as $size){$key='lrt_price_'.$c.'_'.$size;if(array_key_exists($key,$row)){$d['prices'][$c][$size]=lrt_csv_price($row[$key]);$touched=true;}}
 // Native Regular price is the authoritative 50 ml QAR value for simple products.
 // Variation rows retain WooCommerce semantics: regular price belongs to that variation's size.
 if($p->is_type('simple')&&($d||$touched)){
  if(array_key_exists('regular_price',$row)){$d['prices']['QAR'][50]=lrt_csv_price($row['regular_price']);}
  if(isset($d['prices']['QAR'])&&array_key_exists(50,$d['prices']['QAR']))$p->set_regular_price($d['prices']['QAR'][50]===null?'':(string)$d['prices']['QAR'][50]);
 }
 if($p->is_type('variation')){
  if(array_key_exists('regular_price',$row))$p->update_meta_data('_lrt_price_QAR',lrt_csv_price($row['regular_price'])??'');
  elseif(array_key_exists('lrt_variation_QAR',$row))$p->set_regular_price($p->get_meta('_lrt_price_QAR'));
 }
 if($touched||$d){if(isset($d['notes'])){$d['notes']=array_replace(['','',''],$d['notes']);ksort($d['notes']);}$p->update_meta_data('_lrt_data',$d);}
 return $p;
}
add_filter('woocommerce_product_export_column_names','lrt_csv_columns');
add_filter('woocommerce_product_export_product_default_columns','lrt_csv_columns');
add_filter('woocommerce_csv_product_import_mapping_options','lrt_csv_columns');
add_filter('woocommerce_csv_product_import_mapping_default_columns','lrt_csv_mapping');
foreach(lrt_csv_columns([]) as $key=>$label)add_filter('woocommerce_product_export_product_column_'.$key,function($value,$p)use($key){return lrt_csv_export($p,$key);},10,2);
add_filter('woocommerce_product_export_product_column_regular_price',function($value,$p){if($p->is_type('simple')){$d=lrt_data($p);if(isset($d['prices']['QAR'])&&array_key_exists(50,$d['prices']['QAR']))return $d['prices']['QAR'][50]??'';}if($p->is_type('variation')&&$p->get_meta('_lrt_price_QAR')!=='')return $p->get_meta('_lrt_price_QAR');return $value;},10,2);
add_filter('woocommerce_product_import_pre_insert_product_object','lrt_csv_import',10,2);
