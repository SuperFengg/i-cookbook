<template>
  <div class="recipe-list">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">食谱列表</h1>
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/recipes/add')">
          添加食谱
        </el-button>
      </div>
      
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索食谱..."
          prefix-icon="el-icon-search"
          clearable
          @input="handleSearch"
        />
        <el-select v-model="categoryFilter" placeholder="选择分类" clearable>
          <el-option label="全部" value="" />
          <el-option-group label="家常菜系">
            <el-option label="家常菜" value="家常菜" />
            <el-option label="快手菜" value="快手菜" />
            <el-option label="下饭菜" value="下饭菜" />
          </el-option-group>
          <el-option-group label="八大菜系">
            <el-option label="川菜" value="川菜" />
            <el-option label="粤菜" value="粤菜" />
            <el-option label="苏菜" value="苏菜" />
            <el-option label="浙菜" value="浙菜" />
            <el-option label="闽菜" value="闽菜" />
            <el-option label="湘菜" value="湘菜" />
            <el-option label="鲁菜" value="鲁菜" />
            <el-option label="徽菜" value="徽菜" />
          </el-option-group>
          <el-option-group label="其他菜系">
            <el-option label="东北菜" value="东北菜" />
            <el-option label="西北菜" value="西北菜" />
            <el-option label="新疆菜" value="新疆菜" />
            <el-option label="云南菜" value="云南菜" />
            <el-option label="贵州菜" value="贵州菜" />
            <el-option label="广西菜" value="广西菜" />
            <el-option label="海南菜" value="海南菜" />
            <el-option label="台湾菜" value="台湾菜" />
          </el-option-group>
          <el-option-group label="特色美食">
            <el-option label="火锅" value="火锅" />
            <el-option label="烧烤" value="烧烤" />
            <el-option label="汤品" value="汤品" />
            <el-option label="凉菜" value="凉菜" />
            <el-option label="主食" value="主食" />
            <el-option label="甜点" value="甜点" />
            <el-option label="饮品" value="饮品" />
          </el-option-group>
        </el-select>
      </div>
      
      <div class="recipe-grid">
        <el-card
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          class="recipe-card"
          shadow="hover"
          @click.native="viewRecipe(recipe.id)"
        >
          <div class="recipe-image">
            <RecipeImage :src="recipe.image" :alt="recipe.title" placeholder-text="暂无封面" />
          </div>
          <div class="recipe-content">
            <h3 class="recipe-title">{{ recipe.title }}</h3>
            <p class="recipe-description">{{ recipe.description }}</p>
            <div class="recipe-meta">
              <el-tag size="small" :type="getCategoryType(recipe.category)">
                {{ recipe.category }}
              </el-tag>
              <span class="cook-time">
                <i class="el-icon-time"></i>
                {{ recipe.cookTime }}分钟
              </span>
            </div>
            <div class="recipe-actions">
              <el-button size="mini" type="text" @click.stop="editRecipe(recipe.id)">
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button size="mini" type="text" @click.stop="deleteRecipe(recipe.id)">
                <i class="el-icon-delete"></i>
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
      
      <div v-if="filteredRecipes.length === 0" class="empty-state">
        <i class="el-icon-document"></i>
        <p>暂无食谱，点击"添加食谱"开始创建吧！</p>
      </div>
    </div>
  </div>
</template>

<script>
import storageAdapter from '../utils/storageAdapter.js'
import RecipeImage from '../components/RecipeImage.vue'

