// Optional QA harness: install Playwright separately; no browser tooling is shipped to customers.
// QA_PLAYWRIGHT=/absolute/path/to/playwright-core/index.mjs CHROME_PATH=/path/to/chrome
// QA_BASE_URL=http://127.0.0.1:3002 node scripts/browser-qa.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.QA_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
const base=process.env.QA_BASE_URL||'http://127.0.0.1:3002';
const checks=[],errors=[],failedRequests=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure().errorText}));
const pass=name=>checks.push({name,status:'passed'});
try{
 await page.goto(base);await page.getByRole('button',{name:'Essential only',exact:true}).click();
 assert((await page.context().cookies()).some(c=>c.name==='lrt_cookie_consent'&&c.value==='essential'));pass('Essential-only consent persisted');
 await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('dialog',{name:'Navigation'}).waitFor();await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);pass('Mobile menu and Escape');
 await page.goto(base+'/product/saffron-veil');await page.getByRole('button',{name:'100 ml',exact:true}).click();await page.getByRole('button',{name:'Add to bag',exact:true}).click();assert.equal(await page.getByRole('dialog').count(),0);await page.getByRole('button',{name:/View cart/}).click();await page.getByRole('dialog').waitFor();
 await page.getByRole('button',{name:'Add one Saffron Veil',exact:true}).click();assert((await page.getByRole('dialog').innerText()).includes('QAR 418'));pass('100 ml variant, toast, cart, quantity and total');
 await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:'Shopping bag, 2 items'}).click();pass('Cart persists after reload');await page.getByRole('button',{name:'Continue to checkout'}).click();
 for(const [name,value] of Object.entries({firstName:'Test',lastName:'Buyer',email:'test@example.com',phone:'+97430000000',address:'Test address only'}))await page.locator(`[name=${name}]`).fill(value);
 await page.locator('[name=city]').selectOption('Doha');await page.locator('[name=terms]').check();await page.getByRole('button',{name:'Place test order'}).click();await page.getByRole('dialog',{name:'Order confirmation'}).waitFor();assert((await page.getByRole('dialog').innerText()).includes('QAR 418'));pass('Simulated checkout, correct total; no real payment or order');
 await page.goto(base+'/shop');await page.getByRole('searchbox',{name:'Search shop'}).fill('saffron');assert.equal(await page.locator('.collection .product-card').count(),1);pass('Catalogue search');
 await page.goto(base+'/privacy');await page.getByRole('button',{name:'Manage cookie preferences'}).click();await page.getByRole('button',{name:'Accept all',exact:true}).click();assert((await page.context().cookies()).some(c=>c.name==='lrt_cookie_consent'&&c.value==='all'));assert.equal(await page.locator('.cookie-settings').count(),0);pass('Consent reopening and footer control removal');
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto(base);await page.locator('footer').scrollIntoViewIfNeeded();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);pass('No home/footer overflow at '+width);
  if(process.env.QA_SCREENSHOT_DIR)await page.locator('footer').screenshot({path:process.env.QA_SCREENSHOT_DIR+'/footer-'+width+'.png'});
 }
 const links=[...new Set(await page.locator('footer a').evaluateAll(a=>a.map(x=>x.getAttribute('href'))))];for(const url of [...links,'/collection/men','/collection/warm','/product/saffron-veil'])assert.equal((await page.request.get(base+url)).status(),200,url);pass('Footer, product and collection destinations return 200');
 assert.equal((await page.request.get(base+'/product/nonexistent')).status(),404);pass('Missing product returns 404');assert((await (await page.request.get(base+'/robots.txt')).text()).includes('Disallow: /'));pass('Staging indexing disabled');
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);assert.equal(await page.evaluate(()=>document.fonts.check('14px "DM Sans"')),true);pass('Local font loaded');
 const localResources=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.startsWith(location.origin)).map(r=>({url:new URL(r.name).pathname,bytes:r.transferSize,durationMs:r.duration})));
 assert(!localResources.some(r=>r.url.includes('fonts.googleapis')));assert.equal(await page.locator('img[loading=lazy]').count(),0);pass('No lazy-loaded images');
 assert.deepEqual(errors,[]);pass('No browser JavaScript errors');
 const unexpectedFailures=failedRequests.filter(r=>!r.error.includes('ERR_ABORTED'));
 assert.deepEqual(unexpectedFailures,[]);pass('No unexpected failed network requests');
 fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/browser-qa.json',JSON.stringify({checks,errors,failedRequests,localResources},null,2));console.log(JSON.stringify({passed:checks.length,errors,unexpectedFailures}));
}catch(e){console.error('PAGE ERRORS',errors);console.error('VISIBLE ERRORS',await page.locator('.error').allTextContents());console.error('PAGE',await page.locator('main').innerText());throw e;}finally{await browser.close();}
