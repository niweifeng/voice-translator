# APK构建说明

## 概述

由于当前环境没有Android SDK，无法直接构建APK。以下是几种替代方案：

## 方案1：在线生成APK（推荐）

使用在线工具将网页转换为APK：

1. **AppGeyser** (免费)
   - 访问 https://www.appsgeyser.com/
   - 选择 "Website" 
   - 输入你的网站地址（或上传HTML文件）
   - 点击生成，获得APK

2. **PWABuilder** (推荐)
   - 访问 https://www.pwabuilder.com/
   - 输入你的网站URL
   - 下载Android APK

3. **Andromo**
   - 访问 https://www.andromo.com/
   - 选择从URL创建
   - 生成APK

---

## 方案2：GitHub Pages + PWA安装

1. 将 `voice-translator` 文件夹部署到GitHub Pages
2. 在Android Chrome中打开
3. 点击"安装应用到桌面"提示
4. 应用将像原生APP一样安装

---

## 方案3：本地构建（需要Android SDK）

### 前置条件
- JDK 11+
- Android SDK
- Gradle

### 构建步骤

```bash
# 1. 安装Cordova
npm install -g cordova

# 2. 创建项目
cd voice-translator
cordova platform add android

# 3. 构建
cordova build android
```

生成的APK位于: `platforms/android/apk/debug/app-debug.apk`

---

## 文件说明

当前项目已包含：
- ✅ 完整的Web应用（HTML/CSS/JS）
- ✅ PWA支持（manifest.json）
- ✅ 安装提示功能
- ✅ 所有功能完整

## 下一步

请选择上述方案之一来生成APK。如果需要部署到GitHub Pages或在线托管，请告诉我。
