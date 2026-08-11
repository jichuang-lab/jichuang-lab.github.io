# 极创创新工作室 招新页 开发契约（Interface Contract）

> 本契约定义 index.html / css/style.css / js/main.js 三者的公共接口。
> 三个文件必须严格遵循本契约中的命名与结构，否则并行开发会导致互相不兼容。

## 1. 文件与职责

| 文件 | 职责 |
|---|---|
| `index.html` | 页面结构，含全部区块、导航、占位图片容器 |
| `css/style.css` | 设计令牌、玻璃拟态、bento grid、响应式、动效样式 |
| `js/main.js` | 入场揭示、错位延迟、视差、数值滚动、汉堡菜单、`prefers-reduced-motion` 降级 |

## 2. 页面区块与锚点（index.html 必须包含的 section id）

| id | 区块 | 导航锚点文字 |
|---|---|---|
| `#hero` | 首屏 Hero | - |
| `#tracks-quick` | 参与信息（方向/校区/门槛） | - |
| `#resources` | What You Get | 资源 |
| `#proof` | 成果 Proof | 成果 |
| `#tracks` | 招新方向 | 方向 |
| `#roadmap` | 招新流程 | 流程 |
| `#apply` | 报名 | 报名 |

导航栏固定链接：`#resources` `#proof` `#tracks` `#roadmap` `#apply`。

## 3. 全局 class 命名（CSS 必须实现，HTML 必须使用）

### 布局
- `.container` — 页面最大内容宽度（1200px，居中，左右 padding 24px）
- `.section` — 区块通用（纵向 padding 96px）
- `.section-head` — 区块标题组（含 `.kicker` 小节标签、`h2` 主标题、`.section-desc` 描述）

