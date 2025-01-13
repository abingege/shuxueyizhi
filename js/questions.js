// 题目生成器类
class QuestionGenerator {
    constructor() {
        // 定义难度等级范围
        this.difficultyRanges = {
            1: { min: 1, max: 10, operators: ['+', '-'] },  // 1-5关
            2: { min: 1, max: 30, operators: ['+', '-'] },  // 6-10关
            3: { min: 1, max: 50, operators: ['+', '-'] }   // 11-15关
        };
        
        // 用于记录已经出现过的题目
        this.usedQuestions = new Set();
    }

    // 获取当前难度等级
    getDifficultyLevel(level) {
        if (level <= 5) return 1;
        if (level <= 10) return 2;
        return 3;
    }

    // 生成随机数
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 生成题目的唯一标识
    generateQuestionKey(num1, operator, num2) {
        return `${num1}${operator}${num2}`;
    }

    // 检查题目是否重复
    isQuestionDuplicate(num1, operator, num2) {
        const key = this.generateQuestionKey(num1, operator, num2);
        return this.usedQuestions.has(key);
    }

    // 生成题目
    generateQuestion(level) {
        const difficulty = this.getDifficultyLevel(level);
        const range = this.difficultyRanges[difficulty];
        
        let num1, num2, operator, key;
        let attempts = 0;
        const maxAttempts = 100; // 防止无限循环

        do {
            // 生成两个随机数
            num1 = this.getRandomNumber(range.min, range.max);
            num2 = this.getRandomNumber(range.min, range.max);
            
            // 随机选择运算符
            operator = range.operators[Math.floor(Math.random() * range.operators.length)];
            
            // 如果是减法，确保结果为正数
            if (operator === '-' && num1 < num2) {
                [num1, num2] = [num2, num1];  // 交换两个数
            }

            key = this.generateQuestionKey(num1, operator, num2);
            attempts++;

            // 如果尝试次数过多，清空已使用题目记录
            if (attempts >= maxAttempts) {
                console.log('重置题目池');
                this.usedQuestions.clear();
                attempts = 0;
            }
        } while (this.usedQuestions.has(key));

        // 记录这个题目
        this.usedQuestions.add(key);

        // 计算答案
        const answer = operator === '+' ? num1 + num2 : num1 - num2;

        return {
            question: `${num1} ${operator} ${num2} = ?`,
            answer: answer
        };
    }

    // 生成一组题目
    generateQuestionSet(level, count = 5) {
        const questions = [];
        for (let i = 0; i < count; i++) {
            questions.push(this.generateQuestion(level));
        }
        return questions;
    }

    // 检查答案
    checkAnswer(userAnswer, correctAnswer) {
        return parseInt(userAnswer) === correctAnswer;
    }

    // 获取鼓励消息
    getEncouragement(isCorrect) {
        const correctMessages = [
            "太棒了！",
            "做得好！",
            "真聪明！",
            "继续加油！",
            "你真厉害！"
        ];

        const incorrectMessages = [
            "没关系，再试一次！",
            "加油，你可以的！",
            "仔细想想哦~",
            "相信自己，再来一次！",
            "别灰心，继续努力！"
        ];

        const messages = isCorrect ? correctMessages : incorrectMessages;
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // 重置题目池
    resetQuestionPool() {
        this.usedQuestions.clear();
    }
}

// 导出题目生成器实例
const questionGenerator = new QuestionGenerator(); 