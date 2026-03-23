// 模拟浏览器环境测试
console.log('🧪 模拟浏览器环境测试...\n');

// 模拟 window 和 document
global.window = {};
global.document = {
    getElementById: (id) => {
        console.log(`📄 document.getElementById('${id}')`);
        return {
            innerHTML: '',
            textContent: '',
            style: {},
            classList: { add: () => {}, remove: () => {} },
            addEventListener: () => {},
            querySelectorAll: () => [],
            clientWidth: 800,
            clientHeight: 600
        };
    },
    querySelectorAll: () => []
};

// 模拟 console
const originalLog = console.log;
console.log = (...args) => {
    originalLog('🟢', ...args);
};
console.warn = (...args) => {
    originalLog('🟡', ...args);
};
console.error = (...args) => {
    originalLog('🔴', ...args);
};

// 模拟 Phaser
global.Phaser = {
    AUTO: 'AUTO',
    Scene: class Scene {
        constructor(key) {
            console.log(`🎬 Phaser.Scene 创建: ${key}`);
        }
    },
    Game: class Game {
        constructor(config) {
            console.log('🎮 Phaser.Game 创建成功！');
            console.log('   配置:', JSON.stringify({
                ...config,
                scene: config.scene ? '[MainScene]' : undefined
            }, null, 2));
        }
    },
    Scale: {
        RESIZE: 'RESIZE',
        NO_CENTER: 'NO_CENTER'
    }
};

console.log('1. 加载 Hero.js...');
const fs = require('fs');
const path = require('path');

try {
    eval(fs.readFileSync(path.join(__dirname, 'js/Hero.js'), 'utf8'));
    console.log('   ✅ Hero.js 加载成功');
} catch (e) {
    console.error('   ❌ Hero.js 加载失败:', e);
    process.exit(1);
}

console.log('\n2. 加载 Buildings.js...');
try {
    eval(fs.readFileSync(path.join(__dirname, 'js/Buildings.js'), 'utf8'));
    console.log('   ✅ Buildings.js 加载成功');
} catch (e) {
    console.error('   ❌ Buildings.js 加载失败:', e);
    process.exit(1);
}

console.log('\n3. 加载 GameManager.js...');
try {
    eval(fs.readFileSync(path.join(__dirname, 'js/GameManager.js'), 'utf8'));
    console.log('   ✅ GameManager.js 加载成功');
} catch (e) {
    console.error('   ❌ GameManager.js 加载失败:', e);
    process.exit(1);
}

console.log('\n4. 加载 UIManager.js...');
try {
    eval(fs.readFileSync(path.join(__dirname, 'js/UIManager.js'), 'utf8'));
    console.log('   ✅ UIManager.js 加载成功');
} catch (e) {
    console.error('   ❌ UIManager.js 加载失败:', e);
    process.exit(1);
}

console.log('\n5. 加载 MainScene.js...');
try {
    eval(fs.readFileSync(path.join(__dirname, 'js/scenes/MainScene.js'), 'utf8'));
    console.log('   ✅ MainScene.js 加载成功');
} catch (e) {
    console.error('   ❌ MainScene.js 加载失败:', e);
    process.exit(1);
}

console.log('\n6. 加载 game.js 并执行 window.onload...');
try {
    const gameJsContent = fs.readFileSync(path.join(__dirname, 'js/game.js'), 'utf8');
    eval(gameJsContent);
    console.log('   ✅ game.js 加载成功');
    
    // 执行 window.onload
    console.log('\n7. 执行 window.onload...');
    if (window.onload) {
        window.onload();
        console.log('   ✅ window.onload 执行成功');
    }
} catch (e) {
    console.error('   ❌ 执行失败:', e);
    console.error('   堆栈:', e.stack);
    process.exit(1);
}

console.log('\n🎉 所有测试通过！');
