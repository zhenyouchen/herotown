// 勇者类 - 核心勇者系统
class Hero {
    constructor(id, name = null) {
        this.id = id;
        this.name = name || Hero.generateRandomName();
        this.age = 0; // 0岁出生，18岁出征
        this.gender = Math.random() > 0.5 ? '男' : '女';
        
        // 属性
        this.stats = {
            strength: 5 + Math.floor(Math.random() * 5),    // 力量
            intelligence: 5 + Math.floor(Math.random() * 5), // 智力
            agility: 5 + Math.floor(Math.random() * 5),      // 敏捷
            vitality: 5 + Math.floor(Math.random() * 5),     // 体质
            luck: 5 + Math.floor(Math.random() * 5)          // 运气
        };
        
        this.skills = []; // 学会的技能
        this.equipment = {
            weapon: null,
            armor: null
        };
        
        this.status = 'growing'; // growing, adventuring, retired
        this.adventureCount = 0;
        this.totalLoot = 0;
        
        // 成长事件记录
        this.history = [];
    }
    
    // 生成随机名字
    static generateRandomName() {
        const surnames = ['林', '张', '王', '李', '赵', '陈', '刘', '黄', '周', '吴', '郑', '孙', '马', '朱', '胡'];
        const maleNames = ['浩', '伟', '强', '磊', '洋', '勇', '军', '杰', '涛', '明', '超', '秀', '刚', '平', '文'];
        const femaleNames = ['娜', '静', '敏', '燕', '艳', '丽', '娟', '莉', '芳', '萍', '玲', '丹', '洁', '红', '颖'];
        
        const surname = surnames[Math.floor(Math.random() * surnames.length)];
        const isMale = Math.random() > 0.5;
        const nameList = isMale ? maleNames : femaleNames;
        const name = nameList[Math.floor(Math.random() * nameList.length)];
        
        return surname + name;
    }
    
    // 过生日，长一岁
    haveBirthday() {
        this.age++;
        this.addHistory(`${this.age}岁了！`);
        
        // 基础属性自然成长
        const statsToGrow = ['strength', 'intelligence', 'agility', 'vitality', 'luck'];
        const stat = statsToGrow[Math.floor(Math.random() * statsToGrow.length)];
        const growth = 1 + Math.floor(Math.random() * 2);
        this.stats[stat] += growth;
        this.addHistory(`${stat === 'strength' ? '力量' : stat === 'intelligence' ? '智力' : stat === 'agility' ? '敏捷' : stat === 'vitality' ? '体质' : '运气'}+${growth}`);
    }
    
    // 学习技能
    learnSkill(skill) {
        if (!this.skills.find(s => s.id === skill.id)) {
            this.skills.push({...skill, level: 1});
            this.addHistory(`学会了技能：${skill.name}`);
            return true;
        } else {
            const existing = this.skills.find(s => s.id === skill.id);
            existing.level++;
            this.addHistory(`${skill.name} 升级到 Lv.${existing.level}`);
            return false;
        }
    }
    
    // 添加历史记录
    addHistory(event) {
        this.history.unshift({
            age: this.age,
            event: event,
            time: Date.now()
        });
        if (this.history.length > 50) {
            this.history.pop();
        }
    }
    
    // 计算综合战力
    getPower() {
        let power = 0;
        Object.values(this.stats).forEach(val => power += val);
        this.skills.forEach(skill => power += skill.level * 10);
        if (this.equipment.weapon) power += this.equipment.weapon.power;
        if (this.equipment.armor) power += this.equipment.armor.power;
        return power;
    }
    
    // 检查是否可以出征
    canAdventure() {
        return this.age >= 18 && this.status === 'growing';
    }
    
    // 出征
    goAdventure() {
        if (!this.canAdventure()) return null;
        
        this.status = 'adventuring';
        this.adventureCount++;
        this.addHistory('踏上了冒险之旅！');
        
        // 模拟冒险结果（简化版，以后可以做复杂的肉鸽战斗）
        const successChance = Math.min(95, 30 + this.getPower() * 0.5 + this.stats.luck);
        const success = Math.random() * 100 < successChance;
        
        if (success) {
            const loot = 50 + Math.floor(Math.random() * 100) + this.getPower() * 2;
            this.totalLoot += loot;
            this.status = 'growing'; // 冒险回来继续成长
            this.addHistory(`冒险成功！带回了 ${loot} 金币！`);
            return { success: true, loot: loot, hero: this };
        } else {
            // 失败可能受伤，属性降低
            const statDamage = ['strength', 'agility', 'vitality'][Math.floor(Math.random() * 3)];
            this.stats[statDamage] = Math.max(1, this.stats[statDamage] - 2);
            this.status = 'growing';
            this.addHistory('冒险失败，受伤归来...');
            return { success: false, loot: 0, hero: this };
        }
    }
}
