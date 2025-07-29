<template>
  <div class="mobile-table">
    <!-- 桌面端显示表格 -->
    <div class="desktop-table table-container">
      <el-table :data="data" border>
        <el-table-column 
          v-for="column in columns" 
          :key="column.prop"
          :prop="column.prop" 
          :label="column.label" 
          :width="column.width"
          :min-width="column.minWidth"
        />
      </el-table>
    </div>
    
    <!-- 移动端显示卡片 -->
    <div class="mobile-cards">
      <div 
        v-for="(item, index) in data" 
        :key="index"
        class="mobile-card"
      >
        <div 
          v-for="column in columns" 
          :key="column.prop"
          class="card-row"
        >
          <span class="card-label">{{ column.label }}：</span>
          <span class="card-value">{{ item[column.prop] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileTable',
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true,
      // 格式: [{ prop: 'name', label: '名称', width: 200 }]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
@import '../assets/styles/mixins.scss';

.mobile-table {
  .desktop-table {
    @include respond-to(sm) {
      display: block;
    }
    
    @include respond-to(xs) {
      display: none;
    }
  }
  
  .mobile-cards {
    @include respond-to(sm) {
      display: none;
    }
    
    @include respond-to(xs) {
      display: block;
    }
    
    .mobile-card {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: $border-radius-base;
      padding: $spacing-md;
      margin-bottom: $spacing-sm;
      
      .card-row {
        @include flex(row, space-between, center);
        margin-bottom: $spacing-xs;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .card-label {
          font-weight: 600;
          color: $secondary-color;
          font-size: $font-size-small;
          min-width: 60px;
        }
        
        .card-value {
          color: #333;
          font-size: $font-size-small;
          text-align: right;
          flex: 1;
          margin-left: $spacing-sm;
        }
      }
    }
  }
}
</style> 