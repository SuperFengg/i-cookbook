<template>
  <div class="sass-demo">
    <div class="container">
      <h1 class="demo-title">Sass 功能演示</h1>
      
      <div class="demo-section">
        <h2>变量和嵌套</h2>
        <div class="demo-card">
          <p>这是一个使用Sass变量和嵌套语法的演示卡片</p>
          <button class="demo-btn">点击我</button>
        </div>
      </div>
      
      <div class="demo-section">
        <h2>混入(Mixins)</h2>
        <div class="button-group">
          <button class="btn btn-primary">主要按钮</button>
          <button class="btn btn-success">成功按钮</button>
          <button class="btn btn-warning">警告按钮</button>
          <button class="btn btn-danger">危险按钮</button>
        </div>
      </div>
      
      <div class="demo-section">
        <h2>响应式设计</h2>
        <div class="responsive-grid">
          <div class="grid-item">网格项目 1</div>
          <div class="grid-item">网格项目 2</div>
          <div class="grid-item">网格项目 3</div>
          <div class="grid-item">网格项目 4</div>
        </div>
      </div>
      
      <div class="demo-section">
        <h2>渐变和阴影</h2>
        <div class="gradient-card">
          <h3>渐变背景卡片</h3>
          <p>这个卡片使用了Sass的渐变和阴影效果</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SassDemo',
  data() {
    return {
      message: 'Sass 演示组件'
    }
  }
}
</script>

<style lang="scss" scoped>
// 导入变量和混入
@import '../assets/styles/variables.scss';
@import '../assets/styles/mixins.scss';

.sass-demo {
  padding: $spacing-lg 0;
  
  .demo-title {
    text-align: center;
    color: $primary-color;
    margin-bottom: $spacing-xl;
    font-size: $font-size-h1;
  }
  
  .demo-section {
    margin-bottom: $spacing-xl;
    
    h2 {
      color: $secondary-color;
      border-bottom: 2px solid $primary-color;
      padding-bottom: $spacing-sm;
      margin-bottom: $spacing-lg;
    }
  }
  
  .demo-card {
    @include card();
    @include flex(column, flex-start, center);
    
    p {
      margin-bottom: $spacing-md;
      color: $secondary-color;
    }
    
    .demo-btn {
      @include button($primary-color);
      font-weight: 600;
    }
  }
  
  .button-group {
    @include flex(row, flex-start, center);
    gap: $spacing-md;
    flex-wrap: wrap;
    
    .btn {
      margin-bottom: $spacing-sm;
    }
  }
  
  .responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-md;
    
    .grid-item {
      @include card();
      @include flex(column, center, center);
      min-height: 100px;
      text-align: center;
      font-weight: 600;
      color: $secondary-color;
      
      @include respond-to(xs) {
        grid-template-columns: 1fr;
      }
      
      @include respond-to(sm) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @include respond-to(md) {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  }
  
  .gradient-card {
    @include card();
    @include gradient($primary-color, darken($primary-color, 20%));
    @include shadow(light);
    color: white;
    text-align: center;
    
    h3 {
      color: white;
      margin-bottom: $spacing-md;
    }
    
    p {
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 0;
    }
  }
}
</style> 