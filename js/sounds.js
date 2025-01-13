// 音效控制器类
class SoundController {
    constructor() {
        // 音效状态
        this.isMuted = false;
        
        // 声音图标元素
        this.soundIcon = document.getElementById('sound-icon');
        this.gameSoundIcon = document.getElementById('game-sound-icon');
    }

    // 播放音效
    async play(soundName) {
        if (!this.isMuted && gameResources.sounds[soundName]) {
            try {
                await soundGenerator.generateSound(gameResources.sounds[soundName]);
            } catch (error) {
                console.log('音效播放失败:', error);
            }
        }
    }

    // 切换静音状态
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // 更新声音图标
        const iconSrc = this.isMuted ? gameResources.images['sound-off'] : gameResources.images['sound-on'];
        this.soundIcon.src = iconSrc;
        this.gameSoundIcon.src = iconSrc;

        // 控制背景音乐
        if (this.isMuted) {
            soundGenerator.stopBackgroundMusic();
        } else {
            soundGenerator.playBackgroundMusic();
        }
        
        return this.isMuted;
    }

    // 开始播放背景音乐
    startBackgroundMusic() {
        if (!this.isMuted) {
            soundGenerator.playBackgroundMusic();
        }
    }

    // 停止背景音乐
    stopBackgroundMusic() {
        soundGenerator.stopBackgroundMusic();
    }
}

// 导出音效控制器实例
const soundController = new SoundController(); 