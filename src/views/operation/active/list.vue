<template>
  <!-- 饭团互动活动 -->
  <section class="banner-list page_main">
    <section class="page_card page_card_padding">
      <form-title>任务列表</form-title>      
      <template-table
        :hasIndex="false"
        :table-list="tableList"
        :table-column="tableColumn"
        :table-btns="tableBtns"
        :operationBtnWidth="220"
        @handleEvent="handleEvent"
      ></template-table>     
    </section>
  </section>
</template>
<script>
import TemplateTable from '@components/template-table';
import TemplatePage from '@components/template-page';
import Message from '@utils/message';
import API from '@api/active';

export default {
  components: {
    TemplateTable,
    TemplatePage
  },
  data() {
    return {
      tableColumn: [
        {
          label: '任务名称',
          name: 'name'
        },
        {
          label: '获得饭团',
          name: 'addcount'
        },
        {
          label: '次数限制',
          name: 'number',
          render:(h,{row})=>{
            if(row.number==0){
              return <span>{row.numofday}/日</span>
            }else{
              return <span>{row.number}</span>
            }
          }
        },
        {
          label: '更新时间',
          name: 'updatetime'
        },        
        {
          label: '状态',
          name: 'status',
          render: (h, { row }) => {
            return <span>{row.status === 0 ? '开启' : '停用'}</span>;
          }
        },        
      ],
      tableBtns: [
        {
          label: '编辑',
          role: 'edit'
        },
        // {
        //   label: '删除',
        //   role: 'del'
        // }
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
    handleEvent(row, role, index) {
      switch (role){
        case 'edit':
          this.$router.push({
            name: '编辑任务',
            params: {
              id: row.id
            }
          });
          break;
        case 'del':
          Message.confirm('删除提示', '确定删除该条banner信息？', () => {
            this.$service.post(API.deleteById, { id: row.id }, true).then(res => {
              if (res && res.code === 0) {
                Message.success('删除成功！');
                this.queryTableList();
              } else {
                Message.error(`${res.message || '删除失败！'}`);
              }
            });
          });
          break;       
        default:
          break;
      }
    },
    handleSearch() {
      this.queryTableList();
    },
    queryTableList() {
      const params = {
        // page: this.pageInit.page,
        // limit: this.pageInit.pageSize
      };
      this.$service.post(API.integralRoleList, params).then(res => {
        console.log("任务列表",res);
        if (res) {
          // this.pageInit.total = res.total;
          this.tableList = res;
        }
      });
    }
  },
  mounted() {
    this.queryTableList();
  }
};
</script>