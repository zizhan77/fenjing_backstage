<template>
  <!-- 用户拉新 -->
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
import PageSearch from '@components/page-search'
import Message from '@utils/message'
import API from '@api/user'
import { formatDate } from '@utils/utils'
import TemplateTable from '@components/template-table'
import TemplatePage from '@components/template-page'

const Freeze = 0
const UnFreeze = 1

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
          label: '用户id',
          name: 'id'
        },
        {
          label: '手机号',
          name: 'phonenumber'
        },
        {
          label: '昵称',
          name: 'name'
        },
        {
          label: '邀请数量',
          name: 'newnum'
        }
      ],
      tableBtns: [
        // {
        //   label: '冻结用户',
        //   role: 'freeze',
        //   showHandler: (index, row) => {
        //     return row.status === UnFreeze;
        //   }
        // },
        // {
        //   label: '解冻用户',
        //   role: 'unFreeze',
        //   showHandler: (index, row) => {
        //     return row.status === Freeze;
        //   }
        // },
        // {
        //   label: '操作记录',
        //   role: 'record'
        // }
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
          name: 'phonenumber',
          type: 'text',
          value: ''
        },
        {
          label: '筛选时间:',
          name: 'createtime',
          type: 'datetimepicker',
          value: '',
          startDate: new Date().getTime() - (60 * 60 * 24 * 30 * 365)
        },
        {
          label: '-',
          name: 'endtime',
          type: 'datetimepicker',
          value: ''
        }
      ]
    }
  },
  created() {
    this.queryTableList()
  },
  methods: {
    handleChange(val) {
      console.log(val)
      this.pageInit.page = val
      this.queryTableList()
    },
    handleEvent(row, role, index) {
      let title = ''
      let status
      switch (role) {
        case 'record':
          this.$router.push({
            name: '操作记录',
            params: {
              userId: row.id
            }
          })
          return false
          break
        case 'freeze':
          title = '冻结'
          status = Freeze
          break
        case 'unFreeze':
          title = '解冻'
          status = UnFreeze
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
    queryTableList() {
      this.loading = true
      const { ...other } = this.searchForm
      const params = {
        pageNo: this.pageInit.page,
        pageSize: this.pageInit.pageSize,
        ...other
      }
      this.$service.post(API.queryUserNew, params).then(res => {
        this.loading = false
        if (res) {
          // console.log(res)
          this.pageInit.total = res.rows
          this.tableList = []
          setTimeout(() => { this.tableList = res.lists }, 20)
        }
      })
    }
  }
}
</script>
