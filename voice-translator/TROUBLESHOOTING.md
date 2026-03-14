# 语音翻译器 - 快速开始

## 问题排查

如果遇到"无法启动语音识别"，请检查以下几点：

### 1. 浏览器要求
- ✅ 必须使用 **Chrome** 浏览器（推荐）
- ✅ Edge 浏览器也可以
- ❌ 不支持微信内置浏览器、QQ浏览器等

### 2. HTTPS 要求 ⚠️
语音识别API **必须**在HTTPS环境下运行！

**解决方法：**
- 方法A：部署到GitHub Pages（自动HTTPS）
- 方法B：使用localhost开发测试
- 方法C：使用HTTPS服务器部署

### 3. 麦克风权限
确保已允许浏览器使用麦克风：
- Chrome地址栏左侧 → 点击锁/地球图标 → 允许麦克风

### 4. 网络要求
- 需要访问 Google 语音识别服务
- 如果在大陆地区，可能需要VPN/代理

---

## 快速测试（本地运行）

### 方法1：使用Python（推荐）
```bash
# 进入目录
cd voice-translator

# 启动HTTPS服务器（需要安装OpenSSL证书）
python -m http.server 8080
# 然后访问: http://localhost:8080
```

### 方法2：使用Node.js
```bash
# 安装http-server
npm install -g http-server

# 启动服务器
http-server -p 8080
```

### 方法3：VS Code
1. 安装 "Live Server" 扩展
2. 右键 index.html → Open with Live Server

---

## 部署到GitHub Pages（免费HTTPS）

1. 创建GitHub仓库
2. 上传所有文件
3. Settings → Pages → 启用GitHub Pages
4. 访问生成的HTTPS链接

---

## 常见错误

| 错误 | 解决方法 |
|---|---|
| not-allowed | 允许浏览器麦克风权限 |
| no-speech | 对着麦克风说话，或检查麦克风是否工作 |
| network | 检查网络连接 |
| 语音识别不可用 | 确保使用Chrome + HTTPS |

---

## 技术支持

如果仍有问题，请检查：
1. 浏览器控制台日志（F12 → Console）
2. 网络请求是否正常
3. 麦克风是否被其他应用占用
