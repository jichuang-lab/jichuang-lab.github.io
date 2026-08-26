# DESIGN.md — 极创招新页 Neo-Brutalism 设计体系

> 版本：v1.0（2026-08）
> 来源：对 [deepdemos.top](https://deepdemos.top) 全量 CSS 的逐条逆向学习，落地为极创招新页的视觉改造。
> 效力范围：本文件是 `css/style.css` 的设计规范与决策记录；`CONTRACT.md` 管结构命名，本文管视觉表达。两者冲突时以 CONTRACT 为准（类名/钩子不可改），配色以本文为准。
> **决策变更**：REQUIREMENTS.md §3.2 曾否决 Brutalism、选定玻璃拟态。应用例要求改版为 Neo-Brutalism，旧结论仅作历史备查。

---

## 1. 风格定义：什么是这里的 Neo-Brutalism

deepdemos.top 的风格可归纳为「纸面 + 墨线 + 糖果色 + 硬阴影 + 微旋转」五件套：

| 要素 | 规则 | 反面（被抛弃的玻璃拟态） |
|---|---|---|
| 底色 | 纯白纸 `#fff`，无渐变光斑 | 深蓝近黑底 + 渐变光斑 |
| 边框 | 一切可见元素 3–4px 纯黑实线边框 | 1px 半透明白边 |
| 阴影 | **零模糊硬偏移阴影**（`8px 8px 0 #000`），可彩色 | 大半径高斯模糊软阴影 |
| 圆角 | **一律 0**（`border-radius: 0`） | 20px 大圆角 |
| 材质 | 不透明实底色块；禁用 `backdrop-filter` | 半透明玻璃 + blur |

为什么适合本站（说服逻辑不变，手段更换）：
- **诚实感**：粗野主义"所见即所得"的结构感，与实验室"真实训练、真实项目"的文案立场一致；
- **工程隐喻**：等宽字体正文 + 终端式打字标题，天然贴合嵌入式/电控气质；
- **新生受众**：糖果色 + 贴纸感降低"高科技门槛"的心理压力，服务"零基础可报"的转化目标（Fogg 模型的 Ability 支柱）。

---

## 2. 设计令牌（Design Tokens）

全部收口在 `:root`，**禁止在组件规则里硬编码色值/阴影/边宽**。

### 2.1 色彩

| 令牌 | 值 | 用途 |
|---|---|---|
| `--ink` | `#000` | 文字、一切边框、硬阴影基色 |
| `--paper` | `#fff` | 页面底、卡片底 |
| `--red` | `#ff6b6b` | 主强调：主按钮、悬停抬升阴影、live 元素 |
| `--teal` | `#4ecdc4` | 次强调：电控视觉向、成功态 |
| `--yellow` | `#ffe66d` | 高亮：kicker 底、输入态、强调面板、CTA 区 |
| `--mint` | `#95e1d3` | 辅助：通识/信息提示、状态徽章 |
| `--coral` | `#f38181` | 辅助：硬件向、装饰 |
| `--muted` | `#444` | 说明性次级文字（night 主题翻转为 `#bbb`） |

### 2.2 无障碍对比度铁律（与 deepdemos 的刻意偏离）

deepdemos 在红底上用白字（`--red` + `#fff` ≈ 2.8:1），**不满足 WCAG**。本站规定：

> **所有糖果色表面上一律配 `--ink` 黑字。禁止白字压任何强调色。**

实测对比度（对黑）：yellow ≈13:1，mint ≈14:1，teal ≈11:1，coral ≈8:3:1，red ≈7.6:1 —— 全部 ≥ 4.5:1。正文黑字对纸底 21:1。这是唯一一处没有照抄原站的地方。

### 2.3 边框与阴影

```
--border-w: 4px        /* 卡片/按钮级 */
细一级用 3px、行分隔用 2–3px、顶部分类条用 8px 实线
--shadow-sm: 4px 4px 0 var(--ink)
--shadow-md: 6px 6px 0 var(--ink)
--shadow-lg: 8px 8px 0 var(--ink)
--shadow-xl: 10px 10px 0 var(--ink)
彩色硬阴影直接写 `12px 12px 0 var(--red)` 形式
```

规则：**blur 恒为 0，spread 恒为 0**；hover 抬升 = 元素反向位移 + 阴影增大；按压 = 正向位移吃掉阴影。

### 2.4 字体（本地栈，无 CDN）

```
--font-heading: "Inter","Segoe UI","Noto Sans SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif
--font-body: ui-monospace,"JetBrains Mono","Cascadia Code",Consolas,"Courier New","Noto Sans SC",monospace
```

- deepdemos 用 Google Fonts 引 Inter/JetBrains Mono；本契约禁止外部依赖（CONTRACT §7.7），故只用本地栈，中文自动回退 Noto/雅黑。
- 标题：heading 族，`font-weight:900`，`line-height:1.05`，中文 `letter-spacing:-0.01em`（勿照抄拉丁的 -0.05em）；英文 kicker 类 `text-transform:uppercase; letter-spacing:.08em`（uppercase 对中文无害，保留）。
- 正文/标签/按钮：**body 族等宽**。整页正文全用等宽是 deepdemos 的核心识别点，必须保留。

### 2.5 其他令牌

- 缓动：`--ease: cubic-bezier(0.2,0.8,0.2,1)`；时长 150–200ms（transform/box-shadow 类），入场揭示 500ms。
- 间距节奏：container `min(1200px, 100% - 32px)`；section 纵向 padding 72px（移动端 44px）；网格 gap 24px。
- 断点：`<=1024px` 收窄两栏布局；`<=768px` 全面单列（见 §6）；`<=480px` 字号与统计块再压缩。

---

## 3. 版式系统

- **区块头 `.section-head`**：`.kicker` 徽章 → `h2`（clamp(26px, 4vw, 40px), 900）→ `.section-desc`（mono, `--muted`, 15px）。三段左对齐纵排。
- **kicker / hero-eyebrow（贴纸徽章）**：mono 12px 700、黄底、3px 黑边、`rotate(-1deg)`、`4px 4px 0` 阴影、inline-block。这是全页的"节拍器"，每个 section 一个。
- **Hero**：左 copy 右 media 两栏。主标题走终端打字机效果（JS 已有 `[data-type-title]`），`.hero-title-mark` 光标 `_` 以 steps() 硬闪烁——等宽字体语境下终端隐喻成立，保留并强化。`hero-meta` 三项做成带编号的迷你统计块（mono、2px 边框）。
- **背景层 `.hero-bg`**：不再是光斑，改为**墨点阵图案**（radial-gradient 1.5px 点阵，透明度 ~0.08）+ 右侧一条黄色斜纹带。它同时是视差层（`[data-parallax]` 内联 translateY），高度需超出视口（inset 负值）防露底。

---

## 4. 组件规范（按页面出现顺序）

所有交互组件统一手感：`transition: transform .18s, box-shadow .18s`；`:focus-visible { outline:4px solid var(--ink); outline-offset:3px }`。

### 4.1 按钮 `.btn`
- 基座：mono 700、14px、uppercase、4px 黑边、白底、`shadow-lg`、padding 12px 22px。
- **hover**：`translate(4px,4px)` 且阴影归零（"按进去"）；**active** 再压到 `(6px,6px)`。位移方向与阴影偏移必须互补。
- 变体：`.btn-primary` 红底黑字 `rotate(-1deg)`；`.btn-ghost` 黄底黑字 `rotate(1deg)`。微旋转只用于静态姿态，hover 时旋回 0（配合位移更"活"）。

### 4.2 卡片 `.glass-card`（类名沿用契约，含义已重写为"粗野卡片"）
- 白底、4px 黑边、`shadow-lg`、padding 24–28。
- **微旋转制造手工感**：同网格相邻卡 ±0.5~0.75deg 交错（nth-child odd/even），hover 归零并抬升 `translate(-3px,-3px)` + `12px 12px 0 var(--red)`。
- 分类色条：卡顶部 8px 实线表达归属——电控=teal、视觉=coral、硬件=yellow、机械=mint；横向信息条的左侧 10px 竖条：共通/信息=mint（如 `.learn-tongshi`）、进阶交汇=red（如 `.learn-confluence`）、重点=red。**色条是分类语义，不是装饰**，同一语义全页一致。路线卡的顶条色按卡片顺序分配（nth-child），与横条的左竖条互不冲突。

### 4.3 印章 / 贴纸（stamp）
小尺寸 mono 加粗标签，`rotate(-2~-6deg)`，绝对定位骑在容器边缘（如 `top:-14px; left:-8px`），常配 `3px 3px 0` 小阴影。用途：`.video-index`（序号）、`.tl-phase`（阶段）、`.learn-route`（路线）、`.moment-index`。一屏印章 ≤3 个，多则失焦；**豁免**：`.learn-route` 路线编号章共 4 枚（01–04 对应四条路线卡），属功能性编号而非装饰，不受此限。

### 4.4 标签 chip `.tag`
mono 12px、3px 黑边、白底、`2px 2px 0` 阴影、padding 4px 10px；hover 黄底位移。不做圆胶囊（radius 0 铁律）。

### 4.5 统计块 `.proof-stat`
`.stat-value` heading 900 clamp(34px,4vw,52px)；数字滚动 `[data-count]` 行为不变（JS）。后缀 `+`/`×` 在 span 外。stat-sub 用 mono 12px muted。

### 4.6 列表行
`.medal-list`：行间 3px 黑实线分隔，名称 800 左、注记 mono 右（flex space-between）。
`.learn-list`：有序计数器，序号放黄底黑框小方块（`li::before` + CSS counter），条目间 2px 虚线。

### 4.7 时间线 `.timeline`
桌面三列卡（不再用纵向线），每张卡顶部色条 teal/yellow/coral 按 nth-child 分配，`.tl-phase` 印章骑缝。移动端纵向堆叠，左侧 6px 色条模拟轨道。

### 4.8 CTA 区 `#apply`
全站唯一强中心：`.apply-box` 整体黄底、4px 边、`shadow-xl`、不旋转；内嵌白色 `.qr-card`（含 1px 网格底纹衬托二维码）。`.apply-note` 用 3px 虚线边 notice 样式。

### 4.9 相册与灯箱
`.drag-carousel`：横向 scroll-snap 可拖拽；`.drag-item` 白卡 4px 边 + 小硬阴影；**img 必须 `pointer-events:none`**（点击绑定在 item 上，灯箱依赖此约定，见 CONTRACT/AGENTS）。
`#award-lightbox`：黑色 85% 遮罩上放白框大图 + 黄底 caption 条；控制按钮 52px 方块纸底黑字黄阴影。

### 4.10 模态 `<dialog>`
`.future-question`：白卡、4px 边、`10px 10px 0` 阴影、`::backdrop` 黑 55%；`?` 大字符用黄色荧光笔底（`background:linear-gradient(transparent 55%, var(--yellow) 55%)`）。

### 4.11 导航
- 顶栏：fixed、纸底、底部 4px 黑线；滚过阈值加 `.scrolled` → 追加 `0 4px 0 var(--yellow)` 硬阴影（状态反馈）。
- 桌面链接 hover：黄底 + 3px 透明边转黑 + `rotate(-1deg)`（deepdemos 同款）。
- 移动端 `body.nav-open`：`.nav-menu` 展开为顶栏下全宽面板，链接逐行 3px 分隔线。
- `.side-nav`：右侧居中竖排小方牌（`writing-mode: vertical-rl`），`<=1100px` 隐藏。

### 4.12 滚动条（品牌细节，必做）
WebKit：16px 宽、纸底轨道左右各 2px 墨线、墨色滑块中央叠黄色条纹（repeating-linear-gradient）；hover 滑块变 teal。Firefox 降级 `scrollbar-color: var(--ink) var(--paper)`。

### 4.13 选区
`::selection { background: var(--red); color:#fff }`——选区属瞬时操作态，不承担阅读功能，此处允许白字（唯一例外）。

---

## 5. 动效系统

延续 REQUIREMENTS §3.6 "动效是行为不是装饰"，但语言全部换成位移+阴影：

| 动效 | 实现 | 备注 |
|---|---|---|
| 入场揭示 | `[data-reveal]` → `.is-visible`，opacity+translateY(22px)，500ms | 仅 `html.js` 下隐藏，无 JS 直接可见（渐进增强） |
| 错位延迟 | JS 读 `data-delay` 写 inline transition-delay | CSS 不再重复实现 |
| 数字滚动 | `[data-count]` rAF 计数（既有） | 不变 |
| 视差 | `.hero-bg` 内联 translateY（既有） | 移动端/触屏/reduced-motion 自动关闭（JS 侧已判） |
| 打字机 | `[data-type-title]` + 光标 blink | reduced-motion 直接呈现全文 |
| hover 手感 | translate 吃/吐阴影 | 全站统一 180ms |
| 弹跳点缀 | summary 展开、chip 出场可用 scale(.94→1.04→1) tab-pop | 只用于小元素 |

**双通道降级（两条都必须在）**：
1. `body.reduced-motion`（JS 加）→ 揭示直接可见、blink/弹跳停止；
2. `@media (prefers-reduced-motion: reduce)` → `*{transition-duration:.01ms!important; animation-duration:.01ms!important}`（deepdemos 同款兜底，覆盖 JS 未就绪窗口）。

---

## 6. 响应式策略

- 桌面优先书写，`@media (max-width:…)` 收窄。
- **`<=768px` 是"另一套设计"而非缩放**（继承自原站经验）：全部网格单列；旋转归零（旋转在小屏只添乱）；proof bento 必须执行 `.proof-grid > * { grid-area:auto !important }` 重置（CONTRACT 位置契约，见 AGENTS.md）；hero 单列、media 上移到 copy 之后；side-nav 隐藏；导航切汉堡面板。
- 触摸目标 ≥40px（btn/tag-chip min-height）。

---

## 7. 图片规范（沿用 + 增补)

继承 CONTRACT §4 与原站经验：
- `.media-frame` 固定比例容器 + object-fit cover/contain 三层结构不变；
- 高瘦截图走 `.internship-frame`（aspect auto + contain），绝不硬塞 ratio 框；
- 二维码 `.fit-contain` + 白底衬格。

增补（粗野主义化）：
- 所有图片外框 = 4px 墨线 + 硬阴影，图片本身就是"贴上墙的照片"；不再使用占位渐变，占位态改为**斜纹底 + mono 文案**；
- 照片自带白边（`padding:6px; background:var(--paper)`）模拟相纸。

---

## 8. 主题机制

- 默认即成品：纸白粗野风。index.html **不写死 data-theme**。
- `?theme=` 预览通道保留（JS `initThemePreview` 不动）：
  - `night` → 定义了反转变体：`:root` 令牌翻转（ink↔paper、muted 提亮），阴影/边框因引用 `var(--ink)` 自动反转，糖果色不动；
  - `engineering` / `campus` → 未定义规则，静默呈现默认（旧链接不炸）。
- 新组件若用了 `--muted` 或写死黑白之外的颜色，须检查 night 下可读性。

---

## 9. 禁止清单（验收口径）

1. 禁止 emoji（CONTRACT 原有铁律）；
2. 禁止外部 CDN/字体/图床引用；
3. 禁止 `border-radius > 0`（第三方控件默认圆角需显式清零）；
4. 禁止模糊阴影、`backdrop-filter`、渐变光斑；
5. 强调色表面禁白字（§2.2）；
6. 禁止新增装饰性循环动画；
7. 色彩/阴影/边宽不得绕过令牌硬编码。

---

## 10. 旧 → 新 映射速查（维护者向）

| 旧（玻璃拟态语义） | 新（粗野语义） |
|---|---|
| `.glass-card` 半透玻璃卡 | 白底墨框硬阴影卡，±0.5deg 交错 |
| `.kicker` 渐变小标 | 黄底贴纸徽章 rotate(-1deg) |
| `.btn-primary` 渐变按钮 | 红底黑字 rotate(-1deg) |
| `.hero-bg` 渐变光斑视差 | 墨点阵 + 黄斜纹带视差 |
| `.timeline` 纵向线 | 三列色条卡 |
| `body[data-theme="engineering"]` 蓝色主题 | 删除；night 反转变体取代主题玩法 |
| 占位块渐变+图标 | 斜纹底 + mono 文案 |

> 改版后 CONTRACT.md §5 的令牌表已同步替换；§2 结构命名、§3 动效钩子、§7 验收清单继续有效。
