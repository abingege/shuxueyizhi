// 游戏控制器类
class GameController {
    constructor() {
        // 游戏状态
        this.currentLevel = 1;
        this.stars = 0;
        this.currentQuestionIndex = 0;
        this.questions = [];
        this.gameStartTime = 0;

        // DOM元素
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.resultScreen = document.getElementById('result-screen');
        this.questionText = document.querySelector('.question-text');
        this.answerInput = document.getElementById('answer-input');
        this.submitButton = document.getElementById('submit-answer');
        this.fox = document.getElementById('fox');
        this.levelDisplay = document.getElementById('current-level');
        this.starsDisplay = document.getElementById('stars-count');

        // 声音控制按钮
        this.soundToggle = document.getElementById('sound-toggle');
        this.gameSoundToggle = document.getElementById('game-sound-toggle');

        // 用户相关元素
        this.loginForm = document.getElementById('login-form');
        this.userInfo = document.getElementById('user-info');
        this.authMessage = document.getElementById('auth-message');
        this.leaderboardList = document.getElementById('leaderboard-list');
        this.headerUsername = document.getElementById('header-username');

        // 绑定事件处理器
        this.bindEventHandlers();

        // 确保this在事件处理器中正确
        this.startGame = this.startGame.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.startNextLevel = this.startNextLevel.bind(this);
        this.replayLevel = this.replayLevel.bind(this);
        this.showHint = this.showHint.bind(this);
        this.togglePause = this.togglePause.bind(this);

        // 绑定用户相关事件处理器
        this.bindUserEventHandlers();

        // 初始化用户界面
        this.initializeUserInterface();
    }

