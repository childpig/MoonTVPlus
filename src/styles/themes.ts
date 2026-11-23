// 内置主题定义
export const builtInThemes = {
  default: {
    name: '默认主题',
    description: '使用系统默认样式',
    color: '#3b82f6',
    css: '',
  },
  cinema_amber: {
    name: '影院暖橙',
    description: '深棕到琥珀的影院氛围，暖色高亮',
    color: '#d97706',
    css: `
/* ========== 影院暖橙 Cinema Amber ========== */
:root:not(.dark) {
  --theme-primary: #c2410c;
  --theme-primary-hover: #9a3412;
  --theme-text: #3b2412;
  --theme-text-secondary: #8a5a2b;
  --theme-border: #e3c49b;
}
html:not(.dark) body {
  background: linear-gradient(180deg, #f6ead9 0%, #f0d8b4 45%, #e6bd83 100%) !important;
  background-attachment: fixed !important;
  color: #3b2412 !important;
}

.dark {
  --theme-primary: #f59e0b;
  --theme-primary-hover: #d97706;
  --theme-text: #fdf4e7;
  --theme-text-secondary: #dfb98a;
  --theme-border: #6e3d18;
}
html.dark body {
  background: linear-gradient(180deg, #17100b 0%, #2f1a10 18%, #5d2f12 42%, #914d18 70%, #b46e1d 100%) !important;
  background-attachment: fixed !important;
  color: #fdf4e7 !important;
}

/* 轮播未加载时的占位渐变：跟随暖棕，不再露出深蓝灰 */
html:not(.dark) [class*="from-gray-100"] { --tw-gradient-from: #f0d8b4 !important; --tw-gradient-to: #e6bd83 !important; }
.dark [class*="from-gray-800"] { --tw-gradient-from: #2f1a10 !important; --tw-gradient-to: #5d2f12 !important; }

/* 侧边栏 / 毛玻璃面板（排除 body：body 自带 bg-white/dark:bg-gray-900 类） */
:root:not(.dark) [class*="bg-white/40"]:not(body) {
  background: rgba(255, 248, 238, 0.78) !important;
  border-color: rgba(160, 100, 40, 0.22) !important;
}
.dark [class*="bg-white/40"]:not(body),
.dark [class*="bg-gray-900/70"]:not(body) {
  background: rgba(26, 15, 9, 0.74) !important;
  backdrop-filter: blur(18px) !important;
  -webkit-backdrop-filter: blur(18px) !important;
  border-color: rgba(190, 116, 40, 0.3) !important;
}

/* logo：影院拍板 + 暖白字 */
a[href="/"][class*="text-2xl"] { color: #fff4e7 !important; }
a[href="/"][class*="text-2xl"]::before { content: "\1F3AC\fe0f "; }

[class*="text-green-500"],
[class*="text-blue-500"],
[class*="text-green-600"],
[class*="text-blue-600"] {
  color: var(--theme-primary) !important;
}

/* 侧栏导航：仅激活项暖橙 */
.dark a[data-active="true"],
.dark [class*="data-[active=true]"] {
  background: rgba(217, 119, 6, 0.26) !important;
}
.dark a[data-active="true"] *,
.dark [class*="data-[active=true]:text"] {
  color: #ffedd5 !important;
}

/* 主色按钮 */
[class~="bg-blue-600"]:not(body),
[class~="bg-green-600"]:not(body) {
  background: var(--theme-primary) !important;
}

/* 内容卡片 / 面板：暖棕半透明（排除 body） */
:root:not(.dark) [class*="bg-white"]:not(body):not([class*="bg-white/40"]),
:root:not(.dark) [class*="bg-gray-50"]:not(body),
:root:not(.dark) [class*="bg-gray-100"]:not(body) {
  background: rgba(255, 250, 242, 0.86) !important;
}
.dark [class*="bg-gray-700"]:not(body),
.dark [class*="bg-gray-800"]:not(body),
.dark [class*="bg-gray-900"]:not(body),
.dark [class*="bg-white"]:not(body):not([class*="bg-white/40"]) {
  background: rgba(43, 25, 15, 0.8) !important;
  color: var(--theme-text) !important;
  border-color: rgba(190, 116, 40, 0.24) !important;
}

/* 文字 */
:root:not(.dark) [class*="text-gray-"]:not(body),
.dark [class*="text-gray-"]:not(body) {
  color: var(--theme-text-secondary) !important;
}
:root:not(.dark) [class*="text-gray-900"]:not(body),
.dark [class*="text-gray-100"]:not(body),
.dark [class*="text-gray-200"]:not(body) {
  color: var(--theme-text) !important;
}

/* 边框 */
[class*="border-gray-200"]:not(body),
[class*="border-gray-300"]:not(body),
[class*="border-gray-600"]:not(body),
[class*="border-gray-700"]:not(body) {
  border-color: var(--theme-border) !important;
}

/* 轮播主按钮：白色胶囊 */
[class*="bg-gray-500/30"]:not(body) {
  background: #fff !important;
  color: #35200f !important;
  border-radius: 9999px !important;
  padding-left: 1.75rem !important;
  padding-right: 1.75rem !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
}
[class*="bg-gray-500/30"] svg { fill: #35200f !important; }

/* 评分角标 */
[class*="bg-yellow-500"]:not(body) { background: var(--theme-primary) !important; color: #fff !important; }

/* 顶部进度条 */
#nprogress .bar, .dark #nprogress .bar {
  background: #f59e0b !important;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.85), 0 0 5px rgba(245, 158, 11, 0.6) !important;
}

[class*="rounded-lg"]:not(body) { border-radius: 0.75rem !important; }
`,
  },
  dark_blue: {
    name: '深蓝夜空',
    description: '深邃的蓝色科技风格',
    color: '#3b82f6',
    css: `
/* 浅色模式 */
:root:not(.dark) {
  --theme-primary: #2563eb;
  --theme-primary-hover: #1d4ed8;
  --theme-bg: #dbeafe;
  --theme-bg-secondary: #eff6ff;
  --theme-text: #1e3a8a;
  --theme-text-secondary: #3b82f6;
  --theme-border: #93c5fd;
}

:root:not(.dark) body {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
  color: var(--theme-text) !important;
}

/* 深色模式 */
.dark {
  --theme-primary: #3b82f6;
  --theme-primary-hover: #2563eb;
  --theme-bg: #0f172a;
  --theme-bg-secondary: #1e293b;
  --theme-text: #e2e8f0;
  --theme-text-secondary: #94a3b8;
  --theme-border: #334155;
}

.dark body {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
  color: var(--theme-text) !important;
}

/* 通用样式 */
[class*="bg-white"]:not(.dark *), [class*="bg-gray-50"]:not(.dark *) {
  background: var(--theme-bg-secondary) !important;
  color: var(--theme-text) !important;
}

.dark [class*="bg-gray-800"], .dark [class*="bg-gray-900"] {
  background: var(--theme-bg-secondary) !important;
  color: var(--theme-text) !important;
}

[class*="border-gray"] {
  border-color: var(--theme-border) !important;
}

[class*="text-gray-600"], [class*="text-gray-700"], [class*="text-gray-800"] {
  color: var(--theme-text-secondary) !important;
}

.dark [class*="text-gray-"] {
  color: var(--theme-text-secondary) !important;
}
`,
  },
  purple_dream: {
    name: '紫色梦境',
    description: '神秘的紫色渐变风格',
    color: '#a78bfa',
    css: `
/* 浅色模式 */
:root:not(.dark) {
  --theme-primary: #7c3aed;
  --theme-primary-hover: #6d28d9;
  --theme-bg: #f3e8ff;
  --theme-bg-secondary: #faf5ff;
  --theme-text: #581c87;
  --theme-text-secondary: #7c3aed;
  --theme-border: #d8b4fe;
}

:root:not(.dark) body {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%) !important;
  color: var(--theme-text) !important;
}

/* 深色模式 */
.dark {
  --theme-primary: #a78bfa;
  --theme-primary-hover: #8b5cf6;
  --theme-bg: #1a0b2e;
  --theme-bg-secondary: #2d1b4e;
  --theme-text: #f3e8ff;
  --theme-text-secondary: #c4b5fd;
  --theme-border: #4c1d95;
}

.dark body {
  background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #4c1d95 100%) !important;
  color: var(--theme-text) !important;
}

/* 通用样式 */
[class*="bg-white"]:not(.dark *), [class*="bg-gray-50"]:not(.dark *) {
  background: var(--theme-bg-secondary) !important;
  color: var(--theme-text) !important;
}

.dark [class*="bg-gray-800"], .dark [class*="bg-gray-900"] {
  background: rgba(45, 27, 78, 0.8) !important;
  color: var(--theme-text) !important;
  backdrop-filter: blur(10px);
}

[class*="border-gray"] {
  border-color: var(--theme-border) !important;
}

[class*="text-gray-600"], [class*="text-gray-700"], [class*="text-gray-800"] {
  color: var(--theme-text-secondary) !important;
}

.dark [class*="text-gray-"] {
  color: var(--theme-text-secondary) !important;
}
`,
  },
  green_forest: {
    name: '翠绿森林',
    description: '清新的绿色自然风格',
    color: '#10b981',
    css: `
/* 浅色模式 */
:root:not(.dark) {
  --theme-primary: #059669;
  --theme-primary-hover: #047857;
  --theme-bg: #d1fae5;
  --theme-bg-secondary: #ecfdf5;
  --theme-text: #064e3b;
  --theme-text-secondary: #059669;
  --theme-border: #6ee7b7;
}

:root:not(.dark) body {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%) !important;
  color: var(--theme-text) !important;
}

/* 深色模式 */
.dark {
  --theme-primary: #10b981;
  --theme-primary-hover: #059669;
  --theme-bg: #064e3b;
  --theme-bg-secondary: #065f46;
  --theme-text: #d1fae5;
  --theme-text-secondary: #6ee7b7;
  --theme-border: #047857;
}

.dark body {
  background: linear-gradient(135deg, #064e3b 0%, #065f46 100%) !important;
  color: var(--theme-text) !important;
}

/* 通用样式 */
[class*="bg-white"]:not(.dark *), [class*="bg-gray-50"]:not(.dark *) {
  background: var(--theme-bg-secondary) !important;
  color: var(--theme-text) !important;
}

.dark [class*="bg-gray-800"], .dark [class*="bg-gray-900"] {
  background: rgba(6, 95, 70, 0.9) !important;
  color: var(--theme-text) !important;
}

[class*="border-gray"] {
  border-color: var(--theme-border) !important;
}

[class*="text-gray-600"], [class*="text-gray-700"], [class*="text-gray-800"] {
  color: var(--theme-text-secondary) !important;
}

.dark [class*="text-gray-"] {
  color: var(--theme-text-secondary) !important;
}
`,
  },
  orange_sunset: {
    name: '橙色日落',
    description: '温暖的橙色日落风格',
    color: '#f97316',
    css: `
/* 浅色模式 */
:root:not(.dark) {
  --theme-primary: #ea580c;
  --theme-primary-hover: #c2410c;
  --theme-bg: #fed7aa;
  --theme-bg-secondary: #ffedd5;
  --theme-text: #7c2d12;
  --theme-text-secondary: #ea580c;
  --theme-border: #fdba74;
}

:root:not(.dark) body {
  background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%) !important;
  color: var(--theme-text) !important;
}

/* 深色模式 */
.dark {
  --theme-primary: #f97316;
  --theme-primary-hover: #ea580c;
  --theme-bg: #431407;
  --theme-bg-secondary: #7c2d12;
  --theme-text: #fed7aa;
  --theme-text-secondary: #fdba74;
  --theme-border: #9a3412;
}

.dark body {
  background: linear-gradient(135deg, #431407 0%, #7c2d12 50%, #9a3412 100%) !important;
  color: var(--theme-text) !important;
}

/* 通用样式 */
[class*="bg-white"]:not(.dark *), [class*="bg-gray-50"]:not(.dark *) {
  background: var(--theme-bg-secondary) !important;
  color: var(--theme-text) !important;
}

.dark [class*="bg-gray-800"], .dark [class*="bg-gray-900"] {
  background: rgba(124, 45, 18, 0.85) !important;
  color: var(--theme-text) !important;
}

[class*="border-gray"] {
  border-color: var(--theme-border) !important;
}

[class*="text-gray-600"], [class*="text-gray-700"], [class*="text-gray-800"] {
  color: var(--theme-text-secondary) !important;
}

.dark [class*="text-gray-"] {
  color: var(--theme-text-secondary) !important;
}
`,
  },
  pink_candy: {
    name: '粉色糖果',
    description: '甜美的粉色糖果风格',
    color: '#ec4899',
    css: `
/* 浅色模式 */
:root:not(.dark) {
  --theme-primary: #db2777;
  --theme-primary-hover: #be185d;
  --theme-bg: #fce7f3;
  --theme-bg-secondary: #fdf2f8;
  --theme-text: #831843;
  --theme-text-secondary: #db2777;
  --theme-border: #fbcfe8;
}

:root:not(.dark) body {
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%) !important;
  color: var(--theme-text) !important;
}

/* 深色模式 */
.dark {
  --theme-primary: #ec4899;
  --theme-primary-hover: #db2777;
  --theme-bg: #500724;
  --theme-bg-secondary: #831843;
  --theme-text: #fce7f3;
  --theme-text-secondary: #fbcfe8;
  --theme-border: #9f1239;
}

.dark body {
  background: linear-gradient(135deg, #500724 0%, #831843 50%, #9f1239 100%) !important;
  color: var(--theme-text) !important;
}

/* 通用样式 */
[class*="bg-white"]:not(.dark *), [class*="bg-gray-50"]:not(.dark *) {
  background: var(--theme-bg-secondary) !important;
  color: var(--theme-text) !important;
}

.dark [class*="bg-gray-800"], .dark [class*="bg-gray-900"] {
  background: rgba(131, 24, 67, 0.85) !important;
  color: var(--theme-text) !important;
}

[class*="border-gray"] {
  border-color: var(--theme-border) !important;
}

[class*="text-gray-600"], [class*="text-gray-700"], [class*="text-gray-800"] {
  color: var(--theme-text-secondary) !important;
}

.dark [class*="text-gray-"] {
  color: var(--theme-text-secondary) !important;
}
`,
  },
  cyan_ocean: {
    name: '青色海洋',
    description: '清爽的青色海洋风格',
    color: '#06b6d4',
    css: `
/* 浅色模式 */
:root:not(.dark) {
  --theme-primary: #0891b2;
  --theme-primary-hover: #0e7490;
  --theme-bg: #cffafe;
  --theme-bg-secondary: #ecfeff;
  --theme-text: #164e63;
  --theme-text-secondary: #0891b2;
  --theme-border: #67e8f9;
}

:root:not(.dark) body {
  background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%) !important;
  color: var(--theme-text) !important;
}

/* 深色模式 */
.dark {
  --theme-primary: #06b6d4;
  --theme-primary-hover: #0891b2;
  --theme-bg: #083344;
  --theme-bg-secondary: #164e63;
  --theme-text: #cffafe;
  --theme-text-secondary: #67e8f9;
  --theme-border: #155e75;
}

.dark body {
  background: linear-gradient(135deg, #083344 0%, #164e63 100%) !important;
  color: var(--theme-text) !important;
}

/* 通用样式 */
[class*="bg-white"]:not(.dark *), [class*="bg-gray-50"]:not(.dark *) {
  background: var(--theme-bg-secondary) !important;
  color: var(--theme-text) !important;
}

.dark [class*="bg-gray-800"], .dark [class*="bg-gray-900"] {
  background: rgba(22, 78, 99, 0.9) !important;
  color: var(--theme-text) !important;
}

[class*="border-gray"] {
  border-color: var(--theme-border) !important;
}

[class*="text-gray-600"], [class*="text-gray-700"], [class*="text-gray-800"] {
  color: var(--theme-text-secondary) !important;
}

.dark [class*="text-gray-"] {
  color: var(--theme-text-secondary) !important;
}
`,
  },
};

export type ThemeName = keyof typeof builtInThemes;

export function getThemeCSS(themeName: ThemeName): string {
  return builtInThemes[themeName]?.css || '';
}

export function getThemeNames(): { value: ThemeName; label: string }[] {
  return Object.entries(builtInThemes).map(([key, theme]) => ({
    value: key as ThemeName,
    label: theme.name,
  }));
}
