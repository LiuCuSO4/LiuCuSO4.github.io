# 硫酸铜的博客

基于 **Hexo 8 + Butterfly 5** 的个人博客，部署在 GitHub Pages：<https://liucuso4.github.io>

## 写一篇新文章

在 `source/_posts/` 新建一个 `.md` 文件：

```markdown
---
title: 文章标题
date: 2026-11-14 20:00:00
tags:
  - 随笔
categories:
  - 生活
cover: /img/cover-1.svg
---

正文用 Markdown 写。
```

保存后本地预览：

```bash
npm install          # 第一次
npx hexo server      # http://localhost:4000
```

## 发布

```bash
双击 发布.bat
```

它会构建站点并把 `public/` 推到 `gh-pages` 分支，一两分钟后 <https://liucuso4.github.io> 更新。

> 之所以不用 GitHub Actions：当前网络下 `github.com:443` 的 git 推送被阻断，本机通过 GitHub API 发布。等以后方便了，可以在仓库里加 `.github/workflows/pages.yml`（文件已备好），把 Pages 的 Source 改成 “GitHub Actions”，就能做到 push 即发布。

## 改外观 / 改配置

| 想改什么 | 改哪里 |
| --- | --- |
| 站点名、副标题、作者、网址 | `_config.yml` |
| 导航菜单、头像、Banner、社交链接、公告、目录、深色模式 | `_config.butterfly.yml` |
| 自定义 CSS（相册网格、灯箱、播放器、正文排版） | `source/css/custom.css` |
| 自定义 JS（相册灯箱） | `source/js/custom.js` |
| 关于页 | `source/about/index.md` |
| 相册 | `source/gallery/index.md` + `source/img/` |
| 音乐播放列表 | `source/music/index.md` |
| 友链 | `source/_data/link.yml` |
| 留言 / 评论 | `source/comments/index.md` |

## 目录

```
source/_posts/     文章（Markdown）
source/img/        SVG 图片素材
source/css/        custom.css + APlayer
source/js/         custom.js + APlayer
themes/            主题从 npm 安装（hexo-theme-butterfly）
tools/             本地工具（发布、截图、修 front-matter）
public/            构建产物（不提交）
```

## 本地工具

- `tools/deploy-gh-pages.js` — 把 `public/` 发布到 `gh-pages` 分支（走 GitHub API）
- `tools/upload.js` — 把源码提交到 `main`（同上，用于网络受限时）
- `tools/fix-frontmatter.js` — 修文章头的换行问题

## 备份

文章和配置都在仓库里，GitHub 本身就是备份；本地再留一份这个文件夹即可。
