// 动画控制器类
class AnimationController {
    constructor() {
        // 存储动画状态
        this.isAnimating = false;
    }

    // 显示正确答案动画
    showCorrectAnimation(element) {
        element.classList.remove('wrong-answer');
        element.classList.add('correct-answer');
        setTimeout(() => {
            element.classList.remove('correct-answer');
        }, 500);
    }

    // 显示错误答案动画
    showWrongAnimation(element) {
        element.classList.remove('correct-answer');
        element.classList.add('wrong-answer');
        setTimeout(() => {
            element.classList.remove('wrong-answer');
        }, 500);
    }

    // 移动小狐狸
    moveFox(element, distance) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        element.classList.add('move-right');
        
        // 计算新位置
        const currentLeft = parseInt(getComputedStyle(element).left);
        element.style.left = `${currentLeft + distance}px`;
        
        setTimeout(() => {
            element.classList.remove('move-right');
            this.isAnimating = false;
        }, 1000);
    }

    // 小狐狸跳跃
    jumpFox(element) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        element.classList.add('jump');
        
        setTimeout(() => {
            element.classList.remove('jump');
            this.isAnimating = false;
        }, 500);
    }

    // 显示星星动画
    showStarAnimation(container) {
        const star = document.createElement('div');
        star.className = 'star twinkle';
        star.style.position = 'absolute';
        star.style.left = Math.random() * 80 + 10 + '%';
        star.style.top = Math.random() * 80 + 10 + '%';
        
        container.appendChild(star);
        
        setTimeout(() => {
            container.removeChild(star);
        }, 1000);
    }

    // 按钮点击动画
    buttonClickAnimation(button) {
        if (!button) return;
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 200);
    }

    // 关卡切换动画
    levelTransition(gameScene) {
        if (!gameScene) return;
        gameScene.classList.add('level-transition');
        setTimeout(() => {
            gameScene.classList.remove('level-transition');
        }, 500);
    }
}

// 导出动画控制器实例
const animationController = new AnimationController(); 