// 游戏管理器 - 全局状态
class GameManager {
    constructor() {
        // 先尝试读取存档
        const saved = this.loadGame();
        
        this.money = saved ? saved.money : 500;
        this.day = saved ? saved.day : 1;
        this.time = saved ? saved.time : 8.0;
        
        // 初始化建筑
        if (saved && saved.buildings) {
            this.buildings = this.rebuildBuildings(saved.buildings);
        } else {
            this.buildings = {
                hospital: new HeroHospital(),
                school: new HeroSchool(),
                gym: new HeroGym(),
                fitness: new HeroFitness(),
                weapon: new WeaponShop(),
                armor: new ArmorShop()
            };
        }
        
        // 初始化勇者列表
        if (saved && saved.heroes) {
            this.heroes = this.rebuildHeroes(saved.heroes);
            this.nextHeroId = saved.nextHeroId || 1;
        } else {
            this.heroes = [];
            this.nextHeroId = 1;
            // 初始给一个勇者（禁止 emit 事件，因为 UI 还没准备好）
            this.birthHero(true);
        }
        
        // 待处理的事件（技能选择等）
        this.pendingEvents = saved ? saved.pendingEvents || [] : [];
        
        this.listeners = {
            money: [],
            day: [],
            time: [],
            heroes: [],
            buildings: [],
            events: []
        };
        
        if (saved) {
            console.log('🎮 已读取存档！');
        }
    }
    
    // 重建建筑对象（从存档数据）
    rebuildBuildings(savedData) {
        const buildings = {
            hospital: new HeroHospital(),
            school: new HeroSchool(),
            gym: new HeroGym(),
            fitness: new HeroFitness(),
            weapon: new WeaponShop(),
            armor: new ArmorShop()
        };
        
        Object.keys(savedData).forEach(key => {
            if (buildings[key]) {
                buildings[key].level = savedData[key].level;
            }
        });
        
        return buildings;
    }
    
    // 重建勇者对象（从存档数据）
    rebuildHeroes(savedData) {
        return savedData.map(data => {
            const hero = new Hero(data.id, data.name);
            Object.assign(hero, data);
            return hero;
        });
    }
    
    // 保存游戏到 localStorage
    saveGame() {
        const saveData = {
            money: this.money,
            day: this.day,
            time: this.time,
            heroes: this.heroes,
            nextHeroId: this.nextHeroId,
            buildings: Object.fromEntries(
                Object.entries(this.buildings).map(([k, v]) => [k, { level: v.level }])
            ),
            pendingEvents: this.pendingEvents,
            timestamp: Date.now()
        };
        localStorage.setItem('heroTownSave', JSON.stringify(saveData));
        console.log('💾 游戏已保存！');
    }
    
    // 从 localStorage 读取游戏
    loadGame() {
        const saved = localStorage.getItem('heroTownSave');
        return saved ? JSON.parse(saved) : null;
    }
    
    // 清除存档
    clearSave() {
        localStorage.removeItem('heroTownSave');
        console.log('🗑️ 存档已清除！');
        location.reload();
    }
    
