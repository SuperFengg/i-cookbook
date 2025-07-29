<template>
  <div id="app">
    <AppNavigation />
    
    <main class="app-main">
      <router-view/>
    </main>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import SassDemo from './components/SassDemo.vue'
import AppNavigation from './components/Navigation.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    // SassDemo,
    AppNavigation
  }
}
</script>

<style lang="scss" scoped>
// 导入变量和混入
@import './assets/styles/variables.scss';
@import './assets/styles/mixins.scss';

#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.app-main {
  padding: $spacing-md 0;
  margin-top: 80px; // 为固定导航栏留出空间
  
  @include respond-to(xs) {
    margin-top: 120px; // 移动端导航栏更高，需要更多空间
    padding: $spacing-sm 0;
  }
}
</style>
