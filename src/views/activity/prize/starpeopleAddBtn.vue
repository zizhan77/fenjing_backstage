


<template>
  <!-- 奖品列表 -->
  <section class="activity-list page_main">
    <section class="page_card page_card_padding">
      <form-title>{{$route.name}}</form-title>
      <div class="tc">
        <h4 class="fl">{{title}}</h4>
      </div>
      <!-- <h4 class="inline_block">谢谢惠顾概率:0%</h4> -->
      <el-button class="btn_small mt20 fr" type="primary" @click="hadnleAdd">新增奖品</el-button>
      <el-button class="btn_small mt20 fr" type="primary" @click="autoadd">自动生成奖品</el-button>
      <template-table
        :table-list="tableList"
        :table-column="tableColumn"
        :table-btns="tableBtns"
        :operationBtnWidth="220"
        @handleEvent="handleEvent"
      ></template-table>
      <template-page :pagination-init="pageInit" @change="handleChange"></template-page>
    </section>
  </section>
</template>
<script>
import Message from '@utils/message';
import API from '@api/activity';

export default {
  props: {
    activity: [String, Number],
    title: [String, Number]
  },
  data() {
    return {
      tableColumn: [
        {
          label: '奖品名称',
          name: 'prizeName'
        },
        {
          label: '奖品概率',
          name: 'prob',
          render: (h, { row }) => {
            return <span>{row.prob}%</span>;
          }
        },
        {
          label: '奖品总库存',
          name: 'totalNum'
        },
        {
          label: '已发放数量',
          name: 'givedNum'
        }
      ],
      tableBtns: [
        {
          label: '修改',
          role: 'edit'
        },
        // {
        //   label: '兑换码配置',
        //   role: 'cdkey'
        // },
        // {
        //   label: '查看记录',
        //   role: 'detail'
        // }
        {
          label: '删除',
          role: 'del'
        }
      ],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      searchForm: {}
    };
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    autoadd(){
      
    },
    handleEvent(row, role, index) {
      switch (role) {
        case 'edit':
          this.$router.push({
            name: '奖品设置',
            params: {
              activityId: this.activity,
              prizeId: row.id,
              prizeType: row.prizeType,
              level:row.level,
              sponsorId:this.$route.params.sponsorId
            }
          });
          break;
        case 'cdkey':
          this.$router.push({
            name: '批量导入',
            params: {
              prizeName: row.prizeName,
              prizeId: row.id,
              activityId: this.activity
            }
          });
          break;
        case 'detail':
          this.$router.push({
            name: '抽奖记录',
          });
          break;
        case 'del':{
          let id=row.id;
          Message.confirm('删除提示', '确定删除该条奖品信息？', (res) => { 

            this.$service.post(API.deletePriById, {id}).then(res => {
                  console.log("删除结果",res)
                  this.queryTableList();
                });
            
          });
          break;
        }
        case 'del':
          break;
        default:
          break;
      }
    },
    hadnleAdd(){
      this.$router.push({
        name: '奖品设置',
        params: {
          activityId: this.activity
        }
      })
    },
    queryTableList(){
      this.$service.post("actor/pc/getActorTripList", { page:1,pageSize:1,id: this.activity,name:"",url:"",integral:"30" }).then(res => {
        console.log("奖品列表数据：",res);
        if (res){
          this.tableList = res;
          // this.tableList = res.filter(item => item.id === this.activity);
        }
      });
    }
  },
  created(){
    console.log(this.activity)
    this.queryTableList();
  }
}
</script>