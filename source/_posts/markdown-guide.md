---
title: Markdown 写作速查表
date: 2026-11-13 10:20:00
updated: 2026-11-14 14:30:00
tags:
  - 教程
  - Markdown
  - 写作
categories:
  - 技术
cover: /img/cover-5.svg
top_img: /img/hero-5.svg
---

这篇既是写给你看的，也是写给我自己看的。文章都是 Markdown 文件，下面这些语法都可以直接用。

## 标题

用 `#` 到 `######` 表示一到六级标题，右侧会自动生成目录，鼠标移到标题上会出现锚点。

## 强调

- **加粗**：`**加粗**`
- *斜体*：`*斜体*`
- ~~删除线~~：`~~删除线~~`
- `行内代码`：用反引号包起来
- [链接](https://example.com)：`[链接](https://example.com)`

## 列表

无序列表：

- 第一项
- 第二项
  - 嵌套一层
  - 再嵌套一层
- 第三项

有序列表：

1. 先这样
2. 再那样
3. 最后这样

## 引用与提示块

> 普通引用就是一句话，缩进一点，斜一点，看起来像在自言自语。

提示块用主题自带的标签：

{% raw %}
```markdown
{% note tip %}
这是一条提示。
{% endnote %}
```
{% endraw %}

效果如下：

{% note tip %}
在 Markdown 里写 `{% raw %}{% note tip %}{% endraw %}`，会变成这种彩色提示块。把 `tip` 换成 `info`、`warning`、`danger` 可以换颜色。
{% endnote %}

## 代码

行内代码用反引号，代码块用三个反引号加语言名：

```js
function greet(name) {
  const hour = new Date().getHours();
  const time = hour < 6 ? '凌晨' : hour < 12 ? '早上' : hour < 18 ? '下午' : '晚上';
  return `${time}好，${name}`;
}

console.log(greet('硫酸铜'));
```

```bash
npx hexo new "今天的随笔"
npx hexo server        # 本地预览
git add . && git commit -m "new post" && git push
```

## 表格

| 语法 | 效果 | 备注 |
| --- | :---: | ---: |
| `**粗**` | **粗** | 常用 |
| `> 引用` | 引用 | 需要空行 |
| `![图](url)` | 图片 | 图片放 `source/img/` |

## 图片

![示例图片](/img/cover-3.svg)

图片会自动圆角、加阴影，宽度撑满正文；点击可以放大。

## 分割线

---

## 一个小建议

不要为了用语法而用语法。一篇文章里，**加粗不超过五处**，代码块只放真正需要复制的东西，剩下的交给句子本身。

写清楚，比写漂亮重要。
