<?php
// Pure hook harness: exercises real bridge code; does not emulate a live WooCommerce installation.
define('ABSPATH',__DIR__);$hooks=[];
function add_filter($name,$fn,$priority=10,$args=1){global $hooks;$hooks[$name][]=$fn;}
function add_action($name,$fn,$priority=10,$args=1){}
function sanitize_text_field($s){return trim(strip_tags($s));}
function sanitize_textarea_field($s){return trim(strip_tags($s));}
function wp_json_encode($v,$flags=0){return json_encode($v,$flags);}
class Product {public $meta=[];public $regular='';public $type='simple';function is_type($t){return $t===$this->type;}function get_meta($k){return $this->meta[$k]??'';}function update_meta_data($k,$v){$this->meta[$k]=$v;}function set_regular_price($v){$this->regular=$v;}}
require __DIR__.'/../wordpress/lrt-bridge/lrt-bridge.php';
function check($value,$message){if(!$value)throw new Exception($message);echo 'PASS '.$message."\n";}
$p=new Product();$p->meta['_lrt_data']=['brand'=>'Brand A','collection'=>'Evening','family'=>'Woody','scentFamily'=>'Earthy','gender'=>'Unisex','color'=>'#abc123','tag'=>'New','occasion'=>'Evening','season'=>'Winter','concentration'=>'EDP','ingredients'=>"Alcohol\nFragrance",'care'=>'Store away from sunlight','notes'=>['Rose, saffron','Jasmine, iris','Oud, musk'],'sizes'=>[50,55,100,200],'prices'=>['QAR'=>[50=>125.5,55=>135,100=>209,200=>null],'AED'=>[50=>99,55=>109,100=>0,200=>299]]];
$columns=lrt_csv_columns([]);$headers=array_merge(['Regular price'],array_values($columns));$values=['125.5'];foreach($columns as $key=>$label)$values[]=lrt_csv_export($p,$key);
$f=fopen('php://temp','r+');fputcsv($f,$headers,',','"','');fputcsv($f,$values,',','"','');rewind($f);$h=fgetcsv($f,0,',','"','');$v=fgetcsv($f,0,',','"','');$mapping=lrt_csv_mapping(['Regular price'=>'regular_price']);$row=[];foreach($h as $i=>$header){check(isset($mapping[$header]),'automatic mapping: '.$header);$row[$mapping[$header]]=$v[$i];}
$q=lrt_csv_import(new Product(),$row);$expected=$p->meta['_lrt_data'];unset($expected['family']);$expected['scentFamily']='Woody';check($q->meta['_lrt_data']==$expected,'all scent fields, commas, multiline care and arbitrary-size market prices round trip');check($q->regular==='125.5','regular price equals 50ml QAR');
$q=lrt_csv_import($q,['regular_price'=>'140','lrt_price_QAR_50'=>'150']);check($q->meta['_lrt_data']['prices']['QAR'][50]===140.0,'native regular price wins explicit conflict');check($q->meta['_lrt_data']['brand']==='Brand A','omitted columns preserve values');
$q=lrt_csv_import($q,['lrt_price_AED_100'=>'']);check($q->meta['_lrt_data']['prices']['AED'][100]===null,'blank price marks unavailable');
$bad=false;try{lrt_csv_import($q,['lrt_price_QAR_100'=>'-1']);}catch(Exception $e){$bad=true;}check($bad,'negative prices rejected');
$bad=false;try{lrt_csv_import($q,['lrt_prices'=>'invalid']);}catch(Exception $e){$bad=true;}check($bad,'invalid JSON rejected');
$v=new Product();$v->type='variation';lrt_csv_import($v,['regular_price'=>'190','lrt_variation_QAR'=>'200','lrt_variation_AED'=>'175']);check($v->get_meta('_lrt_price_QAR')===190.0&&$v->get_meta('_lrt_price_AED')===175.0,'variation price uses own size, native QAR wins');
echo "CSV hook harness complete. Live WooCommerce import still requires staging verification.\n";
class WP_REST_Request {public $body='';public $time='';public $signature='';function get_body(){return $this->body;}function get_header($h){return $h==='X-Lrt-Time'?$this->time:$this->signature;}function get_route(){return '/lrt/v1/checkout';}function get_method(){return 'POST';}}
class WP_Error {function __construct(public $code,public $message,public $data){}}
define('LRT_API_SECRET',str_repeat('test-only-',5));$request=new WP_REST_Request();$request->time=(string)time();$request->body='{"items":[]}';$request->signature=hash_hmac('sha256',$request->time."\nPOST\ncheckout\n".$request->body,LRT_API_SECRET);check(lrt_auth($request)===true,'valid bridge signature accepted');$request->body='{"items":[1]}';check(lrt_auth($request) instanceof WP_Error,'tampered body rejected');$request->time=(string)(time()-301);check(lrt_auth($request) instanceof WP_Error,'expired signature rejected');$request->body=str_repeat('x',16001);check(lrt_auth($request)->data['status']===413,'oversized signed request rejected before hashing');

check(lrt_csv_import(new Product(),['lrt_family'=>'Warm'])->meta['_lrt_data']['scentFamily']==='Amber','legacy CSV import migrates family');
