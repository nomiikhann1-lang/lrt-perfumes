import {permanentRedirect} from 'next/navigation';
export default async function Page({params}){const {slug=[]}=await params;permanentRedirect('/collection'+(slug.length?'/'+slug.join('/') :''));}
