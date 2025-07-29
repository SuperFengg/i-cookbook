<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
// 使用Sass变量
$primary-color: #42b983;
$secondary-color: #35495e;
$font-size-large: 24px;
$font-size-medium: 16px;

// 使用嵌套语法
.hello {
  h1 {
    color: $primary-color;
    font-size: $font-size-large;
    margin-bottom: 20px;
  }

  h3 {
    margin: 40px 0 0;
    color: $secondary-color;
    
    // 使用&符号引用父选择器
    &:hover {
      color: $primary-color;
    }
  }

  ul {
    list-style-type: none;
    padding: 0;
    
    li {
      display: inline-block;
      margin: 0 10px;
      
      a {
        color: $primary-color;
        text-decoration: none;
        transition: color 0.3s ease;
        
        &:hover {
          color: darken($primary-color, 10%);
        }
      }
    }
  }

  // 使用@mixin
  @mixin button-style {
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .demo-button {
    @include button-style;
    background-color: $primary-color;
    color: white;
    
    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
}
</style>
