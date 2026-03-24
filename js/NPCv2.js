// NPC类 - 地图上的非玩家角色（使用Tiny Swords素材）
class NPC {
    constructor(id, name, unitType, x, y, buildings) {
        this.id = id;
        this.name = name;
        this.unitType = unitType; // Warrior, Archer, Lancer, Monk, Pawn
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.speed = 0.8 + Math.random() * 0.4;
        this.idleTime = 0;
        this.maxIdleTime = 60 + Math.random() * 120;
        this.direction = 'down';
        this.sprite = null;
        this.nameText = null;
        this.buildings = buildings; // 建筑位置，用于碰撞检测
        this.radius = 20; // NPC碰撞半径
        
        // 根据unitType设置对话
        this.dialogues = this.getDialoguesByUnitType(unitType);
    }
    
    getDialoguesByUnitType(unitType) {
        const dialogueMap = {
            Warrior: [
                "战斗是我的生命！",
                "需要保镖吗？我很便宜。",
                "我的剑已经饥渴难耐了！",
                "勇者大人，请让我跟随您！"
            ],
            Archer: [
                "百步穿杨，例无虚发。",
                "需要远程支援吗？",
                "我的眼睛比鹰还锐利。",
                "箭在弦上，随时准备。"
            ],
            Lancer: [
                "长枪如龙，所向披靡！",
                "一寸长，一寸强。",
                "我的枪法可是祖传的。",
                "冲锋陷阵，舍我其谁！"
            ],
            Monk: [
                "愿神明保佑你。",
                "需要治疗吗？我精通医术。",
                "和平胜过战争。",
                "让我为你祈祷..."
            ],
            Pawn: [
                "我只是个普通人...",
                "小镇的生活很平静。",
                "听说外面的世界很危险。",
                "愿勇者大人们平安归来。"
            ]
        };
        return dialogueMap[unitType] || dialogueMap.Pawn;
    }
    
    getRandomDialogue() {
        return this.dialogues[Math.floor(Math.random() * this.dialogues.length)];
    }
    
