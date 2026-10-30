import {mobilePageContent} from '../../lib/mobile-pages';
import {pageMeta} from '../../lib/seo';
import {renderStore} from '../../lib/render-store';
import {pageContent} from '../../lib/pages';
import {notFound} from 'next/navigation';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const {page}=await params;const content=pageContent[page]||mobilePageContent[page];return pageMeta(content?.title||page,content?.intro||'Manage your LRT Perfumes shopping experience.','/'+page,['cart','checkout'].includes(page));}
export default async function Page({params}){const {page}=await params;if(!pageContent[page]&&!['cart','checkout'].includes(page))notFound();return renderStore({view:page});}
