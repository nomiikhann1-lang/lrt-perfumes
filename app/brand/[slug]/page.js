import {getCatalog,pageMeta} from '../../../lib/seo';
import {collectionsFor} from '../../../lib/collections';
import {renderStore} from '../../../lib/render-store';
import {notFound} from 'next/navigation';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const {slug}=await params;const c=collectionsFor(await getCatalog()).find(c=>c.group==='Brands'&&c.slug===slug);return pageMeta(c?.title||'Brand not found',c?.description||'Explore LRT Perfumes.','/brand/'+slug,!c);}
export default async function Page({params}){const {slug}=await params;const c=collectionsFor(await getCatalog()).find(c=>c.group==='Brands'&&c.slug===slug);if(!c)notFound();return renderStore({view:'shop',collectionSlug:slug,collectionTitle:c.title,collectionDescription:c.description});}
