<template>
  <!-- 查询所有兑换码 -->
  <section class="code-list page_main">
    <page-search :searchData="searchData" v-model="searchForm" @onSearch="handleChange(1)"></page-search>
    <section class="page_card page_card_padding">
      <template-table
        v-loading="loading"
        :table-list="tableList"
        :table-column="tableColumn"
        :operationBtnWidth="220"
      ></template-table>
      <template-page :pagination-init="pageInit" @change="handleChange"></template-page>
    </section>
  </section>
</template>
<script>
import Message from '@utils/message';
import API from '@api/activity';
import { formatDate } from '@utils/utils';

// 兑换码类型
const FOR_COUPON = 1;
const FOR_PRIZE = 2;
const FOR_TICKET = 3;
const FOR_SEAT_TICKET = 4;
const FOR_NOSEAT_TICKET = 5;
// 兑换码状态
const UN_EXCHANGE = 1;
const UN_USE = 2;
const USED = 3;

// 类型文本
const TypeTxt = {
  [FOR_SEAT_TICKET]: '有座电子票兑换码',
  [FOR_NOSEAT_TICKET]: '无座电子票兑换码'
};

// 状态文本
const StatusTxt = {
  [UN_EXCHANGE]: '未兑换',
  [UN_USE]: '未使用',
  [USED]: '已使用'
};

export default {
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '兑换码',
          name: 'exchangeCode'
        },
        {
          label: '演出id',
          name: 'performanceId'
        },
        {
          label: '演出名称',
          name: 'performanceName'
        },
        {
          label: '场次',
          name: 'showName'
        },
        {
          label: '票档名称',
          name: 'ticketGearName'
        },
        {
          label: '兑换码状态',
          name: 'status',
          render: (h, { row }) => {
            const status = Number(row.status);
            return <span>{StatusTxt[status]}</span>;
          }
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
    searchData() {
      return [
        {
          label: '兑换码id:',
          name: 'exchangeCode',
          type: 'text',
          value: ''
        },
        {
          label: '兑换码状态',
          name: 'status',
          type: 'select',
          value: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '未兑换',
              value: UN_EXCHANGE
            },
            {
              label: '未使用',
              value: UN_USE
            },
            {
              label: '已使用',
              value: USED
            }
          ]
        },
        {
          label: '兑换码类型:',
          name: 'type',
          type: 'select',
          value: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '有座电子票兑换码',
              value: FOR_SEAT_TICKET
            },
            {
              label: '无座电子票兑换码',
              value: FOR_NOSEAT_TICKET
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
    queryTableList() {
      this.loading = true;
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize,
        ...this.searchForm
      };
      this.$service.post(API.queryExchangeCodeForSms, params).then(res => {
        this.loading = false;
        if (res) {
          this.pageInit.total = res.total;
          this.tableList = res.data;
        }
      });
    }
  },
  mounted() {
    this.queryTableList();
  }
};
</script>