import {securityHeaders} from './lib/security-policy.js';
const config={poweredByHeader:false,productionBrowserSourceMaps:false,reactStrictMode:true,devIndicators:false,async headers(){return [{source:'/(.*)',headers:securityHeaders},{source:'/api/:path*',headers:[{key:'Cache-Control',value:'no-store'}]}];}};export default config;
