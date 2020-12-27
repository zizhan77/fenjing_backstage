<template>
  <!-- 赞助商列表 -->
  <section class="sponsor-list page_main">
    <section class="page_card page_card_padding">
      <form-title>{{$route.name}}</form-title>      
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
import TemplatePage from '@components/template-page';
import TemplateTable from '@components/template-table';

export default {
  components:{
    TemplatePage,
    TemplateTable
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '拼图',
          name: 'url',
          render: (h, { row }) => {
            const origin = window.location.origin;
            const src = row.url;
            return <img src={src} width="50" height="50" />;
          }
        },       
        {
          label: '状态',
          name: 'status',
          render(h, { row }) {
            return <span>{row.status==0 ? "等待审核":row.status==1 ? '🙂通过' : '😭不通过'}</span>;
          }
        }        
      ],
      tableBtns: [
         {
          label: '通过',
          role: 'pass'
        },
        {
          label: '不通过',
          role: 'cut'
        },       
        // {
        //   label: '冻结账户',
        //   role: 'freeze'
        // }
      ],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 15,
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
    handleEvent(row, role, index) {
      switch (role) {
        case 'pass'://设置通过 1
          this.setStatus(row.id,1);
          break;
        case 'cut'://设置不通过 2
          this.setStatus(row.id,2);
          break;        
        default:
          break;
      }
    },
    hadnleAdd() {
      this.$router.push({
        name: '赞助商配置'
      });
    },
    setStatus(id,status){
      this.$service.post(API.setCheckPic,{id,status},true).then(res=>{
        console.log("设置结果",res)
        if(res.code==0){
          Message.success("设置成功~")
          this.queryTableList();
        }else{
          Message.fail("设置失败，请重试~")
        }        
      });
    },
    queryTableList() {
      this.loading = true;
      this.$service.post(API.getCheckPic, { page: this.pageInit.page, limit: this.pageInit.pageSize }).then(res => {
        console.log("获取的图片：",res);
        this.pageInit.total=res.total || 0;   
        res=res.data             
        this.loading = false;
        if (res && res.length){
          this.tableList = res;          
        }
      });
    }
  },
  created() {
    this.queryTableList();
  }
};
</script>