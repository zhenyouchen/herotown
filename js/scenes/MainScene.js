// 土地类型定义
const LAND_TYPES = {
    field: {
        name: '田地',
        color: 0xf4a460,
        emoji: '🌾',
        description: '可以种植作物的农田'
    },
    wasteland: {
        name: '荒地',
        color: 0xd2b48c,
        emoji: '🏜️',
        description: '贫瘠的荒地，有待开发'
    },
    forest: {
        name: '森林',
        color: 0x228b22,
        emoji: '🌲',
        description: '茂密的森林，可以采集木材'
    },
    dungeon: {
        name: '魔兽洞窟',
        color: 0x4a0080,
        emoji: '🕳️',
        description: '危险的洞窟，有魔兽出没'
    },
    mine: {
        name: '矿洞',
        color: 0x696969,
        emoji: '⛏️',
        description: '矿藏丰富的矿洞'
    }
};

// 主游戏场景
class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.landMap = []; // 存储每个格子的土地类型
        this.gridSize = 64;
        this.mapWidth = 800; // 减小地图尺寸
        this.mapHeight = 600; // 减小地图尺寸
    }
    
    create() {
        console.log('🎨 MainScene.create() 被调用');
        
        // 获取游戏区域尺寸
        const width = this.scale.width;
        const height = this.scale.height;
        
        console.log('📐 场景尺寸:', width, 'x', height);
        
        // 相机设置
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
        
        // 创建一个简单的背景
        this.add.rectangle(this.mapWidth/2, this.mapHeight/2, this.mapWidth, this.mapHeight, 0x87ceeb);
        
        // 添加一些测试内容
        this.add.text(this.mapWidth/2, this.mapHeight/2, '🏰 勇者小镇\n游戏加载成功！', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
        
        // 添加测试格子
        this.createTestGrid();
        
        // 测试文字（固定在屏幕上）
        const hint = this.add.text(width / 2, 30, '✅ 游戏加载成功！这是测试页面', { 
            fontSize: '18px', 
            fill: '#00ff00',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0);
        
        console.log('✅ MainScene.create() 完成');
    }
    
    createTestGrid() {
        // 创建一个小的测试网格
        const cols = 10;
        const rows = 8;
        const offsetX = (this.mapWidth - cols * this.gridSize) / 2;
        const offsetY = (this.mapHeight - rows * this.gridSize) / 2 + 50;
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const gridX = offsetX + x * this.gridSize + this.gridSize / 2;
                const gridY = offsetY + y * this.gridSize + this.gridSize / 2;
                
                // 随机选择土地类型
                const types = Object.keys(LAND_TYPES);
                const landType = types[Math.floor(Math.random() * types.length)];
                const landInfo = LAND_TYPES[landType];
                
                this.add.rectangle(gridX, gridY, this.gridSize - 2, this.gridSize - 2, landInfo.color)
                    .setStrokeStyle(1, 0x333);
                
                if (x % 2 === 0 && y % 2 === 0) {
                    this.add.text(gridX, gridY, landInfo.emoji, {
                        fontSize: '20px'
                    }).setOrigin(0.5);
                }
            }
        }
    }
}
