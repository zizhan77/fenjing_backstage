<template>
  <!-- 抽奖记录 -->
  <section class="record-list page_main">
    <page-search
      ref="search"
      :searchData="searchData"
      v-model="searchForm"
      @onSearch="handleChange(1)"
      @onGet="getexcel"
    ></page-search>
    <section class="page_card page_card_padding" v-loading="loading">     
      <template-table class :table-list="tableList" :table-column="tableColumn"></template-table>
      <template-page :pagination-init="pageInit" @change="handleChange"></template-page>
    </section>
  </section>
</template>
<script>
import API from '@api/activity';
import { get } from 'lodash';
export default {  
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '奖品名称',
          name: 'prizeName'
        },
        {
          label: '抽奖时间',
          name: 'time'
        },
        {
          label: '活动名称',
          name: 'activityName'
        },
        // {
        //   label: '兑换状态（仅限电子票）',
        //   name: 'status',
        //   render(h, { row }) {
        //     return <span>{row.status ? '已兑奖' : '未兑奖'}</span>;
        //   }
        // },
        {
          label: '中奖人',
          name: 'contactName'
        },
        {
          label: '手机号码',
          name: 'contactPhone'
        },
        {
          label: '邮寄省',
          name: 'contactProvince'
        },
        {
          label: '详细地址',
          name: 'contactAddress'
        }
      ],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      searchForm:{},
      params:this.$route.params
    };
  },  
  computed: {
     searchData(){
      return [
        {
          label: '奖品名称:',
          name: 'prizeName',
          type: 'text',
          value: ''
        },
        {
          label: '活动名称:',
          name: 'activityName',
          type: 'text',
          value: ''
        },
        {
          label: '手机号码:',
          name: 'contactPhone',
          type: 'text',
          value: ''
        },        
        {
          label: '奖品类型:',
          name: 'prizeType',
          type: 'select',
          value: '',
          options:[
            {
              label:"门票",
              value:1
            },
            {
              label:"实物",
              value:2
            },
            {
              label:"电子券",
              value:4
            },
          ]
        },
        {
          label: '时间段:',
          name: 'sedate',
          type: 'datetimerange',
          value: []
        },
        // {
        //   label: '兑换状态:',
        //   name: 'status',
        //   type: 'select',
        //   value: '',
        //   options: [
        //     {
        //       label: '全部',
        //       value: ''
        //     },
        //     {
        //       label: '已兑换',
        //       value: 1
        //     },
        //     {
        //       label: '未兑换',
        //       value: 0
        //     }
        //   ]
        // }
      ];
    }
  },
  methods: {
    getexcel(){
      const {sedate,...others}=this.searchForm;
      var startsedate='',endsedate='';
      if(sedate && sedate.length){ startsedate=sedate[0]
          endsedate=sedate[1]}
      const params = {
      startsedate,
      endsedate,
      ...others
    };
    this.$service.post(API.exportexcel, params).then(res => {
      console.log(res);
        if(res){
          window.open("https://www.jiyilive.com/memory-voice-pc/reward.xls")
        }        
      });

    },
    handleChange(val) {      
      this.pageInit.page = val;
      this.queryTableList();
    },
    queryTableList() {      
      this.loading = true;
      const {sedate,...others}=this.searchForm;
      var startsedate='',endsedate='';
      if(sedate && sedate.length){ startsedate=sedate[0]
          endsedate=sedate[1]}
      const params = {
        page: this.pageInit.page,
        pageSize: this.pageInit.pageSize,
        // activityId:this.params.prizeId,
        startsedate,
        endsedate,
        ...others
      };
      console.log("传递的参数：",params);
      this.$service.post(API.queryListByCondition, params).then(res => {
        this.loading = false;
        console.log("请求中奖记录：",res);
        if (res && res.lists.length) {
          this.pageInit.total=res.rows
          this.tableList = [];
          setTimeout(()=>{this.tableList = res.lists;},200)
        }else{
          this.pageInit.total=0
          this.tableList = [];
        }
      });
    }
  },
  mounted(){
    this.queryTableList();
  }
};
</script>
<style lang="scss">
  .el-table .cell.el-tooltip{white-space:normal;}
</style>