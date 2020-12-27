<template>
  <!-- 兑换码使用情况 -->
  <section class="actor-list page_main">
    <page-search :searchData="searchData" v-model="searchForm" @onSearch="handleChange(1)"></page-search>
    <section class="page_card page_card_padding">
      <template-table
        v-loading="loading"
        :hasIndex="false"
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
import API from '@api/coupon';

export default {
  props: {
    id: [String, Number]
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '序号',
          name: 'sort'
        },
        {
          label: '兑换码',
          name: 'mainId'
        },
        {
          label: '优惠券名称',
          name: 'couponName'
        },
        {
          label: '状态',
          name: 'status',
          render: (h, { row }) => {
            let status = row.status ? String(row.status) : '';
            if (!status) {
              return '';
            }
            let label;
            switch (status) {
              case '1':
                label = '未兑换';
                break;
              case '2':
                label = '未使用';
                break;
              case '3':
                label = '已使用';
                break;
              default:
                break;
            }
            return <span>{label}</span>;
          }
        },
        {
          label: '用户信息',
          name: 'userPhone'
        },
        {
          label: '兑换时间',
          name: 'createTime'
        },
        {
          label: '使用时间',
          name: 'updateTime'
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
          label: '手机号:',
          name: 'phoneNumber',
          type: 'text',
          value: ''
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
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize,
        mainId: this.id,
        ...this.searchForm
      };
      this.loading = true;
      this.$service.post(API.queryRecordList, params).then(res => {
        this.loading = false;
        if (res) {
          this.pageInit.total = res.total;
          this.tableList = res.data || [];
        }
      });
    }
  },
  created() {
    this.queryTableList();
  }
};
</script>