// Run against a local server. Uses an existing Playwright installation only:
// PLAYWRIGHT_PACKAGE=/absolute/path/to/playwright/package.json node scripts/sidebar-verify.mjs
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
const report = { desktop: [], mobile: [], errors: [], motion: [], accessibility: [] };
const routes = ["primeiro-acesso", "funcionalidades/documentos", "funcionalidades/workflows"];
const widths = [1920, 1440, 1320, 1319, 1200, 1100, 1024];
const closeEnough = (a, b, label) => assert.ok(Math.abs(a - b) <= 1, `${label}: ${a} vs ${b}`);
async function settle(page) {
  await page.waitForFunction(() => !document.querySelector('.docs-sidebar')?.getAnimations({subtree:true}).some(a => a.playState === 'running'));
}
async function measure(page) {
  return page.evaluate(() => {
    const rect = (selector) => {
      const el = document.querySelector(selector);
      if (!el || !el.getClientRects().length) return null;
      const r = el.getBoundingClientRect();
      return {left:r.left, right:r.right, top:r.top, width:r.width, height:r.height, centerX:r.x+r.width/2, centerY:r.y+r.height/2};
    };
    let precedingChildren = 0;
    const icons = [...document.querySelectorAll('.docs-sidebar .navigation-tree__item[data-depth="0"]')].map(item => {
      const icon = item.querySelector('.navigation-tree__icon');
      const r = icon.getBoundingClientRect();
      const result = {name:item.querySelector('.navigation-tree__label').textContent, y:r.y+r.height/2, precedingChildren};
      precedingChildren += item.querySelector(':scope > .navigation-tree__children-shell')?.getBoundingClientRect().height || 0;
      return result;
    });
    const toggles = [...document.querySelectorAll('.docs-sidebar .navigation-tree__item[data-depth="0"] > .navigation-tree__row')].filter(row=>row.querySelector('button')).map(row=>{
      const r=row.getBoundingClientRect(), b=row.querySelector('button').getBoundingClientRect();
      return {rowY:r.y+r.height/2, buttonY:b.y+b.height/2};
    });
    return { sidebar:rect('.docs-sidebar'), toggle:rect('.docs-sidebar__toggle'), article:rect('.article'), toc:rect('.table-of-contents'), icons, toggles,
      overflow:document.documentElement.scrollWidth>innerWidth,
      toggleTransform:getComputedStyle(document.querySelector('.docs-sidebar__toggle-icon')).transform,
      compact:document.querySelector('.navigation-tree--sidebar').dataset.compact,
      treeCount:document.querySelectorAll('.docs-sidebar .navigation-tree').length };
  });
}
async function triple(page) {
  await settle(page);
  const expanded = await measure(page);
  await page.locator('.docs-sidebar__toggle').click();
  await page.mouse.move(700, 70);
  await settle(page);
  const collapsed = await measure(page);
  assert.equal(collapsed.compact, 'true');
  await page.mouse.move(22, collapsed.icons[0].y);
  await page.waitForFunction(()=>document.querySelector('.docs-sidebar').dataset.preview==='open');
  await settle(page);
  const preview = await measure(page);
  for (const [name, state] of Object.entries({expanded,collapsed,preview})) {
    assert.equal(state.treeCount,1);
    closeEnough(state.sidebar.width, name==='collapsed'?48:240, `${name} width`);
    closeEnough(state.sidebar.left,0,'left');
    assert.ok(state.toggle.width>=44 && state.toggle.height>=44);
    assert.ok(!state.overflow, 'horizontal overflow');
    assert.ok(state.article.left>=240, 'article covered');
    closeEnough(expanded.article.centerX,state.article.centerX,'article stability');
    if (expanded.toc) closeEnough(expanded.toc.left,state.toc.left,'TOC stability');
    for (let i=0;i<state.icons.length;i++) {
      const a=expanded.icons[i], b=state.icons[i];
      closeEnough(a.y-a.precedingChildren,b.y-b.precedingChildren,`${a.name} structural Y`);
    }
    for (const button of state.toggles) closeEnough(button.rowY,button.buttonY,'branch chevron alignment');
  }
  assert.match(expanded.toggleTransform,/matrix\(1,/);
  assert.match(collapsed.toggleTransform,/matrix\(-1,/);
  assert.match(preview.toggleTransform,/matrix\(-1,/);
  return {expanded,collapsed,preview};
}
try {
  const context = await browser.newContext({viewport:{width:1440,height:1000}});
  const page = await context.newPage();
  page.on('pageerror',error=>report.errors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());});
  for (const theme of ['light','dark']) {
    await page.emulateMedia({colorScheme:theme});
    for (const route of routes) {
      for (const width of widths) {
        await page.setViewportSize({width,height:1000});
        await page.goto(`${baseURL}/docs/${route}`);
        await page.locator('.docs-sidebar').waitFor();
        await page.evaluate(t=>{document.documentElement.dataset.theme=t;localStorage.setItem('godocs-theme',t);},theme);
        const measurements=await triple(page);
        report.desktop.push({theme,route,width,...measurements});
        if ([1920,1440,1320,1319,1200,1024].includes(width)) {
          await page.screenshot({path:path.join(output,`${theme}-${width}-${route.split('/').at(-1)}-preview.png`)});
        }
        await page.keyboard.press('Escape');
        await settle(page);
        assert.equal(await page.locator('.docs-sidebar').getAttribute('data-preview'),'closed');
        assert.equal(await page.locator('.docs-sidebar__toggle').evaluate(el=>el===document.activeElement),true);
        if (width===1440) await page.screenshot({path:path.join(output,`${theme}-${route.split('/').at(-1)}-rail.png`)});
      }
      console.log(`Geometry: ${theme} ${route} (${widths.join(', ')})`);
    }
  }
  await context.close();
  for (const theme of ['light','dark']) for (const width of [1023,768,390]) {
    const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:width===390,colorScheme:theme});
    const page=await context.newPage();
    page.on('pageerror',error=>report.errors.push(String(error)));
    for (const route of routes) {
      await page.goto(`${baseURL}/docs/${route}`);
      await page.locator('.mobile-nav-trigger').tap();
      const dialog=page.getByRole('dialog',{name:'Navegação',exact:true});
      await dialog.waitFor();
      assert.equal(await page.locator('.docs-sidebar').isVisible(),false);
      await page.keyboard.press('Tab');
      assert.equal(await dialog.evaluate(el=>el.contains(document.activeElement)),true);
      const nav=page.locator('.drawer__navigation');
      await nav.evaluate(el=>el.scrollTop=el.scrollHeight);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.screenshot({path:path.join(output,`${theme}-${width}-${route.split('/').at(-1)}-drawer.png`)});
      await page.keyboard.press('Escape');
      assert.equal(await dialog.count(),0);
      assert.equal(await page.locator('.mobile-nav-trigger').evaluate(el=>el===document.activeElement),true);
      await page.locator('.mobile-nav-trigger').tap();
      await page.getByRole('button',{name:'Fechar navegação',exact:true}).tap();
      assert.equal(await dialog.count(),0);
      await page.locator('.mobile-nav-trigger').tap();
      await page.mouse.click(width-2,400);
      assert.equal(await dialog.count(),0);
      await page.locator('.mobile-nav-trigger').tap();
      await dialog.getByRole('link',{name:'Primeiro Acesso',exact:true}).tap();
      await page.waitForURL('**/docs/primeiro-acesso');
      assert.equal(await dialog.count(),0);
      report.mobile.push({theme,width,route,drawer:true,focus:true,escape:true,backdrop:true,navigation:true,overflow:false});
    }
    await context.close();
    console.log(`Mobile: ${theme} ${width}`);
  }
  assert.deepEqual(report.errors,[]);
} finally {
  await writeFile(path.join(output,'geometry.json'),JSON.stringify(report,null,2));
  await browser.close();
}
console.log(`Verified ${report.desktop.length} desktop triples and ${report.mobile.length} mobile flows. ${output}`);
