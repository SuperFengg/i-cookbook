// 本地存储工具类
import imageCompressor from './imageCompressor.js'

const STORAGE_KEY = 'recipe_data'
const IMAGE_STORAGE_KEY = 'recipe_images'
const MAX_IMAGE_SIZE_KB = 500 // 最大图片大小限制

export default {
  // 获取所有食谱数据
  getAllRecipes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('获取食谱数据失败:', error)
      return []
    }
  },

  // 保存所有食谱数据
  saveAllRecipes(recipes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
      return true
    } catch (error) {
      console.error('保存食谱数据失败:', error)
      return false
    }
  },

  // 添加新食谱
  async addRecipe(recipe) {
    try {
      const recipes = this.getAllRecipes()
      
      // 处理图片压缩
      if (recipe.image && recipe.image.startsWith('data:image')) {
        recipe.image = await this.optimizeImage(recipe.image)
      }
      
      const newRecipe = {
        ...recipe,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      recipes.push(newRecipe)
      this.saveAllRecipes(recipes)
      return newRecipe
    } catch (error) {
      console.error('添加食谱失败:', error)
      return null
    }
  },

  // 更新食谱
  async updateRecipe(recipeId, updatedRecipe) {
    try {
      const recipes = this.getAllRecipes()
      const index = recipes.findIndex(recipe => recipe.id === recipeId)
      
      if (index !== -1) {
        // 处理图片压缩
        if (updatedRecipe.image && updatedRecipe.image.startsWith('data:image')) {
          updatedRecipe.image = await this.optimizeImage(updatedRecipe.image)
        }
        
        recipes[index] = {
          ...recipes[index],
          ...updatedRecipe,
          id: recipeId,
          updatedAt: new Date().toISOString()
        }
        this.saveAllRecipes(recipes)
        return recipes[index]
      }
      return null
    } catch (error) {
      console.error('更新食谱失败:', error)
      return null
    }
  },

  // 删除食谱
  deleteRecipe(recipeId) {
    try {
      const recipes = this.getAllRecipes()
      const filteredRecipes = recipes.filter(recipe => recipe.id !== recipeId)
      this.saveAllRecipes(filteredRecipes)
      
      // 清理相关图片数据
      this.cleanupRecipeImages(recipeId)
      
      return true
    } catch (error) {
      console.error('删除食谱失败:', error)
      return false
    }
  },

  // 根据ID获取食谱
  getRecipeById(recipeId) {
    try {
      const recipes = this.getAllRecipes()
      return recipes.find(recipe => recipe.id === recipeId) || null
    } catch (error) {
      console.error('获取食谱详情失败:', error)
      return null
    }
  },

  // 搜索食谱
  searchRecipes(keyword, category = '') {
    try {
      const recipes = this.getAllRecipes()
      return recipes.filter(recipe => {
        const matchKeyword = !keyword || 
          recipe.title.toLowerCase().includes(keyword.toLowerCase()) ||
          recipe.description.toLowerCase().includes(keyword.toLowerCase())
        
        const matchCategory = !category || recipe.category === category
        
        return matchKeyword && matchCategory
      })
    } catch (error) {
      console.error('搜索食谱失败:', error)
      return []
    }
  },

  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },

  // 清空所有数据
  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(IMAGE_STORAGE_KEY)
      return true
    } catch (error) {
      console.error('清空数据失败:', error)
      return false
    }
  },

  // 获取数据统计
  getStats() {
    try {
      const recipes = this.getAllRecipes()
      const totalSize = this.getStorageSize()
      
      return {
        total: recipes.length,
        categories: [...new Set(recipes.map(recipe => recipe.category))],
        recent: recipes
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5),
        storageSize: totalSize,
        imageCount: this.getImageCount()
      }
    } catch (error) {
      console.error('获取统计信息失败:', error)
      return { total: 0, categories: [], recent: [], storageSize: 0, imageCount: 0 }
    }
  },

  // 优化图片存储
  async optimizeImage(imageData) {
    try {
      // 如果图片已经是优化过的，直接返回
      if (imageData.includes('image/jpeg') && !imageCompressor.isImageTooLarge(imageData)) {
        return imageData
      }

      // 将Base64转换为File对象
      const response = await fetch(imageData)
      const blob = await response.blob()
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })

      // 压缩图片
      const compressedImage = await imageCompressor.compressImage(file, {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.7,
        format: 'jpeg'
      })

      // 检查压缩后的大小
      if (imageCompressor.isImageTooLarge(compressedImage, MAX_IMAGE_SIZE_KB)) {
        // 进一步压缩
        const furtherCompressed = await imageCompressor.compressImage(file, {
          maxWidth: 600,
          maxHeight: 450,
          quality: 0.5,
          format: 'jpeg'
        })
        return furtherCompressed
      }

      return compressedImage
    } catch (error) {
      console.error('图片优化失败:', error)
      return imageData // 如果优化失败，返回原图
    }
  },

  // 获取存储大小（KB）
  getStorageSize() {
    try {
      const recipesData = localStorage.getItem(STORAGE_KEY) || ''
      const imagesData = localStorage.getItem(IMAGE_STORAGE_KEY) || ''
      const totalSize = (recipesData.length + imagesData.length) * 0.75 / 1024
      return totalSize.toFixed(2)
    } catch (error) {
      return '0'
    }
  },

  // 获取图片数量
  getImageCount() {
    try {
      const recipes = this.getAllRecipes()
      return recipes.filter(recipe => recipe.image && recipe.image.startsWith('data:image')).length
    } catch (error) {
      return 0
    }
  },

  // 清理食谱相关图片
  cleanupRecipeImages(recipeId) {
    try {
      const images = JSON.parse(localStorage.getItem(IMAGE_STORAGE_KEY) || '{}')
      delete images[recipeId]
      localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images))
    } catch (error) {
      console.error('清理图片失败:', error)
    }
  },

  // 导出数据（不包含图片）
  exportDataWithoutImages() {
    try {
      const recipes = this.getAllRecipes()
      const recipesWithoutImages = recipes.map(recipe => ({
        ...recipe,
        image: '' // 移除图片数据
      }))
      return JSON.stringify(recipesWithoutImages, null, 2)
    } catch (error) {
      console.error('导出数据失败:', error)
      return null
    }
  },

  // 导入数据
  importData(data) {
    try {
      const recipes = JSON.parse(data)
      recipes.forEach(recipe => {
        recipe.id = this.generateId() // 重新生成ID
        recipe.createdAt = new Date().toISOString()
        recipe.updatedAt = new Date().toISOString()
      })
      this.saveAllRecipes(recipes)
      return true
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  }
} 