# Voice Translator - 语音翻译器

一个基于Web的实时语音翻译应用，支持中文翻译到多种语言。

## 功能特点

- 🎙️ **语音输入**: 从麦克风获取声音，实时识别为文字
- 🌐 **多语言翻译**: 支持中文翻译到英文、日语、韩语、西班牙语、法语、德语、俄语、葡萄牙语、意大利语、阿拉伯语、泰语、越南语等
- 🔊 **语音播报**: 将翻译结果通过语音播放出来
- ⚙️ **个性化设置**: 可选择源语言、目标语言、语音语速
- 💾 **设置保存**: 自动保存您的语言偏好设置

## 使用方法

### 在浏览器中运行

1. 将所有文件部署到Web服务器（或使用本地服务器）
2. 在Android设备上使用Chrome浏览器访问
3. 允许麦克风权限即可使用

### 打包为APK

#### 方法一：使用PWA Builder（推荐）

1. 访问 https://www.pwabuilder.com/
2. 将您的网站URL或上传文件输入
3. 下载生成的APK

#### 方法二：使用TWA (Trusted Web Activity)

可以使用 `Android Studio` 配合 `TWA` 将Web应用包装为APK。

#### 方法三：使用在线转换服务

- https://www.appsgeyser.com/
- https://www.andromo.com/
- https://www.buildfire.com/

## 文件结构

```
voice-translator/
├── index.html      # 主页面
├── style.css      # 样式表
├── app.js         # 应用程序逻辑
├── manifest.json  # PWA清单
└── README.md      # 说明文档
```

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **语音识别**: Web Speech API (SpeechRecognition)
- **语音合成**: Web Speech API (SpeechSynthesis)
- **翻译API**: MyMemory Translation API (免费)

## 浏览器兼容性

- Chrome (Android) - 完整支持 ✓
- Edge (Android) - 完整支持 ✓
- Safari (iOS) - 部分支持（语音识别需要iOS 14.3+）

## 注意事项

1. 首次使用需要允许麦克风权限
2. 需要网络连接进行翻译
3. 语音识别准确性取决于网络状况和说话清晰度
4. 部分语言可能需要下载语音包

## 许可证

MIT License
