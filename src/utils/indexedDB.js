// IndexedDB 工具类
const DB_NAME = 'RecipeAppDB'
const DB_VERSION = 1
const RECIPES_STORE = 'recipes'
const IMAGES_STORE = 'images'

export default {
  db: null,

  // 初始化数据库
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error('数据库打开失败'))
      }

      request.onsuccess = (event) => {
        this.db = event.target.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // 创建食谱存储
        if (!db.objectStoreNames.contains(RECIPES_STORE)) {
          const recipesStore = db.createObjectStore(RECIPES_STORE, { keyPath: 'id' })
          recipesStore.createIndex('title', 'title', { unique: false })
          recipesStore.createIndex('category', 'category', { unique: false })
          recipesStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // 创建图片存储
        if (!db.objectStoreNames.contains(IMAGES_STORE)) {
          const imagesStore = db.createObjectStore(IMAGES_STORE, { keyPath: 'id' })
          imagesStore.createIndex('recipeId', 'recipeId', { unique: false })
        }
      }
    })
  },

  // 确保数据库已初始化
  async ensureDB() {
    if (!this.db) {
      await this.initDB()
    }
    return this.db
  },

  // 获取所有食谱
  async getAllRecipes() {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([RECIPES_STORE], 'readonly')
        const store = transaction.objectStore(RECIPES_STORE)
        const request = store.getAll()

        request.onsuccess = () => {
          resolve(request.result || [])
        }

        request.onerror = () => {
          reject(new Error('获取食谱失败'))
        }
      })
    } catch (error) {
      console.error('获取食谱失败:', error)
      return []
    }
  },

  // 添加食谱
  async addRecipe(recipe) {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([RECIPES_STORE], 'readwrite')
        const store = transaction.objectStore(RECIPES_STORE)

        const newRecipe = {
          ...recipe,
          id: this.generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        const request = store.add(newRecipe)

        request.onsuccess = () => {
          resolve(newRecipe)
        }

        request.onerror = () => {
          reject(new Error('添加食谱失败'))
        }
      })
    } catch (error) {
      console.error('添加食谱失败:', error)
      return null
    }
  },

  // 更新食谱
  async updateRecipe(recipeId, updatedRecipe) {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([RECIPES_STORE], 'readwrite')
        const store = transaction.objectStore(RECIPES_STORE)

        const request = store.get(recipeId)

        request.onsuccess = () => {
          const existingRecipe = request.result
          if (existingRecipe) {
            const updated = {
              ...existingRecipe,
              ...updatedRecipe,
              id: recipeId,
              updatedAt: new Date().toISOString()
            }

            const putRequest = store.put(updated)
            putRequest.onsuccess = () => resolve(updated)
            putRequest.onerror = () => reject(new Error('更新食谱失败'))
          } else {
            reject(new Error('食谱不存在'))
          }
        }

        request.onerror = () => {
          reject(new Error('获取食谱失败'))
        }
      })
    } catch (error) {
      console.error('更新食谱失败:', error)
      return null
    }
  },

  // 删除食谱
  async deleteRecipe(recipeId) {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([RECIPES_STORE, IMAGES_STORE], 'readwrite')
        const recipesStore = transaction.objectStore(RECIPES_STORE)
        const imagesStore = transaction.objectStore(IMAGES_STORE)

        // 删除食谱
        const deleteRecipeRequest = recipesStore.delete(recipeId)
        deleteRecipeRequest.onsuccess = () => {
          // 删除相关图片
          const imageIndex = imagesStore.index('recipeId')
          const deleteImagesRequest = imageIndex.openCursor(IDBKeyRange.only(recipeId))
          
          deleteImagesRequest.onsuccess = () => {
            const cursor = deleteImagesRequest.result
            if (cursor) {
              cursor.delete()
              cursor.continue()
            }
          }
          
          resolve(true)
        }

        deleteRecipeRequest.onerror = () => {
          reject(new Error('删除食谱失败'))
        }
      })
    } catch (error) {
      console.error('删除食谱失败:', error)
      return false
    }
  },

  // 根据ID获取食谱
  async getRecipeById(recipeId) {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([RECIPES_STORE], 'readonly')
        const store = transaction.objectStore(RECIPES_STORE)
        const request = store.get(recipeId)

        request.onsuccess = () => {
          resolve(request.result || null)
        }

        request.onerror = () => {
          reject(new Error('获取食谱详情失败'))
        }
      })
    } catch (error) {
      console.error('获取食谱详情失败:', error)
      return null
    }
  },

  // 搜索食谱
  async searchRecipes(keyword, category = '') {
    try {
      const recipes = await this.getAllRecipes()
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

  // 保存图片
  async saveImage(recipeId, imageData, imageName = 'main') {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([IMAGES_STORE], 'readwrite')
        const store = transaction.objectStore(IMAGES_STORE)

        const imageRecord = {
          id: `${recipeId}_${imageName}`,
          recipeId,
          imageName,
          data: imageData,
          createdAt: new Date().toISOString()
        }

        const request = store.put(imageRecord)

        request.onsuccess = () => {
          resolve(imageRecord)
        }

        request.onerror = () => {
          reject(new Error('保存图片失败'))
        }
      })
    } catch (error) {
      console.error('保存图片失败:', error)
      return null
    }
  },

  // 获取图片
  async getImage(recipeId, imageName = 'main') {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([IMAGES_STORE], 'readonly')
        const store = transaction.objectStore(IMAGES_STORE)
        const request = store.get(`${recipeId}_${imageName}`)

        request.onsuccess = () => {
          resolve(request.result ? request.result.data : null)
        }

        request.onerror = () => {
          reject(new Error('获取图片失败'))
        }
      })
    } catch (error) {
      console.error('获取图片失败:', error)
      return null
    }
  },

  // 删除图片
  async deleteImage(recipeId, imageName = 'main') {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([IMAGES_STORE], 'readwrite')
        const store = transaction.objectStore(IMAGES_STORE)
        const request = store.delete(`${recipeId}_${imageName}`)

        request.onsuccess = () => {
          resolve(true)
        }

        request.onerror = () => {
          reject(new Error('删除图片失败'))
        }
      })
    } catch (error) {
      console.error('删除图片失败:', error)
      return false
    }
  },

  // 获取食谱的所有图片
  async getRecipeImages(recipeId) {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([IMAGES_STORE], 'readonly')
        const store = transaction.objectStore(IMAGES_STORE)
        const index = store.index('recipeId')
        const request = index.getAll(recipeId)

        request.onsuccess = () => {
          resolve(request.result || [])
        }

        request.onerror = () => {
          reject(new Error('获取图片失败'))
        }
      })
    } catch (error) {
      console.error('获取图片失败:', error)
      return []
    }
  },

  // 获取数据统计
  async getStats() {
    try {
      const recipes = await this.getAllRecipes()
      const images = await this.getAllImages()
      
      return {
        total: recipes.length,
        imageCount: images.length,
        categories: [...new Set(recipes.map(recipe => recipe.category))],
        recent: recipes
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5),
        storageSize: await this.getStorageSize()
      }
    } catch (error) {
      console.error('获取统计信息失败:', error)
      return { total: 0, imageCount: 0, categories: [], recent: [], storageSize: '0' }
    }
  },

  // 获取所有图片
  async getAllImages() {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([IMAGES_STORE], 'readonly')
        const store = transaction.objectStore(IMAGES_STORE)
        const request = store.getAll()

        request.onsuccess = () => {
          resolve(request.result || [])
        }

        request.onerror = () => {
          reject(new Error('获取图片失败'))
        }
      })
    } catch (error) {
      console.error('获取图片失败:', error)
      return []
    }
  },

  // 获取存储大小
  async getStorageSize() {
    try {
      const recipes = await this.getAllRecipes()
      const images = await this.getAllImages()
      
      let totalSize = 0
      
      // 计算食谱数据大小
      recipes.forEach(recipe => {
        totalSize += JSON.stringify(recipe).length
      })
      
      // 计算图片数据大小
      images.forEach(image => {
        totalSize += image.data.length
      })
      
      return (totalSize / 1024).toFixed(2) // 转换为KB
    } catch (error) {
      return '0'
    }
  },

  // 清空所有数据
  async clearAllData() {
    try {
      await this.ensureDB()
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([RECIPES_STORE, IMAGES_STORE], 'readwrite')
        const recipesStore = transaction.objectStore(RECIPES_STORE)
        const imagesStore = transaction.objectStore(IMAGES_STORE)

        const clearRecipesRequest = recipesStore.clear()
        const clearImagesRequest = imagesStore.clear()

        clearRecipesRequest.onsuccess = () => {
          clearImagesRequest.onsuccess = () => {
            resolve(true)
          }
          clearImagesRequest.onerror = () => {
            reject(new Error('清空图片失败'))
          }
        }

        clearRecipesRequest.onerror = () => {
          reject(new Error('清空食谱失败'))
        }
      })
    } catch (error) {
      console.error('清空数据失败:', error)
      return false
    }
  },

  // 导出数据
  async exportData() {
    try {
      const recipes = await this.getAllRecipes()
      const images = await this.getAllImages()
      
      return {
        recipes,
        images,
        exportDate: new Date().toISOString()
      }
    } catch (error) {
      console.error('导出数据失败:', error)
      return null
    }
  },

  // 导入数据
  async importData(data) {
    try {
      const { recipes, images } = data
      
      // 清空现有数据
      await this.clearAllData()
      
      // 导入食谱
      for (const recipe of recipes) {
        recipe.id = this.generateId() // 重新生成ID
        recipe.createdAt = new Date().toISOString()
        recipe.updatedAt = new Date().toISOString()
        await this.addRecipe(recipe)
      }
      
      // 导入图片
      for (const image of images) {
        image.id = this.generateId()
        image.createdAt = new Date().toISOString()
        await this.saveImage(image.recipeId, image.data, image.imageName)
      }
      
      return true
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  },

  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
} 