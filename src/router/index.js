import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [

    {
      path: '/login',
      name: '登陆',
      component: () => import('@/views/login'),
      hidden: true
    }
  ]
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 上边登录完成，这里开始调用导航，此处可以配置，各个选项显示与否

export default router
