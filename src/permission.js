import router from './router'
import Routes from './router/routes'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from './utils/auth'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  const hasToken = getToken()
  if (hasToken) {
    let userInfo = store.state.user.userInfo
    if (!userInfo) {
      const menuList = await store.dispatch('user/getUserInfo')
      console.log("获取的菜单：",menuList)
      // debugger
      // menuList.push({"id":9});menuList.push({"id":11});//menuList.push({"id":10});//手动添加了主办方id 9,10 的菜单 11活动管理
      Routes.children = Routes.children.filter(route => menuList.some((menu) => String(menu.id) === String(route.meta.id)))
      router.addRoutes([Routes])
    }

    if (to.path === '/login' || !to.matched.length) {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      /* has no token*/
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
