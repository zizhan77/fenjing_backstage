<template>
  <!-- 奖品设置 -->
  <section class="activity-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-medium">
        <template-form 
        title="奖品设置" 
        ref="form" 
        :render-data="renderData" 
        v-model="form"        
        >
          <template slot-scope="props">
            <span v-if="props.item.name==='total_num'">份</span>
            <span v-if="props.item.name==='prizeNum'">张</span>
            <section v-if="props.item.name==='eticketList'">
              <!-- 演出 -->
              <el-select
                v-model="currentShow.showName"
                class="show-select"
                placeholder="请选择演出"
                @change="onShowChange"
              >
                <el-option
                  v-for="(item, index) in showList"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
              <!-- 区域 -->
              <el-select v-model="currentShow.areaName" class="show-select" placeholder="请选择区域">
                <el-option
                  v-for="(item, index) in areaOps"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
              <!-- 份数 -->
              <el-input v-model.number="currentShow.nums" class="w-mini"></el-input>份
              <el-input v-model.number="currentShow.count" class="w-mini"></el-input>每份/张
              <!-- 添加 -->
              <el-button type="primary" @click="addShow">添加</el-button>
              <section class="tag-list mt20">
                <el-tag
                  size="medium"
                  v-for="(tag, index) in form.eticketList"
                  :key="index"
                  closable
                  @close="handleDel(index)"
                >{{tag.name}}</el-tag>
              </section>
            </section>
            
            <section v-if="props.item.name==='integralProbList'">
              <el-input class="input_small" type="number" v-model="currentProb.integralNum"></el-input>---
              <el-input class="input_small" type="number" v-model="currentProb.prob"></el-input>%
              <el-button type="primary" @click="handleAddProb">添加</el-button>
              <section class="prob-list mt20">
                <el-tag
                  class="mr10"
                  size="medium"
                  v-for="(tag, index) in form.integralProbList"
                  :key="index"
                  closable
                  @close="handleDelProb(index)"
                >积分数{{tag.integralNum}} 概率{{tag.prob}}%</el-tag>
              </section>
            </section>
          </template>
        </template-form>
        <footer class="page_footer">
          <el-button size="medium" type="primary" @click="handleConfirm" :loading="btnLoading">确 认</el-button>
          <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
        </footer>
      </div>
    </section>
  </section>
</template>
<script>

import { get } from 'lodash';
import Message from '@utils/message';
import { isContains } from '@utils/utils';
import API from '@api/activity';
import ShowApi from '@api/show';
import BasicApi from '@api/basic';
import TemplateForm from '@components/template-form';

