import {cache} from 'react';
import {readCatalog} from './catalog-service.js';
import {headers} from 'next/headers';
import {connected} from './wordpress';
export const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||(process.env.VERCEL_URL?'https://'+process.env.VERCEL_URL:'https://lrtperfumes.com')).replace(/\/$/,'');
export const canIndex=process.env.SITE_INDEXING==='true'&&connected();
export const getCatalog=cache(readCatalog);
export function pageMeta(title,description,path,noindex=false){return {title,description,alternates:{canonical:siteUrl+path},robots:{index:canIndex&&!noindex,follow:true},openGraph:{title:title+' | LRT Perfumes',description,url:siteUrl+path,siteName:'LRT Perfumes',type:'website',images:[{url:siteUrl+'/hero-mobile.webp',alt:'LRT Perfumes'}]},twitter:{card:'summary_large_image',title,description,images:[siteUrl+'/hero-mobile.webp']}};}
export async function JsonLd({data}){const nonce=(await headers()).get('x-nonce')||undefined;return <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}}/>;}
