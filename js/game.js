// 游戏入口文件

// 等所有脚本加载完后初始化
window.onload = function() {
    console.log('🎮 所有脚本加载完成，开始初始化...');
    
    // 初始化游戏管理器
    window.gameManager = new GameManager();
    
    // 获取游戏区域尺寸 - 使用默认值确保游戏能启动
    const gameDiv = document.getElementById('game');
    let width = gameDiv.clientWidth || 800;
    let height = gameDiv.clientHeight || 600;
    
    // 如果尺寸太小，使用合理的默认值
    if (width < 100) width = 800;
    if (height < 100) height = 600;
    
    console.log('📐 游戏画布尺寸:', width, 'x', height);
    
    // 游戏配置
    const config = {
        type: Phaser.AUTO,
        width: width,
        height: height,
        parent: 'game',
        scene: [MainScene],
        backgroundColor: '#2d2d44', // 用浅一点的背景色，方便看出是否加载
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
