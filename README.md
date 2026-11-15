# 硫酸铜的博客

在线地址：**https://liucuso4.github.io/**

Hexo 8 + Butterfly 5.7 主题，托管在 GitHub Pages（免费、永久、自带 HTTPS）。
本地这份是「源文件」，`public/` 是生成出来的成品，成品发布在仓库的 `gh-pages` 分支。

---

## 一、日常写作

### 方式 A：本地写（推荐）

1. 双击 **`写文章.bat`**，输入标题，回车；
2. 在 `source/_posts/` 下打开新生成的 `.md` 文件写正文；
3. 双击 **`发布博客.bat`**，等脚本跑完（约 30 秒），浏览器会自动打开线上地址。

### 方式 B：直接在 GitHub 网页上改

打开 https://github.com/LiuCuSO4/LiuCuSO4.github.io/tree/main/source/_posts ，
点文件 → 右上角铅笔 → 改完 Commit changes。想加新文章就点 **Add file → Create new file**，
路径写 `source/_posts/英文或中文文件名.md`。

提交后 GitHub Actions 会自动构建发布，约 1 分钟上线，不用回电脑上跑脚本。

### 文章开头的参数

```yaml
---
title: 标题
date: 2026-11-14 12:00:00
updated: 2026-11-14 12:00:00     # 可选，不写就用最后修改时间
categories: 技术                  # 一个
tags: [Hexo, 教程]                # 多个
cover: /img/cover-3.svg           # 列表卡片封面
top_img: /img/hero-3.svg          # 文章页顶部大图
top: true                         # 可选，置顶
---
```

`cover` 和 `top_img` 不写也行，会走主题的默认图。

---

## 二、改外观

主配置在 **`_config.butterfly.yml`**（有中文注释，改完重新发布即可）。

| 想改什么 | 找哪一项 |
| --- | --- |
| 站点名 / 副标题 / 头像 | `_config.yml` 的 `title`、`subtitle`；`avatar` |
| 顶部导航菜单 | `menu:`（名称 + 路径 + 图标） |
| 社交图标（GitHub / B站 / 邮箱） | `social:` |
| 首页大图、各页头图 | `index_img`、`default_top_img`、`archive_img` 等 |
| 文章默认封面 | `default_cover:`（现在轮换 6 张） |
| 主题色 | `theme_color:`（默认 `#49b1f5`） |
| 首页副标题打字效果 | `subtitle:` |
| 公告栏 | `card_announcement:` |
| 页脚年份 / 备案号 | `footer:` |
| 目录、代码高亮、深色模式 | `toc:`、`highlight_theme:`、`darkmode:` |

图片都放在 **`source/img/`**，换图最省事的办法：
把自己的图片丢进去，然后把配置里的 `/img/xxx.svg` 改成新文件名。

配色想大改就编辑 `source/css/custom.css`，它最后加载，能覆盖主题默认样式。

---

## 三、发布是怎么跑的

现在走 **GitHub Actions**：`main` 一有新提交，GitHub 就在云端 `npm ci` + `hexo generate`，
再把成品发布到 Pages。

`发布博客.bat` 只做三件事：

1. `git add -A` + commit（有改动才做）；
2. `node tools/upload.js` —— 逐文件调用 GitHub API，把源码推到 `main`；
3. 等 Actions 构建完成（通常 40–90 秒），浏览器打开线上地址。

「commit / 构建 / 上线」都不用自己敲命令。之所以不用 `git push`：这台机器连不上
`github.com:443`（`api.github.com` 是通的），所以上传走 REST API。

**前提**：`gh` 处于登录状态（`gh auth status` 检查，权限里要有 `workflow`），
且仓库 Settings → Pages 的 Source 是 **GitHub Actions**。这两项都已经配好了。

网页上直接改文件也会触发同一套流程，所以在哪里写都行。

---

## 四、评论与留言

- 现在的留言板是 GitHub Discussions：https://github.com/LiuCuSO4/LiuCuSO4.github.io/discussions
- 想换成**文章内嵌评论**（giscus），只需两步：
  1. 打开 https://github.com/apps/giscus 安装到本仓库；
  2. 把 `_config.butterfly.yml` 里 `comments.use:` 改成 `use: Giscus`，重新发布。

  giscus 的 `repo / repo_id / category_id` 已经填好了，不用再申请。

---

## 五、换自己的域名（可选）

1. 在 `source/` 下新建文件 `CNAME`，内容一行：`blog.example.com`；
2. 域名 DNS 加一条 CNAME 记录指向 `liucuso4.github.io`；
3. 重新发布，然后在仓库 Settings → Pages 里填 Custom domain 并勾选 Enforce HTTPS。

---

## 六、目录说明

```
_config.yml              站点配置（标题、网址、分页）
_config.butterfly.yml    主题配置（菜单、配色、侧栏、评论）
source/_posts/           文章（Markdown）
source/_data/link.yml    友链
source/about|comments|gallery|music|link|tags|categories/   固定页面
source/img/              站内图片（SVG 封面、头像、Banner）
source/css/custom.css    自定义样式
source/js/custom.js      相册灯箱
tools/deploy-gh-pages.js 发布脚本
tools/upload.js          上传源文件到 main 分支
发布博客.bat / 写文章.bat  双击即用
public/                  生成结果（不用手改）
```

---

## 七、进阶

- **自动部署已经开好**：`.github/workflows/pages.yml` 在 `main` 有新提交时构建并发布，
  Pages 的 Source 也已切到「GitHub Actions」。网页上改文章 → 提交 → 一分钟后就上线。
- **网页版后台**：仓库里的 `.pages.yml` 是 [Pages CMS](https://app.pagescms.org/) 的配置，
  装上它的 GitHub App 后可以在浏览器里可视化写文章（标题、标签、封面、正文都有表单）。
- **备份**：整个文件夹复制走就是完整备份；线上成品在 Actions 的 artifact 里，
  旧的 `gh-pages` 分支是切换前留下的，可以不管。

---

## 八、常见问题

**改了没生效？** 浏览器缓存 → Ctrl+F5；或者去仓库 Actions 页面看最近一次构建是不是绿的。

**发布报 401/403？** `gh auth status` 看登录是否过期，重新 `gh auth login`。

**中文乱码？** 确保 `.md` 文件是 UTF-8 编码。

**想换回之前那个带后台的动态博客？** 同目录下的 `../my-blog` 还在，双击 `启动博客.bat` 即可。
