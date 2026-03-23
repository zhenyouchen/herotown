// 土地类型定义 - 像素艺术风格
const LAND_TYPES = {
    grass: {
        name: '草地',
        color: 0x4a7c23,
        colorAlt: 0x5a8c33,
        emoji: '🌿',
        description: '绿油油的草地'
    },
    dirt: {
        name: '泥土',
        color: 0x8b6914,
        colorAlt: 0x9b7924,
        emoji: '🟤',
        description: '肥沃的泥土'
    },
    water: {
        name: '池塘',
        color: 0x2980b9,
        colorAlt: 0x3498db,
        emoji: '💧',
        description: '清澈的池塘'
    },
    forest: {
        name: '森林',
        color: 0x1e4620,
        colorAlt: 0x2e5630,
        emoji: '🌲',
        description: '茂密的像素森林'
    },
    stone: {
        name: '岩石',
        color: 0x5d5d5d,
        colorAlt: 0x7d7d7d,
        emoji: '🪨',
        description: '坚硬的岩石'
    },
    sand: {
        name: '沙地',
        color: 0xf4d03f,
        colorAlt: 0xf5d65f,
        emoji: '🏜️',
        description: '金色的沙地'
    }
};

// 像素艺术风格的建筑配置
const PIXEL_BUILDINGS = {
    hospital: { name: '勇者医院', color: 0xe74c3c, emoji: '🏥' },
    school: { name: '勇者学堂', color: 0x3498db, emoji: '📚' },
    gym: { name: '勇者武馆', color: 0xf39c12, emoji: '⚔️' },
    fitness: { name: '健身房', color: 0x2ecc71, emoji: '💪' },
    weapon: { name: '武器店', color: 0x9b59b6, emoji: '🗡️' },
    armor: { name: '防具店', color: 0x1abc9c, emoji: '🛡️' }
};

