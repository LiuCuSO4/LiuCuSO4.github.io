@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 发布博客

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 没有找到 Node.js，请先安装：https://nodejs.org/
  pause
  exit /b 1
)

rem 用系统证书库，避免个别机器上 Node 报 UNABLE_TO_VERIFY_LEAF_SIGNATURE
set "NODE_OPTIONS=--use-system-ca"

echo ========================================
echo   1/4  把源码提交到 main 分支
echo ========================================
git add -A
git diff --cached --quiet
if errorlevel 1 (
  git -c core.quotepath=false commit -m "update: %date% %time%" >nul
  node tools\upload.js "update: %date% %time%"
  if errorlevel 1 (
    echo.
    echo [失败] 源码上传出错。先确认 gh 还登录着：gh auth status
    pause
    exit /b 1
  )
) else (
  echo   源码没有变化，跳过这一步。
)

echo.
echo ========================================
echo   2/4  生成静态页面
echo ========================================
call npx hexo clean
call npx hexo generate
if errorlevel 1 (
  echo.
  echo [失败] 生成出错，看看上面的红色提示。
  pause
  exit /b 1
)

rem hexo 跑完可能把控制台代码页重置，重新声明一次，免得后面的中文变乱码
chcp 65001 >nul

echo.
echo ========================================
echo   3/4  上传成品到 gh-pages 分支
echo ========================================
node tools\deploy-gh-pages.js "update: %date% %time%"
if errorlevel 1 (
  echo.
  echo [失败] 上传出错。先确认 gh 还登录着：gh auth status
  pause
  exit /b 1
)

echo.
echo ========================================
echo   4/4  通知 GitHub Pages 重新构建
echo ========================================
gh api --method POST repos/LiuCuSO4/LiuCuSO4.github.io/pages/builds >nul 2>nul

echo.
echo 完成！等 30 秒左右打开：https://liucuso4.github.io/
start "" "https://liucuso4.github.io/"
echo.
pause
