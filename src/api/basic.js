export default {
  // 查询活动列表
  activityQueryAll: 'activity/queryAll',
  // 查询省市
  queryListByParent: 'basic/address/queryListByParent',
  // 查询艺人列表
  queryArtistList: 'basic/artist/queryArtistList',
  // 查询艺人详情
  queryArtistDetail: 'basic/artist/queryArtistDetail',
  // 艺人创建/编辑
  addOrUpdate: 'basic/artist/addOrUpdate',
  // 艺人删除
  deleteArtById: 'basic/artist/deleteById',
  // 查询运费列表
  queryInfo: 'basic/freight/queryInfo',
  // 修改默认运费
  updateById: 'basic/freight/updateById',
  // 查询城市列表
  queryCityList: 'basic/address/queryCityList',
  // 城市开启/禁用
  updateCityStatus: 'basic/address/updateCityStatus',
  // 场地列表
  getPlaceList: 'basic/place/getPlaceList',
  // 删除场地
  deleteById: 'basic/deleteById',
  // 查询场地详情
  queryDetail: 'basic/place/queryDetail',
  // 场地创建 //编辑
  addOrUpdatePlace: 'basic/place/addOrUpdatePlace',
  // 查询管理员列表
  getAdminList: 'admin/getList',
  // 查询角色列表
  getRoleList: 'authority/role/queryList',
  // 创建角色
  addRole: 'authority/role/addRole',
  // 删除角色
  deleteRole: 'authority/role/deleteRole',
  // 查询所有菜单列表
  queryMenuList: 'authority/menu/queryList',
  // 配置角色对应的菜单权限
  addRoleMenusRel: 'authority/addRoleMenusRel',
  // 查询区域列表
  queryAreaListByPlaceId: 'area/queryAreaListByPlaceId',
  // 创建区域
  createArea: 'area/createArea',
  // 编辑区域
  updateArea: 'area/updateArea',
  // 删除当前行座位
  deleteSeatList: 'seats/deleteSeatList',
  // 查询区域对应座位
  querySeatModel: 'seats/querySeatModel',
  // 新增座位list
  initSeatList: 'seats/initSeatList',
  // 修改管理员密码
  updatePassword: 'admin/updatePassword',
  // 新增管理员
  administrator: 'admin/add/administrator',
  // 禁用管理员
  updateAble: 'admin/updateAble',
  // 新增行程
  addActorTrip: 'actor/pc/addActorTrip',
  //查询行程
  getActorTripList: 'actor/pc/getActorTripList',
  // 删除艺人行程
  deleteActorTrip: 'actor/pc/deleteActorTrip',
  //更新艺人行程
  updateActorTrip:'actor/pc/updateActorTrip',
}
