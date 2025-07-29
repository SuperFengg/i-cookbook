# 移动端表单优化

## 问题描述

添加食谱和编辑食谱页面在移动端存在以下问题：

1. 返回按钮离顶部导航栏高度太高
2. 各个输入表单的左侧空白太宽
3. 封面图的位置与下面文字描述内容叠加
4. 取消和保存食谱两个按钮位置不够美观

## 解决方案

### 1. 优化页面头部布局

- **减少顶部间距**：
  - 移动端页面padding从 `$spacing-lg` 减少到 `$spacing-sm`
  - 页面头部margin-bottom从 `$spacing-lg` 减少到 `$spacing-md`
  - 返回按钮和标题保持水平布局

### 2. 优化表单标签宽度

- **动态标签宽度**：
  - 桌面端：100px
  - 移动端：80px
  - 使用计算属性 `$isMobile` 动态调整

### 3. 优化表单容器布局

- **减少左侧空白**：
  - 移动端表单容器添加左右padding：`$spacing-sm`
  - 卡片头部和内容区域padding优化
  - 保持内容紧凑但清晰

### 4. 优化图片上传区域

- **防止内容叠加**：
  - 图片上传区域添加底部margin：`$spacing-sm`
  - 上传提示文字优化间距和字体大小
  - 确保图片和描述文字有足够间距

### 5. 优化操作按钮

- **粘性底部按钮**：
  - 移动端按钮固定在页面底部
  - 使用 `position: sticky` 和 `bottom: 0`
  - 添加阴影效果和背景色
  - 按钮等宽分布，高度44px便于触摸

## 技术实现

### 移动端检测

```javascript
computed: {
  $isMobile() {
    return window.innerWidth <= 768;
  }
}
```

### 动态标签宽度

```vue
<el-form
  :label-width="$isMobile ? '80px' : '100px'"
  class="recipe-form"
>
```

### 粘性按钮样式

```scss
.form-actions {
  @include respond-to(xs) {
    position: sticky;
    bottom: 0;
    background: white;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
    
    .el-button {
      flex: 1;
      height: 44px;
      font-size: 16px;
    }
  }
}
```

### 响应式布局优化

```scss
.add-recipe {
  @include respond-to(xs) {
    padding: $spacing-sm 0;
  }
  
  .recipe-form {
    @include respond-to(xs) {
      padding: 0 $spacing-sm;
    }
  }
}
```

## 更新的页面

- `src/views/AddRecipe.vue` - 添加食谱页面
- `src/views/EditRecipe.vue` - 编辑食谱页面

## 效果

- 移动端页面布局更加紧凑
- 表单标签宽度适配移动端
- 图片上传区域不再与描述叠加
- 操作按钮固定在底部，便于操作
- 整体移动端用户体验显著提升
