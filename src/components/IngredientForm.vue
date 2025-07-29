<template>
  <div class="ingredient-form">
    <div class="ingredient-header">
      <span class="ingredient-index">食材 {{ index + 1 }}</span>
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="small"
        @click="$emit('remove')"
      />
    </div>
    
    <el-row :gutter="20" class="ingredient-row">
      <el-col :xs="24" :sm="8">
        <el-form-item label="食材名称">
          <el-input
            :value="ingredient.name"
            placeholder="食材名称"
            @input="updateField('name', $event)"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="6">
        <el-form-item label="用量">
          <el-input
            :value="ingredient.amount"
            placeholder="用量"
            @input="updateField('amount', $event)"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-form-item label="备注">
          <el-input
            :value="ingredient.note"
            placeholder="备注（可选）"
            @input="updateField('note', $event)"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'IngredientForm',
  props: {
    ingredient: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    updateField(field, value) {
      this.$emit('update', {
        ...this.ingredient,
        [field]: value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
@import '../assets/styles/mixins.scss';

.ingredient-form {
  margin-bottom: $spacing-md;
  padding: $spacing-md;
  border: 1px solid #ebeef5;
  border-radius: $border-radius-base;
  background: #fafafa;
  
  @include respond-to(xs) {
    padding: $spacing-sm;
    margin-bottom: $spacing-sm;
  }
  
  .ingredient-header {
    @include flex(row, space-between, center);
    margin-bottom: $spacing-sm;
    
    .ingredient-index {
      font-weight: 600;
      color: $primary-color;
      font-size: $font-size-large;
    }
  }
  
  .ingredient-row {
    @include respond-to(xs) {
      margin-bottom: 0;
      
      .el-col {
        margin-bottom: $spacing-sm;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  
  // 移动端表单标签优化
  :deep(.el-form-item__label) {
    @include respond-to(xs) {
      font-size: $font-size-small;
      line-height: 1.2;
      padding-bottom: 4px;
    }
  }
  
  // 移动端输入框优化
  :deep(.el-input__inner) {
    @include respond-to(xs) {
      height: 40px;
      font-size: $font-size-small;
    }
  }
  
  // 移动端按钮优化
  :deep(.el-button--small) {
    @include respond-to(xs) {
      padding: 8px 12px;
      font-size: $font-size-small;
    }
  }
}
</style> 