@echo off
title 语音翻译器 - 本地服务器
color 0a
echo ========================================
echo    语音翻译器 - 本地服务器
echo ========================================
echo.
echo 正在启动服务器...
echo.
cd /d D:\voice-translator

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python 未安装
    echo 请安装 Python 3.7+ 后重试
    pause
    exit /b
)

echo 服务器启动成功!
echo.
echo 请在浏览器中打开以下地址:
echo.
echo   http://localhost:8080
echo.
echo 注意: 语音识别需要 HTTPS 环境
echo 如果无法使用语音功能，请使用 HTTPS 隧道
echo.
echo 按 Ctrl+C 停止服务器
echo.

REM Start Python HTTP server
python -m http.server 8080
