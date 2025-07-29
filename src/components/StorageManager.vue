<template>
  <div class="storage-manager">
    <el-card>
      <div slot="header" class="card-header">
        <span>存储管理</span>
        <div class="header-actions">
          <el-button type="primary" size="small" @click="switchStorage">
            切换到 {{ nextStorageType }}
          </el-button>
          <el-button type="danger" size="small" @click="clearAllData">
            清空所有数据
          </el-button>
        </div>
      </div>
      
      <div class="storage-info">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="info-item">
              <div class="info-label">存储类型</div>
              <div class="info-value">{{ storageInfo.currentType }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <div class="info-label">食谱总数</div>
              <div class="info-value">{{ stats.total }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <div class="info-label">图片数量</div>
              <div class="info-value">{{ stats.imageCount }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="info-item">
              <div class="info-label">存储大小</div>
              <div class="info-value">{{ stats.storageSize }}KB</div>
            </div>
          </el-col>
        </el-row>
        
        <!-- 存储容量信息 -->
        <div class="storage-capacity">
          <div class="capacity-header">
            <span>存储容量</span>
            <span>{{ storageInfo.currentType === 'indexedDB' ? '50MB-1GB+' : '5-10MB' }}</span>
          </div>
          <div class="capacity-tip">
            {{ storageInfo.currentType === 'indexedDB' ? 'IndexedDB 支持更大存储空间，适合存储大量图片' : 'localStorage 容量有限，建议切换到 IndexedDB' }}
          </div>
        </div>
        
        <!-- 存储进度条 -->
        <div class="storage-progress" v-if="storageInfo.currentType === 'localStorage'">
          <div class="progress-header">
            <span>存储使用情况</span>
            <span>{{ storageUsagePercent }}%</span>
          </div>
          <el-progress 
            :percentage="storageUsagePercent" 
            :color="progressColor"
            :stroke-width="8"
          />
          <div class="progress-tip">
            {{ storageTip }}
          </div>
        </div>
      </div>
      
      <div class="storage-actions">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-button type="primary" @click="exportData" :loading="exporting">
              导出数据
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="success" @click="exportDataWithoutImages" :loading="exporting">
              导出（无图片）
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-upload
              ref="upload"
              :show-file-list="false"
              :before-upload="beforeImport"
              accept=".json"
            >
              <el-button type="warning">
                导入数据
              </el-button>
            </el-upload>
          </el-col>
        </el-row>
      </div>
      
      <!-- 最近食谱 -->
      <div class="recent-recipes" v-if="stats.recent.length > 0">
        <h4>最近食谱</h4>
        <el-table :data="stats.recent" size="small">
          <el-table-column prop="title" label="食谱名称" />
          <el-table-column prop="category" label="分类" width="100" />
          <el-table-column prop="updatedAt" label="更新时间" width="150">
            <template slot-scope="scope">
              {{ formatDate(scope.row.updatedAt) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import storageAdapter from '../utils/storageAdapter.js'

export default {
  name: 'StorageManager',
  data() {
    return {
      stats: {
        total: 0,
        imageCount: 0,
        storageSize: '0',
        categories: [],
        recent: []
      },
      storageInfo: {
        currentType: 'indexedDB',
        supportsIndexedDB: true,
        localStorageLimit: '5-10MB',
        indexedDBLimit: '50MB-1GB+'
      },
      exporting: false,
      maxStorageSize: 5120 // 5MB in KB (for localStorage)
    }
  },
  computed: {
    nextStorageType() {
      return this.storageInfo.currentType === 'indexedDB' ? 'localStorage' : 'indexedDB'
    },
    storageUsagePercent() {
      if (this.storageInfo.currentType !== 'localStorage') return 0
      const usage = parseFloat(this.stats.storageSize)
      return Math.min(Math.round((usage / this.maxStorageSize) * 100), 100)
    },
    progressColor() {
      const percent = this.storageUsagePercent
      if (percent < 50) return '#67C23A'
      if (percent < 80) return '#E6A23C'
      return '#F56C6C'
    },
    storageTip() {
      const percent = this.storageUsagePercent
      if (percent < 50) return '存储空间充足'
      if (percent < 80) return '存储空间适中，建议适当清理'
      return '存储空间紧张，建议清理部分数据或切换到 IndexedDB'
    }
  },
  async created() {
    await this.loadStorageInfo()
  },
  methods: {
    async loadStorageInfo() {
      try {
        this.storageInfo = await storageAdapter.getStorageInfo()
        this.stats = this.storageInfo.stats
      } catch (error) {
        console.error('加载存储信息失败:', error)
      }
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('zh-CN')
    },
    
    async switchStorage() {
      try {
        const fromType = this.storageInfo.currentType
        const toType = this.nextStorageType
        
        this.$confirm(`确定要切换到 ${toType} 存储吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 迁移数据
          const success = await storageAdapter.migrateData(fromType, toType)
          
          if (success) {
            this.$message.success(`成功切换到 ${toType} 存储`)
            await this.loadStorageInfo()
          } else {
            this.$message.error('存储切换失败')
          }
        }).catch(() => {
          // 取消操作
        })
      } catch (error) {
        console.error('切换存储失败:', error)
        this.$message.error('切换存储失败')
      }
    },
    
    async exportData() {
      this.exporting = true
      try {
        const data = await storageAdapter.exportData()
        if (data) {
          const dataStr = JSON.stringify(data, null, 2)
          const dataBlob = new Blob([dataStr], { type: 'application/json' })
          const url = URL.createObjectURL(dataBlob)
          const link = document.createElement('a')
          link.href = url
          link.download = `recipes_${new Date().toISOString().split('T')[0]}.json`
          link.click()
          URL.revokeObjectURL(url)
          this.$message.success('数据导出成功')
        } else {
          this.$message.error('导出失败')
        }
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败')
      } finally {
        this.exporting = false
      }
    },
    
    async exportDataWithoutImages() {
      this.exporting = true
      try {
        const data = await storageAdapter.exportData()
        if (data) {
          // 移除图片数据
          const dataWithoutImages = {
            ...data,
            images: []
          }
          
          const dataStr = JSON.stringify(dataWithoutImages, null, 2)
          const dataBlob = new Blob([dataStr], { type: 'application/json' })
          const url = URL.createObjectURL(dataBlob)
          const link = document.createElement('a')
          link.href = url
          link.download = `recipes_no_images_${new Date().toISOString().split('T')[0]}.json`
          link.click()
          URL.revokeObjectURL(url)
          this.$message.success('数据导出成功（无图片）')
        } else {
          this.$message.error('导出失败')
        }
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败')
      } finally {
        this.exporting = false
      }
    },
    
    beforeImport(file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result)
          const success = await storageAdapter.importData(data)
          if (success) {
            this.$message.success('数据导入成功')
            await this.loadStorageInfo()
          } else {
            this.$message.error('数据导入失败')
          }
        } catch (error) {
          console.error('导入失败:', error)
          this.$message.error('数据格式错误')
        }
      }
      reader.readAsText(file)
      return false // 阻止自动上传
    },
    
    async clearAllData() {
      this.$confirm('确定要清空所有数据吗？此操作不可恢复！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (await storageAdapter.clearAllData()) {
          this.$message.success('数据已清空')
          await this.loadStorageInfo()
        } else {
          this.$message.error('清空失败')
        }
      }).catch(() => {
        // 取消操作
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';
@import '../assets/styles/mixins.scss';

.storage-manager {
  .card-header {
    @include flex(row, space-between, center);
    
    .header-actions {
      @include flex(row, flex-end, center);
      gap: $spacing-sm;
    }
  }
  
  .storage-info {
    margin-bottom: $spacing-lg;
    
    .info-item {
      text-align: center;
      padding: $spacing-md;
      background: #f8f9fa;
      border-radius: $border-radius-base;
      
      .info-label {
        font-size: $font-size-small;
        color: #666;
        margin-bottom: $spacing-xs;
      }
      
      .info-value {
        font-size: $font-size-large;
        font-weight: 600;
        color: $primary-color;
      }
    }
    
    .storage-capacity {
      margin-top: $spacing-lg;
      padding: $spacing-md;
      background: #e8f4fd;
      border-radius: $border-radius-base;
      border-left: 4px solid #409eff;
      
      .capacity-header {
        @include flex(row, space-between, center);
        margin-bottom: $spacing-xs;
        font-weight: 600;
        color: #409eff;
      }
      
      .capacity-tip {
        font-size: $font-size-small;
        color: #666;
      }
    }
    
    .storage-progress {
      margin-top: $spacing-lg;
      
      .progress-header {
        @include flex(row, space-between, center);
        margin-bottom: $spacing-sm;
        font-size: $font-size-small;
        color: #666;
      }
      
      .progress-tip {
        margin-top: $spacing-xs;
        font-size: $font-size-small;
        color: #999;
        text-align: center;
      }
    }
  }
  
  .storage-actions {
    margin-bottom: $spacing-lg;
    
    .el-button {
      width: 100%;
    }
  }
  
  .recent-recipes {
    h4 {
      margin-bottom: $spacing-md;
      color: $secondary-color;
    }
  }
  
  @include respond-to(xs) {
    .storage-info {
      .info-item {
        margin-bottom: $spacing-sm;
      }
    }
    
    .storage-actions {
      .el-col {
        margin-bottom: $spacing-sm;
      }
    }
  }
}
</style> 