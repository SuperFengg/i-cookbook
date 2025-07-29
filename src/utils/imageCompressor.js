// 图片压缩工具类
export default {
  // 压缩图片
  async compressImage(file, options = {}) {
    const {
      maxWidth = 800,
      maxHeight = 600,
      quality = 0.7,
      format = 'jpeg'
    } = options

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // 计算压缩后的尺寸
        let { width, height } = img
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        
        if (ratio < 1) {
          width *= ratio
          height *= ratio
        }

        // 设置canvas尺寸
        canvas.width = width
        canvas.height = height

        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height)

        // 转换为Base64
        const compressedDataUrl = canvas.toDataURL(`image/${format}`, quality)
        resolve(compressedDataUrl)
      }

      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }

      // 从文件创建URL
      const url = URL.createObjectURL(file)
      img.src = url
    })
  },

  // 获取图片文件大小（KB）
  getFileSize(file) {
    return (file.size / 1024).toFixed(2)
  },

  // 获取Base64大小（KB）
  getBase64Size(base64) {
    const base64Length = base64.length
    const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
    const sizeInBytes = (base64Length * 0.75) - padding
    return (sizeInBytes / 1024).toFixed(2)
  },

  // 检查图片是否过大
  isImageTooLarge(base64, maxSizeKB = 500) {
    const size = this.getBase64Size(base64)
    return parseFloat(size) > maxSizeKB
  },

  // 生成缩略图
  async generateThumbnail(file, size = 150) {
    return this.compressImage(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.6,
      format: 'jpeg'
    })
  },

  // 批量压缩图片
  async compressImages(files, options = {}) {
    const compressedImages = []
    
    for (const file of files) {
      try {
        const compressed = await this.compressImage(file, options)
        compressedImages.push(compressed)
      } catch (error) {
        console.error('压缩图片失败:', error)
        // 如果压缩失败，使用原始文件
        const reader = new FileReader()
        reader.onload = (e) => compressedImages.push(e.target.result)
        reader.readAsDataURL(file)
      }
    }
    
    return compressedImages
  }
} 