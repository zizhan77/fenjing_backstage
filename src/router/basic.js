// 基础配置
export default {
    path: '/basic',
    name: '基础配置',
    component: () =>
        import ('@views/basic'),
    icon: '基础配置',
    meta: {
        id: 3
    },
    children: [{
            path: '/activity/rule',
            name: '新手引导规则',
            component: () =>
                import ('@views/activity/rule')
        },
        {
            path: '/basic/admin',
            name: '管理员管理',
            component: () =>
                import ('@views/basic/admin'),
            meta: {
                role: [1]
            },
            children: [{
                    path: '/basic/admin/list',
                    name: '管理员列表',
                    component: () =>
                        import ('@views/basic/admin/list')
                },
                {
                    path: '/basic/admin/list/edit/:userId?/:accountNumber?/:role?',
                    name: '管理员配置',
                    props: true,
                    component: () =>
                        import ('@views/basic/admin/edit'),
                    meta: {
                        hidden: true
                    }
                },
                {
                    path: '/basic/admin/list/role',
                    name: '角色配置',
                    component: () =>
                        import ('@views/basic/admin/role')
                }
            ]
        },
        // {
        //     path: '/ticket-checkor',
        //     name: '验票员管理',
        //     component: () =>
        //         import ('@views/ticket-checkor'),
        //     children: [{
        //             path: '/ticket-checkor/list',
        //             name: '验票员列表',
        //             component: () =>
        //                 import ('@views/ticket-checkor/list'),
        //         },
        //         {
        //             path: '/ticket-checkor/edit/:userId?',
        //             name: '验票员配置',
        //             component: () =>
        //                 import ('@views/ticket-checkor/edit'),
        //             meta: {
        //                 hidden: true
        //             }
        //         }
        //     ]
        // },
        {
            path: '/basic/placement',
            name: '场地管理',
            component: () =>
                import ('@views/basic/place'),
            children: [{
                    path: '/basic/placement/list',
                    name: '场地列表',
                    component: () =>
                        import ('@views/basic/place/list'),
                },
                {
                    path: '/basic/placement/edit/:placeId?',
                    name: '场地详情',
                    props: true,
                    component: () =>
                        import ('@views/basic/place/edit'),
                    meta: {
                        hidden: true
                    }
                },
                {
                    path: '/basic/placement/area/list/:placeId',
                    name: '区域列表',
                    props: true,
                    component: () =>
                        import ('@views/basic/place/area'),
                    meta: {
                        hidden: true
                    }
                },
                {
                    path: '/basic/placement/area/edit/:placeId?/:areaId?',
                    name: '区域配置',
                    props: true,
                    component: () =>
                        import ('@views/basic/place/area/area-edit'),
                    meta: {
                        hidden: true
                    }
                },
                {
                    path: '/basic/placement/area/seat/:placeId?/:areaId/:areaName?',
                    name: '选座配置',
                    props: true,
                    component: () =>
                        import ('@views/basic/place/area/seat-edit'),
                    meta: {
                        hidden: true
                    }
                }
            ]
        },
        {
            path: '/basic/city/list',
            name: '城市管理',
            component: () =>
                import ('@views/basic/city/list')
        },
        {
            path: '/basic/freight/list',
            name: '运费管理',
            component: () =>
                import ('@views/basic/freight/list')
        },
        // {
        //     path: '/basic/actor',
        //     name: '艺人管理',
        //     component: () =>
        //         import ('@views/basic/actor'),
        //     children: [{
        //             path: '/basic/actor/list',
        //             name: '艺人列表',
        //             component: () =>
        //                 import ('@views/basic/actor/list')
        //         },
        //         {
        //             path: '/basic/actor/tripLst',
        //             name: '行程管理',
        //             component: () =>
        //                 import ('@views/basic/actor/tripLst'),
        //             props: true,
        //             meta: {
        //                 hidden: true
        //             }
        //         },
               
        //         {
        //             path: '/basic/actor/trip',
        //             name: '艺人行程',
        //             component: () =>
        //                 import ('@views/basic/actor/trip'),
        //             props: true,
        //             meta: {
        //                 hidden: true
        //             }
        //         },
        //         {
        //             path: '/basic/actor/edit/:actorId?',
        //             name: '艺人编辑',
        //             component: () =>
        //                 import ('@views/basic/actor/edit'),
        //             props: true,
        //             meta: {
        //                 hidden: true
        //             }
        //         }
        //     ],
           
        // }
    ]
}