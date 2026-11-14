@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 写一篇新文章

set /p title=文章标题（直接回车取消）:
if "%title%"=="" exit /b 0

call npx hexo new "%title%"
if errorlevel 1 (
  echo [失败] 创建失败。
  pause
  exit /b 1
)

echo.
echo 已创建。接下来：
echo   1. 在打开的 Markdown 文件里写正文（文件在 source\_posts\ 下）
echo   2. 双击「发布博客.bat」即可上线
echo.
pause
