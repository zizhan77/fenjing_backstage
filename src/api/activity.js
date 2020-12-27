export default {
  // 查询活动列表
  // activityQueryAll: 'activity/queryAll',旧地址
  activityQueryAll: 'activity/pc/queryAll',
  // 查询单个活动
  activityQueryOne: 'activity/pc/queryGetOne',
  // 新增活动
  add: 'activity/add',
  // 修改活动
  updateById: 'activity/updateById',
  // 查询奖品列表
  prizeQueryAll: 'prize/queryAll',
  // 新增奖品
  insert: 'prize/insert',
  // 更新奖品
  update: 'prizeD/updateBatch',
  // 查询奖品明细
  queryList: 'prizeD/queryList',
  // 导入excel
  uploadExcel: 'file/uploadExcel',
  // 查询抽奖记录
  // queryListByCondition: 'reward/queryListByCondition',
  queryListByCondition: 'reward/pc/queryListBy',
  queryListBy: 'reward/queryListBy',
  // 导出excel
  exportexcel: 'reward/pc/downLoadExcel',
  // 查询赞助商兑换码
  queryExchangeCodeForSms: 'exchange-code/queryExchangeCodeForSms',
  // 查询演出列表
  getShowList: 'performance/pc/getListByPage',
  // 获取所有赞助商列表
  getSponsor: 'sponsor/queryAll',
  // 修改活动规则
  updateRule: 'activity/ruleUrl/edit',
  // 查询活动规则
  getRule: 'activity/ruleUrl/query',
  // 删除活动
  deleteById: 'activity/deleteById',
  // 删除奖品
  deletePriById: 'prize/deleteById',
  // 修改排行
  updateEnable: 'ranking/edit',
  // 新增排行
  addPerformance: 'ranking/edit',
  // 查询演出
  getDetail: 'ranking/queryGetOne',
  //自动生成优惠券
  getChangeCode:'prize/pc/addchangecodeall',
    // zt
  // 艺人列表
  starPeopleList: "actor/pc/getActorList"
  // end
}
