import {renderStore} from '../../lib/render-store';
import {pageMeta} from '../../lib/seo';
export const metadata=pageMeta('Brand collection','Explore fragrance brands at LRT Perfumes.','/brand');
export default function Page(){return renderStore({view:'brands'});}
