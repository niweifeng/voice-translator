@echo off
title 语音翻译器 - APK 生成器
color 0a
echo ========================================
echo    语音翻译器 - APK 生成器
echo ========================================
echo.
echo 此脚本将帮助您生成APK安装包
echo.

REM Check for internet connection
echo [1/3] 检查网络连接...
ping -n 1 google.com >nul 2>&1
if errorlevel 1 (
    echo ERROR: 无法连接到互联网
    echo 请检查网络后重试
    pause
    exit /b 1
)
echo      网络连接正常

REM Create output directory
if not exist "apk-output" mkdir apk-output

echo.
echo [2/3] 准备构建文件...
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo      Node.js 已安装

REM Install dependencies
echo.
echo [3/3] 安装构建工具...
echo.

REM Try to install android-builder or similar
npm install -g phonegap >nul 2>&1
if errorlevel 1 (
    echo WARNING: 安装phonegap失败，尝试其他方法...
)

echo.
echo ========================================
echo   准备完成！
echo ========================================
echo.
echo 由于当前环境缺少Android SDK，无法直接构建APK
echo.
echo 请选择以下方法之一：
echo.
echo 方法1: 使用在线APK生成器（推荐）
echo   1. 访问 https://www.appsgeyser.com/
echo   2. 选择 "Website" 
echo   3. 输入: http://localhost:9000
echo   4. 点击 Generate 下载APK
echo.
echo 方法2: 使用PWA Builder
echo   1. 访问 https://www.pwabuilder.com/
echo   2. 输入您的网站URL
echo   3. 下载Android APK
echo.
echo 方法3: 本地构建（需要Android SDK）
echo   1. 安装 Android Studio
echo   2. 创建新项目，选择 "Empty Views Activity"
echo   3. 将 web 文件放入 assets 目录
echo   4. Build -> Generate Signed APK
echo.
echo ========================================
echo.
pause
