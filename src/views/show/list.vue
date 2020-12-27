<template>
  <!-- 演出列表 -->
  <section class="show-list page_main">
    <page-search
      ref="search"
      :searchData="searchData"
      v-model="searchForm"
      @onSearch="handleChange(1)"
      @onChange="handSearchChange"
    ></page-search>
    <section class="page_card page_card_padding">
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新增演出</el-button>
      <template-table
        v-loading="loading"
        :table-list="tableList"
        :table-column="tableColumn"
        :table-btns="tableBtns"
        @handleEvent="handleEvent"
      ></template-table>
      <template-page :pagination-init="pageInit" @change="handleChange"></template-page>
    </section>
    <el-dialog title="请选择场次" :visible.sync="visible" width="30%">
      <template-form ref="showForm" labelWidth="80px" :renderData="showData" v-model="currentShow"></template-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="selectShowIds">座位设置</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import PageSearch from '@components/page-search';
import TemplateTable from '@components/template-table';
import TemplatePage from '@components/template-page';
import API from '@api/show';
import { formatDate } from '@utils/utils';
import Message from '@utils/message';

const OPEN = 1;
const CLOSE = 2;

const SHOW_STATUS = {
  1: '预售(未确定开售时间)',
  2: '预售(已确定开售时间)',
  3: '开售',
  4: '已过期'
};

export default {
  components: {
    TemplateTable,
    TemplatePage,
    PageSearch
  },
  data() {
    return {
      visible: false,
      loading: false,
      // 当前选择场次
      currentShow: {
        showId: ''
      },
      tableColumn: [
        {
          label: '演出名称',
          name: 'title'
        },
        {
          label: '演出状态',
          name: 'statusStr',
          render(h, { row }) {
            return <span>{SHOW_STATUS[row.status]}</span>;
          }
        },
        {
          label: '城市/场地',
          name: 'address'
        },
        {
          label: '状态',
          name: 'enable',
          render(h, { row }) {
            return <span>{row.enable === OPEN ? '启用中' : '停用中'}</span>;
          }
        },
        {
          label: '创建时间',
          name: 'createTimeStr'
        },
        {
          label: '演出时间',
          name: 'showTimeStr'
        },
        {
          label: '排序序号',
          name: 'sort'
        }
      ],
      tableBtns: [
        {
          label: '信息修改',
          role: 'edit'
        },
        {
          label: '库存管理',
          role: 'stock'
        },
        {
          label: '座位配置',
          role: 'seat'
        },
        {
          label: '批量生成兑换码',
          role: 'code'
        },
        {
          label: '启用',
          role: 'open',
          showHandler: (index, row) => {
            return row.enable === CLOSE;
          }
        },
        {
          label: '停用',
          role: 'close',
          showHandler: (index, row) => {
            return row.enable === OPEN;
          }
        }
      ],
      // 城市下拉项
      cityOps: [],
      // 场地下拉想
      placeOps: [],
      // 场次下拉项
      showOps: [],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      searchForm: {},
      performanceId: '',
      placeId: ''
    };
  },
  computed: {
    searchData() {
      return [
        {
          label: '演出名称:',
          name: 'title',
          type: 'text',
          value: ''
        },
        {
          label: '城市:',
          name: 'city',
          type: 'select',
          value: '',
          options: this.cityOps
        },
        {
          label: '场地:',
          name: 'placeId',
          type: 'select',
          value: '',
          options: this.placeOps
        }
        // {
        //   label: '演出状态:',
        //   name: 'status',
        //   type: 'select',
        //   value: '',
        //   options: [
        //     {
        //       label: '不限',
        //       value: ''
        //     },
        //     {
        //       label: '预售(未确定开售时间)',
        //       value: 1
        //     },
        //     {
        //       label: '预售(已确定开售时间)',
        //       value: 2
        //     },
        //     {
        //       label: '开售',
        //       value: 3
        //     },
        //     {
        //       label: '已过期',
        //       value: 4
        //     }
        //   ]
        // }
      ];
    },
    showData() {
      return [{ label: '场次:', name: 'showId', type: 'select', value: '', required: true, options: this.showOps }];
    }
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    // search change
    async handSearchChange(key, val) {
      if (key === 'city') {
        this.$refs.search.resetForm('placeId');
        if (val) {
          const { list } = await this.$service.post(API.getPlaceList, { city: val, page: 1, limit: 9999 });
          if (list && list.length) {
            this.placeOps = list.map(item => {
              return {
                label: item.name,
                value: item.code
              };
            });
          }
        }
      }
    },
    // 选择场次
    selectShowIds() {
      if (!this.$refs.showForm.validate()) {
        return false;
      }
      this.$router.push({
        name: '座位配置',
        params: {
          performanceId: this.performanceId,
          placeId: this.placeId,
          showId: this.currentShow.showId
        }
      });
    },
    handleEvent(row, role, index) {
      switch (role) {
        case 'edit':
          this.$router.push({
            name: '演出详情',
            params: {
              showId: row.showId
            }
          });
          break;
        case 'stock':
          this.$router.push({
            name: '库存管理',
            params: {
              showId: row.showId,
              title: row.name,
              chooseSeat: row.chooseSeat
            }
          });
          break;
        case 'seat':
          this.$router.push({
            name: '座位配置',
            params: {
              performanceId: row.showId,
              placeId: row.placeId
            }
          });
          break;
        case 'open':
          Message.confirm('启用提示', '是否启用该场演出？', async () => {
            await this.setShowStatus(row.showId, OPEN);
          });
          break;
        case 'close':
          Message.confirm('停用提示', '是否停用该场演出？', async () => {
            await this.setShowStatus(row.showId, CLOSE);
          });
          break;
        case 'code':
          this.performanceId = row.showId;
          this.placeId = row.placeId;
          this.visible = true;
          this.showOps = row.showList.map(item => {
            return {
              label: item.showName,
              value: item.id
            };
          });
          break;
        default:
          break;
      }
    },
    // 演出启用停用
    async setShowStatus(id, enable) {
      const title = enable === OPEN ? `启用` : `停用`;
      this.$service.post(API.updateEnable, { performanceId: id, enable }, true).then(res => {
        if (res && res.code === 0) {
          Message.success(`${title}成功！`);
          this.queryTableList();
        } else {
          Message.error(`${res.message || `${title}失败！`}`);
        }
      });
    },
    hadnleAdd() {
      this.$router.push({
        name: '演出详情'
      });
    },
    async queryTableList() {
      this.loading = true;
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize,
        ...this.searchForm
      };
      const table = await this.$service.post(API.getShowList, params);
      this.loading = false;
      if (table) {
        this.pageInit.total = table.total || 0;
        this.tableList = table.list.map(item => {
          const { performanceVo = {}, placeInfo = {} } = item;
          return {
            ...placeInfo,
            ...performanceVo,
            showId: performanceVo.id,
            placeId: placeInfo.id
          };
        });
      }
    }
  },
  async created() {
    const cityList = await this.$service.post(API.getCityList);
    if (cityList && cityList.length) {
      this.cityOps = cityList.map(item => {
        return {
          label: item.name,
          value: item.code
        };
      });
    }
  },
  async mounted() {
    await this.queryTableList();
  }
};
</script>