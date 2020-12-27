// 赞助商管理
export default {
  path: '/organizer',
  name: '主办方管理',
  icon: '主办方管理',
  component: () => import('@views/organizer'),
  meta: {
    id: 9
  },
  children: [
    {
      path: '/organizer/list',
      name: '主办方列表',
      component: () => import('@views/organizer/list'),
    },
    {
      path: '/organizer/edit/:userId?',
      name: '主办方配置',
      component: () => import('@views/organizer/edit'),
      meta: {
        hidden: true
      }
    }
  ]
}