    update() {
        if (this.idleTime > 0) {
            this.idleTime--;
            return;
        }
        
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 3) {
            this.pickNewTarget();
            this.idleTime = this.maxIdleTime;
        } else {
            // 计算移动
            const moveX = (dx / distance) * this.speed;
            const moveY = (dy / distance) * this.speed;
            
            // 预测新位置
            const newX = this.x + moveX;
            const newY = this.y + moveY;
            
            // 检查是否与建筑碰撞
            if (!this.checkBuildingCollision(newX, newY)) {
                this.x = newX;
                this.y = newY;
                
                // 更新方向
                if (Math.abs(moveX) > Math.abs(moveY)) {
                    this.direction = moveX > 0 ? 'right' : 'left';
                } else {
                    this.direction = moveY > 0 ? 'down' : 'up';
                }
                
                // 更新精灵位置
                if (this.sprite) {
                    this.sprite.x = this.x;
                    this.sprite.y = this.y;
                }
                if (this.nameText) {
                    this.nameText.x = this.x;
                    this.nameText.y = this.y - 25;
                }
            } else {
                // 碰撞了，重新选择目标
                this.pickNewTarget();
            }
        }
    }
    
    checkBuildingCollision(x, y) {
        // 检查与每个建筑的碰撞
        for (let building of this.buildings) {
            const dx = x - building.x;
            const dy = y - building.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 建筑半径 + NPC半径
            if (distance < (building.radius + this.radius)) {
                return true; // 碰撞
            }
        }
        return false; // 没有碰撞
    }
    
    pickNewTarget() {
        const centerX = 800;
        const centerY = 800;
        const range = 250;
        
        let attempts = 0;
        let newX, newY;
        
        // 尝试找到不碰撞的位置
        do {
            newX = centerX + (Math.random() - 0.5) * range * 2;
            newY = centerY + (Math.random() - 0.5) * range * 2;
            attempts++;
        } while (this.checkBuildingCollision(newX, newY) && attempts < 10);
        
        this.targetX = Math.max(150, Math.min(1450, newX));
        this.targetY = Math.max(150, Math.min(1450, newY));
    }
    
    createSprite(scene) {
        console.log('🔨 创建NPC精灵:', this.name, '类型:', this.unitType);
        
        // 使用Tiny Swords精灵表的第一帧
        const textureKey = `unit-${this.unitType.toLowerCase()}`;
        
        // 检查精灵表是否存在
        if (!scene.textures.exists(textureKey)) {
            console.error('❌ 精灵表不存在:', textureKey);
            // 使用备用emoji
            const emojis = { Warrior: '⚔️', Archer: '🏹', Lancer: '🗡️', Monk: '🧘', Pawn: '👤' };
            this.sprite = scene.add.text(this.x, this.y, emojis[this.unitType] || '👤', {
                fontSize: '32px'
            }).setOrigin(0.5);
        } else {
            try {
                // 使用精灵表的第一帧创建精灵
                console.log('  使用精灵表:', textureKey);
                this.sprite = scene.add.sprite(this.x, this.y, textureKey, 0); // 帧0
                this.sprite.setScale(0.8); // 稍微缩小一点
            } catch (e) {
                console.error('❌ 创建精灵失败:', e);
                const emojis = { Warrior: '⚔️', Archer: '🏹', Lancer: '🗡️', Monk: '🧘', Pawn: '👤' };
                this.sprite = scene.add.text(this.x, this.y, emojis[this.unitType] || '👤', {
                    fontSize: '32px'
                }).setOrigin(0.5);
            }
        }
        
        // 创建名字文本
        this.nameText = scene.add.text(this.x, this.y - 25, this.name, {
            fontSize: '10px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5);
        
        console.log('✅ NPC精灵创建完成:', this.name);
    }
}

// NPC管理器
class NPCManager {
    constructor(scene, buildings) {
        this.scene = scene;
        this.npcs = [];
        // 建筑碰撞数据
        this.buildingColliders = buildings || [
            { x: 650, y: 700, radius: 60 },   // hospital
            { x: 800, y: 700, radius: 60 },   // school
            { x: 950, y: 700, radius: 60 },   // gym
            { x: 650, y: 900, radius: 60 },   // fitness
            { x: 800, y: 900, radius: 60 },   // weapon
            { x: 950, y: 900, radius: 60 },   // armor
            { x: 800, y: 800, radius: 50 }    // campfire center
        ];
        
        console.log('🔍 调试信息 - window.NPCManagerCreated:', window.NPCManagerCreated);
        console.log('🔍 调试信息 - window.ExistingNPCs:', window.ExistingNPCs ? window.ExistingNPCs.length : 0);
        
        // 防止重复创建NPC（使用全局标志）
        if (window.NPCManagerCreated && window.ExistingNPCs) {
            console.log('⚠️ NPCManager已经创建过了，跳过重复创建NPC');
            this.npcs = window.ExistingNPCs;
            console.log('ℹ️ 复用已有的', this.npcs.length, '个NPC');
            return;
        }
        
        // 先清除场景中已有的精灵（以防万一）
        if (window.ExistingNPCs && window.ExistingNPCs.length > 0) {
            console.log('🧹 清理之前可能残留的NPC精灵...');
            window.ExistingNPCs.forEach(npc => {
                if (npc.sprite) npc.sprite.destroy();
                if (npc.nameText) npc.nameText.destroy();
            });
        }
        
        window.NPCManagerCreated = true;
        console.log('✅ 设置window.NPCManagerCreated = true');
        
        this.createNPCs();
        
        // 保存NPC引用供后续使用
        window.ExistingNPCs = this.npcs;
        console.log('💾 保存window.ExistingNPCs, NPC数量:', this.npcs.length);
    }
    
    createNPCs() {
        console.log('🔨 开始创建NPC...');
        
        // 确保只创建10个NPC - 恢复原来的多样化类型
        const npcData = [
            { name: '战士阿龙', unitType: 'Warrior' },
            { name: '射手小美', unitType: 'Archer' },
            { name: '枪兵大壮', unitType: 'Lancer' },
            { name: '僧侣静空', unitType: 'Monk' },
            { name: '村民小明', unitType: 'Pawn' },
            { name: '战士铁柱', unitType: 'Warrior' },
            { name: '射手小芳', unitType: 'Archer' },
            { name: '枪兵二狗', unitType: 'Lancer' },
            { name: '僧侣慧心', unitType: 'Monk' },
            { name: '村民大壮', unitType: 'Pawn' }
        ];
        
        console.log('📋 NPC数据数量:', npcData.length);
        
        // 先清空已有的NPC数组
        this.npcs = [];
        
        console.log('🔨 开始循环创建每个NPC...');
        npcData.forEach((data, index) => {
            console.log(`  创建NPC ${index + 1}/${npcData.length}: ${data.name} (${data.unitType})`);
            
            // 在中心区域随机位置生成，确保不在建筑内
            let x, y;
            let attempts = 0;
            do {
                x = 550 + Math.random() * 500;
                y = 550 + Math.random() * 500;
                attempts++;
            } while (this.checkInitialPosition(x, y) && attempts < 20);
            
            const npc = new NPC(index, data.name, data.unitType, x, y, this.buildingColliders);
            npc.createSprite(this.scene);
            this.npcs.push(npc);
        });
        
        console.log(`✅ 创建完成！总共 ${this.npcs.length} 个NPC（使用Tiny Swords素材）`);
        
        // 额外验证：确保不超过10个
        if (this.npcs.length > 10) {
            console.error('❌ 错误！创建了超过10个NPC！');
            // 移除多余的NPC
            while (this.npcs.length > 10) {
                const extraNpc = this.npcs.pop();
                if (extraNpc.sprite) extraNpc.sprite.destroy();
                if (extraNpc.nameText) extraNpc.nameText.destroy();
                console.log('🧹 移除了多余的NPC:', extraNpc.name);
            }
        }
    }
    
    checkInitialPosition(x, y) {
        // 检查初始位置是否在建筑内
        for (let building of this.buildingColliders) {
            const dx = x - building.x;
            const dy = y - building.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < building.radius + 30) {
                return true; // 在建筑内
            }
        }
        return false;
    }
    
    update() {
        this.npcs.forEach(npc => npc.update());
    }
    
    getNPCAt(x, y) {
        for (let npc of this.npcs) {
            const dx = npc.x - x;
            const dy = npc.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 25) {
                return npc;
            }
        }
        return null;
    }
}
