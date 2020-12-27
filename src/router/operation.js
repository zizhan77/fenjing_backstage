// 运营管理
export default {
  path: '/operation',
  name: '营销运营',
  icon: '运营配置',
  component: () => import('@views/operation'),
  meta: {
    id: 4
  },
  children: [
    {
      path: '/operation/banner/list',
      name: 'banner/开屏页列表',
      component: () => import('@views/operation/banner/list')
    },
    {
      path: '/operation/active/list',
      name: '饭团互动活动',
      component: () => import('@views/operation/active/list')
    },
    {
      path: '/operation/active/rule',
      name: '签到规则',
      component: () => import('@views/operation/active/rule')
    },
    {
      path: '/operation/active/edit/:id?',
      name: '编辑任务',
      component: () => import('@views/operation/active/edit'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/operation/banner/edit/:bannerId?',
      name: 'banner设置',
      component: () => import('@views/operation/banner/edit'),
      meta: {
        hidden: true
      }
    },
    // {
    //   path: '/coupon',
    //   name: '优惠券管理',
    //   icon: '优惠券管理',
    //   component: () => import('@views/coupon'),     
    //   children: [
    //     {
    //       path: '/coupon/list',
    //       name: '优惠券列表',
    //       component: () => import('@views/coupon/list')
    //     },
    //     {
    //       path: '/coupon/edit/:couponId?',
    //       name: '优惠券设置',
    //       component: () => import('@views/coupon/edit'),
    //       meta: {
    //         hidden: true
    //       }
    //     },
    //     {
    //       path: '/coupon/cdkey/list',
    //       name: '优惠券兑换码',
    //       component: () => import('@views/coupon/cdkey/index')
    //     },
    //     {
    //       path: '/coupon/cdkey/create-cdkey',
    //       name: '生成兑换码',
    //       component: () => import('@views/coupon/cdkey/create-cdkey'),
    //       meta: {
    //         hidden: true
    //       }
    //     },
    //     {
    //       path: '/coupon/cdkey/detail/list/:id?',
    //       props: true,
    //       name: '兑换码使用情况',
    //       component: () => import('@views/coupon/cdkey/detail'),
    //       meta: {
    //         hidden: true
    //       }
    //     }
    //   ]
    // }
  ]
}