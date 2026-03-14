// Voice Translator App - Main JavaScript

class VoiceTranslator {
    constructor() {
        // DOM Elements
        this.sourceLang = document.getElementById('sourceLang');
        this.targetLang = document.getElementById('targetLang');
        this.originalText = document.getElementById('originalText');
        this.translatedText = document.getElementById('translatedText');
        this.recordBtn = document.getElementById('recordBtn');
        this.playBtn = document.getElementById('playBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.swapBtn = document.getElementById('swapBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.recordingStatus = document.getElementById('recordingStatus');
        this.translationStatus = document.getElementById('translationStatus');
        this.translatedLabel = document.getElementById('translatedLabel');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.infoText = document.getElementById('infoText');
        this.speechRate = document.getElementById('speechRate');
        this.speechRateValue = document.getElementById('speechRateValue');
        
        // State
        this.isRecording = false;
        this.isPlaying = false;
        this.recognition = null;
        this.synth = window.speechSynthesis || window.webkitSpeechSynthesis;
        this.currentTranslation = '';
        this.recognitionSupported = false;
        
        // Language names mapping
        this.langNames = {
            'zh-CN': '中文',
            'en-US': 'English',
            'ja-JP': '日本語',
            'ko-KR': '한국어',
            'en': 'English',
            'ja': '日本語',
            'ko': '한국어',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'ru': 'Русский',
            'pt': 'Português',
            'it': 'Italiano',
            'ar': 'العربية',
            'th': 'ไทย',
            'vi': 'Tiếng Việt',
            'zh': '中文'
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.initSpeechRecognition();
        this.initEventListeners();
        this.checkBrowserSupport();
        this.updateStatus('ready', '● 就绪 - 请点击麦克风开始');
    }
    
    loadSettings() {
        const savedSource = localStorage.getItem('sourceLang');
        const savedTarget = localStorage.getItem('targetLang');
        const savedRate = localStorage.getItem('speechRate');
        
        if (savedSource) this.sourceLang.value = savedSource;
        if (savedTarget) this.targetLang.value = savedTarget;
        if (savedRate) {
            this.speechRate.value = savedRate;
            this.speechRateValue.textContent = savedRate + 'x';
        }
        
        this.updateTranslatedLabel();
    }
    
    saveSettings() {
        localStorage.setItem('sourceLang', this.sourceLang.value);
        localStorage.setItem('targetLang', this.targetLang.value);
        localStorage.setItem('speechRate', this.speechRate.value);
    }
    
    checkBrowserSupport() {
        // Check for SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            this.updateStatus('error', '● 浏览器不支持语音识别');
            this.showError('❌ 您的浏览器不支持语音识别功能。\n\n请使用以下浏览器：\n• Chrome (安卓/桌面版)\n• Edge (桌面版)\n• Safari (iOS 14.3+)\n\n⚠️ 注意：必须在HTTPS环境下使用！');
            this.recordBtn.disabled = true;
            return false;
        }
        
        if (!window.speechSynthesis && !window.webkitSpeechSynthesis) {
            this.showError('您的浏览器不支持语音合成功能');
        }
        
        // Check if running on HTTPS or localhost
        const isHTTPS = window.location.protocol === 'https:';
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (!isHTTPS && !isLocalhost) {
            this.showError('⚠️ 请在HTTPS环境下使用语音功能！\n\n当前协议: ' + window.location.protocol + '\n建议：使用localhost测试或部署到HTTPS服务器');
        }
        
        return true;
    }
    
    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            this.recognitionSupported = false;
            return;
        }
        
        try {
            // Create recognition instance
            this.recognition = new SpeechRecognition();
            this.recognitionSupported = true;
            
            // Configure recognition
            this.recognition.continuous = false; // Changed to false for better compatibility
            this.recognition.interimResults = true;
            this.recognition.maxAlternatives = 1;
            this.recognition.lang = this.sourceLang.value;
            
            // Set up event handlers
            this.recognition.onstart = () => {
                console.log('Speech recognition started');
                this.isRecording = true;
                this.updateRecordButton();
                this.updateStatus('recording', '● 正在聆听...');
                this.originalText.textContent = '🎤 正在聆听，请说话...';
                this.originalText.classList.remove('placeholder');
            };
            
            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (finalTranscript) {
                    this.originalText.textContent = finalTranscript;
                    this.originalText.classList.remove('placeholder');
                    // Auto-translate when speech is detected
                    this.translateText(finalTranscript);
                } else if (interimTranscript) {
                    this.originalText.textContent = interimTranscript;
                }
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isRecording = false;
                this.updateRecordButton();
                
                const errorMessages = {
                    'no-speech': '未检测到语音，请再说一次',
                    'audio-capture': '无法访问麦克风，请检查权限',
                    'not-allowed': '麦克风权限被拒绝，请允许访问',
                    'network': '网络错误，请检查网络连接',
                    'aborted': '识别已取消',
                    'language-not-supported': '不支持该语言',
                    'service-not-allowed': '语音服务不可用'
                };
                
                const errorMsg = errorMessages[event.error] || '识别错误: ' + event.error;
                this.showError(errorMsg);
                this.updateStatus('error', '● ' + errorMsg);
            };
            
