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

echo ========================================
echo   1/3  生成静态页面
echo ========================================
call npx hexo clean
call npx hexo generate
if errorlevel 1 (
  echo.
  echo [失败] 生成出错，看看上面的红色提示。
  pause
  exit /b 1
)

echo.
echo ========================================
echo   2/3  上传到 GitHub（gh-pages 分支）
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
echo   3/3  通知 GitHub Pages 重新构建
echo ========================================
gh api --method POST repos/LiuCuSO4/LiuCuSO4.github.io/pages/builds >nul 2>nul

echo.
echo 完成！等 30 秒左右打开：https://liucuso4.github.io/
start "" "https://liucuso4.github.io/"
echo.
pause
