# 食材表单间距优化说明

## 问题描述

在移动端查看食材添加表单时，输入框之间挨得太近，缺乏足够的视觉分隔，影响用户体验。

## 优化方案

### 1. 增加栅格间距

#### 优化前

```vue
<el-row :gutter="10" class="ingredient-row">
  <el-col :xs="24" :sm="8">
    <el-form-item label="食材名称">
      <el-input v-model="ingredient.name" />
    </el-form-item>
  </el-col>
  <!-- 其他列... -->
</el-row>
```

#### 优化后

```vue
<el-row :gutter="20" class="ingredient-row">
  <el-col :xs="24" :sm="8">
    <el-form-item label="食材名称">
      <el-input v-model="ingredient.name" />
    </el-form-item>
  </el-col>
  <!-- 其他列... -->
</el-row>
```

### 2. 移动端垂直间距优化

#### CSS实现

```scss
.ingredient-row {
  @include respond-to(xs) {
    margin-bottom: 0;
    
    .el-col {
      margin-bottom: $spacing-sm; // 16px
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
```

### 3. 全局移动端样式优化

#### 移动端食材表单间距

```scss
.ingredient-item {
  @include respond-to(xs) {
    .ingredient-row {
      .el-col {
        margin-bottom: 16px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      .el-form-item {
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
```

## 优化效果

### 桌面端效果

- 栅格间距从10px增加到20px
- 保持水平布局的紧凑性
- 视觉分隔更加清晰

### 移动端效果

- 每个输入框之间有16px的垂直间距
- 表单标签和输入框之间有12px间距
- 最后一个元素无底部间距
- 整体布局更加舒适

## 技术实现

### 1. 响应式栅格间距

```vue
<!-- 桌面端：20px水平间距 -->
<!-- 移动端：16px垂直间距 -->
<el-row :gutter="20" class="ingredient-row">
  <el-col :xs="24" :sm="8">
    <!-- 内容 -->
  </el-col>
</el-row>
```

### 2. 移动端专用样式

```scss
@include respond-to(xs) {
  .el-col {
    margin-bottom: $spacing-sm; // 16px
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
```

### 3. 变量使用

```scss
$spacing-sm: 16px;  // 小间距
$spacing-md: 24px;  // 中间距
```

## 应用范围

### 1. 添加食谱页面

- ✅ `src/views/AddRecipe.vue`
- ✅ 食材表单间距优化

### 2. 编辑食谱页面

- ✅ `src/views/EditRecipe.vue`
- ✅ 食材表单间距优化

### 3. 食材表单组件

- ✅ `src/components/IngredientForm.vue`
- ✅ 组件内间距优化

### 4. 全局移动端样式

- ✅ `src/assets/styles/mobile.scss`
- ✅ 统一的移动端间距规范

## 间距规范

### 桌面端间距

- 栅格间距：20px
- 卡片内边距：24px
- 表单项间距：24px

### 移动端间距

- 栅格垂直间距：16px
- 卡片内边距：16px
- 表单项间距：12px
- 输入框高度：40px

## 测试建议

### 1. 设备测试

- iPhone SE (375px)
- iPhone 12 (390px)
- iPhone 12 Pro Max (428px)
- Android 设备 (360px-400px)

### 2. 视觉测试

- ✅ 输入框间距是否舒适
- ✅ 表单标签是否清晰
- ✅ 整体布局是否协调
- ✅ 触摸区域是否足够

### 3. 用户体验

- ✅ 输入体验是否流畅
- ✅ 视觉层次是否清晰
- ✅ 操作便利性是否良好
- ✅ 页面美观度是否提升

## 优化前后对比

### 优化前问题

- ❌ 输入框间距过小
- ❌ 移动端视觉拥挤
- ❌ 缺乏清晰的视觉分隔
- ❌ 操作体验不佳

### 优化后效果

- ✅ 输入框间距舒适
- ✅ 移动端布局清晰
- ✅ 视觉分隔明确
- ✅ 操作体验良好

现在食材表单在移动端有了更好的间距，提供了更舒适的用户体验！
