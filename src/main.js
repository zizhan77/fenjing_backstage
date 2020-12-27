import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Service from './service'
import Directives from './directives'
import { upperFirst, camelCase } from 'lodash'
import Element from 'element-ui'
// import 'normalize.css/normalize.css'

import './styles/element-variables.scss'
// iconc.css
import '@/static/css/icon.css'
// font.css
import '@/static/css/font.css'
// global css
import '@/styles/index.scss'

import './icons'
// permission control
import './permission'


Vue.use(Element, {
  size: 'small'
})
Vue.use(Service)
Vue.use(Directives)
Vue.config.productionTip = false

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
