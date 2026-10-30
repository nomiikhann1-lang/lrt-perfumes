import test from 'node:test';import assert from 'node:assert/strict';
import {createCatalogCache,normalizeProducts} from '../lib/catalog-service.js';
import {allowRequest,readLimitedBody,trustedPaymentUrl} from '../lib/request-security.js';
import {collectionsFor} from '../lib/collections.js';
test('catalogue cache coalesces concurrent requests and expires',async()=>{let n=0,time=0;const read=createCatalogCache(async()=>{n++;await new Promise(r=>setTimeout(r,5));return [];},{now:()=>time,ttl:60});await Promise.all(Array.from({length:30},()=>read()));assert.equal(n,1);await read();assert.equal(n,1);time=61;await read();assert.equal(n,2);});
test('backend outage cooldown prevents request storms, then retries',async()=>{let n=0,time=0;const read=createCatalogCache(async()=>{n++;throw Error('offline');},{now:()=>time,cooldown:5});await assert.rejects(read());await assert.rejects(read());assert.equal(n,1);time=6;await assert.rejects(read());assert.equal(n,2);});
test('malformed catalogue rejected and optional fields normalized',()=>{assert.throws(()=>normalizeProducts([null]));assert.throws(()=>normalizeProducts([{id:1,name:'A',slug:'a'},{id:1,name:'A',slug:'a'}]));const [p]=normalizeProducts([{id:1,name:'A',slug:'a',image:'javascript:alert(1)'}]);assert.deepEqual(p.notes,[]);assert.equal(p.image,'');});
test('request guard limits and expires its window',()=>{for(let i=0;i<12;i++)assert.equal(allowRequest('test',100),true);assert.equal(allowRequest('test',100),false);assert.equal(allowRequest('test',60101),true);});
test('body limit counts bytes and stops chunked bodies',async()=>{const request=new Request('http://localhost',{method:'POST',headers:{Origin:'http://localhost:3000','Content-Type':'application/json'},body:'é'.repeat(9000)});await assert.rejects(readLimitedBody(request),e=>e.status===413);});
test('payment destinations must be HTTPS on WooCommerce origin',()=>{process.env.WORDPRESS_URL='https://commerce.example';assert.equal(trustedPaymentUrl('https://commerce.example/checkout/order-pay/1'),'https://commerce.example/checkout/order-pay/1');for(const url of ['https://attacker.example/pay','javascript:alert(1)','http://commerce.example/pay'])assert.throws(()=>trustedPaymentUrl(url));delete process.env.WORDPRESS_URL;});
test('empty catalogue does not manufacture collections',()=>assert.deepEqual(collectionsFor([]),[]));
import {productSizes} from '../lib/catalog.js';
test('real catalogue sizes are not restricted to demo sizes',()=>assert.deepEqual(productSizes({variants:[{size:100},{size:55},{size:55},{size:0}]}),[55,100]));
import {POST} from '../app/api/checkout/route.js';
test('connected commerce remains gated until explicitly configured',async()=>{
 const before={...process.env};process.env.WORDPRESS_URL='https://commerce.example';process.env.LRT_API_SECRET='a'.repeat(32);delete process.env.COMMERCE_ENABLED;
 try{const result=await POST(new Request('https://shop.example/api/checkout',{method:'POST',headers:{'Content-Type':'application/json',origin:'https://shop.example'},body:JSON.stringify({firstName:'Test',lastName:'Buyer',email:'test@example.com',phone:'+97430000000',address:'Test address',country:'QA',city:'Doha',currency:'QAR',payment:'card',requestId:'test-gate-123456',items:[{id:1,size:50,qty:1}],terms:'on'})}));assert.equal(result.status,503);assert.match((await result.json()).error,/not yet available/);}finally{for(const key of ['WORDPRESS_URL','LRT_API_SECRET','COMMERCE_ENABLED'])if(before[key]===undefined)delete process.env[key];else process.env[key]=before[key];}
});
