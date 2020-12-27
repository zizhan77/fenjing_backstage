// 订单管理
export default {
  path: '/order',
  name: '订单管理',
  icon: '订单信息',
  meta: {
    id: 2
  },
  component: () => import('@views/order'),
  children: [
    {
      path: '/order/list',
      name: '订单列表',
      component: () => import('@views/order/list')
    },
    {
      path: '/operation/banner/code/list',
      name: '兑换码查询',
      component: () => import('@views/operation/code')
    }
  ]
}