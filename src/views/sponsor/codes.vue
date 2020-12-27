<template>
  <!-- 赞助商列表 -->
  <section class="sponsor-list page_main">
    <section class="page_card page_card_padding">
      <form-title>{{$route.name}}</form-title>
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">添加券码</el-button>
      <template-table
        v-loading="loading"
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
import API from '@api/sponsor';

export default {
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '名称',
          name: 'name'
        },
        {
          label: '券码描述',
          name: 'des'
        },
        {
          label: '兑换链接',
          name: 'url'
        },
         {
          label: '优惠券数量',
          name: 'count'
        },
        {
          label: '创建时间',
          name: 'createTime'
        }
      ], 
      tableBtns:[
        {
          label: '编辑',
          role: 'edit'         
        },
        {
          label: '批量上传',
          role: 'upload'         
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
  computed: {
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    getExcel(ele){
      console.log(ele);

    },
    handleEvent(row, role, index) {
      switch (role) {//编辑券码
        case 'upload':
          this.$router.push({
            name: '上传券码',
            params: {
              userId: this.$route.params.userId,
              codeId:row.id
            }
          });
          break;
        case 'edit':
          this.$router.push({
            name: '编辑券码',
            params:{
              userId:this.$route.params.userId,
              qumaId:row.id
            }
          });
          break;
        default:
          break;
      }
    },
    hadnleAdd() {
      this.$router.push({
        name: '编辑券码',
        params:{
          userId:this.$route.params.userId
        }
      });
    },
    queryTableList(){
      this.loading = true;
      this.$service.post(API.queryBySponsorId, { "ids":this.$route.params.userId }).then(res => {
        console.log("券码列表",res)
        this.loading = false;
        if (res && res.length){
          this.tableList = res;
        }
      });
    }
  },
  created(){
    this.queryTableList();
  }
};
</script>