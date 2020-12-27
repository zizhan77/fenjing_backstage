<template>
  <!-- 优惠券列表 -->
  <section class="coupon-list page_main">
    <section class="page_card page_card_padding">
      <form-title>{{$route.name}}</form-title>
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新增优惠券</el-button>
      <template-table
        :hasIndex="false"
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
import API from '@api/coupon';

export default {
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '序号',
          name: 'couponSort'
        },
        {
          label: '优惠券名称',
          name: 'title'
        },
        {
          label: '有效期限',
          name: 'usefulDays',
          render: (h, { row }) => {
            const { dateType, usefulDays, startTime, endTime } = row;
            return <span>{dateType === 1 ? `${startTime}至${endTime}` : `${usefulDays}天`}</span>;
          }
        },
        {
          label: '创建时间',
          name: 'createTime'
        },
        {
          label: '使用说明',
          name: 'description'
        }
      ],
      tableBtns: [
        {
          label: '修改',
          role: 'edit'
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
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    handleEvent(row, role, index) {
      switch (role) {
        case 'edit':
          this.$router.push({
            name: '优惠券设置',
            params: {
              couponId: row.id
            }
          });
          break;
        default:
          break;
      }
    },
    hadnleAdd() {
      this.$router.push({
        name: '优惠券设置'
      });
    },
    queryTableList() {
      this.loading = true;
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize
      };
      this.$service.post(API.getCouponListByPage, params).then(res => {
        this.loading = false;
        if (res) {
          this.pageInit.total = res.total;
          this.tableList = res.list;
        }
      });
      // this.$service.post(API.queryCouponList, params).then(res => {
      //   this.loading = false;
      //   if (res) {
      //     this.tableList = res;
      //   }
      // });
    }
  },
  mounted() {
    this.queryTableList();
  }
};
</script>