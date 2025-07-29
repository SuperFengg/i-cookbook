<template>
  <div class="recipe-detail">
    <div class="container">
      <div v-if="recipe" class="recipe-content">
        <div class="recipe-header">
          <el-button icon="el-icon-arrow-left" @click="$router.go(-1)">
            返回
          </el-button>
          <div class="recipe-actions">
            <el-button type="primary" icon="el-icon-edit" @click="editRecipe">
              编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRecipe">
              删除
            </el-button>
          </div>
        </div>
        
        <div class="recipe-main">
          <div class="recipe-image">
            <RecipeImage 
              :src="recipe.image" 
              :alt="recipe.title" 
              placeholder-text="点击编辑添加封面图片" 
              :clickable="true"
              @placeholder-click="editRecipe"
            />
          </div>
          
          <div class="recipe-info">
            <h1 class="recipe-title">{{ recipe.title }}</h1>
            <p class="recipe-description">{{ recipe.description }}</p>
            
            <div class="recipe-meta">
              <el-tag size="medium" :type="getCategoryType(recipe.category)">
                {{ recipe.category }}
              </el-tag>
              <div class="meta-item">
                <i class="el-icon-time"></i>
                <span>烹饪时间：{{ recipe.cookTime }}分钟</span>
              </div>
              <div class="meta-item">
                <i class="el-icon-user"></i>
                <span>份量：{{ recipe.servings }}人份</span>
              </div>
              <div class="meta-item">
                <i class="el-icon-star-on"></i>
                <span>难度：{{ recipe.difficulty }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="recipe-sections">
          <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane label="食材" name="ingredients">
              <div class="ingredients-list">
                <h3>食材清单</h3>
                <MobileTable 
                  :data="recipe.ingredients"
                  :columns="ingredientColumns"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="步骤" name="steps">
              <div class="steps-list">
                <h3>烹饪步骤</h3>
                <el-timeline>
                  <el-timeline-item
                    v-for="(step, index) in recipe.steps"
                    :key="index"
                    :timestamp="`步骤 ${index + 1}`"
                    placement="top"
                  >
                    <div class="step-content">
                      <p class="step-text">{{ step.description }}</p>
                      <div v-if="step.image" class="step-image">
                        <RecipeImage :src="step.image" :alt="`步骤${index + 1}`" placeholder-text="步骤图片" />
                      </div>
                      <div v-if="step.tips" class="step-tips">
                        <i class="el-icon-info"></i>
                        <span>{{ step.tips }}</span>
                      </div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="小贴士" name="tips">
              <div class="tips-content">
                <h3>烹饪小贴士</h3>
                <ul class="tips-list">
                  <li v-for="(tip, index) in recipe.tips" :key="index">
                    {{ tip }}
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      
      <div v-else class="loading-state">
        <el-empty description="食谱不存在或已删除">
          <el-button type="primary" @click="$router.push('/recipes')">
            返回列表
          </el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import MobileTable from '../components/MobileTable.vue'
import RecipeImage from '../components/RecipeImage.vue'
import storageAdapter from '../utils/storageAdapter.js'

export default {
  name: 'RecipeDetail',
  components: {
    MobileTable,
    RecipeImage
  },
  data() {
    return {
      activeTab: 'ingredients',
      recipe: null,
      loading: false,
      ingredientColumns: [
        { prop: 'name', label: '食材名称', width: 200 },
        { prop: 'amount', label: '用量', width: 150 },
        { prop: 'note', label: '备注' }
      ]
    }
  },
  created() {
    this.loadRecipe()
  },
  methods: {
    async loadRecipe() {
      this.loading = true
      const recipeId = this.$route.params.id
      
      try {
        const recipe = await storageAdapter.getRecipeById(recipeId)
        if (recipe) {
          this.recipe = recipe
        } else {
          this.$message.error('食谱不存在')
          this.$router.push('/recipes')
        }
      } catch (error) {
        console.error('加载食谱失败:', error)
        this.$message.error('加载食谱失败')
        this.$router.push('/recipes')
      } finally {
        this.loading = false
      }
    },

    editRecipe() {
      this.$router.push(`/recipes/${this.recipe.id}/edit`)
    },

    async deleteRecipe() {
      this.$confirm('确定要删除这个食谱吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (await storageAdapter.deleteRecipe(this.recipe.id)) {
          this.$message.success('删除成功')
          this.$router.push('/recipes')
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {
        // 取消删除
      })
    },

    getCategoryType(category) {
      const types = {
        '家常菜': 'primary',
        '川菜': 'danger',
        '粤菜': 'success',
        '甜点': 'warning'
      }
      return types[category] || 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
@import '../assets/styles/mixins.scss';

.recipe-detail {
  padding: $spacing-md 0;
  
      .recipe-header {
      @include flex(row, space-between, center);
      margin-bottom: $spacing-md;
    
    @include respond-to(xs) {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-sm;
    }
  }
  
  .recipe-main {
    @include flex(row, flex-start, flex-start);
    gap: $spacing-xl;
    margin-bottom: $spacing-xl;
    
    @include respond-to(xs) {
      flex-direction: column;
      gap: $spacing-md;
    }
    
    .recipe-image {
      flex: 0 0 400px;
      height: 300px;
      
      @include respond-to(xs) {
        flex: none;
        width: 100%;
        height: 200px;
      }
    }
    
    .recipe-info {
      flex: 1;
      
      .recipe-title {
        margin: 0 0 $spacing-md 0;
        color: $secondary-color;
        font-size: $font-size-h1;
        
        @include respond-to(xs) {
          font-size: $font-size-h2;
          margin-bottom: $spacing-sm;
        }
      }
      
      .recipe-description {
        color: #666;
        line-height: 1.6;
        margin-bottom: $spacing-lg;
        
        @include respond-to(xs) {
          margin-bottom: $spacing-md;
        }
      }
      
      .recipe-meta {
        @include flex(column, flex-start, flex-start);
        gap: $spacing-sm;
        
        .meta-item {
          @include flex(row, flex-start, center);
          gap: $spacing-xs;
          color: #666;
          
          i {
            color: $primary-color;
          }
        }
      }
    }
  }
  
  .recipe-sections {
    .ingredients-list,
    .steps-list,
    .tips-content {
      h3 {
        margin-bottom: $spacing-lg;
        color: $secondary-color;
      }
    }
    
    .ingredients-list {
      // 使用MobileTable组件，无需额外样式
    }
    
    .step-content {
      .step-text {
        margin-bottom: $spacing-sm;
        line-height: 1.6;
      }
      
      .step-image {
        margin: $spacing-sm 0;
        
        img {
          max-width: 100%;
          border-radius: $border-radius-base;
        }
      }
      
      .step-tips {
        @include flex(row, flex-start, center);
        gap: $spacing-xs;
        color: $warning-color;
        font-size: $font-size-small;
        margin-top: $spacing-sm;
        
        i {
          font-size: 14px;
        }
      }
    }
    
    .tips-list {
      li {
        margin-bottom: $spacing-sm;
        line-height: 1.6;
        color: #666;
      }
    }
  }
  
  .loading-state {
    text-align: center;
    padding: $spacing-xl 0;
  }
}
</style> 