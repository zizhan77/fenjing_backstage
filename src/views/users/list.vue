<template>

  <!-- 用户列表 -->
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
import Modal from '@components/Modal'
const Freeze = 0
const UnFreeze = 1

export default {
  components: {
    Modal
  },
  data() {
    return {    
      loading: false,
      tfant: 0,
      form: {},
      tableColumn: [
        {
          label: '用户id',
          name: 'id'
        },
        {
          label: '手机号',
          name: 'phoneNumber'
        },
        {
          label: '用户名',
          name: 'name'
        },
        {
          label: '用户状态',
          name: 'status',
          render: (h, { row }) => {
            return <span>{row.status ? '正常' : '冻结'}</span>
          }
        },
        {
          label: '创建时间',
          name: 'createTime'
          // render: (h, { row }) => {
          //   return <span>{formatDate(row.createTime, 'yyyy-MM-dd HH:mm:ss')}</span>;
          // }
        },
        {
          label: '用户来源',
          name: 'sourceName'
        },
        {
          label: '饭团数量',
          name: 'integral',
          render: (h, { row }) => {
            var _this = this
            return h('span', [
              h('el-input', {
                props: {
                  value: row.integral
                },
                on: {
                  'input'(even) {
                    row.integral = even
                  },
                  'change'(event) {
                    const integral = event
                    const id = row.id
                    const params = {
                      integral,
                      id
                    }
                    // console.log("变完了的值：",event);
                    _this.$service.post(API.setFantuan, params, true).then(res => {
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
          label: '抽奖设置',
          role: 'setChouj'
        },
        {
          label: '饭团设置',
          role: 'setFant'
        },
        {
          label: '冻结用户',
          role: 'freeze',
          showHandler: (index, row) => {
            return row.status === UnFreeze
          }
        },
        {
          label: '解冻用户',
          role: 'unFreeze',
          showHandler: (index, row) => {
            return row.status === Freeze
          }
        },
        {
          label: '操作记录',
          role: 'record'
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
    renderData() {
      return [
        {
          label: '饭团数量',
          name: 'fantuan',
          value: this.tfant,
          type: 'number',
          required: true
        }
      ]
    },
    searchData() {
      return [
        {
          label: '手机号:',
          name: 'phoneNumber',
          type: 'text',
          value: ''
        },
        {
          label: '用户状态:',
          name: 'status',
          type: 'select',
          value: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '正常',
              value: UnFreeze
            },
            {
              label: '冻结中',
              value: Freeze
            }
          ]
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
          break
        case 'setChouj': {
          this.$router.push({
            name: '抽奖设置',
            params: {
              userCode: row.bizCode
            }
          })
          return true
        }
        case 'setFant': {
          // 新增弹窗模式

          return false
          const pa = {}
          pa.id = row.id
          pa.integral = row.integral
          this.$router.push({
            name: '设置饭团',
            params: {
              row: JSON.stringify(pa)
            }
          })
          return false
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
        page: this.pageInit.page,
        limit: this.pageInit.pageSize,
        ...this.searchForm
      }
      this.$service.post(API.queryUserList, params).then(res => {
        this.loading = false
        if (res) {
          this.pageInit.total = res.total
          // this.tableList = res.data;
          this.tableList = []
          setTimeout(() => { this.tableList = res.data }, 20)
        }
      })
    },
    surechange() { // 确认修改，新增modal
      console.log('确认')
    },
    cancels() {
      console.log('取消')
    },
    changed(res) {
      console.log(res)
    }
  }
}
</script>
