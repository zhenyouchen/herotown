// 游戏入口文件

// 等所有脚本加载完后初始化
window.onload = function() {
    try {
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
            backgroundColor: '#2d2d44',
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.NO_CENTER
            },
            // 添加错误处理
            callbacks: {
                preBoot: function(game) {
                    console.log('🚀 Phaser 预启动...');
                },
                postBoot: function(game) {
                    console.log('✅ Phaser 启动完成！');
                }
            }
        };
        
        // 清除旧的全局标志，确保能正常启动
        window.MainSceneCreated = false;
        window.NPCManagerCreated = false;
        window.ExistingNPCs = [];
        
        // 启动游戏
        const game = new Phaser.Game(config);
        
        // 初始化 UI 管理器
        window.uiManager = new UIManager();
        
        console.log('🏰 勇者小镇启动！');
    } catch (error) {
        console.error('❌ 游戏启动失败:', error);
        console.error('错误堆栈:', error.stack);
        
        // 在页面上显示错误信息
        const gameDiv = document.getElementById('game');
        if (gameDiv) {
            gameDiv.innerHTML = `
                <div style="color: white; padding: 20px; text-align: center;">
                    <h2>❌ 游戏加载失败</h2>
                    <p>错误: ${error.message}</p>
                    <pre style="text-align: left; background: #333; padding: 10px; margin-top: 10px;">${error.stack}</pre>
                </div>
            `;
        }
    }
};

// 全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
    console.error('🚨 全局错误:', message, 'at', source, ':', lineno, ':', colno);
    return false;
};
