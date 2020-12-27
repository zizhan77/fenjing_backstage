<template>
  <!-- 验票员列表 -->
  <section class="sponsor-list page_main">
    <section class="page_card page_card_padding">
      <form-title>{{$route.name}}</form-title>
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新增验票员</el-button>
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
import API from '@api/ticket';
import { formatDate } from '@utils/utils';

const Freeze = 0;
const UnFreeze = 1;

export default {
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '手机号码',
          name: 'phoneNumber'
        },
        {
          label: '验票员名称',
          name: 'name'
        },
        {
          label: '验票员状态',
          name: 'status',
          render: (h, { row }) => {
            return <span>{row.status === 1 ? '启用' : '已冻结'}</span>;
          }
        },
        {
          label: '创建时间',
          name: 'createTime',
          render: (h, { row }) => {
            return <span>{formatDate(row.createTime, 'yyyy-MM-dd HH:mm:ss')}</span>;
          }
        }
      ],
      tableBtns: [
        {
          label: '信息修改',
          role: 'edit'
        }
        // {
        //   label: '冻结账户',
        //   role: 'freeze',
        //   showHandler: (index, row) => {
        //     return row.status === UnFreeze;
        //   }
        // },
        // {
        //   label: '解冻账户',
        //   role: 'unFreeze',
        //   showHandler: (index, row) => {
        //     return row.status === Freeze;
        //   }
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
  computed: {
    searchData() {
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
      let title = '';
      let status;
      switch (role) {
        case 'edit':
          this.$router.push({
            name: '验票员配置',
            params: {
              userId: row.id
            }
          });
          return false;
          break;
        case 'freeze':
          title = '冻结';
          status = Freeze;
          break;
        case 'unFreeze':
          title = '解冻';
          status = UnFreeze;
        default:
          break;
      }
      Message.confirm(`${title}提示`, `确定${title}该验票员？`, () => {
        this.$service.post(API.updateStatus, { id: row.id, status }, true).then(res => {
          if (res && res.code === 0) {
            Message.success(`${title}成功！`);
            this.queryTableList();
          } else {
            Message.error(`${res.message || `${title}失败！`}`);
          }
        });
      });
    },
    hadnleAdd() {
      this.$router.push({
        name: '验票员配置'
      });
    },
    queryTableList() {
      this.loading = true;
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize
      };
      this.$service.post(API.queryList, params).then(res => {
        this.loading = false;
        if (res) {
          this.pageInit.total = res.total;
          this.tableList = res.data;
        }
      });
    }
  },
  created() {
    this.queryTableList();
  }
};
</script>