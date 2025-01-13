// 资源管理器
const gameResources = {
    // 图片资源（使用简单的 SVG 作为默认资源）
    images: {
        // 森林背景 - 简单的渐变背景
        'forest-bg': `data:image/svg+xml;utf8,<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23a8e6cf"/><stop offset="100%" style="stop-color:%23dcedc1"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23bg)"/><g fill="%233d8b40" opacity="0.6"><path d="M100,500 L150,500 L125,300 Z"/><path d="M300,500 L350,500 L325,250 Z"/><path d="M500,500 L550,500 L525,350 Z"/><path d="M700,500 L750,500 L725,280 Z"/></g></svg>`,

        // 小狐狸 - 简单的卡通风格SVG
        'fox': `data:image/svg+xml;utf8,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><g transform="translate(5,5)"><ellipse cx="25" cy="30" rx="20" ry="15" fill="%23ff7043"/><circle cx="25" cy="20" r="12" fill="%23ff7043"/><path d="M15,15 L10,5 L20,12 Z" fill="%23ff7043"/><path d="M35,15 L40,5 L30,12 Z" fill="%23ff7043"/><circle cx="20" cy="18" r="2" fill="%23000"/><circle cx="30" cy="18" r="2" fill="%23000"/><circle cx="25" cy="22" r="2" fill="%23000"/></g></svg>`,

        // 声音开启图标
        'sound-on': `data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M10,15 L15,15 L23,8 L23,32 L15,25 L10,25 Z" fill="%232196f3"/><path d="M27,12 Q32,20 27,28 M30,8 Q38,20 30,32" stroke="%232196f3" fill="none"/></svg>`,

        // 声音关闭图标
        'sound-off': `data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M10,15 L15,15 L23,8 L23,32 L15,25 L10,25 Z" fill="%232196f3"/><path d="M30,15 L40,25 M30,25 L40,15" stroke="%232196f3" stroke-width="2"/></svg>`,

        // 星星图标
        'star': `data:image/svg+xml;utf8,<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><path d="M15,0 L18.5,10.5 L30,10.5 L20.5,17 L24,28 L15,21.5 L6,28 L9.5,17 L0,10.5 L11.5,10.5 Z" fill="%23ffd700"/></svg>`
    },

    // 音效资源（使用 Web Audio API 生成简单的音效）
    sounds: {
        // 正确答案音效
        correct: {
            frequency: 800,
            type: 'sine',
            duration: 0.1,
            interval: 0.1,
            count: 2
        },
        
        // 错误答案音效
        wrong: {
            frequency: 300,
            type: 'sine',
            duration: 0.2,
            interval: 0,
            count: 1
        },

        // 点击音效
        click: {
            frequency: 500,
            type: 'sine',
            duration: 0.05,
            interval: 0,
            count: 1
        },

        // 完成关卡音效
        levelComplete: {
            frequency: 600,
            type: 'sine',
            duration: 0.1,
            interval: 0.1,
            count: 3
        },

        // 通关音效
        gameComplete: {
            frequency: 800,
            type: 'sine',
            duration: 0.1,
            interval: 0.1,
            count: 5
        }
    },

    // 背景音乐（使用简单的音符序列）
    backgroundMusic: {
        notes: [
            { frequency: 400, duration: 0.2 },
            { frequency: 500, duration: 0.2 },
            { frequency: 600, duration: 0.2 },
            { frequency: 500, duration: 0.2 }
        ],
        interval: 0.5
    }
};

// Web Audio API 音效生成器
class SoundGenerator {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.backgroundMusicLoop = null;
    }

    // 初始化音频上下文
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // 生成单个音效
    async generateSound(options) {
        if (!this.audioContext) this.init();
        const { frequency, type, duration, interval, count } = options;
        
        for (let i = 0; i < count; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
            
            if (interval > 0 && i < count - 1) {
                await new Promise(resolve => setTimeout(resolve, interval * 1000));
            }
        }
    }

    // 播放背景音乐
    playBackgroundMusic() {
        if (!this.audioContext) this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;

        const playNote = async (noteIndex) => {
            if (!this.isPlaying) return;

            const note = gameResources.backgroundMusic.notes[noteIndex];
            await this.generateSound({
                frequency: note.frequency,
                type: 'sine',
                duration: note.duration,
                interval: 0,
                count: 1
            });

            const nextIndex = (noteIndex + 1) % gameResources.backgroundMusic.notes.length;
            this.backgroundMusicLoop = setTimeout(
                () => playNote(nextIndex),
                gameResources.backgroundMusic.interval * 1000
            );
        };

        playNote(0);
    }

    // 停止背景音乐
    stopBackgroundMusic() {
        this.isPlaying = false;
        if (this.backgroundMusicLoop) {
            clearTimeout(this.backgroundMusicLoop);
            this.backgroundMusicLoop = null;
        }
    }
}

// 导出资源
window.gameResources = gameResources;
window.soundGenerator = new SoundGenerator(); 