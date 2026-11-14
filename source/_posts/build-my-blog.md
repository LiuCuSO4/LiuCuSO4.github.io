---
title: 这个博客是怎么搭起来的
date: 2026-11-12 15:40:00
updated: 2026-11-14 14:30:00
tags:
  - 教程
  - Hexo
  - 建站
categories:
  - 技术
cover: /img/cover-2.svg
top_img: /img/hero-2.svg
---

## 先说结论

这个站是 **Hexo + Butterfly 主题 + GitHub Pages**：

- **Hexo**：把 Markdown 编译成静态 HTML，跑完就不用管了；
- **Butterfly**：负责好看——全屏 banner、卡片列表、悬浮目录、明暗主题；
- **GitHub Pages**：免费托管，地址是 `https://liucusO4.github.io`，不用买服务器，也不用备案；
- **GitHub Actions**：每次提交，自动重新构建并发布，不用在本地敲命令。

整套东西一年花销是 0 元。

## 为什么不用动态博客

之前也试过带后台的动态博客：能登录、能在线写、能审留言，很顺手。但它有两个绕不开的问题：

1. 要有地方跑 Node，家用电脑关机就没了；
2. 想给它一个体面的域名，要么买服务器，要么做内网穿透。

静态站把这两件事都省了。代价是「后台」变成了「编辑 Markdown 文件」——所以下面会讲，怎么把它变得不那么难受。

## 它长什么样

| 模块 | 说明 |
| --- | --- |
| 首页 | 全屏 Banner + 打字机副标题 + 文章卡片 |
| 文章页 | 右侧悬浮目录、代码高亮与复制、版权声明、上一篇/下一篇 |
| 归档 | 按年份分组的时间轴 |
| 标签 / 分类 | 标签云 + 对应文章列表 |
| 留言板 | 基于 GitHub Discussions 的评论 |
| 相册 | 瀑布流 + 点击放大 |
| 音乐 | 内嵌播放器，歌单在页面里改 |
| 友链 | 卡片式友链，数据在 `source/_data/link.yml` |
| 搜索 | 本地全文搜索，点右上角放大镜 |

## 写作的三条路

**一、浏览器里写（推荐）**

仓库根目录有一个 `.pages.yml`，用 [Pages CMS](https://app.pagescms.org/) 登录 GitHub 后选中这个仓库，就能在网页表单里新建文章、填标签、传封面，点保存即提交。GitHub Actions 会自动发布，几十秒后线上就更新了。

**二、GitHub 网页上改**

打开 `source/_posts/`，点任意 `.md` 文件右上角的铅笔图标就能编辑。适合改错别字。

**三、本地写**

```bash
npm install          # 第一次
npx hexo new "文章标题"   # 生成 source/_posts/文章标题.md
npx hexo server      # 本地预览 http://localhost:4000
```

写完 `git push`，剩下的交给 Actions。

{% note tip %}
文章开头的 `---` 之间是 front-matter：`title` 标题、`date` 日期、`tags` 标签、`categories` 分类、`cover` 封面、`top: true` 置顶。少写一项也不会报错。
{% endnote %}

## 目录结构

```text
hexo-blog/
├─ source/
│  ├─ _posts/          # 文章，一篇一个 .md
│  ├─ _data/link.yml   # 友链数据
│  ├─ img/             # 图片素材
│  ├─ css/custom.css   # 自定义样式
│  ├─ about/index.md   # 关于页
│  ├─ gallery/index.md # 相册页
│  └─ music/index.md   # 音乐页
├─ _config.yml         # 站点配置：标题、作者、网址
├─ _config.butterfly.yml # 主题配置：菜单、颜色、侧栏、评论
└─ .github/workflows/pages.yml # 自动构建发布
```

## 改起来麻烦吗

改标题、改副标题、换头像、换 banner、加菜单、开关暗色模式，都在 `_config.butterfly.yml` 里，改完提交就行。文件里每一段都有注释，照着改不容易错。

真正麻烦的只有一种情况：想加一个主题没有的功能。那就得写代码了——但那本来也不是「随手改改」的范围。

## 最后

工具只是工具。搭得再漂亮，不写也只是一个空壳。

所以，去写吧。
