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
        this.mapWidth = 2000;
        this.mapHeight = 2000;
    }
    
    create() {
        // 获取游戏区域尺寸
        const width = this.scale.width;
        const height = this.scale.height;
        
        // 相机设置
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
        
        // 创建大地图
        this.createWorld();
        
        // 测试文字（固定在屏幕上）
        const hint = this.add.text(width / 2, 30, '拖动鼠标移动视角 | 滚轮缩放 | 点击格子查看信息', { 
            fontSize: '16px', 
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0);
        
        // 土地信息面板（固定在屏幕上）
        this.landInfo = this.add.text(20, 60, '', {
            fontSize: '14px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2
        }).setScrollFactor(0);
        
        // 设置拖动
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.cameras.main.scrollX -= pointer.position.x - pointer.prevPosition.x;
                this.cameras.main.scrollY -= pointer.position.y - pointer.prevPosition.y;
            }
        });
        
        // 滚轮缩放
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const zoom = this.cameras.main.zoom;
            if (deltaY < 0) {
                this.cameras.main.zoom = Math.min(2, zoom + 0.1);
            } else {
                this.cameras.main.zoom = Math.max(0.5, zoom - 0.1);
            }
        });
        
        // 点击格子显示信息
        this.input.on('pointerdown', (pointer) => {
            if (!pointer.isDown) return;
            
            const worldX = pointer.worldX;
            const worldY = pointer.worldY;
            
            if (worldX >= 0 && worldX < this.mapWidth && worldY >= 0 && worldY < this.mapHeight) {
                const gridX = Math.floor(worldX / this.gridSize);
                const gridY = Math.floor(worldY / this.gridSize);
                
                if (this.landMap[gridY] && this.landMap[gridY][gridX]) {
                    this.showLandInfo(gridX, gridY, this.landMap[gridY][gridX]);
                }
            }
        });
        
        // 相机初始位置
        this.cameras.main.centerOn(1000, 1000);
    }
    
    // 生成土地类型分布
    generateLandMap() {
        const cols = Math.floor(this.mapWidth / this.gridSize);
        const rows = Math.floor(this.mapHeight / this.gridSize);
        
        // 初始化土地图
        for (let y = 0; y < rows; y++) {
            this.landMap[y] = [];
            for (let x = 0; x < cols; x++) {
                this.landMap[y][x] = this.getLandType(x, y, cols, rows);
            }
        }
        
        // 中心区域设置为荒地（用于建造城镇）
        const centerStart = Math.floor(cols / 2) - 5;
        const centerEnd = Math.floor(cols / 2) + 5;
        
        for (let y = centerStart; y < centerEnd; y++) {
            for (let x = centerStart; x < centerEnd; x++) {
                if (this.landMap[y] && this.landMap[y][x]) {
                    this.landMap[y][x] = 'wasteland';
                }
            }
        }
    }
    
    // 根据位置获取土地类型（使用简单的噪声算法）
    getLandType(x, y, cols, rows) {
        // 使用简单的伪随机算法，让相同位置每次都生成相同的类型
        const seed = x * 7919 + y * 104729 + 12345;
        const random = ((seed * 1103515245 + 12345) % 2147483648) / 2147483648;
        
        // 计算距离中心的距离
        const centerX = cols / 2;
        const centerY = rows / 2;
        const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDist = Math.sqrt(Math.pow(cols / 2, 2) + Math.pow(rows / 2, 2));
        const distRatio = distFromCenter / maxDist;
        
        // 根据距离调整概率
        if (distRatio < 0.3) {
            // 中心附近：荒地和田地多
            if (random < 0.5) return 'wasteland';
            if (random < 0.7) return 'field';
            if (random < 0.85) return 'forest';
            if (random < 0.95) return 'mine';
            return 'dungeon';
        } else if (distRatio < 0.6) {
            // 中间区域：森林和田地多
            if (random < 0.35) return 'forest';
            if (random < 0.55) return 'field';
            if (random < 0.7) return 'wasteland';
            if (random < 0.85) return 'mine';
            return 'dungeon';
        } else {
            // 边缘区域：森林、矿洞、洞窟多
            if (random < 0.35) return 'forest';
            if (random < 0.55) return 'mine';
            if (random < 0.75) return 'dungeon';
            if (random < 0.9) return 'wasteland';
            return 'field';
        }
    }
    
    createWorld() {
        // 天空背景
        this.add.rectangle(this.mapWidth/2, this.mapHeight/2, this.mapWidth, this.mapHeight, 0x87ceeb);
        
        // 生成土地类型分布
        this.generateLandMap();
        
        // 根据土地类型绘制地图
        const cols = Math.floor(this.mapWidth / this.gridSize);
        const rows = Math.floor(this.mapHeight / this.gridSize);
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const landType = this.landMap[y][x];
                const landInfo = LAND_TYPES[landType];
                
                // 绘制格子
                const gridX = x * this.gridSize + this.gridSize / 2;
                const gridY = y * this.gridSize + this.gridSize / 2;
                
                this.add.rectangle(gridX, gridY, this.gridSize - 2, this.gridSize - 2, landInfo.color)
                    .setStrokeStyle(1, 0x333);
                
                // 在格子上添加emoji图标（每4个格子显示一个，避免太拥挤）
                if (x % 2 === 0 && y % 2 === 0) {
                    this.add.text(gridX, gridY, landInfo.emoji, {
                        fontSize: '24px'
                    }).setOrigin(0.5);
                }
            }
        }
        
        // 初始的几个建筑占位符（在中心区域）
        this.placeBuilding(320, 320, 'hospital', 0xff6b6b);
        this.placeBuilding(640, 320, 'school', 0x4ecdc4);
        this.placeBuilding(960, 320, 'gym', 0xffd700);
        this.placeBuilding(320, 640, 'fitness', 0x95e1d3);
        this.placeBuilding(640, 640, 'weapon', 0xf38181);
        this.placeBuilding(960, 640, 'armor', 0xaa96da);
    }
    
    // 显示土地信息
    showLandInfo(gridX, gridY, landType) {
        const landInfo = LAND_TYPES[landType];
        this.landInfo.setText(
            `📍 位置: (${gridX}, ${gridY})\n` +
            `${landInfo.emoji} 类型: ${landInfo.name}\n` +
            `📝 ${landInfo.description}`
        );
    }
    
    placeBuilding(x, y, name, color) {
        // 建筑底座（2x2格子）
        this.add.rectangle(x + this.gridSize, y + this.gridSize, this.gridSize*2 - 4, this.gridSize*2 - 4, color)
            .setStrokeStyle(2, 0x333);
        
        // 建筑名字
        this.add.text(x + this.gridSize, y + this.gridSize, name, {
            fontSize: '12px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }
}