    // 监听状态变化
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }
    
    // 触发事件
    emit(event, value) {
        if (this.listeners && this.listeners[event]) {
            this.listeners[event].forEach(cb => {
                try {
                    cb(value);
                } catch (e) {
                    console.warn(`事件监听器错误 (${event}):`, e);
                }
            });
        }
    }
    
    // 勇者出生
    birthHero(suppressEvent = false) {
        const hero = new Hero(this.nextHeroId++);
        // 医院等级加成
        const hospitalEffect = this.buildings.hospital.getEffect();
        Object.keys(hero.stats).forEach(stat => {
            hero.stats[stat] += Math.floor(hospitalEffect.statBonus / 5);
        });
        hero.addHistory('在勇者医院出生了！');
        this.heroes.push(hero);
        if (!suppressEvent) {
            this.emit('heroes', this.heroes);
        }
        this.saveGame();
        return hero;
    }
    
    // 增加金钱
    addMoney(amount) {
        this.money += amount;
        this.emit('money', this.money);
        this.saveGame();
    }
    
    // 花费金钱
    spendMoney(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            this.emit('money', this.money);
            this.saveGame();
            return true;
        }
        return false;
    }
    
    // 升级建筑
    upgradeBuilding(buildingType) {
        const building = this.buildings[buildingType];
        if (!building || !building.canUpgrade()) return false;
        
        const cost = building.getUpgradeCost();
        if (!this.spendMoney(cost)) return false;
        
        building.upgrade();
        this.emit('buildings', this.buildings);
        this.saveGame();
        return true;
    }
    
    // 推进时间
    advanceTime(hours) {
        this.time += hours;
        
        // 每天处理
        let newDay = false;
        while (this.time >= 24.0) {
            this.time -= 24.0;
            this.day += 1;
            newDay = true;
            this.processNewDay();
        }
        
        this.emit('time', this.time);
        if (newDay) {
            this.emit('day', this.day);
        }
        this.saveGame();
    }
    
    // 每天的处理
    processNewDay() {
        console.log(`=== 第 ${this.day} 天开始 ===`);
        
        // 1. 所有勇者长一岁
        this.heroes.forEach(hero => {
            if (hero.status === 'growing') {
                hero.haveBirthday();
                
                // 建筑效果加成
                this.applyBuildingEffects(hero);
                
                // 18岁后可以出征
                if (hero.age >= 18 && Math.random() < 0.3) {
                    const result = hero.goAdventure();
                    if (result) {
                        if (result.success) {
                            this.addMoney(result.loot);
                        }
                    }
                }
            }
        });
        
        // 2. 医院可能有新勇者出生
        const hospitalEffect = this.buildings.hospital.getEffect();
        if (Math.random() < hospitalEffect.birthRate && this.heroes.length < 20) {
            this.birthHero();
        }
        
        // 3. 随机触发技能学习事件
        this.triggerSkillEvents();
        
        this.emit('heroes', this.heroes);
    }
    
    // 应用建筑效果
    applyBuildingEffects(hero) {
        // 学堂
        const schoolEffect = this.buildings.school.getEffect();
        if (Math.random() < 0.5) {
            hero.stats.intelligence += Math.floor(schoolEffect.intelligenceGain);
        }
        
        // 武馆
        const gymEffect = this.buildings.gym.getEffect();
        if (Math.random() < 0.5) {
            hero.stats.strength += Math.floor(gymEffect.strengthGain);
        }
        if (Math.random() < 0.5) {
            hero.stats.agility += Math.floor(gymEffect.agilityGain);
        }
        
        // 健身房
        const fitnessEffect = this.buildings.fitness.getEffect();
        if (Math.random() < 0.5) {
            hero.stats.vitality += Math.floor(fitnessEffect.vitalityGain);
        }
    }
    
    // 触发技能学习事件
    triggerSkillEvents() {
        const eligibleHeroes = this.heroes.filter(h => 
            h.status === 'growing' && h.age >= 5 && h.age < 18
        );
        
        eligibleHeroes.forEach(hero => {
            const schoolChance = this.buildings.school.getEffect().skillChance;
            const gymChance = this.buildings.gym.getEffect().combatSkillChance;
            
            if (Math.random() < (schoolChance + gymChance) * 0.3) {
                this.createSkillChoiceEvent(hero);
            }
        });
    }
    
    // 创建技能选择事件
    createSkillChoiceEvent(hero) {
        // 随机选3个技能
        const allSkills = [...SKILLS.combat, ...SKILLS.magic, ...SKILLS.support];
        const shuffled = allSkills.sort(() => Math.random() - 0.5);
        const choices = shuffled.slice(0, 3);
        
        const event = {
            id: Date.now() + Math.random(),
            type: 'skill_choice',
            heroId: hero.id,
            heroName: hero.name,
            choices: choices,
            timestamp: Date.now()
        };
        
        this.pendingEvents.push(event);
        this.emit('events', this.pendingEvents);
        console.log(`🎯 ${hero.name} 有新的技能可以学习！`);
    }
    
    // 选择技能
    chooseSkill(eventId, skillIndex) {
        const eventIndex = this.pendingEvents.findIndex(e => e.id === eventId);
        if (eventIndex === -1) return false;
        
        const event = this.pendingEvents[eventIndex];
        const hero = this.heroes.find(h => h.id === event.heroId);
        if (!hero) return false;
        
        const skill = event.choices[skillIndex];
        hero.learnSkill(skill);
        
        this.pendingEvents.splice(eventIndex, 1);
        this.emit('events', this.pendingEvents);
        this.emit('heroes', this.heroes);
        this.saveGame();
        return true;
    }
    
    // 给勇者买装备
    buyEquipment(heroId, equipmentType, item) {
        const hero = this.heroes.find(h => h.id === heroId);
        if (!hero) return false;
        if (!this.spendMoney(item.cost)) return false;
        
        if (equipmentType === 'weapon') {
            hero.equipment.weapon = item;
        } else {
            hero.equipment.armor = item;
        }
        
        hero.addHistory(`购买了${item.name}！`);
        this.emit('heroes', this.heroes);
        this.saveGame();
        return true;
    }
    
    // 格式化时间显示
    formatTime() {
        const hours = Math.floor(this.time);
        const minutes = Math.floor((this.time - hours) * 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
}