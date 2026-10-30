import {readCatalog} from '../../../lib/catalog-service.js';
import {connected} from '../../../lib/wordpress.js';
export async function GET(){try{return Response.json({products:await readCatalog(),mode:connected()?'wordpress':'demo'},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'The catalogue is temporarily unavailable.'},{status:503,headers:{'Cache-Control':'no-store'}});}}
