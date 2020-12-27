// 演出管理
export default {
  path: '/sort',
  name: '排行管理',
  component: () => import('@views/sort'),
  icon: '排行管理',
  meta: {
    id: 10
  },
  children: [
    {
      path: '/sort/list',
      name: '排行列表',
      component: () => import('@views/sort/list')
    },
    {
      path: '/sort/edit/:showId?',
      name: '排行详情',
      props: true,
      meta: {
        hidden: true
      },
      component: () => import('@views/sort/show-edit')
    }
  ]
}