### 导航
- `header.site-header` — 固定顶栏
- `.nav-menu` — 桌面导航列表（ul）
- `button#nav-toggle` — 汉堡按钮（SVG 图标，两条线）`
- `.nav-link` — 导航链接
- `body.nav-open` — 移动端菜单展开时的状态类

### 按钮
- `.btn` 基础、`.btn-primary` 渐变强调、`.btn-ghost` 玻璃描边
- 按钮必须使用 SVG 图标或纯文本，**禁用 emoji**

### 玻璃卡片
- `.glass-card` — 玻璃拟态卡片（backdrop-filter + 半透明白 + 1px 边）
- `.glass-card .card-title` / `.card-desc`
- `.tag` — 技术标签（小胶囊）

### Hero
- `.hero` 区块、`.hero-bg` 背景光斑层（绝对定位，供视差用）、`.hero-content` 内容层
- `.hero-title` 主标题、`.hero-sub` 副标语、`.hero-lead` 次标语、`.hero-desc` 引导说明、`.hero-cta` 按钮组
- `.scroll-hint` 底部滚动提示

### 参与信息
- `.quick-grid` — 参与信息三列网格
- `.quick-item` — 单列（`.quick-label` 小标题 / `.quick-value` 大文字 / `.quick-icon` SVG）

### What You Get
- `.benefit-grid` — 2x2 卡片网格
- `.benefit-card` — 单卡片（`.benefit-num` 编号 01/02/03/04、`.card-title`、`.card-desc`）

### 成果 Proof
- `.proof-grid` — Bento Grid（CSS Grid，`grid-template-areas`）
- `.proof-card` — 单个成果卡片（`.proof-medal` 奖牌区、`.proof-item` 条目）
- `.proof-card.span-2` — 横跨两列的卡片（Bento 异尺寸）
- `.medal-list` — 奖项列表（`.medal-item` + `.medal-name`）
- `.media-frame` — 固定宽高比图片容器（`.media-frame.ratio-16x9` / `.ratio-4x3` / `.ratio-1x1`）
- `.media-frame .placeholder` — 占位块（渐变底 + SVG 轮廓图标 + 文案）
- `.media-frame img` — 正式图片（`object-fit: cover/contain`）

### 方向 Tracks
- `.track-grid` — 两卡片布局
- `.track-card` — 单个方向卡（`.track-icon`、`.card-title`、`.card-desc`、`.tag-list` 技术标签组）

### 流程 Roadmap
- `.timeline` — 时间线容器、`.timeline-item` 单节点（`.tl-phase` 阶段名、`.tl-title`、`.tl-desc`）

### 报名 Apply
- `.apply-box` — 报名主容器
- `.qr-card` — 二维码卡片（`.qr-frame` 固定 1:1 图片容器 + 占位）
- `.apply-cta` — 扫码提示文案
- `.apply-note` — 说明文字（二维码有效期等）

### 动效挂钩（JS 依赖，CSS 提供初始/终态样式）
- `[data-reveal]` — 入场揭示元素（滚动进入视口时加 `.is-visible`）。CSS：初始 opacity:0 / translateY(24px)，`.is-visible` 过渡到 opacity:1 / translateY(0)
- `[data-reveal][data-delay="N"]` — 错位延迟（N 为 ms，仅与 group 内配合）
- `[data-parallax]` — 视差元素（JS 按滚动速度偏移 transform）
- `[data-count]` — 数值滚动元素（属性值为最终数字，JS 从 0 计数）
- `body.reduced-motion` — `prefers-reduced-motion` 时加到 body，所有过渡/动画退化为即时

## 4. 图片处理约定（HTML 必须遵循）

- 每个展示图使用 `.media-frame` 容器 + 指定 ratio 类，内部为 `.placeholder`（占位）或 `img`
- 占位块内容：暖米灰渐变底 + 居中 SVG 线性图标 + 一行文案（如"实验室图片 待补充"）
- **禁用手写 emoji**；占位图标一律 SVG

## 5. CSS 设计令牌（style.css 必须定义，用 CSS 自定义属性）

浅色暖调主题（米白底）+ 琥珀橙强调。

```
--bg: #fdfbf7        /* 页面底色（亮米白） */
--bg-elev: rgba(255,255,255,0.65)  /* 玻璃表面（白半透明） */
--glass-border: rgba(120,100,60,0.16)  /* 玻璃边 */
--accent-1: #d97706  /* 主强调琥珀 */
--accent-2: #f59e0b  /* 次强调亮琥珀 */
--accent-text: #b45309 /* 深琥珀（小字/文字强调） */
--text-1: #26211a    /* 主文字 */
--text-2: #5c554a    /* 次级文字 */
--gradient-text: linear-gradient(135deg,#a16207,#d97706) /* 深琥珀文字渐变 */
--gradient-btn: linear-gradient(135deg,#c2570a,#92400e)  /* 深橙按钮渐变 */
--radius-lg: 20px; --radius-md: 14px;
--ease: cubic-bezier(0.2, 0.8, 0.2, 1);   /* 缓动 */
--ease-emphasized: cubic-bezier(0.3, 0, 0, 1); /* 强调缓动 */
--dur: 300ms;
```

强调色渐变：`linear-gradient(135deg, var(--accent-2), var(--accent-1))`（琥珀到深琥珀，用于装饰背景；文字渐变用 `--gradient-text`，按钮用 `--gradient-btn`）。

## 6. 无障碍与兼容

- 导航、按钮等交互元素提供 `aria-label`（文案，不用 emoji）
- `prefers-reduced-motion: reduce` → body 加 `reduced-motion`，禁用过渡动画
- 颜色对比：正文对底色 ≥ 4.5:1
- 移动端：<=768px 导航收成汉堡菜单，网格单列

## 7. 验收清单（验收子 Agent 依据）

1. index.html 包含全部 7 个 section id 与导航链接
2. 三个文件 class/id 与本契约完全一致
3. 无任何 emoji 出现在 HTML/CSS/JS 中
4. CSS 定义了全部设计令牌并实际使用（无硬编码关键色）
5. 所有图片位均有 `.media-frame` 容器 + 占位
6. JS 实现：汉堡菜单、`[data-reveal]` 滚动入场、`[data-count]` 数值滚动、`[data-parallax]` 视差、reduced-motion 降级
7. 无外部 CDN 依赖（纯静态可离线打开，font 可用本地栈）
8. HTML/CSS/JS 语法无错误（可用 node 或浏览器打开检查）
