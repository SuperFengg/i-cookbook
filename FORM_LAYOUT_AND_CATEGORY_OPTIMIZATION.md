# 表单布局和分类优化

## 问题描述

1. 添加食谱和编辑食谱页面的分钟、人份两个单位的布局被挤到下面，不够美观
2. 菜品分类选项不够丰富，缺少中国各大菜系

## 解决方案

### 1. 优化输入框和单位布局

- **使用 flexbox 布局**：
  - 创建 `.input-with-unit` 容器
  - 使用 flex 布局让输入框和单位在同一行
  - 输入框占据主要空间，单位固定宽度

### 2. 丰富菜品分类

- **添加四大分类组**：
  - 家常菜系：家常菜、快手菜、下饭菜
  - 八大菜系：川菜、粤菜、苏菜、浙菜、闽菜、湘菜、鲁菜、徽菜
  - 其他菜系：东北菜、西北菜、新疆菜、云南菜、贵州菜、广西菜、海南菜、台湾菜
  - 特色美食：火锅、烧烤、汤品、凉菜、主食、甜点、饮品

### 3. 更新分类标签颜色

- **为每个分类分配合适的颜色**：
  - 家常菜系：primary（蓝色）
  - 川菜、湘菜、新疆菜、贵州菜、火锅：danger（红色）
  - 粤菜、苏菜、浙菜、徽菜、云南菜、广西菜、凉菜：success（绿色）
  - 苏菜、浙菜、西北菜、烧烤、主食、甜点：warning（橙色）
  - 其他：info（灰色）

## 技术实现

### 布局优化

```vue
<div class="input-with-unit">
  <el-input-number
    v-model="recipeForm.cookTime"
    :min="1"
    :max="300"
    style="width: 100%"
  />
  <span class="unit">分钟</span>
</div>
```

### 样式实现

```scss
.input-with-unit {
  @include flex(row, flex-start, center);
  gap: $spacing-xs;
  
  .el-input-number {
    flex: 1;
  }
  
  .unit {
    color: #666;
    font-size: $font-size-small;
    white-space: nowrap;
    min-width: 40px;
  }
}
```

### 分类选项结构

```vue
<el-select v-model="recipeForm.category" placeholder="选择分类">
  <el-option-group label="家常菜系">
    <el-option label="家常菜" value="家常菜" />
    <el-option label="快手菜" value="快手菜" />
    <el-option label="下饭菜" value="下饭菜" />
  </el-option-group>
  <el-option-group label="八大菜系">
    <!-- 八大菜系选项 -->
  </el-option-group>
  <el-option-group label="其他菜系">
    <!-- 其他菜系选项 -->
  </el-option-group>
  <el-option-group label="特色美食">
    <!-- 特色美食选项 -->
  </el-option-group>
</el-select>
```

## 更新的页面

- `src/views/AddRecipe.vue` - 添加食谱页面
- `src/views/EditRecipe.vue` - 编辑食谱页面
- `src/views/RecipeList.vue` - 食谱列表页面

## 效果

- 输入框和单位在同一行显示，布局更加美观
- 分类选项更加丰富，涵盖中国各大菜系
- 分类标签颜色更加丰富，便于区分
- 用户体验得到显著提升
