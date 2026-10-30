import {renderStore} from '../../lib/render-store';
import {pageMeta} from '../../lib/seo';
export const dynamic='force-dynamic';
export const metadata=pageMeta('Perfume collections','Shop LRT Perfumes by gender, scent family, brand and collection. Explore new arrivals and bestsellers.','/collection');
export default function Page(){return renderStore({view:'collections'});}
