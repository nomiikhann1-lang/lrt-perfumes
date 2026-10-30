import {NextResponse} from 'next/server';
import {randomBytes} from 'node:crypto';
import {contentSecurityPolicy,isPrivatePath} from './lib/security-policy';
export function proxy(request){
 const path=request.nextUrl.pathname;
 if(isPrivatePath(path))return new NextResponse('Not found',{status:404,headers:{'Cache-Control':'no-store','Content-Type':'text/plain; charset=utf-8'}});
 const nonce=randomBytes(18).toString('base64');const csp=contentSecurityPolicy(nonce,process.env.NODE_ENV!=='production');
 const headers=new Headers(request.headers);headers.set('x-nonce',nonce);headers.set('Content-Security-Policy',csp);
 const response=NextResponse.next({request:{headers}});response.headers.set('Content-Security-Policy',csp);
 // Nonces belong to this response, so HTML must not be cached and reused.
 if(!path.startsWith('/api/'))response.headers.set('Cache-Control','private, no-store');
 return response;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:png|jpg|jpeg|webp|svg|mp4|woff2)$).*)']};
