<template>
  <!-- 演出列表 -->
  <section class="show-list page_main">    
    <section class="page_card page_card_padding">
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新增排行项目</el-button>
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
      </span>
    </el-dialog>
  </section>
</template>
<script>
import PageSearch from '@components/page-search';
import TemplateTable from '@components/template-table';
import TemplatePage from '@components/template-page';
import API from '@api/sort';
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
          name: 'name'
        },        
        {
          label: '状态',
          name: 'enable',
          render(h, { row }) {
            return <span>{row.enable === "1" ? '启用中' : '停用中'}</span>;
          }
        },
        {
          label: '创建时间',
          name: 'creatTime'
        },
        {
          label: '演出时间',
          name: 'startTime'
        },
        {
          label: '饭团数',
          name: 'count'
        }
      ],
      tableBtns: [
        {
          label: '信息修改',
          role: 'edit'
        },        
        {
          label: '下榜',
          role: 'close',
          showHandler: (index, row) => {
            return row.enable === "1";
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
    showData() {
      return [{ label: '场次:', name: 'showId', type: 'select', value: '', required: true, options: this.showOps }];
    }
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
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
            name: '排行详情',
            params: {
              showId: row.id
            }
          });
          break;        
        case 'close':
          Message.confirm('停用提示', '是否停用该场演出？', async () => {
            await this.setShowStatus(row.id, CLOSE);
          });
          break;       
        default:
          break;
      }
    },
    // 演出启用停用
    async setShowStatus(id, enable) {
      const title = enable === OPEN ? `启用` : `下榜`;
      this.$service.post(API.updateEnable, { id: id, "enable":0 }, true).then(res => {
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
        name: '排行详情'
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
      console.log("所有列表：",table)
      if (table) {
        this.pageInit.total = table.total || 0;
        this.tableList = table.data
      }
    }
  }, 
  async mounted() {
    await this.queryTableList();
  }
};
</script>