export default {
  components: {
    RecipeImage
  },
  name: 'RecipeList',
  data() {
    return {
      searchQuery: '',
      categoryFilter: '',
      recipes: [],
      loading: false
    }
  },
  created() {
    this.loadRecipes()
    this.handleSearchFromUrl()
  },
  computed: {
    filteredRecipes() {
      let filtered = this.recipes
      
      if (this.searchQuery) {
        filtered = filtered.filter(recipe => 
          recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      if (this.categoryFilter) {
        filtered = filtered.filter(recipe => recipe.category === this.categoryFilter)
      }
      
      return filtered
    }
  },
  methods: {
    async loadRecipes() {
      this.loading = true
      try {
        // 自动选择最佳存储方式
        await storageAdapter.autoSelectStorage()
        this.recipes = await storageAdapter.getAllRecipes()
        // 如果没有数据，添加一些示例数据
        if (this.recipes.length === 0) {
          await this.addSampleData()
        }
      } catch (error) {
        console.error('加载食谱失败:', error)
        this.$message.error('加载食谱失败')
      } finally {
        this.loading = false
      }
    },

    handleSearchFromUrl() {
      const searchQuery = this.$route.query.search
      if (searchQuery) {
        this.searchQuery = searchQuery
      }
    },

    async addSampleData() {
      const sampleRecipes = [
        {
          title: '红烧肉',
          description: '经典的家常菜，肥而不腻，入口即化',
          category: '家常菜',
          cookTime: 60,
          servings: 4,
          difficulty: '中等',
          image: '',
          ingredients: [
            { name: '五花肉', amount: '500g', note: '选择肥瘦相间的五花肉' },
            { name: '生抽', amount: '2勺', note: '调味用' },
            { name: '老抽', amount: '1勺', note: '上色用' }
          ],
          steps: [
            { description: '五花肉切块，焯水去腥', tips: '焯水时加入姜片和料酒' },
            { description: '锅中放油，放入冰糖炒糖色', tips: '注意火候，避免糖色过深' },
            { description: '放入肉块翻炒上色', tips: '翻炒均匀，让每块肉都上色' }
          ],
          tips: ['选择肥瘦相间的五花肉', '焯水时加入姜片去腥', '炒糖色时注意火候']
        },
        {
          title: '麻婆豆腐',
          description: '川菜经典，麻辣鲜香，下饭神器',
          category: '川菜',
          cookTime: 30,
          servings: 2,
          difficulty: '简单',
          image: '',
          ingredients: [
            { name: '豆腐', amount: '400g', note: '选择嫩豆腐' },
            { name: '猪肉末', amount: '200g', note: '选择瘦肉末' },
            { name: '豆瓣酱', amount: '2勺', note: '川菜必备调料' }
          ],
          steps: [
            { description: '豆腐切块，猪肉末腌制', tips: '豆腐切块大小适中' },
            { description: '锅中放油，爆香豆瓣酱', tips: '小火慢炒，避免糊锅' },
            { description: '放入肉末翻炒', tips: '肉末炒至变色即可' }
          ],
          tips: ['选择嫩豆腐口感更好', '豆瓣酱要小火慢炒', '最后撒上葱花提香']
        }
      ]

      for (const recipe of sampleRecipes) {
        await storageAdapter.addRecipe(recipe)
      }

      this.recipes = await storageAdapter.getAllRecipes()
    },

    handleSearch() {
      // 搜索逻辑已在computed中处理
    },

    viewRecipe(id) {
      this.$router.push(`/recipes/${id}`)
    },

    editRecipe(id) {
      this.$router.push(`/recipes/${id}/edit`)
    },

    async deleteRecipe(id) {
      this.$confirm('确定要删除这个食谱吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (await storageAdapter.deleteRecipe(id)) {
          this.recipes = await storageAdapter.getAllRecipes()
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {
        // 取消删除
      })
    },

    getCategoryType(category) {
      const types = {
        // 家常菜系
        '家常菜': 'primary',
        '快手菜': 'primary',
        '下饭菜': 'primary',
        // 八大菜系
        '川菜': 'danger',
        '粤菜': 'success',
        '苏菜': 'warning',
        '浙菜': 'warning',
        '闽菜': 'info',
        '湘菜': 'danger',
        '鲁菜': 'primary',
        '徽菜': 'success',
        // 其他菜系
        '东北菜': 'primary',
        '西北菜': 'warning',
        '新疆菜': 'danger',
        '云南菜': 'success',
        '贵州菜': 'danger',
        '广西菜': 'success',
        '海南菜': 'info',
        '台湾菜': 'primary',
        // 特色美食
        '火锅': 'danger',
        '烧烤': 'warning',
        '汤品': 'info',
        '凉菜': 'success',
        '主食': 'primary',
        '甜点': 'warning',
        '饮品': 'info'
      }
      return types[category] || 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
@import '../assets/styles/mixins.scss';

.recipe-list {
  padding: $spacing-md 0;
  
      .page-header {
      @include flex(row, space-between, center);
      margin-bottom: $spacing-md;
    
    @include respond-to(xs) {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-sm;
    }
    
    .page-title {
      margin: 0;
      color: $secondary-color;
      
      @include respond-to(xs) {
        font-size: $font-size-h2;
      }
    }
  }
  
  .search-bar {
    @include flex(row, flex-start, center);
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    
    @include respond-to(xs) {
      flex-direction: column;
      gap: $spacing-sm;
      align-items: stretch;
    }
    
    .el-input {
      max-width: 300px;
      
      @include respond-to(xs) {
        max-width: 100%;
      }
    }
    
    .el-select {
      width: 150px;
      
      @include respond-to(xs) {
        width: 100%;
      }
    }
  }
  
  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: $spacing-lg;
    
    @include respond-to(xs) {
      grid-template-columns: 1fr;
      gap: $spacing-sm;
    }
    
    .recipe-card {
      cursor: pointer;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      @include respond-to(xs) {
        &:hover {
          transform: none;
        }
      }
      
      .recipe-image {
        height: 200px;
        overflow: hidden;
        border-radius: $border-radius-base;
        
        @include respond-to(xs) {
          height: 150px;
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .recipe-content {
        padding: $spacing-md 0;
        
        @include respond-to(xs) {
          padding: $spacing-sm 0;
        }
        
        .recipe-title {
          margin: 0 0 $spacing-sm 0;
          font-size: $font-size-h3;
          color: $secondary-color;
          
          @include respond-to(xs) {
            font-size: $font-size-large;
            margin-bottom: $spacing-xs;
          }
        }
        
        .recipe-description {
          color: #666;
          margin-bottom: $spacing-md;
          @include text-ellipsis(2);
          
          @include respond-to(xs) {
            margin-bottom: $spacing-sm;
            @include text-ellipsis(1);
          }
        }
        
        .recipe-meta {
          @include flex(row, space-between, center);
          margin-bottom: $spacing-sm;
          
          @include respond-to(xs) {
            flex-direction: column;
            align-items: flex-start;
            gap: $spacing-xs;
          }
          
          .cook-time {
            color: #999;
            font-size: $font-size-small;
            
            i {
              margin-right: 4px;
            }
          }
        }
        
        .recipe-actions {
          @include flex(row, flex-end, center);
          gap: $spacing-xs;
          
          @include respond-to(xs) {
            justify-content: flex-start;
            margin-top: $spacing-xs;
          }
          
          .el-button {
            color: #999;
            
            &:hover {
              color: $primary-color;
            }
          }
        }
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: $spacing-xl 0;
    color: #999;
    
    i {
      font-size: 48px;
      margin-bottom: $spacing-md;
    }
    
    p {
      margin: 0;
      font-size: $font-size-large;
    }
  }
}
</style> 