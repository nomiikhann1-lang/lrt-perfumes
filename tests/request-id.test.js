import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {newRequestId} from '../lib/request-id.js';
test('HTTP preview fallback generates valid unique v4 checkout identifiers',()=>{const api={getRandomValues:webcrypto.getRandomValues.bind(webcrypto)};const a=newRequestId(api),b=newRequestId(api);assert.match(a,/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);assert.notEqual(a,b);});
import {POST} from '../app/api/checkout/route.js';
test('checkout permits configured proxy origin but still rejects unrelated origins',async()=>{const old=process.env.CHECKOUT_ORIGIN;try{process.env.CHECKOUT_ORIGIN='https://store.example.test';const accepted=await POST(new Request('http://internal:3000/api/checkout',{method:'POST',headers:{'Content-Type':'application/json',origin:'https://store.example.test'},body:'{}'}));assert.equal(accepted.status,400);const rejected=await POST(new Request('http://internal:3000/api/checkout',{method:'POST',headers:{'Content-Type':'application/json',origin:'https://attacker.example.test'},body:'{}'}));assert.equal(rejected.status,403);}finally{if(old===undefined)delete process.env.CHECKOUT_ORIGIN;else process.env.CHECKOUT_ORIGIN=old;}});
