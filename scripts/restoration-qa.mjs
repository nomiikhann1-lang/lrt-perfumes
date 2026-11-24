import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium}=await import(process.env.QA_PLAYWRIGHT || 'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
const base=process.env.QA_BASE_URL || 'http://localhost:3002';
const page=await browser.newPage();
const errors=[], checks=[];
page.on('pageerror',e=>errors.push(e.message));
await page.context().addCookies([{name:'lrt_cookie_consent',value:'essential',url:base},{name:'lrt_consent_version',value:'2',url:base}]);
const go=async path=>{await page.goto(base+path,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>{const el=document.querySelector('.nav-search-pill input');return el&&Object.keys(el).some(k=>k.startsWith('__reactProps$'));});};
fs.mkdirSync('reports/restoration',{recursive:true});
try{
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/shop','/product/saffron-veil','/contact','/collection','/brand','/fragrance-guide']){
   await go(route);await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' at '+width);
   if(route==='/shop'){
    const layout=await page.locator('.collection .product-card').first().evaluate(el=>({display:getComputedStyle(el).display,columns:getComputedStyle(el).gridTemplateColumns,art:el.querySelector('.product-art').getBoundingClientRect().x,name:el.querySelector('.product-name').getBoundingClientRect().x}));
    if(width<761){assert.equal(layout.display,'grid');assert(layout.name>layout.art);}
    else assert.equal(await page.locator('.product-grid').first().evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),4);
    const header=await page.locator('.store-header').evaluate(el=>{const b=el.querySelector('.brand').getBoundingClientRect(),s=el.querySelector('.nav-search-pill').getBoundingClientRect(),a=el.querySelector('.nav-actions').getBoundingClientRect();return {b:b.x+b.width,s:s.x,end:s.x+s.width,a:a.x,dy:Math.abs(s.y-a.y)};});
    if(width<761){assert(header.b<header.s&&header.end<=header.a&&header.dy<10);}
    await page.screenshot({path:`reports/restoration/shop-${width}.png`});
   }
   if(route==='/product/saffron-veil'){assert.match(await page.locator('.product-taxonomy').innerText(),/SKU\s+LRT-001/);assert.equal(await page.getByText('Oil-based perfume',{exact:true}).count(),0);}
   if(route==='/fragrance-guide'){assert.equal(await page.locator('.guide-family').count(),10);assert.equal(await page.locator('.guide-family img').count(),10);await page.screenshot({path:`reports/restoration/guide-${width}.png`});}
   checks.push(route+' at '+width);
  }
 }
 await go('/shop');
 await page.getByRole('button',{name:'Perfumes',exact:true}).click();
 assert.equal(await page.locator('.perfume-menu-art').count(),3);
 assert.equal(await page.locator('.perfume-menu-links').first().locator('a').count(),10);
 assert(await page.locator('.perfume-menu-links').last().locator('a').count()>0);
 await page.screenshot({path:'reports/restoration/dropdown.png'});
 await page.keyboard.press('Escape');
 await page.getByRole('combobox',{name:'Search perfumes or SKU'}).fill('saffron');
 await page.locator('#nav-matches [role=option]').first().waitFor();
 assert(await page.locator('#nav-matches img[src^="/scent-families/"]').count()>0);
 await page.keyboard.press('Escape');
 await page.getByRole('searchbox',{name:'Search shop'}).fill('saffron');
 assert.equal(await page.locator('.product-name .scent-icon').count(),0);
 await go('/');assert.equal(await page.locator('.occasion-edit,.colour-stories').count(),0);
 assert.equal(await page.locator('a[href="/accessibility"]').count(),0);
 assert.match(await page.locator('footer').innerText(),/AED, Qatar & United Arab Emirates/);
 assert.equal((await page.request.get(base+'/accessibility')).status(),404);
 checks.push('Dropdown images, all family links, dynamic suggestions, header-only search family icons, removed home sections, footer and removed accessibility route');
 assert.deepEqual(errors,[]);
 fs.writeFileSync('reports/restoration/results.json',JSON.stringify({checks,errors},null,2));
 console.log(JSON.stringify({passed:checks.length,errors}));
}finally{await browser.close();}
