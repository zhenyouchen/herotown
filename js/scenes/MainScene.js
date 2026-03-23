// 像素艺术风格 - 使用 Tiny Swords 素材
const LAND_TYPES = {
    grass: { name: '草地', color: 0x4a7c23, tile: 0 },
    dirt: { name: '泥土', color: 0x8b6914, tile: 1 },
    water: { name: '池塘', color: 0x2980b9, tile: 2 },
    forest: { name: '森林', color: 0x1e4620, tile: 3 },
    stone: { name: '岩石', color: 0x5d5d5d, tile: 4 },
    sand: { name: '沙地', color: 0xf4d03f, tile: 5 }
};

const PIXEL_BUILDINGS = {
    hospital: { name: '勇者医院', file: 'Castle.png', color: 0xe74c3c },
    school: { name: '勇者学堂', file: 'Monastery.png', color: 0x3498db },
    gym: { name: '勇者武馆', file: 'Barracks.png', color: 0xf39c12 },
    fitness: { name: '健身房', file: 'Archery.png', color: 0x2ecc71 },
    weapon: { name: '武器店', file: 'House1.png', color: 0x9b59b6 },
    armor: { name: '防具店', file: 'House2.png', color: 0x1abc9c }
};

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.landMap = [];
        this.gridSize = 64;
        this.mapWidth = 1600;
        this.mapHeight = 1600;
        this.buildingSprites = {};
    }
    
    preload() {
        console.log('📦 开始加载素材...');
        
        this.load.setPath('assets/');
        
        Object.values(PIXEL_BUILDINGS).forEach(building => {
            this.load.image(`building-${building.file}`, `buildings/${building.file}`);
        });
        
        this.load.image('tilemap', 'terrain/Tilemap_color1.png');
        
        console.log('✅ 素材加载完成！');
    }
    
    create() {
        console.log('🎨 MainScene.create() - 像素艺术版');
        
        const width = this.scale.width;
        const height = this.scale.height;
        
        console.log('📐 场景尺寸:', width, 'x', height);
        
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
        
        this.createPixelWorld();
        
        const hint = this.add.text(width / 2, 20, '🏰 勇者小镇 - Tiny Swords 像素版 | 拖动移动 | 滚轮缩放', { 
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
            if (random < 0.7) return 'grass';
            if (random < 0.85) return 'dirt';
            return 'stone';
        } else if (distRatio < 0.7) {
            if (random < 0.4) return 'forest';
            if (random < 0.65) return 'grass';
            if (random < 0.8) return 'dirt';
            return 'stone';
        } else {
            if (random < 0.35) return 'water';
            if (random < 0.55) return 'forest';
            if (random < 0.75) return 'stone';
            if (random < 0.9) return 'grass';
            return 'sand';
        }
    }
    
    createPixelWorld() {
        this.add.rectangle(this.mapWidth/2, this.mapHeight/2, this.mapWidth, this.mapHeight, 0x87ceeb);
        
        this.generateLandMap();
        
        const cols = Math.floor(this.mapWidth / this.gridSize);
        const rows = Math.floor(this.mapHeight / this.gridSize);
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const landType = this.landMap[y][x];
                const landInfo = LAND_TYPES[landType];
                const gridX = x * this.gridSize + this.gridSize / 2;
                const gridY = y * this.gridSize + this.gridSize / 2;
                
                this.add.rectangle(gridX, gridY, this.gridSize - 1, this.gridSize - 1, landInfo.color);
            }
        }
        
        this.addPixelDecorations(cols, rows);
        this.placePixelBuildings();
    }
    
    addPixelDecorations(cols, rows) {
        const decoTypes = ['tree', 'rock', 'bush'];
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * this.mapWidth;
            const y = Math.random() * this.mapHeight;
            const decoType = decoTypes[Math.floor(Math.random() * decoTypes.length)];
            
            const distFromCenter = Math.sqrt(
                Math.pow(x - this.mapWidth/2, 2) + Math.pow(y - this.mapHeight/2, 2)
            );
            
            if (distFromCenter > 200) {
                const emojis = { tree: '🌲', rock: '🪨', bush: '🌿' };
                this.add.text(x, y, emojis[decoType], {
                    fontSize: '24px'
                }).setOrigin(0.5);
            }
        }
    }
    
    placePixelBuildings() {
        const centerX = this.mapWidth / 2;
        const centerY = this.mapHeight / 2;
        
        const buildingPositions = [
            { key: 'hospital', x: -150, y: -100 },
            { key: 'school', x: 0, y: -100 },
            { key: 'gym', x: 150, y: -100 },
            { key: 'fitness', x: -150, y: 100 },
            { key: 'weapon', x: 0, y: 100 },
            { key: 'armor', x: 150, y: 100 }
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
        
        this.add.text(campfireX, campfireY - 5, '🔥', { fontSize: '36px' }).setOrigin(0.5);
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const stoneX = campfireX + Math.cos(angle) * 40;
            const stoneY = campfireY + Math.sin(angle) * 40;
            this.add.text(stoneX, stoneY, '🪨', { fontSize: '18px' }).setOrigin(0.5);
        }
    }
    
    placePixelBuilding(x, y, key) {
        const building = PIXEL_BUILDINGS[key];
        
        // 使用加载的图片
        const sprite = this.add.image(x, y, `building-${building.file}`);
        sprite.setScale(0.8); // 缩放以适应
        
        // 添加建筑名称
        this.add.text(x, y + 50, building.name, {
            fontSize: '11px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5);
    }
    
    showLandInfo(gridX, gridY, landType) {
        const landInfo = LAND_TYPES[landType];
        const emojis = { grass: '🌿', dirt: '🟤', water: '💧', forest: '🌲', stone: '🪨', sand: '🏜️' };
        this.landInfo.setText(
            `📍 位置: (${gridX}, ${gridY})\n` +
            `${emojis[landType] || '❓'} 类型: ${landInfo.name}`
        );
    }
}
