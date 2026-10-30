import {permanentRedirect} from 'next/navigation';
import {collectionHref} from '../../lib/collections';
import {pageMeta} from '../../lib/seo';
import {renderStore} from '../../lib/render-store';
export const dynamic='force-dynamic';
export async function generateMetadata({searchParams}){const q=await searchParams;return pageMeta('Shop perfumes by scent family','Explore fresh, flowery, warm, earthy, herbal and gourmand fragrances. Filter perfumes for women, men and everyone.','/shop',Object.keys(q).length>0);}
export default async function Page({searchParams}){const q=await searchParams;if(Object.keys(q).length===1){if(['Men','Women','Unisex'].includes(q.gender))permanentRedirect(collectionHref('All',q.gender));if(['Fresh','Floral','Flowery','Woody','Oud','Earthy','Amber','Warm','Herbal','Gourmand'].includes(q.family))permanentRedirect(collectionHref(q.family));if(q.q==='New')permanentRedirect('/collection/new-arrivals');if(q.q==='Bestseller')permanentRedirect('/collection/bestsellers');}return renderStore({view:'shop',initialQuery:typeof q.q==='string'?q.q.slice(0,160):'',initialFamily:typeof q.family==='string'?q.family.slice(0,100):'All',initialGender:typeof q.gender==='string'?q.gender.slice(0,30):'All'});}
