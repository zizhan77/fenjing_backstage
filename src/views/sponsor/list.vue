<template>
  <!-- 赞助商列表 -->
  <section class="sponsor-list page_main">
    <section class="page_card page_card_padding">
      <form-title>{{$route.name}}</form-title>
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新增赞助商</el-button>
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
import TemplateTable from '@components/template-table';
import TemplatePage from '@components/template-page';

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
          label: '手机号码',
          name: 'phone'
        },
        {
          label: '赞助商名称',
          name: 'name'
        },
        {
          label: '负责人姓名',
          name: 'contactName'
        },
        {
          label: '赞助商状态',
          name: 'status',
          render(h, { row }) {
            return <span>{row.status==2 ? '冻结中' : '启用中'}</span>;
          }
        },
        {
          label: '创建时间',
          name: 'createTime'
        }
      ],
      tableBtns: [
         {
          label: '信息修改',
          role: 'edit'
        },
        {
          label: '添加券码',
          role: 'addq'
        },
       
        {
          label: '冻结账户',
          role: 'freeze'
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
    searchData(){
      return [
        {
          label: '手机号:',
          name: 'phoneNum',
          type: 'text',
          value: ''
        },
        {
          label: '用户状态:',
          name: 'userStatus',
          type: 'select',
          value: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '正常',
              value: 1
            },
            {
              label: '冻结中',
              value: 2
            }
          ]
        }
      ];
    }
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    handleEvent(row, role, index) {
      switch (role) {//编辑券码
        case 'edit':
          this.$router.push({
            name: '赞助商配置',
            params: {
              userId: row.id
            }
          });
          break;
        case 'addq':
          this.$router.push({
            name: '券码列表',
            params: {
              userId: row.id
            }
          });
          break;
        case 'freeze':
          Message.confirm('冻结提示', '确定冻结该账户？', () => {});
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
    queryTableList() {
      this.loading = true;
      this.$service.post(API.sponsorList, { page: this.pageInit.page, limit: this.pageInit.pageSize }).then(res => {
        this.loading = false;
        if (res && res.length) {
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