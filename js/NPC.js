// NPC类 - 地图上的非玩家角色
class NPC {
    constructor(id, name, type, x, y) {
        this.id = id;
        this.name = name;
        this.type = type; // 职业类型
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.speed = 0.5 + Math.random() * 0.5; // 随机速度
        this.idleTime = 0;
        this.maxIdleTime = 100 + Math.random() * 200; // 随机停留时间
        this.direction = 'down';
        this.sprite = null;
        this.nameText = null;
        
        // NPC对话
        this.dialogues = this.getDialoguesByType(type);
    }
    
    getDialoguesByType(type) {
        const dialogueMap = {
            merchant: [
                "欢迎光临！来看看有什么需要的吧。",
                "今天的货物都是新鲜的！",
                "冒险者，你需要补给吗？",
                "便宜卖啦！走过路过不要错过！"
            ],
            villager: [
                "今天的天气真不错。",
                "听说森林深处有宝藏...",
                "勇者大人们都很忙呢。",
                "小镇最近很和平。"
            ],
            guard: [
                "站住！请出示身份证明。",
                "这里是安全区，请放心。",
                "有我在，没人能捣乱！",
                "保持警惕，冒险者。"
            ],
            farmer: [
                "庄稼长得真好。",
                "今年的收成应该不错。",
                "要买点新鲜蔬菜吗？",
                "种地可比冒险轻松多了。"
            ],
            blacksmith: [
                "需要打造武器吗？",
                "我的铁匠铺随时为你服务。",
                "好武器是冒险者的生命！",
                "刚出炉的装备，来看看？"
            ],
            healer: [
                "受伤了吗？让我看看。",
                "健康是最重要的财富。",
                "需要治疗药水吗？",
                "愿神明保佑你。"
            ],
            child: [
                "长大后我也要当勇者！",
                "你看！有蝴蝶！",
                "妈妈说不可以跑太远。",
                "冒险者哥哥/姐姐好酷！"
            ],
            elder: [
                "年轻人，听我讲个故事...",
                "我年轻时也是个冒险者。",
                "这个世界有很多秘密。",
                "要尊重前辈的经验啊。"
            ],
            bard: [
                "想听首歌吗？",
                "音乐是最好的良药。",
                "让我为你演奏一曲！",
                "勇者的故事总是让人热血沸腾！"
            ],
            hunter: [
                "森林里的猎物很多。",
                "需要毛皮吗？",
                "小心野兽，它们很危险。",
                "狩猎是门技术活。"
            ]
        };
        return dialogueMap[type] || dialogueMap.villager;
    }
    
    getRandomDialogue() {
        return this.dialogues[Math.floor(Math.random() * this.dialogues.length)];
    }
    
    update() {
        if (this.idleTime > 0) {
            this.idleTime--;
            return;
        }
        
        // 计算到目标的距离
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 2) {
            // 到达目标，开始 idle
            this.pickNewTarget();
            this.idleTime = this.maxIdleTime;
        } else {
            // 向目标移动
            const moveX = (dx / distance) * this.speed;
            const moveY = (dy / distance) * this.speed;
            this.x += moveX;
            this.y += moveY;
            
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
                this.nameText.y = this.y - 20;
            }
        }
    }
    
    pickNewTarget() {
        // 在中心区域附近随机选择新目标
        const centerX = 800;
        const centerY = 800;
        const range = 300;
        
        this.targetX = centerX + (Math.random() - 0.5) * range * 2;
        this.targetY = centerY + (Math.random() - 0.5) * range * 2;
        
        // 确保在地图范围内
        this.targetX = Math.max(100, Math.min(1500, this.targetX));
        this.targetY = Math.max(100, Math.min(1500, this.targetY));
    }
    
    createSprite(scene) {
        // 根据类型选择emoji
        const emojiMap = {
            merchant: '👨‍💼',
            villager: '👨‍🌾',
            guard: '💂',
            farmer: '👩‍🌾',
            blacksmith: '👨‍🏭',
            healer: '👩‍⚕️',
            child: '🧒',
            elder: '👴',
            bard: '🎸',
            hunter: '🏹'
        };
        
        const emoji = emojiMap[this.type] || '👤';
        
        this.sprite = scene.add.text(this.x, this.y, emoji, {
            fontSize: '28px'
        }).setOrigin(0.5);
        
        this.nameText = scene.add.text(this.x, this.y - 20, this.name, {
            fontSize: '10px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            fontFamily: 'Courier New, monospace'
        }).setOrigin(0.5);
    }
}

// NPC管理器
class NPCManager {
    constructor(scene) {
        this.scene = scene;
        this.npcs = [];
        this.createNPCs();
    }
    
    createNPCs() {
        const npcData = [
            { name: '老张', type: 'merchant' },
            { name: '李四', type: 'villager' },
            { name: '王守卫', type: 'guard' },
            { name: '赵大妈', type: 'farmer' },
            { name: '铁匠刘', type: 'blacksmith' },
            { name: '医女小芳', type: 'healer' },
            { name: '小明', type: 'child' },
            { name: '李大爷', type: 'elder' },
            { name: '吟游诗人', type: 'bard' },
            { name: '猎手阿强', type: 'hunter' }
        ];
        
        npcData.forEach((data, index) => {
            // 在中心区域随机位置生成
            const x = 600 + Math.random() * 400;
            const y = 600 + Math.random() * 400;
            
            const npc = new NPC(index, data.name, data.type, x, y);
            npc.createSprite(this.scene);
            this.npcs.push(npc);
        });
        
        console.log(`✅ 创建了 ${this.npcs.length} 个NPC`);
    }
    
    update() {
        this.npcs.forEach(npc => npc.update());
    }
    
    // 获取点击的NPC
    getNPCAt(x, y) {
        for (let npc of this.npcs) {
            const dx = npc.x - x;
            const dy = npc.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 30) {
                return npc;
            }
        }
        return null;
    }
}
