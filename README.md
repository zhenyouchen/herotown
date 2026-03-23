# 模拟经营休闲游戏

使用 Phaser.js 开发的 Web 模拟经营游戏，直接在浏览器中运行！

## 技术栈

- **Phaser.js 3.80.1** - 2D 游戏框架
- **HTML5 + CSS + JavaScript** - 原生 Web 技术
- **无构建工具** - 直接打开就能玩

## 项目结构

```
sim-game/
├── index.html              # 主 HTML 文件
├── js/
│   ├── game.js            # 游戏入口
│   ├── GameManager.js     # 游戏管理器（全局状态）
│   └── scenes/
│       └── MainScene.js   # 主游戏场景
└── README.md              # 项目说明
```

## 运行游戏

**方法 1：直接用浏览器打开（推荐）**
1. 直接双击 `index.html` 文件在浏览器中打开
2. 或者在浏览器中打开文件：`file:///path/to/sim-game/index.html`

**方法 2：使用本地服务器（更稳定）**

如果你有 Python：
```bash
cd sim-game
python3 -m http.server 8000
```

然后在浏览器中访问：`http://localhost:8000`

如果你有 Node.js，可以用 `http-server`：
```bash
npm install -g http-server
cd sim-game
http-server
```

## 测试操作

- **空格键**: 增加 10 金钱
- **T 键**: 推进 1 小时时间

## 游戏状态

- `money`: 金钱（初始 100）
- `day`: 天数（初始第 1 天）
- `time`: 时间（24小时制，初始 8:00）

## 开始开发

直接修改 `js/` 文件夹下的文件，刷新浏览器就能看到效果！

## 下一步

- 设计游戏核心玩法
- 添加美术资源
- 实现具体的经营系统
