# MobileTable 组件使用说明

## 组件介绍

`MobileTable` 是一个响应式表格组件，在桌面端显示传统表格，在移动端显示卡片式布局，完美解决移动端表格横向滚动的问题。

## 基本用法

```vue
<template>
  <div>
    <h3>食材清单</h3>
    <MobileTable 
      :data="ingredients"
      :columns="columns"
    />
  </div>
</template>

<script>
import MobileTable from '@/components/MobileTable.vue'

export default {
  components: {
    MobileTable
  },
  data() {
    return {
      ingredients: [
        { name: '五花肉', amount: '500g', note: '选择肥瘦相间的五花肉' },
        { name: '生抽', amount: '2勺', note: '调味用' },
        { name: '老抽', amount: '1勺', note: '上色用' }
      ],
      columns: [
        { prop: 'name', label: '食材名称', width: 200 },
        { prop: 'amount', label: '用量', width: 150 },
        { prop: 'note', label: '备注' }
      ]
    }
  }
}
</script>
```

## Props 说明

### data

- **类型**: `Array`
- **必需**: `true`
- **说明**: 表格数据数组

### columns

- **类型**: `Array`
- **必需**: `true`
- **说明**: 列配置数组

#### column 配置项

```javascript
{
  prop: 'name',        // 数据字段名
  label: '食材名称',    // 列标题
  width: 200,          // 列宽度（可选）
  minWidth: 100        // 最小宽度（可选）
}
```

## 响应式行为

### 桌面端 (≥768px)

- 显示传统表格
- 支持横向滚动（如果内容过宽）
- 保持原有的表格功能

### 移动端 (<768px)

- 显示卡片式布局
- 每个数据项显示为一个卡片
- 每个字段显示为一行（标签：值）
- 无需横向滚动

## 样式定制

组件使用以下CSS变量，可以通过覆盖来定制样式：

```scss
.mobile-table {
  .mobile-cards {
    .mobile-card {
      background: #f8f9fa;        // 卡片背景色
      border: 1px solid #e9ecef;  // 卡片边框
      border-radius: 4px;          // 圆角
      padding: 16px;               // 内边距
      margin-bottom: 8px;          // 卡片间距
      
      .card-row {
        .card-label {
          font-weight: 600;        // 标签字体粗细
          color: #35495e;          // 标签颜色
          font-size: 12px;         // 标签字体大小
        }
        
        .card-value {
          color: #333;             // 值颜色
          font-size: 12px;         // 值字体大小
        }
      }
    }
  }
}
```

## 使用场景

### 1. 食材清单

```javascript
const columns = [
  { prop: 'name', label: '食材名称', width: 200 },
  { prop: 'amount', label: '用量', width: 150 },
  { prop: 'note', label: '备注' }
]
```

### 2. 用户信息

```javascript
const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'phone', label: '电话', width: 150 },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'address', label: '地址' }
]
```

### 3. 订单信息

```javascript
const columns = [
  { prop: 'orderNo', label: '订单号', width: 150 },
  { prop: 'product', label: '商品', width: 200 },
  { prop: 'price', label: '价格', width: 100 },
  { prop: 'status', label: '状态', width: 100 }
]
```

## 优势

1. **无需横向滚动**: 移动端使用卡片布局，完全避免横向滚动
2. **响应式设计**: 自动适配不同屏幕尺寸
3. **易于使用**: 简单的配置，快速集成
4. **可定制**: 支持样式定制
5. **复用性强**: 可在多个页面中使用

## 注意事项

1. 确保 `columns` 中的 `prop` 与数据字段名一致
2. 移动端卡片布局适合字段较少的表格（建议 ≤ 4 列）
3. 如果数据量很大，建议添加分页功能
4. 可以根据需要调整断点设置

## 示例效果

### 桌面端效果

```
┌─────────────┬─────────┬─────────────────┐
│ 食材名称    │ 用量    │ 备注            │
├─────────────┼─────────┼─────────────────┤
│ 五花肉      │ 500g    │ 选择肥瘦相间的  │
│ 生抽        │ 2勺     │ 调味用          │
│ 老抽        │ 1勺     │ 上色用          │
└─────────────┴─────────┴─────────────────┘
```

### 移动端效果

```
┌─────────────────────────┐
│ 食材名称：五花肉        │
│ 用量：500g              │
│ 备注：选择肥瘦相间的    │
└─────────────────────────┘
┌─────────────────────────┐
│ 食材名称：生抽          │
│ 用量：2勺               │
│ 备注：调味用            │
└─────────────────────────┘
```
