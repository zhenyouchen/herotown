// UI 管理器 - 处理所有界面交互
class UIManager {
    constructor() {
        this.currentTab = 'buildings';
        this.init();
    }
    
    init() {
        this.setupTabs();
        this.renderBuildingsTab();
        this.setupEventListeners();
        this.updateUI();
        
        // 绑定游戏管理器事件
        gameManager.on('money', () => this.updateUI());
        gameManager.on('day', () => this.updateUI());
        gameManager.on('time', () => this.updateUI());
        gameManager.on('heroes', () => this.updateUI());
        gameManager.on('buildings', () => this.renderBuildingsTab());
        gameManager.on('events', () => this.checkEvents());
    }
    
    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                tabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTab = btn.dataset.tab;
                this.renderCurrentTab();
            });
        });
    }
    
    renderCurrentTab() {
        switch(this.currentTab) {
            case 'buildings':
                this.renderBuildingsTab();
                break;
            case 'heroes':
                this.renderHeroesTab();
                break;
            case 'shop':
                this.renderShopTab();
                break;
        }
    }
    
    renderBuildingsTab() {
        const container = document.getElementById('tab-content');
        const buildings = gameManager.buildings;
        
        container.innerHTML = `
            <h3>🏗️ 小镇建筑</h3>
            <div class="building-grid">
                ${Object.entries(buildings).map(([key, building]) => `
                    <div class="building-card">
                        <div class="building-name">${building.name}</div>
                        <div class="building-level">等级 ${building.level}/${building.maxLevel}</div>
                        <div class="building-desc">${building.description}</div>
                        ${building.canUpgrade() ? `
                            <button class="upgrade-btn" onclick="uiManager.upgradeBuilding('${key}')">
                                升级 (${building.getUpgradeCost()}💰)
                            </button>
                        ` : `
                            <button class="upgrade-btn" disabled>已满级</button>
                        `}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderHeroesTab() {
        const container = document.getElementById('tab-content');
        const heroes = gameManager.heroes;
        
        container.innerHTML = `
            <h3>👥 勇者列表 (${heroes.length})</h3>
            <div class="hero-list">
                ${heroes.map(hero => `
                    <div class="hero-card">
                        <div class="hero-avatar">${hero.gender === '男' ? '🧑' : '👩'}</div>
                        <div class="hero-info">
                            <div class="hero-name">${hero.name} (${hero.age}岁)</div>
                            <div class="hero-stats">
                                <span>💪${hero.stats.strength}</span>
                                <span>🧠${hero.stats.intelligence}</span>
                                <span>⚡${hero.stats.agility}</span>
                                <span>❤️${hero.stats.vitality}</span>
                                <span>🍀${hero.stats.luck}</span>
                            </div>
                            <div class="hero-power">⚔️ 战力: ${hero.getPower()}</div>
                            <div style="font-size: 12px; color: #888; margin-top: 5px;">
                                技能: ${hero.skills.length > 0 ? hero.skills.map(s => s.name).join(', ') : '无'}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderShopTab() {
        const container = document.getElementById('tab-content');
        const weaponShop = gameManager.buildings.weapon;
        const armorShop = gameManager.buildings.armor;
        const heroes = gameManager.heroes;
        
        container.innerHTML = `
            <h3>🛒 商店</h3>
            
            <h4 style="margin: 15px 0 10px; color: #ff6b6b;">⚔️ 武器店 (Lv.${weaponShop.level})</h4>
            <div class="building-grid">
                ${weaponShop.getWeapons().map(item => `
                    <div class="building-card">
                        <div class="building-name">${item.name}</div>
                        <div class="building-level">战力 +${item.power}</div>
                        ${heroes.length > 0 ? `
                            <select id="weapon-hero-${item.id}" style="width:100%; margin-bottom:8px; padding:5px;">
                                ${heroes.map(h => `<option value="${h.id}">${h.name}</option>`).join('')}
                            </select>
                            <button class="upgrade-btn" onclick="uiManager.buyEquipment('${item.id}', 'weapon', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                                购买 (${item.cost}💰)
                            </button>
                        ` : '<div style="color:#888; font-size:12px;">没有勇者</div>'}
                    </div>
                `).join('')}
            </div>
            
            <h4 style="margin: 20px 0 10px; color: #4ecdc4;">🛡️ 防具店 (Lv.${armorShop.level})</h4>
            <div class="building-grid">
                ${armorShop.getArmors().map(item => `
                    <div class="building-card">
                        <div class="building-name">${item.name}</div>
                        <div class="building-level">战力 +${item.power}</div>
                        ${heroes.length > 0 ? `
                            <select id="armor-hero-${item.id}" style="width:100%; margin-bottom:8px; padding:5px;">
                                ${heroes.map(h => `<option value="${h.id}">${h.name}</option>`).join('')}
                            </select>
                            <button class="upgrade-btn" onclick="uiManager.buyEquipment('${item.id}', 'armor', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                                购买 (${item.cost}💰)
                            </button>
                        ` : '<div style="color:#888; font-size:12px;">没有勇者</div>'}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    upgradeBuilding(type) {
        if (gameManager.upgradeBuilding(type)) {
            this.renderBuildingsTab();
        } else {
            alert('金钱不足！');
        }
    }
    
    buyEquipment(itemId, type, item) {
        const selectId = `${type}-hero-${itemId}`;
        const select = document.getElementById(selectId);
        const heroId = parseInt(select.value);
        
        if (gameManager.buyEquipment(heroId, type, item)) {
            this.renderShopTab();
            if (this.currentTab === 'heroes') {
                this.renderHeroesTab();
            }
        } else {
            alert('金钱不足！');
        }
    }
    
    updateUI() {
        document.getElementById('money').textContent = gameManager.money;
        document.getElementById('day').textContent = gameManager.day;
        document.getElementById('time').textContent = gameManager.formatTime();
        document.getElementById('hero-count').textContent = gameManager.heroes.length;
        
        // 更新当前标签页
        if (this.currentTab === 'heroes') {
            this.renderHeroesTab();
        }
    }
    
    checkEvents() {
        if (gameManager.pendingEvents.length > 0) {
            this.showEventModal(gameManager.pendingEvents[0]);
        }
    }
    
    showEventModal(event) {
        const modal = document.getElementById('event-modal');
        const content = document.getElementById('event-content');
        
        if (event.type === 'skill_choice') {
            content.innerHTML = `
                <div class="event-title">🎯 ${event.heroName} 可以学习新技能！</div>
                <p style="color: #aaa; margin-bottom: 20px;">选择一个技能让 ta 学习：</p>
                <div class="skill-choices">
                    ${event.choices.map((skill, index) => `
                        <div class="skill-choice" onclick="uiManager.chooseSkill('${event.id}', ${index})">
                            <div class="skill-name">${skill.name}</div>
                            <div class="skill-type">${skill.type === 'combat' ? '战斗' : skill.type === 'magic' ? '魔法' : '辅助'}</div>
                            <div class="skill-desc">${skill.description}</div>
                            <div style="margin-top:10px; color:#ffd700;">威力: ${skill.power}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        modal.classList.add('show');
    }
    
    chooseSkill(eventId, skillIndex) {
        if (gameManager.chooseSkill(eventId, skillIndex)) {
            document.getElementById('event-modal').classList.remove('show');
            this.checkEvents();
            if (this.currentTab === 'heroes') {
                this.renderHeroesTab();
            }
        }
    }
    
    setupEventListeners() {
        // 初始检查事件
        setTimeout(() => this.checkEvents(), 100);
    }
}