// 赞助商管理
export default {
  path: '/sponsor',
  name: '赞助商管理',
  icon: '赞助商管理',
  component: () => import('@views/sponsor'),
  meta: {
    id: 6
  },
  children: [
    {
      path: '/sponsor/list',
      name: '赞助商列表',
      component: () => import('@views/sponsor/list')
    },
    {
      path: '/sponsor/check',
      name: '问题审核',
      component: () => import('@views/sponsor/check')
    },
    {
      path: '/sponsor/checki',
      name: '图片审核',
      component: () => import('@views/sponsor/checki')
    },
    {
      path: '/sponsor/edit/:userId?',
      name: '赞助商配置',
      component: () => import('@views/sponsor/edit'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/sponsor/codes/:userId?',
      name: '券码列表',
      component: () => import('@views/sponsor/codes'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/sponsor/addq/:userId?',
      name: '编辑券码',
      component: () => import('@views/sponsor/addq'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/sponsor/cdkey/:userId?/:codeId?',
      name: '上传券码',
      component: () => import('@views/sponsor/cdkey'),
      meta: {
        hidden: true
      }
    }
  ]
}