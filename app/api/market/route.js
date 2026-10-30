import {headers} from 'next/headers';
export const dynamic='force-dynamic';
export async function GET(){const h=await headers();const region=(h.get('x-vercel-ip-country')||h.get('cf-ipcountry')||'').toUpperCase();return Response.json({country:region==='AE'?'AE':'QA'},{headers:{'Cache-Control':'private, no-store'}});}
