import {pageMeta,getCatalog} from '../../../lib/seo';
import {renderStore} from '../../../lib/render-store';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const {slug}=await params;const p=(await getCatalog()).find(p=>p.slug===slug);return pageMeta(p?.name||'Perfume not found',p?.description||'Explore the LRT Perfumes collection.','/product/'+slug,!p);}
export default async function Page({params}){return renderStore({view:'product',productSlug:(await params).slug});}
