'use strict';
/**
 * 线上搜索功能检查：打开首页 → 点放大镜 → 输入关键字 → 读结果。
 * 用法：node tools/check-search.js [关键字]
 */
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SITE = process.env.SITE || 'https://liucuso4.github.io/';
const KEYWORD = process.argv[2] || 'Hexo';
const PORT = 9337;
const PROFILE = path.join(os.tmpdir(), 'edge-search-check-' + Date.now());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    ws.addEventListener('open', () => resolve({
      send(method, params) {
        return new Promise((res, rej) => {
          const mid = ++id;
          pending.set(mid, { res, rej });
          ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
        });
      },
      close() { ws.close(); }
    }));
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
      }
    });
    ws.addEventListener('error', reject);
  });
}

(async () => {
  fs.rmSync(PROFILE, { recursive: true, force: true });
  const proc = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE, '--window-size=1440,900',
    'about:blank'
  ], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(400);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find((t) => t.type === 'page');
    } catch (_) {}
  }
  if (!target) throw new Error('无法连接 Edge 调试端口');

  const cdp = await connect(target.webSocketDebuggerUrl);
  const evalJs = async (expr) => {
    const r = await cdp.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };

  await cdp.send('Page.enable');
  await cdp.send('Page.navigate', { url: SITE });
  await sleep(3500);

  const opened = await evalJs(`(() => {
    const btn = document.querySelector('#search-button > .search') || document.querySelector('#search-button');
    if (!btn) return 'no-button';
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const dlg = document.querySelector('#local-search .search-dialog');
    return dlg && getComputedStyle(dlg).visibility !== 'hidden' ? 'open' : 'clicked';
  })()`);
  console.log('搜索框:', opened);
  await sleep(1200);

  const typed = await evalJs(`(() => {
    const input = document.querySelector('#local-search input');
    if (!input) return 'no-input';
    input.focus();
    input.value = ${JSON.stringify(KEYWORD)};
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return 'ok';
  })()`);
  console.log('输入:', typed, KEYWORD);
  await sleep(2500);

  const result = await evalJs(`(() => {
    const box = document.querySelector('#local-search-results');
    if (!box) return { found: false, reason: 'no-results-box' };
    const items = box.querySelectorAll('a');
    return { found: items.length > 0, count: items.length, sample: box.innerText.trim().slice(0, 160) };
  })()`);
  console.log('结果:', JSON.stringify(result));

  const ok = typed === 'ok' && result.found;
  console.log(ok ? 'PASS 搜索可用' : 'FAIL 搜索没出结果');
  cdp.close();
  proc.kill();
  await sleep(300);
  fs.rmSync(PROFILE, { recursive: true, force: true });
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
