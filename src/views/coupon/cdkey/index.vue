<template>
  <!-- 优惠券兑换码列表 -->
  <section class="coupon-list page_main">
    <section class="page_card page_card_padding">
      <form-title>{{$route.name}}</form-title>
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">生成兑换码</el-button>
      <template-table
        v-loading="loading"
        :hasIndex="false"
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
import API from '@api/coupon';

export default {
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '生成说明',
          name: 'remark'
        },
        {
          label: '优惠券名称',
          name: 'title',
          render: (h, { row }) => {
            const { coupon = { title: '' } } = row;
            return <span>{coupon.title || ''}</span>;
          }
        },
        {
          label: '优惠券类型',
          name: 'couponType',
          render(h) {
            return <span>满减</span>;
          }
        },
        {
          label: '状态',
          name: 'status',
          render: (h, { row }) => {
            return <span>{row.status === '1' ? '启用' : '停用'}</span>;
          }
        },
        {
          label: '生成数量',
          name: 'allNum'
        },
        {
          label: '已兑换数量',
          name: 'changedNum'
        },
        {
          label: '已适用数量',
          name: 'usedNum'
        }
      ],
      tableBtns: [
        {
          label: '停用',
          role: 'close',
          showHandler: (index, row) => {
            return String(row.status) === '1';
          }
        },
        {
          label: '启用',
          role: 'open',
          showHandler: (index, row) => {
            return String(row.status) === '2';
          }
        },
        {
          label: '使用情况',
          role: 'detail'
        }
      ],
      tableList: [{}],
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
      let title;
      let status;
      switch (role) {
        case 'close':
          title = '停用';
          status = '2';
          break;
        case 'open':
          title = '启用';
          status = '1';
          break;
        case 'detail':
          this.$router.push({
            name: '兑换码使用情况',
            params: {
              id: row.id
            }
          });
          return false;
          break;
        default:
          break;
      }
      Message.confirm(`${title}说明`, `确定${title}当前优惠券兑换码？`, () => {
        this.$service.post(API.updateEnableStatus, { id: row.id, status }, true).then(res => {
          if (res && res.code === 0) {
            Message.success('设置成功！');
            this.queryTableList();
          } else {
            Message.error(`${res.message || '设置失败！'}`);
          }
        });
      });
    },
    hadnleAdd() {
      this.$router.push({
        name: '生成兑换码'
      });
    },
    queryTableList() {
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize,
        businessTag: 1
      };
      this.loading = true;
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