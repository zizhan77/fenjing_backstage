<template>
  <!-- 订单列表 -->
  <section class="order-list page_main">
    <page-search :searchData="searchData" v-model="searchForm" @onSearch="handleChange(1)"></page-search>
    <section class="page_card page_card_padding">
      <el-button class="btn_small mb10 fr" type="primary" @click="handleImport">导出</el-button>
      <template-table
        class
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
import PageSearch from '@components/page-search';
import TemplateTable from '@components/template-table';
import TemplatePage from '@components/template-page';
import Message from '@utils/message';
import API from '@api/order';
import { formatDate } from '@utils/utils';

const Close = -1;
const AwaitPay = 0;
const AwaitDeliver = 10;
const Deliver = 20;
const Finish = 30;

const statusTxt = {
  [-1]: '取消订单',
  [0]: '待支付',
  [10]: '待发货',
  [20]: '已发货',
  [30]: '已完成'
};

export default {
  components: {
    TemplateTable,
    TemplatePage,
    PageSearch
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '订单号',
          name: 'orderNumber'
        },
        {
          label: '订单状态',
          name: 'status',
          render: (h, { row }) => {
            const { status = 0 } = row;
            return <span>{statusTxt[status]}</span>;
          }
        },
        {
          label: '城市/演出名称',
          name: 'title'
        },
        {
          label: '票品信息',
          name: 'ticketDeliverType'
        },
        {
          label: '订单总价',
          name: 'price',
          render(h, { row }) {
            return <span>{row.price}元</span>;
          }
        },
        {
          label: '收货人信息',
          name: 'userAddress'
        },
        {
          label: '收货人地址',
          name: 'deliverAddress'
        },
        {
          label: '订单创建时间',
          name: 'createTime',
          render: (h, { row }) => {
            return <span>{formatDate(row.createTime)}</span>;
          }
        },
        {
          label: '订单支付时间',
          name: 'payTime',
          render: (h, { row }) => {
            return <span>{formatDate(row.payTime)}</span>;
          }
        }
      ],
      tableBtns: [
        {
          label: '备票发货',
          role: 'deliver',
          showHandler: (index, row) => {
            return row.ticketDeliverType === 10 && row.status !== Close && row.status !== AwaitPay;
          }
        },
        {
          label: '物流信息修改',
          role: 'edit',
          showHandler: (index, row) => {
            // 10快递  20电子票
            return (row.status === AwaitDeliver || row.status === Deliver) && row.ticketDeliverType === 10;
          }
        },
        {
          label: '电子码查看',
          role: 'detail',
          showHandler: (index, row) => {
            return row.status === Finish && row.ticketDeliverType === 20;
          }
        }
        // {
        //   label: '电子码重制',
        //   role: 'reset',
        //   showHandler: (index, row) => {
        //     return row.ticketDeliverType === 20 && row.status !== Close;
        //   }
        // },
        // {
        //   label: '取消',
        //   role: 'cancel',
        //   showHandler: (indx, row) => {
        //     return row.status === AwaitPay;
        //   }
        // }
      ],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 20,
        total: 100
      },
      searchForm: {}
    };
  },
  computed: {
    searchData() {
      return [
        {
          label: '演出名称:',
          name: 'showName',
          type: 'text',
          value: ''
        },
        {
          label: '订单号:',
          name: 'orderNumber',
          type: 'text',
          value: ''
        },
        {
          label: '快递单号:',
          name: 'waybillCode',
          type: 'text',
          value: ''
        },
        // {
        //   label: '城市:',
        //   name: 'city',
        //   type: 'text',
        //   value: ''
        // },
        {
          label: '手机号码:',
          name: 'phone',
          type: 'text',
          value: ''
        },
        {
          label: '订单状态:',
          name: 'status',
          type: 'select',
          value: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '待付款',
              value: 0
            },
            {
              label: '待发货',
              value: 10
            },
            {
              label: '已发货',
              value: 20
            },
            {
              label: '已完成',
              value: 30
            },
            {
              label: '已取消',
              value: -1
            }
          ]
        },
        {
          label: '下单日期:',
          name: 'orderTime',
          value: [],
          type: 'datetimerange'
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
      switch (role) {
        case 'deliver':
          // 备票发货
          this.$prompt('快递单号', '备票发货', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^\S+$/,
            inputErrorMessage: '快递单号不能为空'
          })
            .then(async ({ value }) => {
              await this.handleEditDeliver(value, row.id);
            })
            .catch(() => {});
          break;
        case 'detail':
          // 电子码查看
          Message.confirm('电子码查看', `电子码：${row.waybillCode}`, () => {});
          break;
        case 'reset':
          // 电子码重置
          break;
        case 'edit':
          // 物流信息修改
          this.$prompt('快递单号', '备票发货', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^\S+$/,
            inputErrorMessage: '快递单号不能为空'
          })
            .then(async ({ value }) => {
              await this.handleEditDeliver(value, row.id);
            })
            .catch(() => {});
          break;
        case 'cancel':
          // 取消订单
          break;
        default:
          break;
      }
    },
    // 修改订单电子码或者快递号
    async handleEditDeliver(value, id) {
      this.$service.post(API.editOrderBillCode, { waybillCode: value, id }, true).then(res => {
        if (res && res.code === 0) {
          Message.success('修改成功！');
          this.queryTableList();
        } else {
          Message.error(`${res.message || '修改失败！'}`);
        }
      });
    },
    // 导出
    handleImport() {},
    queryTableList() {
      // const { orderTime } = this.
      // const [  ]
      this.loading = true;
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize,
        ...this.searchForm
      };
      this.$service.post(API.getOrderListByPage, params).then(res => {
        this.loading = false;
        if (res) {
          this.tableList = res.list || [];
          this.pageInit.total = res.total;
        }
      });
    }
  },
  mounted() {
    this.queryTableList();
  }
};
</script>