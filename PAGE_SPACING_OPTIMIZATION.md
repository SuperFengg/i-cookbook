# 页面间距优化

## 问题描述

食谱列表、食谱详情、添加食谱、编辑食谱页面距离顶部的空白太多，影响页面布局的紧凑性和用户体验。

## 解决方案

### 1. 主容器间距优化

**文件：`src/App.vue`**

- 将主容器的padding从 `$spacing-xl` 减少到 `$spacing-md`
- 移动端padding从 `$spacing-lg` 减少到 `$spacing-sm`

```scss
.app-main {
  padding: $spacing-md 0;  // 从 $spacing-xl 减少
  margin-top: 80px;
  
  @include respond-to(xs) {
    margin-top: 120px;
    padding: $spacing-sm 0;  // 移动端进一步减少
  }
}
```

### 2. 页面容器间距优化

**文件：`src/views/RecipeList.vue`、`src/views/RecipeDetail.vue`、`src/views/AddRecipe.vue`、`src/views/EditRecipe.vue`**

- 将页面容器的padding从 `$spacing-lg` 减少到 `$spacing-md`
- 保持移动端的 `$spacing-sm` 设置

```scss
.recipe-list,
.recipe-detail,
.add-recipe,
.edit-recipe {
  padding: $spacing-md 0;  // 从 $spacing-lg 减少
  
  @include respond-to(xs) {
    padding: $spacing-sm 0;  // 移动端保持紧凑
  }
}
```

### 3. 页面头部间距优化

**文件：所有页面组件**

- 将页面头部的margin-bottom从 `$spacing-lg` 减少到 `$spacing-md`
- 减少页面标题与内容之间的空白

```scss
.page-header,
.recipe-header {
  margin-bottom: $spacing-md;  // 从 $spacing-lg 减少
}
```

## 间距变量说明

### 当前使用的间距变量

- `$spacing-sm`: 8px - 移动端紧凑间距
- `$spacing-md`: 16px - 标准间距
- `$spacing-lg`: 24px - 大间距（已减少使用）
- `$spacing-xl`: 32px - 超大间距（已减少使用）

### 优化效果

- **桌面端**：从32px减少到16px，减少50%的顶部空白
- **移动端**：从24px减少到8px，减少67%的顶部空白
- **页面头部**：从24px减少到16px，减少33%的标题下方空白

## 更新的文件

### 主应用文件

- `src/App.vue` - 主容器间距优化

### 页面组件

- `src/views/RecipeList.vue` - 食谱列表页面
- `src/views/RecipeDetail.vue` - 食谱详情页面
- `src/views/AddRecipe.vue` - 添加食谱页面
- `src/views/EditRecipe.vue` - 编辑食谱页面

## 优化效果

### 视觉改进

- ✅ 页面布局更加紧凑
- ✅ 减少不必要的空白区域
- ✅ 提高屏幕空间利用率
- ✅ 保持清晰的视觉层次

### 用户体验提升

- ✅ 减少滚动距离
- ✅ 更快看到页面内容
- ✅ 移动端更好的空间利用
- ✅ 保持响应式设计的平衡

### 技术优势

- ✅ 统一的间距规范
- ✅ 更好的响应式适配
- ✅ 代码更加简洁
- ✅ 易于维护和调整

## 注意事项

### 保持的间距

- 导航栏的margin-top保持不变，确保固定导航栏正常工作
- 移动端的特殊间距设置保持不变
- 内容区域内部的间距保持合理

### 响应式考虑

- 桌面端：适中的间距，保持舒适阅读
- 移动端：紧凑的间距，最大化内容显示
- 平板端：继承桌面端设置，保持一致性

现在所有页面的顶部间距都得到了优化，提供了更加紧凑和高效的布局！
