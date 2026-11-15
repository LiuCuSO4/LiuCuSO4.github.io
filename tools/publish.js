'use strict';

/**
 * 发布博客（GitHub Actions 版）
 *
 * 1. 把本地改动 commit
 * 2. 用 GitHub API 推到 main（这台机器直连 github.com:443 不通）
 * 3. 等 Actions 构建 + 部署完成
 *
 * 用法：node tools/publish.js ["提交说明"]
 */

const { execFileSync, spawnSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REPO = 'LiuCuSO4/LiuCuSO4.github.io';
const ACTIONS_URL = `https://github.com/${REPO}/actions`;
const SITE = 'https://liucuso4.github.io/';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: opts.stdio || 'pipe',
    encoding: 'utf8',
    shell: process.platform === 'win32' && /\.(bat|cmd)$/i.test(cmd)
  });
}

function gh(args) {
  const out = execFileSync('gh', args, { cwd: ROOT, encoding: 'utf8' });
  return out.trim();
}

function ghJson(args) {
  return JSON.parse(gh(args) || 'null');
}

(async () => {
  const message = process.argv[2] || `update: ${new Date().toLocaleString('zh-CN')}`;

  // 1. commit
  run('git', ['add', '-A']);
  const staged = run('git', ['diff', '--cached', '--quiet']);
  if (staged.status !== 0) {
    const commit = run('git', ['-c', 'core.quotepath=false', 'commit', '-m', message]);
    if (commit.status !== 0) {
      console.error(commit.stderr || commit.stdout);
      process.exit(1);
    }
    console.log('✓ 已提交到本地 git');
  } else {
    console.log('· 本地没有改动，仍然推一次（会触发一次构建）');
  }

  // 2. push via API
  console.log('· 正在推送到 GitHub main…');
  const up = run(process.execPath, [path.join(__dirname, 'upload.js'), message], { stdio: 'inherit' });
  if (up.status !== 0) {
    console.error('\n[失败] 推送失败。先确认 gh 还登录着：gh auth status');
    process.exit(1);
  }

  // 3. 等 Actions
  const sha = gh(['api', `repos/${REPO}/git/ref/heads/main`, '--jq', '.object.sha']);
  console.log('· 等待 Actions 构建（commit ' + sha.slice(0, 7) + '）…');

  let runId = null;
  for (let i = 0; i < 24 && !runId; i++) {
    await sleep(5000);
    const list = ghJson([
      'run', 'list', '--limit', '8',
      '--json', 'databaseId,headSha,status,conclusion'
    ]) || [];
    const hit = list.find((r) => r.headSha === sha);
    if (hit) runId = hit.databaseId;
  }

  if (!runId) {
    console.error('\n[失败] 没找到对应的构建，去 Actions 页面看看：' + ACTIONS_URL);
    process.exit(1);
  }

  for (let i = 0; i < 60; i++) {
    const info = ghJson([
      'run', 'view', String(runId),
      '--json', 'status,conclusion,url'
    ]);
    if (info.status === 'completed') {
      if (info.conclusion === 'success') {
        console.log('\n✓ 构建并部署完成');
        console.log('  ' + SITE);
        process.exit(0);
      }
      console.error('\n[失败] 构建结果：' + info.conclusion);
      console.error('  日志：' + (info.url || ACTIONS_URL));
      process.exit(1);
    }
    process.stdout.write('.');
    await sleep(5000);
  }

  console.error('\n[超时] 构建还没结束，去这里看进度：' + ACTIONS_URL);
  process.exit(1);
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
