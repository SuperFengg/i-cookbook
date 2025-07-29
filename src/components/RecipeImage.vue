<template>
  <div class="recipe-image" :class="{ 'has-image': hasImage }">
    <img 
      v-if="hasImage" 
      :src="imageSrc" 
      :alt="alt"
      @error="handleImageError"
      @load="handleImageLoad"
    >
    <div 
      v-else 
      class="image-placeholder"
      :class="{ 'clickable': clickable }"
      @click="handlePlaceholderClick"
    >
      <div class="placeholder-content">
        <i class="el-icon-picture-outline"></i>
        <span class="placeholder-text">{{ placeholderText }}</span>
        <span v-if="clickable" class="placeholder-hint">点击添加</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeImage',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: '食谱图片'
    },
    placeholderText: {
      type: String,
      default: '暂无图片'
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageError: false
    }
  },
  computed: {
    hasImage() {
      return this.src && this.src.trim() && !this.imageError
    },
    imageSrc() {
      return this.src
    }
  },
  methods: {
    handleImageError() {
      this.imageError = true
      this.$emit('error')
    },
    handleImageLoad() {
      this.imageError = false
      this.$emit('load')
    },
    handlePlaceholderClick() {
      if (this.clickable) {
        this.$emit('placeholder-click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
@import '../assets/styles/mixins.scss';

.recipe-image {
  width: 100%;
  height: 100%;
  border-radius: $border-radius-base;
  overflow: hidden;
  background-color: #f5f5f5;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .image-placeholder {
    @include flex(column, center, center);
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    color: #8c939d;
    position: relative;
    transition: all 0.3s ease;
    
    &.clickable {
      cursor: pointer;
      
      &:hover {
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0KDQ1KSI+CiAgICAgIDxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2YwZjBmMCIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+Cjwvc3ZnPgo=');
      opacity: 0.1;
    }
    
    .placeholder-content {
      @include flex(column, center, center);
      position: relative;
      z-index: 1;
    }
    
    i {
      font-size: 64px;
      margin-bottom: $spacing-md;
      opacity: 0.4;
      
      @include respond-to(xs) {
        font-size: 48px;
        margin-bottom: $spacing-sm;
      }
    }
    
    .placeholder-text {
      font-size: $font-size-base;
      opacity: 0.7;
      text-align: center;
      font-weight: 500;
      margin-bottom: $spacing-xs;
      
      @include respond-to(xs) {
        font-size: $font-size-small;
      }
    }
    
    .placeholder-hint {
      font-size: $font-size-small;
      opacity: 0.5;
      text-align: center;
      font-weight: 400;
      
      @include respond-to(xs) {
        font-size: 11px;
      }
    }
  }
  
  &.has-image {
    background-color: transparent;
  }
}
</style> 