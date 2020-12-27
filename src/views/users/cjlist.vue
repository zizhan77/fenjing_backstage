<template>
  <!-- 抽奖设置 -->
  <section class="actor-list page_main">
    <page-search v-model="searchForm" :search-data="searchData" @onSearch="handleChange(1)" />
    <section class="page_card page_card_padding">
      <template-table
        v-loading="loading"
        :table-list="tableList"
        :table-column="tableColumn"
        :table-btns="tableBtns"
        :operation-btn-width="220"
        @handleEvent="handleEvent"
      />
      <template-page :pagination-init="pageInit" @change="handleChange" />
    </section>
  </section>

</template>
<script>
import Message from '@utils/message'
import API from '@api/user'
import { formatDate } from '@utils/utils'

const Freeze = 0
const UnFreeze = 1

export default {
  data() {
    return {
      loading: false,
      modal1: false,
      tmpChouj: 0,
      tableColumn: [
        {
          label: '活动id',
          name: 'activityid'
        },
        {
          label: '活动名称',
          name: 'activitytitle'
        },
        {
          label: '抽奖次数',
          name: 'lotteryqty',
          render: (h, { row }) => {
            var _this = this
            return h('span', [
              h('el-input', {
                props: {
                  value: row.lotteryqty
                },
                on: {
                  'input'(event) {
                    row.lotteryqty = event
                  },
                  'change'(event) {
                    const usercode = row.usercode
                    const activityid = row.activityid
                    const lotteryqty = event
                    const params = {
                      usercode,
                      activityid,
                      lotteryqty
                    }
                    _this.$service.post(API.setChouj, params, true).then(res => {
                      if (res && res.code === 0) {
                        Message.success('设置成功！')
                      } else {
                        Message.error(`${res.message || '设置失败！'}`)
                      }
                    })
                  }
                }
              })
            ])
          }
        }

      ],
      tableBtns: [
        {
          label: '设置次数',
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
    }
  },
  computed: {
    searchData() {
      return []
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
    handleEvent(row, role, index) {
      let status
      const pa = {}
      //   pa.activitytitle = row.activitytitle
      pa.usercode = row.usercode
      pa.activityid = row.activityid
      pa.lotteryqty = row.lotteryqty
      switch (role) {
        case 'freeze':
        {
          this.$router.push({
            name: '设置抽奖',
            params: { row: JSON.stringify(pa) }
          })
          return
        }
        default:
          break
      }
      Message.confirm(`${title}提示`, `确定${title}该用户？`, () => {
        this.$service.post(API.updateUserStatus, { userId: row.id, status }, true).then(res => {
          if (res && res.code === 0) {
            Message.success(`${title}成功！`)
            this.queryTableList()
          } else {
            Message.error(`${res.message || `${title}失败！`}`)
          }
        })
      })
    },
    hadnleAdd() {
      this.$router.push({
        name: '艺人编辑'
      })
    },
    queryTableList() {
      this.loading = true
      const params = {
        // page: this.pageInit.page,
        // limit: this.pageInit.pageSize,
        // ...this.searchForm
        usercode: this.$route.params.userCode
      }
      this.$service.post(API.queryUserChouj, params).then(res => {
        console.log('抽奖数据列表：', res)
        this.loading = false
        if (res) {
          this.tableList = res
        }
      })
    }
  }
}
</script>