    // 绑定事件处理器
    bindEventHandlers() {
        // 开始游戏按钮
        const startButton = document.getElementById('start-button');
        startButton.addEventListener('click', () => {
            console.log('Start button clicked');
            soundController.play('click');
            animationController.buttonClickAnimation(startButton);
            this.startGame();
        });

        // 返回主页按钮
        document.getElementById('home-button').addEventListener('click', () => {
            soundController.play('click');
            animationController.buttonClickAnimation(event.target);
            this.returnToHome();
        });

        // 提交答案按钮
        this.submitButton.addEventListener('click', () => {
            soundController.play('click');
            animationController.buttonClickAnimation(this.submitButton);
            this.checkAnswer();
        });

        // 回车键提交答案
        this.answerInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.checkAnswer();
            }
        });

        // 下一关按钮
        document.getElementById('next-level').addEventListener('click', () => {
            soundController.play('click');
            animationController.buttonClickAnimation(event.target);
            this.startNextLevel();
        });

        // 重玩本关按钮
        document.getElementById('replay-level').addEventListener('click', () => {
            soundController.play('click');
            animationController.buttonClickAnimation(event.target);
            this.replayLevel();
        });

        // 提示按钮
        document.getElementById('hint-button').addEventListener('click', () => {
            soundController.play('click');
            animationController.buttonClickAnimation(event.target);
            this.showHint();
        });

        // 暂停按钮
        document.getElementById('pause-button').addEventListener('click', () => {
            soundController.play('click');
            animationController.buttonClickAnimation(event.target);
            this.togglePause();
        });

        // 声音控制按钮
        this.soundToggle.addEventListener('click', () => soundController.toggleMute());
        this.gameSoundToggle.addEventListener('click', () => soundController.toggleMute());
    }

    // 绑定用户相关事件处理器
    bindUserEventHandlers() {
        // 登录按钮
        document.getElementById('login-button').addEventListener('click', () => {
            console.log('Login button clicked');
            soundController.play('click');
            animationController.buttonClickAnimation(document.getElementById('login-button'));
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            this.handleLogin(username, password);
        });

        // 注册按钮 - 显示注册模态窗口
        document.getElementById('register-button').addEventListener('click', () => {
            console.log('Register button clicked');
            soundController.play('click');
            animationController.buttonClickAnimation(document.getElementById('register-button'));
            this.showRegisterModal();
        });

        // 确认注册按钮
        document.getElementById('confirm-register').addEventListener('click', () => {
            console.log('Confirm register clicked');
            soundController.play('click');
            animationController.buttonClickAnimation(document.getElementById('confirm-register'));
            this.handleModalRegister();
        });

        // 取消注册按钮
        document.getElementById('cancel-register').addEventListener('click', () => {
            soundController.play('click');
            this.hideRegisterModal();
        });

        // 关闭按钮
        document.querySelector('.close-button').addEventListener('click', () => {
            soundController.play('click');
            this.hideRegisterModal();
        });

        // 登出按钮
        document.getElementById('logout-button').addEventListener('click', () => {
            console.log('Logout button clicked');
            soundController.play('click');
            animationController.buttonClickAnimation(document.getElementById('logout-button'));
            this.handleLogout();
        });
    }

    // 初始化用户界面
    initializeUserInterface() {
        // 检查是否有已登录用户
        if (userManager.currentUser) {
            this.showUserInfo();
        } else {
            this.showLoginForm();
        }

        // 更新排行榜
        this.updateLeaderboard();
    }

    // 处理登录
    handleLogin(username, password) {
        console.log('Handling login for:', username); // 调试日志
        
        if (!username || !password) {
            this.showAuthMessage('请输入用户名和密码');
            return;
        }

        if (userManager.login(username, password)) {
            console.log('Login successful'); // 调试日志
            this.showUserInfo();
            this.showAuthMessage('登录成功！');
            soundController.play('correct');
        } else {
            console.log('Login failed'); // 调试日志
            this.showAuthMessage('用户名或密码错误');
            soundController.play('wrong');
        }
    }

    // 处理注册
    handleRegister(username, password) {
        console.log('Handling registration for:', username); // 调试日志
        
        if (!username || !password) {
            this.showAuthMessage('请输入用户名和密码');
            return;
        }

        if (userManager.register(username, password)) {
            console.log('Registration successful'); // 调试日志
            userManager.login(username, password);
            this.showUserInfo();
            this.showAuthMessage('注册成功！');
            soundController.play('correct');
        } else {
            console.log('Registration failed - username exists'); // 调试日志
            this.showAuthMessage('用户名已存在');
            soundController.play('wrong');
        }
    }

    // 处理登出
    handleLogout() {
        userManager.logout();
        this.showLoginForm();
        this.updateLeaderboard();
    }

    // 显示认证消息
    showAuthMessage(message) {
        this.authMessage.textContent = message;
    }

    // 显示用户信息
    showUserInfo() {
        this.loginForm.style.display = 'none';
        this.userInfo.style.display = 'block';
        
        document.getElementById('user-name').textContent = userManager.currentUser.username;
        document.getElementById('user-stars').textContent = userManager.currentUser.stars;
        document.getElementById('user-level').textContent = userManager.currentUser.highestLevel;
        this.headerUsername.textContent = userManager.currentUser.username;
    }

    // 显示登录表单
    showLoginForm() {
        this.loginForm.style.display = 'block';
        this.userInfo.style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        this.headerUsername.textContent = '';
    }

    // 更新排行榜
    updateLeaderboard() {
        const leaderboard = userManager.getLeaderboard();
        this.leaderboardList.innerHTML = leaderboard.map((user, index) => `
            <div class="leaderboard-item">
                <span class="leaderboard-rank">${index + 1}</span>
                <span class="leaderboard-username">${user.username}</span>
                <span class="leaderboard-stars">⭐ ${user.stars}</span>
            </div>
        `).join('');
    }

    // 开始游戏
    async startGame() {
        if (!userManager.currentUser) {
            this.showAuthMessage('请先登录');
            return;
        }

        console.log('Starting game...'); // 调试日志
        try {
            this.gameStartTime = Date.now();
            this.currentLevel = 1;
            this.stars = userManager.currentUser.stars || 0;
            soundController.startBackgroundMusic();
            
            // 确保所有屏幕初始状态正确
            this.resultScreen.style.display = 'none';
            this.gameScreen.style.display = 'none';
            
            await this.startLevel();
            console.log('Game started successfully'); // 调试日志
        } catch (error) {
            console.error('Error starting game:', error); // 错误日志
        }
    }

    // 开始关卡
    async startLevel() {
        console.log('Starting level:', this.currentLevel); // 调试日志
        try {
            // 生成关卡题目
            this.questions = questionGenerator.generateQuestionSet(this.currentLevel);
            this.currentQuestionIndex = 0;

            // 更新显示
            this.levelDisplay.textContent = this.currentLevel;
            this.starsDisplay.textContent = this.stars;

            // 重置小狐狸位置
            this.fox.style.left = '10%';

            // 切换到游戏界面
            this.startScreen.style.display = 'none';
            this.gameScreen.style.display = 'flex';
            
            // 显示第一个题目
            this.showQuestion();
            console.log('Level started successfully'); // 调试日志
        } catch (error) {
            console.error('Error starting level:', error); // 错误日志
        }
    }

    // 显示题目
    showQuestion() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        this.questionText.textContent = currentQuestion.question;
        this.answerInput.value = '';
        this.answerInput.focus();
    }

    // 检查答案
    async checkAnswer() {
        const userAnswer = this.answerInput.value.trim();
        if (!userAnswer) return;

        const currentQuestion = this.questions[this.currentQuestionIndex];
        const isCorrect = questionGenerator.checkAnswer(userAnswer, currentQuestion.answer);

        if (isCorrect) {
            // 播放正确音效
            soundController.play('correct');

            // 显示正确动画
            animationController.showCorrectAnimation(this.questionText);
            animationController.jumpFox(this.fox);
            animationController.showStarAnimation(this.gameScreen);

            // 更新星星数量
            this.stars++;
            this.starsDisplay.textContent = this.stars;

            // 移动小狐狸
            animationController.moveFox(this.fox, 40);

            // 显示鼓励消息
            this.showEncouragement(true);

            // 进入下一题或完成关卡
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex >= this.questions.length) {
                soundController.play('levelComplete');
                await this.completeLevel();
            } else {
                setTimeout(() => this.showQuestion(), 1000);
            }
        } else {
            // 播放错误音效
            soundController.play('wrong');

            // 显示错误动画
            animationController.showWrongAnimation(this.questionText);
            this.showEncouragement(false);
        }
    }

    // 显示鼓励消息
    showEncouragement(isCorrect) {
        const message = questionGenerator.getEncouragement(isCorrect);
        const encouragement = document.createElement('div');
        encouragement.className = 'encouragement fade-in';
        encouragement.textContent = message;
        encouragement.style.position = 'absolute';
        encouragement.style.top = '20%';
        encouragement.style.left = '50%';
        encouragement.style.transform = 'translate(-50%, -50%)';
        
        this.gameScreen.appendChild(encouragement);
        
        setTimeout(() => {
            encouragement.remove();
        }, 1500);
    }

    // 完成关卡
    async completeLevel() {
        const timeUsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        document.getElementById('stars-earned').textContent = this.stars - userManager.currentUser.stars;
        document.getElementById('time-used').textContent = timeUsed;
        document.getElementById('total-stars').textContent = this.stars;

        // 更新用户数据
        userManager.updateStars(this.stars);
        userManager.updateHighestLevel(this.currentLevel);
        
        // 更新显示
        document.getElementById('user-stars').textContent = this.stars;
        document.getElementById('user-level').textContent = Math.max(this.currentLevel, userManager.currentUser.highestLevel);
        
        // 更新排行榜
        this.updateLeaderboard();

        // 切换到结果界面
        this.gameScreen.style.display = 'none';
        this.resultScreen.style.display = 'flex';
    }

    // 开始下一关
    async startNextLevel() {
        this.currentLevel++;
        if (this.currentLevel > 15) {
            // 播放通关音效
            soundController.play('gameComplete');
            // 通关，显示结束画面
            this.showGameComplete();
        } else {
            // 切换回游戏界面
            this.resultScreen.style.display = 'none';
            this.gameScreen.style.display = 'flex';
            this.fox.style.left = '10%';  // 重置小狐狸位置
            await this.startLevel();
        }
    }

    // 重玩本关
    async replayLevel() {
        // 切换回游戏界面
        this.resultScreen.style.display = 'none';
        this.gameScreen.style.display = 'flex';
        this.fox.style.left = '10%';  // 重置小狐狸位置
        await this.startLevel();
    }

    // 显示提示
    showHint() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const [num1, operator, num2] = currentQuestion.question.split(' ');
        
        let hintText = '';
        if (operator === '+') {
            hintText = `试试从${num1}开始往上数${num2}个数`;
        } else {
            hintText = `试试从${num1}开始往回数${num2}个数`;
        }

        const hint = document.createElement('div');
        hint.className = 'hint fade-in';
        hint.textContent = hintText;
        hint.style.position = 'absolute';
        hint.style.top = '30%';
        hint.style.left = '50%';
        hint.style.transform = 'translate(-50%, -50%)';
        hint.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        hint.style.padding = '10px';
        hint.style.borderRadius = '8px';
        
        this.gameScreen.appendChild(hint);
        
        setTimeout(() => {
            hint.remove();
        }, 3000);
    }

    // 切换暂停状态
    togglePause() {
        const pauseButton = document.getElementById('pause-button');
        if (pauseButton.textContent === '暂停') {
            pauseButton.textContent = '继续';
            this.gameScreen.classList.add('paused');
            soundController.stopBackgroundMusic();
        } else {
            pauseButton.textContent = '暂停';
            this.gameScreen.classList.remove('paused');
            soundController.startBackgroundMusic();
        }
    }

    // 显示游戏通关画面
    showGameComplete() {
        const completeScreen = document.createElement('div');
        completeScreen.className = 'screen fade-in';
        completeScreen.innerHTML = `
            <h1>恭喜通关！</h1>
            <p>你真是太厉害了！</p>
            <p>总共获得 ${this.stars} 颗星星</p>
            <button onclick="location.reload()">重新开始</button>
        `;
        
        document.querySelector('.game-container').appendChild(completeScreen);
        this.resultScreen.style.display = 'none';
    }

    // 显示注册模态窗口
    showRegisterModal() {
        const modal = document.getElementById('register-modal');
        modal.style.display = 'flex';
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('reg-confirm-password').value = '';
        document.getElementById('reg-message').textContent = '';
        document.getElementById('reg-username').focus();
    }

    // 隐藏注册模态窗口
    hideRegisterModal() {
        const modal = document.getElementById('register-modal');
        modal.style.display = 'none';
    }

    // 处理模态窗口注册
    handleModalRegister() {
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const messageElement = document.getElementById('reg-message');

        if (!username || !password || !confirmPassword) {
            messageElement.textContent = '请填写所有字段';
            return;
        }

        if (password !== confirmPassword) {
            messageElement.textContent = '两次输入的密码不一致';
            return;
        }

        if (userManager.register(username, password)) {
            soundController.play('correct');
            this.hideRegisterModal();
            // 自动填充登录表单
            document.getElementById('username').value = username;
            document.getElementById('password').value = password;
            this.showAuthMessage('注册成功！请点击登录按钮进行登录');
        } else {
            soundController.play('wrong');
            messageElement.textContent = '用户名已存在';
        }
    }

    // 返回主页
    returnToHome() {
        // 停止背景音乐
        soundController.stopBackgroundMusic();
        
        // 重置游戏状态
        this.currentLevel = 1;
        this.currentQuestionIndex = 0;
        this.questions = [];
        
        // 重置小狐狸位置
        this.fox.style.left = '10%';
        
        // 隐藏游戏界面和结果界面
        this.gameScreen.style.display = 'none';
        this.resultScreen.style.display = 'none';
        
        // 显示开始界面
        this.startScreen.style.display = 'flex';
        
        // 重置暂停状态
        const pauseButton = document.getElementById('pause-button');
        pauseButton.textContent = '暂停';
        this.gameScreen.classList.remove('paused');
        
        // 更新用户信息显示
        if (userManager.currentUser) {
            this.showUserInfo();
        } else {
            this.showLoginForm();
        }
        
        // 更新排行榜
        this.updateLeaderboard();
    }
}

// 当页面加载完成时初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing game...'); // 调试日志
    window.gameController = new GameController(); // 使其全局可访问以便调试
}); 