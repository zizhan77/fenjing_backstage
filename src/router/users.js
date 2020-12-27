// 用户管理
export default {
  path: '/users',
  name: '用户管理',
  component: () => import('@views/users'),
  icon: '用户管理',
  meta: {
    id: 5
  },
  children: [
    {
      path: '/users/list',
      name: '用户列表',
      component: () => import('@views/users/list')
    },
    {
      path: '/users/getnew',
      name: '用户拉新',
      component: () => import('@views/users/getnew')
    },
    {
      path: '/users/list/record/:userId',
      name: '操作记录',
      props: true,
      component: () => import('@views/users/record'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/users/cjlist/:userCode',
      name: '抽奖设置',
      props: true,
      component: () => import('@views/users/cjlist'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/users/setcj/:row',
      name: '设置抽奖',
      props: true,
      component: () => import('@views/users/setcj'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/users/setft/:row',
      name: '设置饭团',
      props: true,
      component: () => import('@views/users/setft'),
      meta: {
        hidden: true
      }
    }
  ]
}
