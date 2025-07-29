<template>
  <div class="add-recipe">
    <div class="container">
      <div class="page-header">
        <el-button icon="el-icon-arrow-left" @click="$router.go(-1)">
          返回
        </el-button>
        <h1 class="page-title">添加食谱</h1>
      </div>
      
      <el-form
        ref="recipeForm"
        :model="recipeForm"
        :rules="rules"
        :label-width="$isMobile ? '80px' : '100px'"
        class="recipe-form"
      >
        <el-card class="form-card">
          <div slot="header">
            <span>基本信息</span>
          </div>
          
          <el-row :gutter="20" class="form-row">
            <el-col :xs="24" :sm="12">
              <el-form-item label="食谱名称" prop="title">
                <el-input v-model="recipeForm.title" placeholder="请输入食谱名称" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="分类" prop="category">
                <el-select v-model="recipeForm.category" placeholder="选择分类" style="width: 100%">
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
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="recipeForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入食谱描述"
            />
          </el-form-item>
          
          <el-row :gutter="20" class="form-row">
            <el-col :xs="24" :sm="8">
              <el-form-item label="烹饪时间" prop="cookTime">
                <div class="input-with-unit">
                  <el-input-number
                    v-model="recipeForm.cookTime"
                    :min="1"
                    :max="300"
                    style="width: 100%"
                  />
                  <span class="unit">分钟</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="8">
              <el-form-item label="份量" prop="servings">
                <div class="input-with-unit">
                  <el-input-number
                    v-model="recipeForm.servings"
                    :min="1"
                    :max="20"
                    style="width: 100%"
                  />
                  <span class="unit">人份</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="8">
              <el-form-item label="难度" prop="difficulty">
                <el-select v-model="recipeForm.difficulty" placeholder="选择难度" style="width: 100%">
                  <el-option label="简单" value="简单" />
                  <el-option label="中等" value="中等" />
                  <el-option label="困难" value="困难" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="封面图片" prop="image">
            <el-upload
              class="image-upload"
              action="#"
              :show-file-list="false"
              :before-upload="beforeImageUpload"
              :http-request="handleImageUpload"
            >
              <div v-if="recipeForm.image" class="upload-image-container">
                <RecipeImage :src="recipeForm.image" alt="食谱封面" />
              </div>
              <div v-else class="upload-placeholder">
                <i class="el-icon-picture-outline upload-icon"></i>
                <span class="upload-text">点击上传封面图片</span>
              </div>
            </el-upload>
            <div class="upload-tip">
              <i class="el-icon-info"></i>
              建议尺寸：600x400px，支持jpg、png格式，文件大小不超过2MB
            </div>
          </el-form-item>
        </el-card>
        
        <el-card class="form-card">
          <div slot="header">
            <span>食材清单</span>
            <el-button type="text" icon="el-icon-plus" @click="addIngredient">
              添加食材
            </el-button>
          </div>
          
          <div v-for="(ingredient, index) in recipeForm.ingredients" :key="index" class="ingredient-item">
            <div class="ingredient-header">
              <span class="ingredient-index">食材 {{ index + 1 }}</span>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="removeIngredient(index)"
              />
            </div>
            
            <el-row :gutter="20" class="ingredient-row">
              <el-col :xs="24" :sm="8">
                <el-form-item label="食材名称">
                  <el-input
                    v-model="ingredient.name"
                    placeholder="食材名称"
                    @input="validateIngredients"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="6">
                <el-form-item label="用量">
                  <el-input
                    v-model="ingredient.amount"
                    placeholder="用量"
                    @input="validateIngredients"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8">
                <el-form-item label="备注">
                  <el-input
                    v-model="ingredient.note"
                    placeholder="备注（可选）"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          
          <div v-if="recipeForm.ingredients.length === 0" class="empty-ingredients">
            <el-empty description="暂无食材，点击添加食材开始">
              <el-button type="primary" @click="addIngredient">添加食材</el-button>
            </el-empty>
          </div>
        </el-card>
        
        <el-card class="form-card">
          <div slot="header">
            <span>烹饪步骤</span>
            <el-button type="text" icon="el-icon-plus" @click="addStep">
              添加步骤
            </el-button>
          </div>
          
          <div v-for="(step, index) in recipeForm.steps" :key="index" class="step-item">
            <div class="step-header">
              <span class="step-number">步骤 {{ index + 1 }}</span>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="removeStep(index)"
              />
            </div>
            
            <el-form-item :label="`步骤${index + 1}描述`" :prop="`steps.${index}.description`">
              <el-input
                v-model="step.description"
                type="textarea"
                :rows="3"
                placeholder="请输入步骤描述"
              />
            </el-form-item>
            
            <el-form-item :label="`步骤${index + 1}小贴士`">
              <el-input
                v-model="step.tips"
                placeholder="请输入小贴士（可选）"
              />
            </el-form-item>
          </div>
          
          <div v-if="recipeForm.steps.length === 0" class="empty-steps">
            <el-empty description="暂无步骤，点击添加步骤开始">
              <el-button type="primary" @click="addStep">添加步骤</el-button>
            </el-empty>
          </div>
        </el-card>
        
        <el-card class="form-card">
          <div slot="header">
            <span>烹饪小贴士</span>
          </div>
          
          <el-form-item label="小贴士">
            <el-input
              v-model="recipeForm.tipsText"
              type="textarea"
              :rows="4"
              placeholder="请输入烹饪小贴士，每行一个"
            />
          </el-form-item>
        </el-card>
        
        <div class="form-actions">
          <el-button @click="$router.go(-1)">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            保存食谱
          </el-button>
        </div>
      </el-form>
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
  name: 'AddRecipe',
  computed: {
    $isMobile() {
      return window.innerWidth <= 768;
    }
  },
  data() {
    return {
      submitting: false,
      recipeForm: {
        title: '',
        description: '',
        category: '',
        cookTime: 30,
        servings: 2,
        difficulty: '中等',
        image: '',
        ingredients: [],
        steps: [],
        tipsText: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入食谱名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入食谱描述', trigger: 'blur' }
        ],
        cookTime: [
          { required: true, message: '请输入烹饪时间', trigger: 'blur' }
        ],
        servings: [
          { required: true, message: '请输入份量', trigger: 'blur' }
        ],
        difficulty: [
          { required: true, message: '请选择难度', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    addIngredient() {
      this.recipeForm.ingredients.push({
        name: '',
        amount: '',
        note: ''
      })
    },
    removeIngredient(index) {
      this.recipeForm.ingredients.splice(index, 1)
    },
    addStep() {
      this.recipeForm.steps.push({
        description: '',
        tips: ''
      })
    },
    removeStep(index) {
      this.recipeForm.steps.splice(index, 1)
    },
    beforeImageUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return false
      }
      return true
    },
    async handleImageUpload(options) {
      try {
        // 显示压缩提示
        this.$message.info('正在压缩图片...')
        
        // 使用图片压缩工具
        const imageCompressor = await import('../utils/imageCompressor.js')
        const compressedImage = await imageCompressor.default.compressImage(options.file, {
          maxWidth: 800,
          maxHeight: 600,
          quality: 0.7,
          format: 'jpeg'
        })
        
        this.recipeForm.image = compressedImage
        
        // 显示压缩结果
        const originalSize = imageCompressor.default.getFileSize(options.file)
        const compressedSize = imageCompressor.default.getBase64Size(compressedImage)
        this.$message.success(`图片压缩完成！原始大小: ${originalSize}KB，压缩后: ${compressedSize}KB`)
        
      } catch (error) {
        console.error('图片压缩失败:', error)
        // 如果压缩失败，使用原始方法
        const reader = new FileReader()
        reader.onload = (e) => {
          this.recipeForm.image = e.target.result
        }
        reader.readAsDataURL(options.file)
        this.$message.warning('图片压缩失败，使用原始图片')
      }
    },
    validateIngredients() {
      // 验证食材是否填写完整
      const validIngredients = this.recipeForm.ingredients.filter(item => 
        item.name.trim() && item.amount.trim()
      )
      return validIngredients.length > 0
    },
    async submitForm() {
      this.$refs.recipeForm.validate(async (valid) => {
        if (valid) {
          if (!this.validateIngredients()) {
            this.$message.error('请至少添加一个食材')
            return
          }
          if (this.recipeForm.steps.length === 0) {
            this.$message.error('请至少添加一个烹饪步骤')
            return
          }
          
          this.submitting = true
          
          // 处理小贴士
          const tips = this.recipeForm.tipsText
            .split('\n')
            .filter(tip => tip.trim())
          
          const recipeData = {
            ...this.recipeForm,
            tips,
            ingredients: this.recipeForm.ingredients.filter(item => 
              item.name.trim() && item.amount.trim()
            )
          }
          
          try {
            const savedRecipe = await storageAdapter.addRecipe(recipeData)
            if (savedRecipe) {
              this.$message.success('食谱保存成功！')
              this.$router.push(`/recipes/${savedRecipe.id}`)
            } else {
              this.$message.error('保存失败，请重试')
            }
          } catch (error) {
            console.error('保存食谱失败:', error)
            this.$message.error('保存失败，请重试')
          } finally {
            this.submitting = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
@import '../assets/styles/mixins.scss';

.add-recipe {
  padding: $spacing-md 0;
  
  @include respond-to(xs) {
    padding: $spacing-sm 0;
  }
  
      .page-header {
      @include flex(row, flex-start, center);
      gap: $spacing-md;
      margin-bottom: $spacing-md;
    
    @include respond-to(xs) {
      flex-direction: row;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-md;
      padding: 0 $spacing-sm;
    }
    
    .page-title {
      margin: 0;
      color: $secondary-color;
      
      @include respond-to(xs) {
        font-size: $font-size-h2;
        margin-left: $spacing-sm;
      }
    }
  }
  
  .recipe-form {
    @include respond-to(xs) {
      padding: 0 $spacing-sm;
    }
    
    .form-card {
      margin-bottom: $spacing-lg;
      
      @include respond-to(xs) {
        margin-bottom: $spacing-md;
      }
      
      .el-card__header {
        @include flex(row, space-between, center);
        
        @include respond-to(xs) {
          flex-direction: row;
          align-items: center;
          gap: $spacing-sm;
          padding: $spacing-sm $spacing-md;
        }
      }
      
      .el-card__body {
        @include respond-to(xs) {
          padding: $spacing-sm;
        }
      }
    }
    
    .input-with-unit {
      @include flex(row, flex-start, center);
      gap: $spacing-xs;
      
      .el-input-number {
        flex: 1;
      }
      
      .unit {
        color: #666;
        font-size: $font-size-small;
        white-space: nowrap;
        min-width: 40px;
      }
    }
    
    .image-upload {
      @include respond-to(xs) {
        margin-bottom: $spacing-sm;
      }
      
      .upload-image-container {
        width: 200px;
        height: 133px;
        border-radius: $border-radius-base;
        overflow: hidden;
        
        @include respond-to(xs) {
          width: 100%;
          height: 120px;
        }
        
        .upload-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      }
      
      .upload-placeholder {
        @include flex(column, center, center);
        width: 200px;
        height: 133px;
        border: 2px dashed #d9d9d9;
        border-radius: $border-radius-base;
        background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
        transition: all 0.3s ease;
        position: relative;
        
        @include respond-to(xs) {
          width: 100%;
          height: 120px;
        }
        
        &:hover {
          border-color: $primary-color;
          background: linear-gradient(135deg, #f0f9ff 0%, #e3f2fd 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        &:active {
          transform: translateY(0);
        }
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0KDQ1KSI+CiAgICAgIDxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2YwZjBmMCIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+Cjwvc3ZnPgo=');
          opacity: 0.05;
          border-radius: $border-radius-base;
        }
        
        .upload-icon {
          font-size: 32px;
          color: #8c939d;
          margin-bottom: $spacing-sm;
          position: relative;
          z-index: 1;
          
          @include respond-to(xs) {
            font-size: 28px;
            margin-bottom: $spacing-xs;
          }
        }
        
        .upload-text {
          font-size: $font-size-base;
          color: #8c939d;
          font-weight: 500;
          position: relative;
          z-index: 1;
          
          @include respond-to(xs) {
            font-size: $font-size-small;
          }
        }
      }
      
      .upload-tip {
        @include flex(row, flex-start, center);
        gap: $spacing-xs;
        font-size: $font-size-small;
        color: #666;
        margin-top: $spacing-sm;
        padding: $spacing-xs $spacing-sm;
        background-color: #f8f9fa;
        border-radius: $border-radius-base;
        border-left: 3px solid $primary-color;
        
        @include respond-to(xs) {
          margin-top: $spacing-xs;
          padding: $spacing-xs;
          font-size: 12px;
        }
        
        i {
          color: $primary-color;
          font-size: 14px;
          
          @include respond-to(xs) {
            font-size: 12px;
          }
        }
      }
    }
    
    .ingredient-item {
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
    }
    
    .step-item {
      margin-bottom: $spacing-lg;
      padding: $spacing-md;
      border: 1px solid #ebeef5;
      border-radius: $border-radius-base;
      background: #fafafa;
      
      @include respond-to(xs) {
        padding: $spacing-sm;
        margin-bottom: $spacing-md;
      }
      
      .step-header {
        @include flex(row, space-between, center);
        margin-bottom: $spacing-md;
        
        @include respond-to(xs) {
          margin-bottom: $spacing-sm;
        }
        
        .step-number {
          font-weight: 600;
          color: $primary-color;
          font-size: $font-size-large;
        }
      }
    }
    
    .empty-ingredients,
    .empty-steps {
      text-align: center;
      padding: $spacing-lg 0;
      
      @include respond-to(xs) {
        padding: $spacing-md 0;
      }
    }
    
    .form-actions {
      @include flex(row, center, center);
      gap: $spacing-md;
      margin-top: $spacing-xl;
      padding-top: $spacing-lg;
      border-top: 1px solid #ebeef5;
      
      @include respond-to(xs) {
        flex-direction: row;
        gap: $spacing-sm;
        margin-top: $spacing-lg;
        padding-top: $spacing-md;
        padding: $spacing-md $spacing-sm;
        position: sticky;
        bottom: 0;
        background: white;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
        z-index: 100;
        
        .el-button {
          flex: 1;
          height: 44px;
          font-size: 16px;
        }
      }
    }
  }
}
</style> 