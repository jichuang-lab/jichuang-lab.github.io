# 极创创新工作室 招新页 开发契约（Interface Contract）

> 本契约定义 index.html / css/style.css / js/main.js 三者的公共接口。
> 三个文件必须严格遵循本契约中的命名与结构，否则并行开发会导致互相不兼容。

## 1. 文件与职责

| 文件 | 职责 |
|---|---|
| `index.html` | 页面结构，含全部区块、导航、占位图片容器 |
| `css/style.css` | 设计令牌、Neo-Brutalism 卡片/硬阴影、bento grid、响应式、动效样式 |
| `js/main.js` | 入场揭示、错位延迟、视差、数值滚动、汉堡菜单、`prefers-reduced-motion` 降级 |

## 2. 页面区块与锚点（index.html 必须包含的 section id）

| id | 区块 | 导航锚点文字 |
|---|---|---|
| `#hero` | 首屏 Hero | - |
| `#tracks-quick` | 参与信息（方向/校区/门槛） | - |
| `#resources` | What You Get | 资源 |
| `#tracks` | 招新方向 | 方向 |
| `#learn` | 学习路线（通识/软件/硬件路线） | 路线 |
| `#videos` | 项目实录 | 实录 |
| `#moments` | 现场 | 现场 |
| `#proof` | 成果 Proof | 成果 |
| `#roadmap` | 招新流程 | 流程 |
| `#apply` | 报名 | 报名 |

页面顺序即上表顺序：参与路径（资源→方向→路线）→ 证明区（实录→现场→成果）→ 行动（流程→报名）。
导航栏固定链接：`#resources` `#tracks` `#learn` `#videos` `#moments` `#proof` `#roadmap` `#apply`。

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

### 学习路线 Learn
- `.learn-tongshi` — 通识篇横条（`.learn-tongshi-title` / `.learn-tongshi-desc` + `.tag-list`）
- `.learn-grid` — 软件/硬件两列网格
- `.learn-column` — 单列路线卡（`.learn-route` 路线标签、`.card-title`、`.learn-intro` 引言、`.learn-list` 有序步骤列表 `.learn-item`：`h4` 标题 + `p` 描述，以及 `.learn-final` 路线终点高亮块：`strong` 标题 + 说明文字）

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
- 占位块内容：斜纹底（repeating-linear-gradient）+ 居中 SVG 线性图标 + 一行文案（如"实验室图片 待补充"）
- **禁用手写 emoji**；占位图标一律 SVG

## 5. CSS 设计令牌（style.css 必须定义，用 CSS 自定义属性）

> 2026-08 视觉改版：整体风格切换为 **Neo-Brutalism**（纸白底 + 纯黑粗边框 + 零模糊硬阴影）。
> 完整规范与组件语义见 `DESIGN.md`；本节仅列核心令牌。

```
--ink: #000            /* 文字/边框/硬阴影基色 */
--paper: #fff          /* 页面底、卡片底 */
--red: #ff6b6b         /* 主强调（主按钮、悬停阴影） */
--teal: #4ecdc4        /* 电控视觉向 / 成功态 */
--yellow: #ffe66d      /* kicker 底 / CTA 面板 */
--mint: #95e1d3        /* 通识/信息 */
--coral: #f38181       /* 硬件向 */
--muted: #444          /* 次级文字 */
--on-accent: #000      /* 糖果色表面固定黑字（WCAG，任何主题不得反转） */
--border-w: 4px
--shadow-sm/md/lg/xl   /* 4/6/8/10px 偏移 0 模糊 0 扩散 */
--font-heading         /* 标题栈（本地字体，无 CDN） */
--font-body            /* 等宽正文栈（本地字体，无 CDN） */
```

铁律：圆角一律 0；禁止 backdrop-filter 与渐变光斑；强调色表面只配 `--on-accent` 黑字；
`body[data-theme="night"]` 为唯一预览变体（令牌翻转），engineering/campus 参数静默回退默认。

## 6. 无障碍与兼容

- 导航、按钮等交互元素提供 `aria-label`（文案，不用 emoji）
- `prefers-reduced-motion: reduce` → body 加 `reduced-motion`，禁用过渡动画
- 颜色对比：正文对底色 ≥ 4.5:1
- 移动端：<=768px 导航收成汉堡菜单，网格单列

## 7. 验收清单（验收子 Agent 依据）

1. index.html 包含全部 10 个 section id 与导航链接
2. 三个文件 class/id 与本契约完全一致
3. 无任何 emoji 出现在 HTML/CSS/JS 中
4. CSS 定义了全部设计令牌并实际使用（无硬编码关键色）
5. 所有图片位均有 `.media-frame` 容器 + 占位
6. JS 实现：汉堡菜单、`[data-reveal]` 滚动入场、`[data-count]` 数值滚动、`[data-parallax]` 视差、reduced-motion 降级
7. 无外部 CDN 依赖（纯静态可离线打开，font 可用本地栈）
8. HTML/CSS/JS 语法无错误（可用 node 或浏览器打开检查）
