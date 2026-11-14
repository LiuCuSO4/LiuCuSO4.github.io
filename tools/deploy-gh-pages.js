/**
 * 把 public/ 发布到 gh-pages 分支（走 GitHub API，不需要 git push）
 * 用法：node tools/deploy-gh-pages.js "提交说明"
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO = 'LiuCuSO4/LiuCuSO4.github.io';
const BRANCH = 'gh-pages';
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();

async function api(method, url, body) {
  const res = await fetch('https://api.github.com' + url, {
    method,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'hexo-blog-deployer',
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error(method + ' ' + url + ' -> ' + res.status + ' ' + (data.message || text));
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function walk(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs, base));
    else out.push(abs);
  }
  return out;
}

async function pool(items, limit, worker) {
  let i = 0;
  const runners = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
}

(async () => {
  if (!fs.existsSync(PUBLIC)) {
    console.error('public/ 不存在，先运行 npx hexo generate');
    process.exit(1);
  }

  const message = process.argv[2] || 'deploy: ' + new Date().toISOString();

  // GitHub Pages 默认跑 Jekyll，.nojekyll 让它直接发布静态文件
  fs.writeFileSync(path.join(PUBLIC, '.nojekyll'), '');

  const files = walk(PUBLIC);
  console.log('files:', files.length);

  const tree = [];

  let done = 0;
  await pool(files, 5, async (abs) => {
    const rel = path.relative(PUBLIC, abs).split(path.sep).join('/');
    const content = fs.readFileSync(abs).toString('base64');
    const blob = await api('POST', `/repos/${REPO}/git/blobs`, { content, encoding: 'base64' });
    tree.push({ path: rel, mode: '100644', type: 'blob', sha: blob.sha });
    done++;
    if (done % 20 === 0) console.log('  blobs', done + '/' + files.length);
  });

  const newTree = await api('POST', `/repos/${REPO}/git/trees`, { tree });
  console.log('tree:', newTree.sha);

  let parents = [];
  try {
    const ref = await api('GET', `/repos/${REPO}/git/ref/heads/${BRANCH}`);
    parents = [ref.object.sha];
  } catch (e) {
    if (e.status !== 404) throw e;
  }

  const commit = await api('POST', `/repos/${REPO}/git/commits`, {
    message,
    tree: newTree.sha,
    parents
  });
  console.log('commit:', commit.sha);

  if (parents.length) {
    await api('PATCH', `/repos/${REPO}/git/refs/heads/${BRANCH}`, { sha: commit.sha, force: true });
  } else {
    await api('POST', `/repos/${REPO}/git/refs`, { ref: `refs/heads/${BRANCH}`, sha: commit.sha });
  }
  console.log('deployed to', BRANCH);
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
