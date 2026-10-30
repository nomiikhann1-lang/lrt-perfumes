import {siteUrl,canIndex} from '../lib/seo';
export default function robots(){return {rules:{userAgent:'*',allow:canIndex?'/':undefined,disallow:canIndex?['/api/','/cart','/checkout','/account']:['/']},sitemap:siteUrl+'/sitemap.xml'};}
