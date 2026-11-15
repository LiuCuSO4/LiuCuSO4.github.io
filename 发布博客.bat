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

where gh >nul 2>nul
if errorlevel 1 (
  echo [错误] 没有找到 GitHub CLI，请先安装：https://cli.github.com/
  pause
  exit /b 1
)

rem 用系统证书库，避免个别机器上 Node 报 UNABLE_TO_VERIFY_LEAF_SIGNATURE
set "NODE_OPTIONS=--use-system-ca"

echo ========================================
echo   提交、推送 main、Actions 自动构建
echo ========================================
node tools\publish.js "update: %date% %time%"
if errorlevel 1 (
  echo.
  echo 发布没有完成，看看上面的提示。
  pause
  exit /b 1
)

start "" "https://liucuso4.github.io/"
echo.
pause
