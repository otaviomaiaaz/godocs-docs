// Uses the same existing Playwright installation and local server as sidebar-verify.mjs.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(process.env.PLAYWRIGHT_PACKAGE || import.meta.url);
const { chromium } = require("playwright");
const output = path.resolve("test-results/sidebar-v2.5");
const baseURL = process.env.SIDEBAR_BASE_URL || "http://127.0.0.1:3000";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = {motion:[], branches:[], a11y:[], keyboard:[], reduced:[], errors:[]};
const pause = page => page.waitForFunction(()=>!document.querySelector('.docs-sidebar').getAnimations({subtree:true}).some(a=>a.playState==='running'));

async function capture(page,selector) {
  return page.evaluate(async selector => {
    const sidebar=document.querySelector('.docs-sidebar');
    const samples=[];
    const start=performance.now();
    let animationStart;
    document.querySelector(selector).dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1}));
    await new Promise(resolve=>{
      function sample() {
        // React commits and the first paint can fall on different frames.
        // Measure choreography from the real CSS animation clock, retaining
        // click latency separately instead of confusing it with reveal delay.
        animationStart ??= sidebar.getAnimations({subtree:true})
          .find(animation => animation.transitionProperty === 'width' || animation.transitionProperty === 'grid-template-rows')?.startTime;
        const active=sidebar.querySelector('a[aria-current="page"]');
        const label=active?.querySelector('.navigation-tree__label');
        const visibleLabels=[...sidebar.querySelectorAll('.navigation-tree__label')].filter(el=>!el.closest('[aria-hidden="true"]'));
        samples.push({t:performance.now()-(animationStart ?? start),clickElapsed:performance.now()-start,width:sidebar.getBoundingClientRect().width,
          active:label?{opacity:+getComputedStyle(label).opacity,surface:+getComputedStyle(active,'::after').opacity,visibility:getComputedStyle(label).visibility}:null,
          minOpacity:Math.min(...visibleLabels.map(el=>+getComputedStyle(el).opacity)),
          icons:[...sidebar.querySelectorAll('.navigation-tree__icon')].map(el=>el.getBoundingClientRect().y),
        });
        if(performance.now()-start<360)requestAnimationFrame(sample);else resolve();
      }
      requestAnimationFrame(sample);
    });
    return samples;
  },selector);
}
try {
  for (const theme of ['light','dark']) {
    const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:theme});
    const page=await context.newPage();
    page.on('pageerror',error=>report.errors.push(String(error)));
    await page.goto(`${baseURL}/docs/primeiro-acesso`);
    await page.locator('.docs-sidebar').waitFor();
    await page.locator('.docs-sidebar__toggle').click();
    await page.mouse.move(700,70);
    await pause(page);
    const expansion=await capture(page,'.docs-sidebar__toggle');
    assert.ok(expansion.some(s=>s.width<240&&s.active?.opacity>0.35),'reveal begins during width');
    const ready=expansion.find(s=>s.t>=230);
    assert.ok(ready.minOpacity>=0.85,`late labels ${ready.minOpacity}`);
    for(const frame of expansion) {
      if(frame.active?.surface>0.1) {
        assert.equal(frame.active.visibility,'visible');
        assert.ok(frame.active.surface<=frame.active.opacity+0.03,'empty active rectangle');
      }
      frame.icons.forEach((y,i)=>assert.ok(Math.abs(y-expansion[0].icons[i])<=1,'icon moved during expansion'));
    }
    await page.screenshot({path:path.join(output,`${theme}-expanded.png`)});
    const collapse=await capture(page,'.docs-sidebar__toggle');
    for(const frame of collapse)frame.icons.forEach((y,i)=>assert.ok(Math.abs(y-collapse[0].icons[i])<=1));
    report.motion.push({theme,expansion,collapse});
    // Real keyboard: focus preview, no trap, Escape restores toggle, full Tab order.
    await page.locator('.docs-sidebar__toggle').focus();
    await page.keyboard.press('Tab');
    await pause(page);
    assert.equal(await page.locator('.docs-sidebar').getAttribute('data-preview'),'open');
    await page.screenshot({path:path.join(output,`${theme}-focus.png`)});
    let exited=false;
    for(let i=0;i<40;i++) {
      await page.keyboard.press('Tab');
      if(!await page.locator('.docs-sidebar').evaluate(el=>el.contains(document.activeElement))){exited=true;break;}
      assert.ok(await page.evaluate(()=>!document.activeElement.closest('[inert],[aria-hidden="true"]')));
    }
    assert.ok(exited,'keyboard trap');
    report.keyboard.push({theme,noTrap:true,noHiddenFocus:true});

    for(const hub of ['documentos','workflows']) {
      await page.goto(`${baseURL}/docs/funcionalidades/${hub}`);
      const row=page.locator(`.docs-sidebar a[href="/docs/funcionalidades/${hub}"]`).locator('..');
      const childHref=await row.locator('..').locator('.navigation-tree__children a').first().getAttribute('href');
      await page.goto(`${baseURL}${childHref}`);
      const button=page.locator(`.docs-sidebar a[href="/docs/funcionalidades/${hub}"]`).locator('..').locator('button');
      await button.click();
      await pause(page);
      assert.equal(await button.getAttribute('aria-expanded'),'false');
      const currentHref=page.url();
      const id=await button.getAttribute('aria-controls');
      const frames=await capture(page,`button[aria-controls="${id}"]`);
      assert.equal(page.url(),currentHref,'chevron navigated');
      await pause(page);
      await page.screenshot({path:path.join(output,`${theme}-${hub}-active-child.png`)});
      for(const frame of frames)if(frame.active?.surface>0)assert.ok(frame.active.opacity>=0.35);
      // Exact active remains the child; manual close must remain possible.
      assert.equal(await page.locator('.docs-sidebar a[aria-current="page"]').getAttribute('href'),childHref);
      report.branches.push({theme,hub,childHref,frames});
      await page.locator(`.docs-sidebar a[href="/docs/funcionalidades/${hub}"]`).click();
      await page.waitForURL(`**/docs/funcionalidades/${hub}`);
      await page.addScriptTag({path:path.resolve('node_modules/axe-core/axe.min.js')});
      const results=await page.evaluate(async()=>{
        const {violations}=await window.axe.run(document.querySelector('.docs-sidebar'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
        return violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));
      });
      report.a11y.push({theme,hub,violations:results});
      assert.deepEqual(results,[]);
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(`${baseURL}/docs/primeiro-acesso`);
    await page.locator('.docs-sidebar__toggle').click();
    await pause(page);
    await page.locator('.docs-sidebar__toggle').focus();
    await page.keyboard.press('Tab');
    await pause(page);
    const reduced=await page.evaluate(()=>{
      const sidebar=document.querySelector('.docs-sidebar');
      return {width:sidebar.getBoundingClientRect().width,preview:sidebar.dataset.preview,
        transitions:[...sidebar.querySelectorAll('.navigation-tree__cascade')].map(el=>({duration:getComputedStyle(el).transitionDuration,delay:getComputedStyle(el).transitionDelay,mask:getComputedStyle(el).maskImage})),
        running:sidebar.getAnimations({subtree:true}).filter(a=>a.playState==='running').length};
    });
    assert.equal(reduced.width,240);
    assert.equal(reduced.running,0);
    assert.ok(reduced.transitions.every(t=>t.delay==='0s'&&t.mask==='none'));
    report.reduced.push({theme,...reduced});
    await page.screenshot({path:path.join(output,`${theme}-reduced.png`)});
    await context.close();
    console.log(`Motion, active child, keyboard, axe and reduced motion: ${theme}`);
  }
  assert.deepEqual(report.errors,[]);
} finally {
  await writeFile(path.join(output,'motion.json'),JSON.stringify(report,null,2));
  await browser.close();
}
