// 用户管理类
class UserManager {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }

    // 从本地存储加载当前用户
    loadCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            return true;
        }
        return false;
    }

    // 保存当前用户到本地存储
    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    // 用户登录
    login(username, password) {
        // 从本地存储获取用户数据
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username] && users[username].password === password) {
            this.currentUser = {
                username: username,
                stars: users[username].stars || 0,
                highestLevel: users[username].highestLevel || 1
            };
            this.saveCurrentUser();
            return true;
        }
        return false;
    }

    // 用户注册
    register(username, password) {
        // 从本地存储获取用户数据
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        // 检查用户名是否已存在
        if (users[username]) {
            return false;
        }

        // 创建新用户
        users[username] = {
            password: password,
            stars: 0,
            highestLevel: 1
        };

        // 保存用户数据
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }

    // 用户登出
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // 更新用户星星数量
    updateStars(stars) {
        if (this.currentUser) {
            this.currentUser.stars = stars;
            
            // 更新本地存储中的用户数据
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            if (users[this.currentUser.username]) {
                users[this.currentUser.username].stars = stars;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            this.saveCurrentUser();
        }
    }

    // 更新用户最高关卡
    updateHighestLevel(level) {
        if (this.currentUser && level > (this.currentUser.highestLevel || 1)) {
            this.currentUser.highestLevel = level;
            
            // 更新本地存储中的用户数据
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            if (users[this.currentUser.username]) {
                users[this.currentUser.username].highestLevel = level;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            this.saveCurrentUser();
        }
    }

    // 获取用户排行榜
    getLeaderboard() {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        return Object.entries(users)
            .map(([username, data]) => ({
                username,
                stars: data.stars || 0,
                highestLevel: data.highestLevel || 1
            }))
            .sort((a, b) => b.stars - a.stars)
            .slice(0, 10); // 只返回前10名
    }
}

// 导出用户管理器实例
window.userManager = new UserManager(); 