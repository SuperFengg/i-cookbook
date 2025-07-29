<template>
  <nav class="navigation">
    <div class="container">
      <div class="nav-left">
        <h1 class="nav-title" @click="$router.push('/recipes')" style="cursor: pointer;">我的食谱</h1>
      </div>
      

      
      <div class="nav-right">
        <el-button round size="small" icon="el-icon-menu" @click="$router.push('/recipes')">
          食谱列表
        </el-button>
        <el-button round size="small" icon="el-icon-plus" type="primary" @click="$router.push('/recipes/add')">
          添加食谱
        </el-button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavigation'
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
@import '../assets/styles/mixins.scss';

.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0; // 移除padding，使用container控制高度
  @include shadow(light);

  .container {
    // 垂直居中并左右拉伸布局
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 60px; // 固定导航栏高度
    width: 100%;
    
    // 移动端布局优化
    @include respond-to(xs) {
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      height: 100px; // 移动端导航栏更高
    }
    
    @include respond-to(sm) {
      flex-direction: row;
      gap: 0;
      padding: 0 2rem;
      height: 60px;
    }
  }
  
  .nav-left {
    display: flex;
    align-items: center;
    flex: 1;
    
    .nav-title {
      color: white;
      margin: 0;
      font-size: $font-size-h1;
      font-weight: 600;
      white-space: nowrap;
      
      @include respond-to(xs) {
        font-size: $font-size-h2;
      }
    }
  }
  

  
  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    @include respond-to(xs) {
      width: 100%;
      justify-content: space-between;
      order: 2;
    }
    
    .el-button {
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.1);
      
      @include respond-to(xs) {
        flex: 1;
        margin: 0 0.25rem;
        font-size: 12px;
        padding: 8px 12px;
      }
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
      }
      
      &.el-button--primary {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        
        &:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }
}
</style> 