            this.recognition.onend = () => {
                console.log('Speech recognition ended');
                this.isRecording = false;
                this.updateRecordButton();
                
                if (this.isRecording) {
                    // Restart if we should still be recording
                    try {
                        this.recognition.start();
                    } catch (e) {
                        console.log('Failed to restart recognition');
                    }
                } else {
                    this.updateStatus('ready', '● 就绪');
                }
            };
            
            console.log('Speech recognition initialized successfully');
            
        } catch (e) {
            console.error('Failed to initialize speech recognition:', e);
            this.recognitionSupported = false;
            this.showError('语音识别初始化失败: ' + e.message);
        }
    }
    
    initEventListeners() {
        // Record button
        this.recordBtn.addEventListener('click', () => {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        });
        
        // Play button
        this.playBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                this.stopPlaying();
            } else {
                this.playTranslation();
            }
        });
        
        // Clear button
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        // Swap languages
        this.swapBtn.addEventListener('click', () => this.swapLanguages());
        
        // Language change
        this.sourceLang.addEventListener('change', () => {
            this.saveSettings();
            if (this.recognition) {
                this.recognition.lang = this.sourceLang.value;
            }
        });
        
        this.targetLang.addEventListener('change', () => {
            this.saveSettings();
            this.updateTranslatedLabel();
        });
        
        // Settings
        this.settingsBtn.addEventListener('click', () => {
            this.settingsModal.classList.add('active');
        });
        
        this.closeSettings.addEventListener('click', () => {
            this.settingsModal.classList.remove('active');
        });
        
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.settingsModal.classList.remove('active');
            }
        });
        
        // Speech rate
        this.speechRate.addEventListener('input', () => {
            this.speechRateValue.textContent = this.speechRate.value + 'x';
            this.saveSettings();
        });
        
        // Prevent page close during recording
        window.addEventListener('beforeunload', (e) => {
            if (this.isRecording) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }
    
    startRecording() {
        if (!this.recognition || !this.recognitionSupported) {
            this.showError('语音识别不可用，请使用Chrome浏览器并确保HTTPS连接');
            return;
        }
        
        // Check if already recording
        if (this.isRecording) {
            this.stopRecording();
            return;
        }
        
        // Request microphone permission and start
        this.requestMicrophonePermission()
            .then(() => {
                try {
                    // Set language
                    this.recognition.lang = this.sourceLang.value;
                    
                    // Start recognition
                    this.recognition.start();
                    
                } catch (e) {
                    console.error('Recognition start error:', e);
                    this.showError('无法启动语音识别: ' + e.message);
                }
            })
            .catch(err => {
                console.error('Microphone permission error:', err);
                this.showError('❌ 无法访问麦克风\n\n请执行以下操作：\n1. 允许浏览器使用麦克风\n2. 使用HTTPS连接\n3. 确保没有其他应用占用麦克风');
            });
    }
    
    async requestMicrophonePermission() {
        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('浏览器不支持媒体设备');
        }
        
        // Request permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Stop the stream immediately - we just needed to check permission
        stream.getTracks().forEach(track => track.stop());
        
        return true;
    }
    
    stopRecording() {
        if (this.recognition && this.isRecording) {
            try {
                this.recognition.stop();
            } catch (e) {
                console.log('Error stopping recognition:', e);
            }
        }
        this.isRecording = false;
        this.updateRecordButton();
        this.updateStatus('ready', '● 就绪');
    }
    
    updateRecordButton() {
        const micIcon = this.recordBtn.querySelector('.mic-icon');
        const stopIcon = this.recordBtn.querySelector('.stop-icon');
        
        if (this.isRecording) {
            micIcon.style.display = 'none';
            stopIcon.style.display = 'block';
            this.recordBtn.classList.add('recording');
        } else {
            micIcon.style.display = 'block';
            stopIcon.style.display = 'none';
            this.recordBtn.classList.remove('recording');
        }
    }
    
    async translateText(text) {
        if (!text.trim()) return;
        
        this.translationStatus.innerHTML = '<span class="loading"></span> 翻译中...';
        this.translationStatus.classList.add('translating');
        
        const sourceLang = this.getAPILang(this.sourceLang.value);
        const targetLang = this.getAPILang(this.targetLang.value);
        
        try {
            const translated = await this.callTranslationAPI(text, sourceLang, targetLang);
            this.currentTranslation = translated;
            this.translatedText.textContent = translated;
            this.translatedText.classList.remove('placeholder');
            this.translationStatus.textContent = '✓ 翻译完成';
            this.translationStatus.classList.remove('translating');
            this.playBtn.disabled = false;
            
            // Auto-play translation
            setTimeout(() => {
                this.playTranslation();
            }, 500);
            
        } catch (error) {
            console.error('Translation error:', error);
            this.translationStatus.textContent = '✗ 翻译失败';
            this.translationStatus.classList.add('error');
            this.showError('翻译失败: ' + error.message);
        }
    }
    
    getAPILang(lang) {
        const mapping = {
            'zh-CN': 'zh-CN',
            'en-US': 'en',
            'ja-JP': 'ja',
            'ko-KR': 'ko',
            'en': 'en',
            'ja': 'ja',
            'ko': 'ko',
            'es': 'es',
            'fr': 'fr',
            'de': 'de',
            'ru': 'ru',
            'pt': 'pt',
            'it': 'it',
            'ar': 'ar',
            'th': 'th',
            'vi': 'vi',
            'zh': 'zh-CN'
        };
        return mapping[lang] || 'en';
    }
    
    async callTranslationAPI(text, source, target) {
        // Using MyMemory Translation API (free, no key required)
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('API请求失败');
        }
        
        const data = await response.json();
        
        if (data.responseStatus !== 200) {
            throw new Error(data.responseDetails || '翻译失败');
        }
        
        return data.responseData.translatedText;
    }
    
    playTranslation() {
        if (!this.currentTranslation) {
            this.showError('没有可播放的翻译内容');
            return;
        }
        
        // Stop any current speech
        if (this.synth) {
            this.synth.cancel();
        }
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(this.currentTranslation);
        
        // Set language based on target
        const langCode = this.getSpeechLang(this.targetLang.value);
        utterance.lang = langCode;
        utterance.rate = parseFloat(this.speechRate.value);
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onstart = () => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.updateStatus('playing', '● 正在播放...');
        };
        
        utterance.onend = () => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.updateStatus('ready', '● 就绪');
        };
        
        utterance.onerror = (e) => {
            console.error('Speech synthesis error:', e);
            this.isPlaying = false;
            this.updatePlayButton();
            this.updateStatus('ready', '● 就绪');
            this.showError('语音播放失败: ' + e.message);
        };
        
        // Speak
        if (this.synth) {
            this.synth.speak(utterance);
        } else {
            this.showError('语音合成不可用');
        }
    }
    
    stopPlaying() {
        if (this.synth) {
            this.synth.cancel();
        }
        this.isPlaying = false;
        this.updatePlayButton();
        this.updateStatus('ready', '● 就绪');
    }
    
    getSpeechLang(lang) {
        const mapping = {
            'en': 'en-US',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'ru': 'ru-RU',
            'pt': 'pt-PT',
            'it': 'it-IT',
            'ar': 'ar-SA',
            'th': 'th-TH',
            'vi': 'vi-VN',
            'zh': 'zh-CN'
        };
        return mapping[lang] || 'en-US';
    }
    
    updatePlayButton() {
        const playIcon = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        const pauseIcon = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
        
        if (this.isPlaying) {
            this.playBtn.innerHTML = pauseIcon;
            this.playBtn.classList.add('playing');
        } else {
            this.playBtn.innerHTML = playIcon;
            this.playBtn.classList.remove('playing');
        }
    }
    
    swapLanguages() {
        const sourceValue = this.sourceLang.value;
        const targetValue = this.targetLang.value;
        
        if (targetValue === 'zh') {
            this.sourceLang.value = 'en-US';
            this.targetLang.value = 'zh';
        } else if (sourceValue === 'zh-CN' || sourceValue === 'zh') {
            this.sourceLang.value = targetValue;
            this.targetLang.value = 'zh';
        } else {
            this.sourceLang.value = targetValue;
            this.targetLang.value = sourceValue;
        }
        
        this.saveSettings();
        this.updateTranslatedLabel();
        
        if (this.recognition) {
            this.recognition.lang = this.sourceLang.value;
        }
    }
    
    updateTranslatedLabel() {
        const targetName = this.langNames[this.targetLang.value] || '翻译';
        this.translatedLabel.textContent = targetName + ' 翻译';
    }
    
    clearAll() {
        this.originalText.textContent = '点击麦克风开始说话...';
        this.originalText.classList.add('placeholder');
        this.translatedText.textContent = '翻译内容将显示在这里';
        this.translatedText.classList.add('placeholder');
        this.translationStatus.textContent = '';
        this.translationStatus.classList.remove('translating', 'error');
        this.currentTranslation = '';
        this.playBtn.disabled = true;
        
        if (this.isRecording) {
            this.stopRecording();
        }
        
        if (this.isPlaying) {
            this.stopPlaying();
        }
    }
    
    updateStatus(type, text) {
        this.connectionStatus.textContent = text;
        this.connectionStatus.className = type;
    }
    
    showError(message) {
        console.error(message);
        this.infoText.innerHTML = message.replace(/\n/g, '<br>');
        this.infoText.style.display = 'block';
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            this.infoText.textContent = '';
            this.infoText.style.display = '';
        }, 8000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.voiceTranslator = new VoiceTranslator();
});