export default {
  components: {
    TemplateForm
  },
  data() {
    return {
      haveCount:0,
      per:false,
      btnLoading: false,
      form: {},
      // 演出列表
      showList: [],
      // 演出对应区域下拉项
      areaOps: [],
      // 当前选择的演出区域份数
      currentShow: {
        showName: '',
        areaName: '',
        name: '',
        nums: ''
      },
      // 当前选择的区间、概率
      currentProb: {
        integralNum: '',
        prob: ''
      },
      sponsors:[]
    };
  },
  computed: {
    prizeType() {
      return get(this.$route, 'params.prizeType', '');
    },
    activity() {
      return get(this.$route, 'params.activityId', '');
    },
    prizeId() {
      return get(this.$route, 'params.prizeId', '');
    },
    level() {
      return get(this.$route, 'params.level', '');
    },
    isEdit() {
      return !!this.prizeId;
    },
    renderData() {
      const extendData = {
        // 电子票表单项//备用，现在没有
        // 1: [
        //   {
        //     label: '奖品设置:',
        //     name: 'eticketList',
        //     required: true,
        //     value: []
        //   },
        //   {
        //     type: 'textarea',
        //     label: '兑换说明',
        //     required: false,
        //     value: '',
        //     name: 'prizeIntro'
        //   },
        //    {
        //   type: 'select',
        //   label: '具体分类:',
        //   name: 'miniType',
        //   required: true,
        //   value: 0,
        //   options: [
        //     {
        //       label: '低成本',
        //       value: 0
        //     },
        //     {
        //       label: '中成本',
        //       value: 1
        //     },
        //     {
        //       label: '高成本',
        //       value: 2
        //     },
        //     {
        //       label: '只能一次',
        //       value: 3
        //     }
        //   ]
        // },
        // ],
        // 积分表单项
        3: [
          {
            label: '积分数量、概率:',
            name: 'integralProbList',
            value: [],
            required: true
          }
        ],
        // 新增实物门票选项
        1: [
          {
            label: '奖品库存:',
            type: 'text',
            name: 'prizeNum',
            value: '',
            required: true
          },
          {
            label: '每日最高出票:',
            type: 'text',
            name: 'sendNum',
            value: '',
            required: true
          },
          {
          type: 'select',
          label: '具体分类:',
          name: 'miniType',
          required: true,
          value: 0,
          options: [
            {
              label: '低成本',
              value: 0
            },
            {
              label: '中成本',
              value: 1
            },
            {
              label: '高成本',
              value: 2
            },
            {
              label: '只能一次',
              value: 3
            }
          ]
        },
        {
            label: '兑奖说明:',
            type: 'textarea',
            name: 'prizeIntro',
            value: '',
            required: false
          },
        ],
        2: [
          {
            label: '奖品库存:',
            type: 'text',
            name: 'prizeNum',
            value: '',
            required: true
          },
          {
          type: 'select',
          label: '具体分类:',
          name: 'miniType',
          required: true,
          value: 0,
          options: [
            {
              label: '低成本',
              value: 0
            },
            {
              label: '中成本',
              value: 1
            },
            {
              label: '高成本',
              value: 2
            },
            {
              label: '只能一次',
              value: 3
            }
          ]
        },
        {
            label: '兑奖说明:',
            type: 'textarea',
            name: 'prizeIntro',
            value: '',
            required: false
          },
        ],
        4: [          
          {
          type: 'select',
          label: '具体分类:',
          name: 'miniType',
          required: true,
          value: 0,
          options: [
            {
              label: '低成本',
              value: 0
            },
            {
              label: '中成本',
              value: 1
            },
            {
              label: '高成本',
              value: 2
            },
            {
              label: '只能一次',
              value: 3
            }
          ]
        },
         {
          type: 'select',//select
          label: '选择优惠券:',
          name: 'codeType',
          required: true,
          value:'',
          options:this.sponsors
        },
        {
            label: '奖品库存:',
            type: 'text',
            name: 'prizeNum',
            value: '',
            required: true
        },
        {
          label: '兑奖说明:',
          type: 'textarea',
          name: 'prizeIntro',
          value: '',
          required: false
        },
        ]
      };
      return [
        {
          type: 'text',
          label: '奖品名称:',
          name: 'prizeName',
          value: '',
          required: true
        },
        {
          type: 'text',
          label: '奖品概率:',
          value: '',
          name: 'prob',
          required: true
        },
        {
          type: 'radioGroup',
          label: '奖品类型:',
          name: 'prizeType',
          required: true,
          value: 3,
          disabled: this.isEdit,
          options: [
            {
              label: '饭团',
              value: 3
            },
            {
              label: '实物',
              value: 2
            },
            {
              label: '门票',
              value: 1
            },
            {
              label: '优惠券',
              value: 4
            }
          ]
        },
        {
          type: 'select',
          label: '奖品等级:',
          name: 'level',
          required: true,
          value: 1,         
          options: [
            {
              label: '一等奖',
              value: 1
            },
            {
              label: '二等奖',
              value: 2
            },
            {
              label: '三等奖',
              value: 3
            },
            {
              label: '四等奖',
              value: 4
            },
            {
              label: '五等奖',
              value: 5
            },
            {
              label: '六等奖',
              value: 6
            },
            {
              label: '七等奖',
              value: 7
            },
            {
              label: '八等奖',
              value: 8
            },
            {
              label: '九等奖',
              value: 9
            },
            {
              label: '十等奖',
              value: 10
            },
            {
              label: '十一等奖',
              value: 11
            },
            {
              label: '十二等奖',
              value: 12
            },
            {
              label: '十三等奖',
              value: 13
            },
            {
              label: '十四等奖',
              value: 14
            },
            {
              label: '十五等奖',
              value: 15
            },
            {
              label: '十六等奖',
              value: 16
            },
            {
              label: '十七等奖',
              value: 17
            },
            {
              label: '十八等奖',
              value: 18
            },
            {
              label: '十九等奖',
              value: 19
            },
            {
              label: '二十等奖',
              value: 20
            }
          ]
        },
        ...(this.isEdit ? extendData[this.form.prizeType] || [] : [])
      ];
    }
  },
  methods: {
    queryLabelByVal(list, val) {
      if (!list || !val || !Array.isArray(list)) {
        return '';
      }
      const match = list.find(({ value }) => value === val);
      return match ? match.label : '';
    },
    // 添加门票
    addShow() {
      if (this.currentShow.showName && this.currentShow.areaName && String(this.currentShow.nums) && !isContains(this.form.eticketList, this.currentShow)) {
        if (!/^[1-9]\d*$/.test(this.currentShow.nums)){
          Message.warning('奖品份数请设置正整数！');
          return false;
        }
        const name = `${this.currentShow.showName}/${this.currentShow.count}/${this.currentShow.nums}份`;
        this.form.eticketList.push({ ...this.currentShow, name });
        this.currentShow = {
          areaName: '',
          showName: '',
          name: '',
          nums: '',
          count:''
        };
      }
    },
    handleDel(index) {
      this.form.eticketList.splice(index, 1);
    },
    checkFend(tnew=0,tjf=0){
      let tall=this.form.integralProbList,tnew1=parseInt(tnew);
       for(let o in tall){
          if(tall[o].integralNum==tjf){
            Message.warning("已有"+tjf+"积分段，请更改");
            return false;
          }
          tnew1+=parseInt(tall[o].prob);
        }        
        if(tnew1==100){this.per=true;
          Message.success("您已配置好各段概率！");
        }else if(tnew1>100){
            Message.error("各个积分奖品段概率和不能大于100！");
            return false;
        }else{
          Message.warning("您还有"+(100-tnew1)+"%需要分配！");
        }
    },
    // 添加概率
    handleAddProb() {
      if (String(this.currentProb.prob) && String(this.currentProb.integralNum)) {  
        let tnew=this.currentProb.prob,tjf=this.currentProb.integralNum;
        this.checkFend(tnew,tjf);       
       
        this.form.integralProbList.push({
          integralNum: this.currentProb.integralNum,
          prob: this.currentProb.prob
        });
        this.currentProb = {
          prob: '',
          integralNum: ''
        };
      }
    },
    handleDelProb(index) {
      this.form.integralProbList.splice(index, 1);
    },
    handleConfirm() {//提交数据
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      if(this.isEdit && this.prizeType==3){
        if(!this.per){Message.error('请确保各个积分奖品段概率和为100%');return false;}
        }
      const prizeId=this.prizeId;
      delete this.form.isChange;     
      const { id,createTime,createUser, prizeNum,updateTime,updateUser, ...others } = this.form;
      delete others.prizeId;
     
      const params = {
        ...others,
        prizeId,
        id,
        count:prizeNum,        
        prizeNum,
        activityId: this.activity        
      };
      console.log("提交的数据：",params);
      // return;
      if (this.isEdit) {
        params.id = this.prizeId;
      }
      this.btnLoading = true;
      const uri = this.isEdit ? API.update : API.insert;
      const method = this.isEdit ? this.$role : this.$service;      
      method.post(uri, params, true).then(res => {
        // console.log("请求结果：",res);
        this.btnLoading = false;
        if (res && res.code === 0) {
          Message.success('保存成功！');
          this.$router.go(-1);
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    },
    // 根据演出场地查询区域
    async onShowChange(val) {
      const show = this.showList.find(({ label }) => val === label);
      if (!show) {
        return false;
      }
      this.areaOps = show.chooseSeat ? await this.queryArea(show.placeId) : show.ticketGearList;
    },
    // 根据场地id查询区域列表
    async queryArea(placeId) {
      const ret = await this.$service.post(BasicApi.queryAreaListByPlaceId, { placeId });
      return ret.map(item => {
        return {
          label: item.areaName,
          value: item.id
        };
      });
    },
    // 查询演出列表
    async queryShowList() {
      return this.$service.post(ShowApi.getShowList, { page: 1, limit: 9999 }).then(res => {
        if (res) {
          this.showList = res.list.map(item => {
            let ticketGearList = item.performanceVo.ticketGearList || [];
            ticketGearList = ticketGearList ? ticketGearList.map(({ id, ticketGearName }) => ({ label: ticketGearName, value: id })) : [];
            return {
              chooseSeat: !!(item.placeInfo.placeInfo === 1),
              ticketGearList,
              label: item.performanceVo.title,
              value: item.performanceVo.id,
              placeId: item.placeInfo.id
            };
          });
        }
      });
    },
    queryFromInfo() {
            this.$service.post(API.queryList, {level:this.level, activityId: this.activity, prizeType: this.prizeType }).then(res => {
        // console.log("获取信息：",res)
        if (res) {
          this.form = Object.assign({}, this.form, {
            ...res,
            eticketList: res.eticketList || [],
            integralProbList: res.integralProbList || []
          });
          this.form.prizeNum=this.form.count ? this.form.count:this.form.prizeNum;
          if(this.isEdit && this.prizeType==3){
            this.checkFend(0,0);
          }
        }
      });
    },
queryQuanInfo(tids) {//获取兑换码信息
        this.$service.post(ShowApi.queryQuanList, {ids:tids }).then(res => {
        // console.log("兑换码：",res)
        if (res) {
          this.sponsors=res.map(({name,id,count})=>{
            return {label:name+"("+count+"库存)",
                    value:id
                    }
            }
          );
        }
      });
    }
  }, 
  async created() {
    await this.queryShowList();
    if (this.isEdit) {
      this.queryQuanInfo(this.$route.params.sponsorId);
      this.queryFromInfo();
    }
  }
};
</script>
<style lang="scss">
.activity-edit {
  .input_small {
    max-width: 70px !important;
    margin: 0 10px;
  }
  .show-select {
    width: 200px;
  }
}
</style>
