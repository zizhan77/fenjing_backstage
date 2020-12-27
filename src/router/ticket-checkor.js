// 验票员管理
export default {
  path: '/ticket-checkor',
  name: '验票员管理',
  icon: '验票员管理',
  component: () => import('@views/ticket-checkor'),
  meta: {
    id: 7
  },
  children: [
    {
      path: '/ticket-checkor/list',
      name: '验票员列表',
      component: () => import('@views/ticket-checkor/list'),
    },
    {
      path: '/ticket-checkor/edit/:userId?',
      name: '验票员配置',
      component: () => import('@views/ticket-checkor/edit'),
      meta: {
        hidden: true
      }
    }
  ]
}