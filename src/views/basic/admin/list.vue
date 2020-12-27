<template>
  <!-- 管理员列表 -->
  <section class="admin-list page_main">
    <div class="page_card page_card_padding">
      <form-title>{{$route.name}}</form-title>
      <el-button
        class="btn_small mt20 fr"
        type="primary"
        @click="$router.push({name: '管理员配置'})"
      >新增管理员</el-button>
      <template-table
        class="page_card page_card_padding"
        :table-list="tableList"
        :table-column="tableColumn"
        :table-btns="tableBtns"
        @handleEvent="handleEvent"
      ></template-table>
      <template-page :pagination-init="pageInit" @change="handleChange"></template-page>
    </div>
  </section>
</template>
<script>
import TemplateTable from '@components/template-table';
import TemplatePage from '@components/template-page';
import API from '@api/basic';
import Message from '@utils/message';

export default {
  components: {
    TemplateTable,
    TemplatePage
  },
  data() {
    return {
      tableColumn: [
        {
          label: '账号',
          name: 'accountNumber'
        },
        {
          label: '角色',
          name: 'roleName'
        },
        {
          label: '状态',
          name: 'status',
          render: (h, { row }) => {
            const status = row.status;
            return <span>{status === 1 ? '启用' : '禁用'}</span>;
          }
        }
      ],
      tableBtns: [
        {
          label: '修改密码',
          role: 'edit'
        },
        {
          label: '启用',
          role: 'open',
          showHandler: (index, row) => {
            return row.status === 3;
          }
        },
        {
          label: '禁用',
          role: 'close',
          showHandler: (index, row) => {
            return row.status === 1;
          }
        }
      ],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    async handleEvent(row, role, index) {
      switch (role) {
        case 'edit':
          this.$router.push({
            path: '/basic/admin/list/edit',
            query: {
              userId: row.id,
              accountNumber: row.accountNumber,
              role: row.role
            }
          });
          break;
        case 'open':
          await this.setAdminStatus(1, row.id);
          break;
        case 'close':
          await this.setAdminStatus(3, row.id);
          break;
        default:
          break;
      }
    },
    // 开启禁用管理员
    async setAdminStatus(status, id) {
      const title = status ? '启用' : '禁用';
      Message.confirm(`${title}提示`, `确定${title}该管理员？`, () => {
        this.$service.post(API.updateAble, { status, id }, true).then(res => {
          if (res && res.code === 0) {
            Message.success(`${title}成功！`);
            this.queryTableList();
          } else {
            Message.error(`${res.message || `${title}失败！`}`);
          }
        });
      });
    },
    queryTableList() {
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize
      };
      this.$service.post(API.getAdminList, params).then(res => {
        if (res) {
          this.pageInit.total = res.total;
          this.tableList = res.list;
        }
      });
    }
  },
  created() {
    this.queryTableList();
  }
};
</script>