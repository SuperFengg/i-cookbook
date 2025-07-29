# Vue2 + Sass 开发指南

## 安装完成

✅ Sass 已成功安装并配置到您的 Vue2 项目中！

## 已安装的依赖

- `sass-loader@^10.0.0` - Sass 加载器
- `sass` - Sass 编译器

## 项目结构

```
src/
├── assets/
│   └── styles/
│       ├── variables.scss    # 全局变量
│       ├── mixins.scss       # 混入函数
│       └── global.scss       # 全局样式
├── components/
│   ├── HelloWorld.vue        # 示例组件（已更新为使用Sass）
│   └── SassDemo.vue         # Sass功能演示组件
└── main.js                  # 已导入全局样式
```

## Sass 功能特性

### 1. 变量 (Variables)

```scss
$primary-color: #42b983;
$font-size-base: 14px;
$spacing-md: 16px;
```

### 2. 嵌套 (Nesting)

```scss
.container {
  max-width: 1200px;
  
  .header {
    background: $primary-color;
    
    h1 {
      color: white;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
```

### 3. 混入 (Mixins)

```scss
@mixin button($bg-color: $primary-color) {
  padding: 10px 20px;
  background-color: $bg-color;
  border-radius: 4px;
  cursor: pointer;
}

.btn {
  @include button();
}
```

### 4. 函数 (Functions)

```scss
.btn:hover {
  background-color: darken($primary-color, 10%);
}
```

### 5. 响应式设计

```scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == sm {
    @media (min-width: 768px) { @content; }
  }
}

.element {
  @include respond-to(sm) {
    display: flex;
  }
}
```

## 使用方法

### 在 Vue 组件中使用 Sass

1. **在 style 标签中添加 `lang="scss"`**：

```vue
<style lang="scss" scoped>
// 你的 Sass 代码
</style>
```

2. **导入变量和混入**：

```scss
@import '../assets/styles/variables.scss';
@import '../assets/styles/mixins.scss';
```

3. **使用变量和混入**：

```scss
.my-component {
  color: $primary-color;
  @include button();
  
  .title {
    font-size: $font-size-h1;
    @include text-ellipsis();
  }
}
```

## 全局样式

项目已配置全局样式文件 `src/assets/styles/global.scss`，包含：

- 基础重置样式
- 通用工具类
- 响应式工具类
- 按钮和卡片组件样式

## 可用的工具类

### 间距类

- `.mt-1` 到 `.mt-5` (margin-top)
- `.mb-1` 到 `.mb-5` (margin-bottom)
- `.p-1` 到 `.p-5` (padding)

### 文本对齐

- `.text-center`
- `.text-left`
- `.text-right`

### 响应式隐藏/显示

- `.hidden-xs`, `.hidden-sm`
- `.visible-xs`, `.visible-sm`

## 运行项目

```bash
npm run serve
```

访问 `http://localhost:8080` 查看 Sass 演示效果。

## 最佳实践

1. **使用变量**：将颜色、字体大小、间距等定义为变量
2. **使用混入**：将重复的样式封装为混入
3. **嵌套适度**：避免过深的嵌套（建议不超过3层）
4. **模块化**：将样式按功能模块化组织
5. **响应式优先**：使用移动优先的响应式设计

## 常用 Sass 函数

- `darken($color, $amount)` - 使颜色变暗
- `lighten($color, $amount)` - 使颜色变亮
- `mix($color1, $color2, $weight)` - 混合颜色
- `percentage($number)` - 转换为百分比

## 注意事项

- 确保在 `style` 标签中添加 `lang="scss"`
- 使用 `scoped` 属性限制样式作用域
- 导入路径要正确（相对于当前文件位置）
- 变量名使用 `$` 前缀
- 混入使用 `@include` 调用

现在您可以开始使用 Sass 来开发更强大、更易维护的 CSS 了！
