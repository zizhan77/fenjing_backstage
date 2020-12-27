<template>
  <!-- 用户列表 -->
  <section class="actor-list page_main">
    <page-search v-model="searchForm" :search-data="searchData" @onSearch="handleChange(1)" />
    <section class="page_card page_card_padding">
      <template-table
        v-loading="loading"
        :table-list="tableList"
        :table-column="tableColumn"
        :operation-btn-width="220"
      />
      <template-page :pagination-init="pageInit" @change="handleChange" />
    </section>
  </section>
</template>
<script>
import Message from '@utils/message'
import API from '@api/user'

const TYPE = {
  1: '登陆',
  2: '创建订单',
  3: '支付'
}

export default {
  props: {
    userId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '用户id',
          name: 'userId'
        },
        {
          label: '手机号',
          name: 'phoneNumber'
        },
        {
          label: '操作类型',
          name: 'type',
          render(h, { row }) {
            return <span>{TYPE[row.type]}</span>
          }
        },
        {
          label: '操作时间',
          name: 'operateTime'
        }
      ],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      searchForm: {}
    }
  },
  computed: {
    searchData() {
      return [
        {
          label: '手机号:',
          name: 'phoneNumber',
          type: 'text',
          value: ''
        },
        {
          label: '操作类型:',
          name: 'type',
          type: 'select',
          value: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '登陆',
              value: 1
            },
            {
              label: '创建订单',
              value: 2
            },
            {
              label: '支付',
              value: 3
            }
          ]
        },
        {
          label: '操作时间:',
          type: 'daterange',
          name: 'updateTime',
          value: []
        }
      ]
    }
  },
  created() {
    this.queryTableList()
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val
      this.queryTableList()
    },
    queryTableList() {
      this.loading = true
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize,
        userId: this.userId,
        ...this.searchForm
      }
      this.$service.post(API.queryOptRecord, params).then(res => {
        this.loading = false
        if (res) {
          this.pageInit.total = res.total
          this.tableList = res.data
        }
      })
    }
  }
}
</script>
