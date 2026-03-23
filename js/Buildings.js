// 建筑系统 - 小镇的各种设施
class Building {
    constructor(type, name, description) {
        this.type = type;
        this.name = name;
        this.description = description;
        this.level = 1;
        this.maxLevel = 10;
    }
    
    getUpgradeCost() {
        return Math.floor(100 * Math.pow(1.5, this.level));
    }
    
    canUpgrade() {
        return this.level < this.maxLevel;
    }
    
    upgrade() {
        if (!this.canUpgrade()) return false;
        this.level++;
        return true;
    }
    
    getEffect() {
        return {}; // 子类实现
    }
}

// 勇者医院 - 勇者出生的地方
class HeroHospital extends Building {
    constructor() {
        super('hospital', '勇者医院', '新的勇者在这里诞生');
    }
    
    // 等级越高，勇者基础属性越好
    getEffect() {
        return {
            birthRate: 0.1 + this.level * 0.05, // 每年出生概率
            statBonus: this.level * 2 // 初始属性加成
        };
    }
    
    getUpgradeCost() {
        return Math.floor(200 * Math.pow(1.6, this.level));
    }
}

// 勇者学堂 - 学习知识，提升智力
class HeroSchool extends Building {
    constructor() {
        super('school', '勇者学堂', '学习知识，提升智力');
    }
    
    getEffect() {
        return {
            intelligenceGain: 1 + this.level * 0.5, // 每年智力提升
            skillChance: 0.1 + this.level * 0.05 // 触发技能学习的概率
        };
    }
}

// 勇者武馆 - 练习武艺，提升力量和敏捷
class HeroGym extends Building {
    constructor() {
        super('gym', '勇者武馆', '练习武艺，提升力量和敏捷');
    }
    
    getEffect() {
        return {
            strengthGain: 1 + this.level * 0.5,
            agilityGain: 1 + this.level * 0.5,
            combatSkillChance: 0.15 + this.level * 0.05
        };
    }
}

// 勇者健身房 - 锻炼身体，提升体质
class HeroFitness extends Building {
    constructor() {
        super('fitness', '勇者健身房', '锻炼身体，提升体质');
    }
    
    getEffect() {
        return {
            vitalityGain: 2 + this.level * 0.5,
            healthBonus: this.level * 10
        };
    }
}

// 勇者武器店 - 购买武器
class WeaponShop extends Building {
    constructor() {
        super('weapon', '勇者武器店', '购买强力的武器');
    }
    
    getEffect() {
        return {
            weaponPower: 5 + this.level * 5,
            weaponVariety: this.level
        };
    }
    
    getWeapons() {
        const weapons = [
            { id: 'wood_sword', name: '木剑', power: 5, cost: 50 },
            { id: 'iron_sword', name: '铁剑', power: 15, cost: 200 },
            { id: 'steel_sword', name: '钢剑', power: 30, cost: 500 },
            { id: 'magic_sword', name: '魔法剑', power: 50, cost: 1000 },
            { id: 'legendary_sword', name: '传说之剑', power: 80, cost: 2000 }
        ];
        return weapons.slice(0, Math.min(this.level, weapons.length));
    }
}

// 勇者防具店 - 购买防具
class ArmorShop extends Building {
    constructor() {
        super('armor', '勇者防具店', '购买坚固的防具');
    }
    
    getEffect() {
        return {
            armorPower: 5 + this.level * 5,
            armorVariety: this.level
        };
    }
    
    getArmors() {
        const armors = [
            { id: 'cloth', name: '布衣', power: 3, cost: 30 },
            { id: 'leather', name: '皮甲', power: 10, cost: 150 },
            { id: 'iron', name: '铁甲', power: 20, cost: 400 },
            { id: 'steel', name: '钢甲', power: 35, cost: 800 },
            { id: 'legendary', name: '传说铠甲', power: 60, cost: 1500 }
        ];
        return armors.slice(0, Math.min(this.level, armors.length));
    }
}

// 技能库
const SKILLS = {
    combat: [
        { id: 'slash', name: '斩击', type: 'combat', description: '基础攻击技能', power: 10 },
        { id: 'heavy_strike', name: '重击', type: 'combat', description: '蓄力一击', power: 20 },
        { id: 'double_slash', name: '二连斩', type: 'combat', description: '连续两次攻击', power: 25 },
        { id: 'sword_dance', name: '剑舞', type: 'combat', description: '华丽的剑技', power: 35 },
        { id: 'destiny_slash', name: '命运斩', type: 'combat', description: '传说中的必杀技', power: 50 }
    ],
    magic: [
        { id: 'fireball', name: '火球术', type: 'magic', description: '释放火球', power: 15 },
        { id: 'heal', name: '治疗术', type: 'magic', description: '恢复生命', power: 20 },
        { id: 'ice_spike', name: '冰锥', type: 'magic', description: '冰冻攻击', power: 25 },
        { id: 'thunder', name: '雷击', type: 'magic', description: '召唤雷电', power: 35 },
        { id: 'meteor', name: '陨石术', type: 'magic', description: '毁灭一切', power: 55 }
    ],
    support: [
        { id: 'dodge', name: '闪避', type: 'support', description: '提高闪避率', power: 10 },
        { id: 'parry', name: '格挡', type: 'support', description: '格挡攻击', power: 15 },
        { id: 'endure', name: '忍耐', type: 'support', description: '减伤', power: 20 },
        { id: 'counter', name: '反击', type: 'support', description: '反击敌人', power: 30 },
        { id: 'final_stand', name: '最后一战', type: 'support', description: '濒死时爆发', power: 45 }
    ]
};
