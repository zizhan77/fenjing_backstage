export default {
  // 查询演出列表
  getShowList: 'performance/pc/getListByPage',
  // getShowSubList: 'performance/pc/getListByPage',
  getActiveList: 'activity/queryAll',
  // 查询城市
  getCityList: 'basic/place/getCityList',
  // 查询场地
  getPlaceList: 'basic/place/getPlaceList',
  // 查询省市
  queryListByParent: 'basic/address/queryListByParent',
  // 查询艺人
  queryArtistList: 'basic/artist/queryArtistList',
  // 新增演出
  addPerformance: 'performance/addPerformance',
  // 查询演出
  getDetail: 'performance/getDetail',
  // 上传图片
  uploadFile: 'file/uploadFile',
  // 新增场次
  addShow: 'performance-show/addShow',
  // 删除场次
  deleteShow: 'performance-show/deleteShow',
  // 新增票档
  addGear: 'ticket-gear/addGear',
  // 删除票档
  deleteGear: 'ticket-gear/deleteGear',
  // 查询座位列表
  querySeatListByPlaceId: 'seats/querySeatListByPlaceId',
  // 库存列表
  queryStoreList: 'ticketStore/queryListById',
  // 修改库存
  updateStore: 'ticketStore/updateTicketStore',
  // 设置座位状态
  editBatchSeatList: 'seats/editBatchSeatList',
  // 演出启用停用
  updateEnable: 'performance/updateEnable',
  // 根据场次搜索座位
  querySeatListByShowId: 'seats/querySeatListByShowId',
  // 不支持选择演出批量生成兑换码
  exchangeCode: 'exchange-code/generate/ticketStore/exchangeCode',
  // 支持选座演出按照座位批量生成兑换码
  createBatchSeatExchangeCode: 'seats/createBatchSeatExchangeCode',
  // 获取优惠券列表
  queryQuanList: 'codeType/queryBySponsorId',
  // 获取活动列表
  getActivityLst: 'performance/getList',
  // 获取活动详情，编辑活动
  addActivityLst: 'activity/add',
  queryAllActivityLst: 'activity/pc/queryAll',
  // 获取所有赞助商列表
  getSponsor: 'sponsor/queryAll',


}
