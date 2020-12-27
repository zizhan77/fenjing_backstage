// 演出管理
export default {
  path: '/show',
  name: '演出管理',
  component: () => import('@views/show'),
  icon: '演出管理',
  meta: {
    id: 1
  },
  children: [
    // {
    //   path: '/show/list',
    //   name: '演出列表',
    //   component: () => import('@views/show/list')
    // },
    // {
    //   path: '/show/activityLst',
    //   name: '活动列表',
    //   component: () => import('@views/show/activityLst')
    // },
    // {
    //   path: '/activity/list',
    //   name: '活动列表',
    //   component: () => import('@views/activity/list')
    // },
    // {
    //   path: '/activity/edit/:activityId/:rankingId?',
    //   name: '活动配置',
    //   component: () => import('@views/activity/edit'),
    //   meta: {
    //     hidden: true
    //   }
    // },
  
  ]
}