const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'source', '_posts');
for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith('.md')) continue;
  const p = path.join(dir, file);
  let text = fs.readFileSync(p, 'utf8');
  const before = text;

  // 修复上一轮脚本留下的字面量 \n
  text = text.replace(
    /^\\ntop_img: \/img\/hero-(\d)\.svg\r?$/m,
    (all, n) => `cover: /img/cover-${n}.svg\ntop_img: /img/hero-${n}.svg`
  );

  if (text !== before) {
    fs.writeFileSync(p, text, 'utf8');
    console.log('fixed', file);
  } else {
    console.log('skip ', file);
  }
}
