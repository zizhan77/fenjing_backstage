// 活动管理综合
export default {
  path: '/activity',
  name: '演出管理',
  component: () => import('@views/activity'),
  icon: '演出管理',
  meta: {
    id: 11
  },
  children: [{
      path: '/activity/list',
      name: '演出列表',
      component: () => import('@views/activity/list')
    },
    {
      path: '/activity/prize/record-list/:prizeId?',
      name: '抽奖记录',
      component: () => import('@views/activity/prize/record'),
      props: true
      // meta: {
      //   hidden: true
      // }
    },
    // 艺人列表zt
    {
      path: '/activity/starpeople',
      name: '艺人列表',
      component: () => import('@views/activity/starpeople')
    },
    {
      path: '/activity/prize/starpeopleAddBtn/:activity?/:title/:activity/:sponsorId?',
      name: '艺人行程列表',
      component: () => import('@views/activity/prize/starpeopleAddBtn'),
      props: true,
      meta: {
        hidden: true
      }
    },
    {
      path: '/activity/starEdit/:activityId',
      name: '艺人修改行程',
      component: () => import('@views/activity/starEdit'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/basic/actor/tripLst',
      name: '行程管理',
      component: () =>
        import('@views/basic/actor/tripLst'),
      props: true,
      meta: {
        hidden: true
      }
    },
    {
      path: '/basic/actor/trip',
      name: '艺人行程',
      component: () =>
        import('@views/basic/actor/trip'),
      props: true,
      meta: {
        hidden: true
      }
    },
    // end
    {
      path: '/activity/edit/:activityId/:rankingId?',
      name: '活动配置',
      component: () => import('@views/activity/edit'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/activity/prize/list/:activity?/:title/:activity/:sponsorId?',
      name: '奖品列表',
      component: () => import('@views/activity/prize/list'),
      props: true,
      meta: {
        hidden: true
      }
    },
    {
      path: '/activity/prize/edit/:prizeId?/:prizeType?/:activityId/:sponsorId?',
      name: '奖品设置',
      props: true,
      component: () => import('@views/activity/prize/edit'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/activity/prize/cdkey/:prizeName/:prizeId?/:activityId?',
      name: '批量导入',
      props: true,
      component: () => import('@views/activity/prize/cdkey'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/activity/pass/list/:activityId?',
      name: '关卡列表',
      props: true,
      component: () => import('@views/activity/pass'),
      meta: {
        hidden: true
      }
    },
    {
      path: '/activity/pass/edit/:passId?',
      name: '关卡设置',
      props: true,
      component: () => import('@views/activity/pass/edit'),
      meta: {
        hidden: true
      }
    }
  ]
}
