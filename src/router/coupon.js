// 优惠券管理
export default {
  path: '/coupon',
  name: '优惠券管理',
  icon: '优惠券管理',
  component: () => import('@views/coupon'),
  meta: {
    id: 8
  },
  children: [
    {
      path: '/coupon/list',
      name: '优惠券列表',
      component: () => import('@views/coupon/list')
    },
    {
      path: '/coupon/edit/:couponId?',
      name: '优惠券设置',
      component: () => import('@views/coupon/edit'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/coupon/cdkey/list',
      name: '优惠券兑换码',
      component: () => import('@views/coupon/cdkey/index')
    },
    {
      path: '/coupon/cdkey/create-cdkey',
      name: '生成兑换码',
      component: () => import('@views/coupon/cdkey/create-cdkey'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/coupon/cdkey/detail/list/:id?',
      props: true,
      name: '兑换码使用情况',
      component: () => import('@views/coupon/cdkey/detail'),
      meta: {
        hidden: true
      }
    },
  ]
}