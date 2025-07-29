import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recipes'
  },
  {
    path: '/recipes',
    name: 'RecipeList',
    component: () => import('../views/RecipeList.vue'),
    meta: {
      title: '食谱列表'
    }
  },
  {
    path: '/recipes/add',
    name: 'AddRecipe',
    component: () => import('../views/AddRecipe.vue'),
    meta: {
      title: '添加食谱'
    }
  },
  {
    path: '/recipes/:id',
    name: 'RecipeDetail',
    component: () => import('../views/RecipeDetail.vue'),
    meta: {
      title: '食谱详情'
    }
  },
  {
    path: '/recipes/:id/edit',
    name: 'EditRecipe',
    component: () => import('../views/EditRecipe.vue'),
    meta: {
      title: '编辑食谱'
    }
  },
  {
    path: '*',
    redirect: '/recipes'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 我的食谱`
  }
  next()
})

export default router 