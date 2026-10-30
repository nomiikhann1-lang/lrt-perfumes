import {collectionsFor} from '../lib/collections';
import {siteUrl,canIndex,getCatalog} from '../lib/seo';
export const dynamic='force-dynamic';
export default async function sitemap(){if(!canIndex)return [];const products=await getCatalog();return ['', '/shop','/about','/contact','/fragrance-guide','/faq','/shipping','/returns','/privacy','/terms','/disclaimer','/stores','/payment-methods','/product-care','/accessibility'].concat(collectionsFor(products).filter(c=>c.slug!=='all').map(c=>(c.group==='Brands'?'/brand/':'/collection/')+c.slug),['/collection','/brand']).concat(products.map(p=>'/product/'+p.slug)).map(path=>({url:siteUrl+path}));}
