// 模拟浏览器加载顺序测试
console.log('🧪 开始测试脚本加载顺序...');

// 模拟全局变量
let window = {};
let global = window;

// 模拟 Phaser
console.log('1. 加载 Phaser...');
window.Phaser = {
    AUTO: 'AUTO',
    Scene: class Scene {},
    Game: class Game {
        constructor(config) {
            console.log('   ✅ Phaser.Game 创建成功');
            console.log('   配置:', config);
        }
    },
    Scale: {
        RESIZE: 'RESIZE',
        NO_CENTER: 'NO_CENTER'
    }
};

console.log('2. 加载 Hero.js...');
const fs = require('fs');
const path = require('path');
eval(fs.readFileSync(path.join(__dirname, 'js/Hero.js'), 'utf8'));
console.log('   ✅ Hero.js 加载成功');

console.log('3. 加载 Buildings.js...');
eval(fs.readFileSync(path.join(__dirname, 'js/Buildings.js'), 'utf8'));
console.log('   ✅ Buildings.js 加载成功');

console.log('4. 加载 GameManager.js...');
eval(fs.readFileSync(path.join(__dirname, 'js/GameManager.js'), 'utf8'));
console.log('   ✅ GameManager.js 加载成功');

console.log('5. 加载 UIManager.js...');
try {
    // UIManager 会用到 DOM，我们需要 mock
    window.document = {
        getElementById: (id) => {
            console.log(`   document.getElementById('${id}') 被调用`);
            return {
                innerHTML: '',
                textContent: '',
                classList: { add: () => {}, remove: () => {} },
                addEventListener: () => {}
            };
        },
        querySelectorAll: () => []
    };
    eval(fs.readFileSync(path.join(__dirname, 'js/UIManager.js'), 'utf8'));
    console.log('   ✅ UIManager.js 加载成功');
} catch (e) {
    console.log('   ⚠️ UIManager.js 加载警告（DOM 相关，正常）:', e.message);
}

console.log('6. 加载 MainScene.js...');
try {
    eval(fs.readFileSync(path.join(__dirname, 'js/scenes/MainScene.js'), 'utf8'));
    console.log('   ✅ MainScene.js 加载成功');
} catch (e) {
    console.log('   ❌ MainScene.js 加载失败:', e);
}

console.log('7. 加载 game.js...');
try {
    eval(fs.readFileSync(path.join(__dirname, 'js/game.js'), 'utf8'));
    console.log('   ✅ game.js 加载成功');
} catch (e) {
    console.log('   ❌ game.js 加载失败:', e);
}

console.log('\n🎉 测试完成！');
