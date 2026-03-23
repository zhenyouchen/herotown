// 游戏入口文件

// 先声明这些类，让后面能用（因为 script 标签加载是顺序的）
let Hero, Building, HeroHospital, HeroSchool, HeroGym, HeroFitness, WeaponShop, ArmorShop, SKILLS, GameManager, UIManager;

// 等所有脚本加载完后初始化
window.onload = function() {
    console.log('🎮 所有脚本加载完成，开始初始化...');
    
    // 获取游戏区域尺寸
    const gameDiv = document.getElementById('game');
    const width = gameDiv.clientWidth;
    const height = gameDiv.clientHeight;
    
    // 游戏配置
    const config = {
        type: Phaser.AUTO,
        width: width,
        height: height,
        parent: 'game',
        scene: [MainScene],
        backgroundColor: '#1a1a2e',
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.NO_CENTER
        }
    };
    
    // 启动游戏
    const game = new Phaser.Game(config);
    
    // 初始化 UI 管理器
    window.uiManager = new UIManager();
    
    console.log('🏰 勇者小镇启动！');
};
