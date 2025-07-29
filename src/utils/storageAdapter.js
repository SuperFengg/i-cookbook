// 存储适配器 - 统一管理 localStorage 和 IndexedDB
import localStorage from './storage.js'
import indexedDB from './indexedDB.js'

// 存储类型枚举
const STORAGE_TYPES = {
  LOCAL_STORAGE: 'localStorage',
  INDEXED_DB: 'indexedDB'
}

// 默认使用 IndexedDB
let currentStorageType = STORAGE_TYPES.INDEXED_DB

export default {
  // 设置存储类型
  setStorageType(type) {
    if (Object.values(STORAGE_TYPES).includes(type)) {
      currentStorageType = type
      console.log(`切换到 ${type} 存储`)
    }
  },

  // 获取当前存储类型
  getStorageType() {
    return currentStorageType
  },

  // 检查 IndexedDB 支持
  async checkIndexedDBSupport() {
    try {
      if (!window.indexedDB) {
        return false
      }
      
      // 尝试打开数据库
      await indexedDB.initDB()
      return true
    } catch (error) {
      console.warn('IndexedDB 不支持，将使用 localStorage:', error)
      return false
    }
  },

  // 自动选择最佳存储方式
  async autoSelectStorage() {
    const supportsIndexedDB = await this.checkIndexedDBSupport()
    if (supportsIndexedDB) {
      this.setStorageType(STORAGE_TYPES.INDEXED_DB)
    } else {
      this.setStorageType(STORAGE_TYPES.LOCAL_STORAGE)
    }
  },

  // 获取所有食谱
  async getAllRecipes() {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.getAllRecipes()
    } else {
      return localStorage.getAllRecipes()
    }
  },

  // 添加食谱
  async addRecipe(recipe) {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.addRecipe(recipe)
    } else {
      return localStorage.addRecipe(recipe)
    }
  },

  // 更新食谱
  async updateRecipe(recipeId, updatedRecipe) {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.updateRecipe(recipeId, updatedRecipe)
    } else {
      // localStorage 中ID可能是数字类型，需要转换
      const recipes = localStorage.getAllRecipes()
      const index = recipes.findIndex(recipe => recipe.id == recipeId)
      if (index !== -1) {
        recipes[index] = {
          ...recipes[index],
          ...updatedRecipe,
          id: recipeId,
          updatedAt: new Date().toISOString()
        }
        localStorage.saveAllRecipes(recipes)
        return recipes[index]
      }
      return null
    }
  },

  // 删除食谱
  async deleteRecipe(recipeId) {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.deleteRecipe(recipeId)
    } else {
      // localStorage 中ID可能是数字类型，需要转换
      const recipes = localStorage.getAllRecipes()
      const filteredRecipes = recipes.filter(recipe => recipe.id != recipeId)
      localStorage.saveAllRecipes(filteredRecipes)
      return true
    }
  },

  // 根据ID获取食谱
  async getRecipeById(recipeId) {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.getRecipeById(recipeId)
    } else {
      // localStorage 中ID可能是数字类型，需要转换
      const recipes = localStorage.getAllRecipes()
      return recipes.find(recipe => recipe.id == recipeId) || null
    }
  },

  // 搜索食谱
  async searchRecipes(keyword, category = '') {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.searchRecipes(keyword, category)
    } else {
      return localStorage.searchRecipes(keyword, category)
    }
  },

  // 保存图片
  async saveImage(recipeId, imageData, imageName = 'main') {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.saveImage(recipeId, imageData, imageName)
    } else {
      // localStorage 不支持单独的图片存储，返回 null
      return null
    }
  },

  // 获取图片
  async getImage(recipeId, imageName = 'main') {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.getImage(recipeId, imageName)
    } else {
      // localStorage 中图片存储在食谱数据中
      const recipe = await this.getRecipeById(recipeId)
      return recipe ? recipe.image : null
    }
  },

  // 删除图片
  async deleteImage(recipeId, imageName = 'main') {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.deleteImage(recipeId, imageName)
    } else {
      // localStorage 中删除图片需要更新食谱
      const recipe = await this.getRecipeById(recipeId)
      if (recipe) {
        recipe.image = ''
        return await this.updateRecipe(recipeId, recipe)
      }
      return false
    }
  },

  // 获取食谱的所有图片
  async getRecipeImages(recipeId) {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.getRecipeImages(recipeId)
    } else {
      // localStorage 中只有主图片
      const recipe = await this.getRecipeById(recipeId)
      return recipe && recipe.image ? [{
        id: `${recipeId}_main`,
        recipeId,
        imageName: 'main',
        data: recipe.image,
        createdAt: recipe.createdAt
      }] : []
    }
  },

  // 获取数据统计
  async getStats() {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.getStats()
    } else {
      return localStorage.getStats()
    }
  },

  // 清空所有数据
  async clearAllData() {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.clearAllData()
    } else {
      return localStorage.clearAllData()
    }
  },

  // 导出数据
  async exportData() {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.exportData()
    } else {
      const recipes = localStorage.getAllRecipes()
      const images = recipes
        .filter(recipe => recipe.image)
        .map(recipe => ({
          id: `${recipe.id}_main`,
          recipeId: recipe.id,
          imageName: 'main',
          data: recipe.image,
          createdAt: recipe.createdAt
        }))
      
      return {
        recipes,
        images,
        exportDate: new Date().toISOString()
      }
    }
  },

  // 导入数据
  async importData(data) {
    if (currentStorageType === STORAGE_TYPES.INDEXED_DB) {
      return await indexedDB.importData(data)
    } else {
      try {
        const { recipes, images } = data
        
        // 将图片数据合并到食谱中
        const recipesWithImages = recipes.map(recipe => {
          const recipeImage = images.find(img => img.recipeId === recipe.id)
          if (recipeImage) {
            recipe.image = recipeImage.data
          }
          return recipe
        })
        
        // 清空现有数据
        localStorage.clearAllData()
        
        // 导入食谱
        recipesWithImages.forEach(recipe => {
          recipe.id = this.generateId()
          recipe.createdAt = new Date().toISOString()
          recipe.updatedAt = new Date().toISOString()
          localStorage.addRecipe(recipe)
        })
        
        return true
      } catch (error) {
        console.error('导入数据失败:', error)
        return false
      }
    }
  },

  // 迁移数据
  async migrateData(fromType, toType) {
    try {
      console.log(`开始从 ${fromType} 迁移到 ${toType}`)
      
      // 临时切换到源存储类型
      const originalType = currentStorageType
      this.setStorageType(fromType)
      
      // 导出数据
      const data = await this.exportData()
      
      // 切换到目标存储类型
      this.setStorageType(toType)
      
      // 导入数据
      const success = await this.importData(data)
      
      if (success) {
        console.log('数据迁移成功')
        return true
      } else {
        // 迁移失败，恢复原存储类型
        this.setStorageType(originalType)
        console.error('数据迁移失败')
        return false
      }
    } catch (error) {
      console.error('数据迁移失败:', error)
      return false
    }
  },

  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },

  // 获取存储信息
  async getStorageInfo() {
    const stats = await this.getStats()
    const supportsIndexedDB = await this.checkIndexedDBSupport()
    
    return {
      currentType: currentStorageType,
      supportsIndexedDB,
      stats,
      localStorageLimit: '5-10MB',
      indexedDBLimit: '50MB-1GB+'
    }
  }
} 