// 主游戏场景
class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.landMap = [];
        this.gridSize = 48; // 像素风格用稍小的格子
        this.mapWidth = 1200;
        this.mapHeight = 1200;
    }
    
    create() {
        console.log('🎨 MainScene.create() - 像素艺术风格');
        
        const width = this.scale.width;
        const height = this.scale.height;
        
        console.log('📐 场景尺寸:', width, 'x', height);
        
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
        
        this.createPixelWorld();
        
        const hint = this.add.text(width / 2, 20, '🏰 勇者小镇 - 像素艺术版 | 拖动移动 | 滚轮缩放', { 
            fontSize: '14px', 
            fill: '#ffffff',
            stroke: '#2c3e50',
            strokeThickness: 4,
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.landInfo = this.add.text(15, 45, '', {
            fontSize: '12px',
            fill: '#ffffff',
            stroke: '#2c3e50',
            strokeThickness: 3,
            fontFamily: 'Courier New, monospace'
        }).setScrollFactor(0);
        
        this.setupControls();
        
        this.cameras.main.centerOn(this.mapWidth / 2, this.mapHeight / 2);
        
        console.log('✅ MainScene.create() 完成 - 像素世界已创建！');
    }
    
    setupControls() {
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.cameras.main.scrollX -= pointer.position.x - pointer.prevPosition.x;
                this.cameras.main.scrollY -= pointer.position.y - pointer.prevPosition.y;
            }
        });
        
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const zoom = this.cameras.main.zoom;
            if (deltaY < 0) {
                this.cameras.main.zoom = Math.min(2.5, zoom + 0.15);
            } else {
                this.cameras.main.zoom = Math.max(0.6, zoom - 0.15);
            }
        });
        
        this.input.on('pointerdown', (pointer) => {
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
    }
    
    generateLandMap() {
        const cols = Math.floor(this.mapWidth / this.gridSize);
        const rows = Math.floor(this.mapHeight / this.gridSize);
        
        const landTypes = Object.keys(LAND_TYPES);
        
        for (let y = 0; y < rows; y++) {
            this.landMap[y] = [];
            for (let x = 0; x < cols; x++) {
                this.landMap[y][x] = this.getPixelLandType(x, y, cols, rows);
            }
        }
        
        const centerStart = Math.floor(cols / 2) - 6;
        const centerEnd = Math.floor(cols / 2) + 6;
        
        for (let y = centerStart; y < centerEnd; y++) {
            for (let x = centerStart; x < centerEnd; x++) {
                if (this.landMap[y] && this.landMap[y][x]) {
                    const distFromCenter = Math.sqrt(
                        Math.pow(x - cols/2, 2) + Math.pow(y - rows/2, 2)
                    );
                    if (distFromCenter < 5) {
                        this.landMap[y][x] = 'grass';
                    } else if (distFromCenter < 6) {
                        this.landMap[y][x] = 'dirt';
                    }
                }
            }
        }
    }
    
    getPixelLandType(x, y, cols, rows) {
        const seed = x * 7919 + y * 104729 + 12345;
        let random = ((seed * 1103515245 + 12345) % 2147483648) / 2147483648;
        
        const centerX = cols / 2;
        const centerY = rows / 2;
        const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDist = Math.sqrt(Math.pow(cols / 2, 2) + Math.pow(rows / 2, 2));
        const distRatio = distFromCenter / maxDist;
        
        if (distRatio < 0.4) {
            if (random < 0.6) return 'grass';
            if (random < 0.8) return 'dirt';
            if (random < 0.9) return 'stone';
            return 'forest';
        } else if (distRatio < 0.7) {
            if (random < 0.4) return 'forest';
            if (random < 0.6) return 'grass';
            if (random < 0.75) return 'dirt';
            if (random < 0.9) return 'stone';
            return 'water';
        } else {
            if (random < 0.35) return 'forest';
            if (random < 0.5) return 'water';
            if (random < 0.7) return 'stone';
            if (random < 0.85) return 'grass';
            return 'sand';
        }
    }
    
    createPixelWorld() {
        this.add.rectangle(this.mapWidth/2, this.mapHeight/2, this.mapWidth, this.mapHeight, 0x34495e);
        
        this.generateLandMap();
        
        const cols = Math.floor(this.mapWidth / this.gridSize);
        const rows = Math.floor(this.mapHeight / this.gridSize);
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const landType = this.landMap[y][x];
                const landInfo = LAND_TYPES[landType];
                
                const gridX = x * this.gridSize + this.gridSize / 2;
                const gridY = y * this.gridSize + this.gridSize / 2;
                
                const seed = x * 100 + y;
                const colorRandom = ((seed * 1103515245 + 12345) % 2147483648) / 2147483648;
                const useAltColor = colorRandom > 0.5;
                
                this.add.rectangle(gridX, gridY, this.gridSize - 1, this.gridSize - 1, 
                    useAltColor ? landInfo.colorAlt : landInfo.color);
                
                if (x % 3 === 1 && y % 3 === 1) {
                    this.add.text(gridX, gridY, landInfo.emoji, {
                        fontSize: '16px'
                    }).setOrigin(0.5);
                }
                
                if (x % 4 === 0 && y % 4 === 0) {
                    this.add.rectangle(gridX - 8, gridY - 8, 4, 4, 0x000000, 0.1);
                    this.add.rectangle(gridX + 8, gridY + 8, 4, 4, 0xffffff, 0.1);
                }
            }
        }
        
        this.addPixelDecorations(cols, rows);
        this.placePixelBuildings();
    }
    
    addPixelDecorations(cols, rows) {
        const decorations = ['🌳', '🌲', '🪨', '🌸', '🍀', '🌻', '🪵', '⛏️'];
        
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * this.mapWidth;
            const y = Math.random() * this.mapHeight;
            const deco = decorations[Math.floor(Math.random() * decorations.length)];
            
            const distFromCenter = Math.sqrt(
                Math.pow(x - this.mapWidth/2, 2) + Math.pow(y - this.mapHeight/2, 2)
            );
            
            if (distFromCenter > 150) {
                this.add.text(x, y, deco, {
                    fontSize: '20px'
                }).setOrigin(0.5);
            }
        }
    }
    
    placePixelBuildings() {
        const centerX = this.mapWidth / 2;
        const centerY = this.mapHeight / 2;
        
        const buildingPositions = [
            { key: 'hospital', x: -120, y: -80 },
            { key: 'school', x: 0, y: -80 },
            { key: 'gym', x: 120, y: -80 },
            { key: 'fitness', x: -120, y: 80 },
            { key: 'weapon', x: 0, y: 80 },
            { key: 'armor', x: 120, y: 80 }
        ];
        
        buildingPositions.forEach(pos => {
            this.placePixelBuilding(
                centerX + pos.x,
                centerY + pos.y,
                pos.key
            );
        });
        
        const campfireX = centerX;
        const campfireY = centerY;
        
        this.add.text(campfireX, campfireY - 5, '🔥', { fontSize: '32px' }).setOrigin(0.5);
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const stoneX = campfireX + Math.cos(angle) * 35;
            const stoneY = campfireY + Math.sin(angle) * 35;
            this.add.text(stoneX, stoneY, '🪨', { fontSize: '16px' }).setOrigin(0.5);
        }
    }
    
    placePixelBuilding(x, y, key) {
        const building = PIXEL_BUILDINGS[key];
        const size = this.gridSize * 1.8;
        
        this.add.rectangle(x, y, size, size, building.color)
            .setStrokeStyle(3, 0x2c3e50);
        
        this.add.rectangle(x, y - size/4, size * 0.8, 4, 0xffffff, 0.3);
        
        this.add.text(x, y, building.emoji, {
            fontSize: '28px'
        }).setOrigin(0.5);
        
        this.add.text(x, y + size/2 + 12, building.name, {
            fontSize: '10px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5);
    }
    
    showLandInfo(gridX, gridY, landType) {
        const landInfo = LAND_TYPES[landType];
        this.landInfo.setText(
            `📍 位置: (${gridX}, ${gridY})\n` +
            `${landInfo.emoji} 类型: ${landInfo.name}\n` +
            `📝 ${landInfo.description}`
        );
    }
}
