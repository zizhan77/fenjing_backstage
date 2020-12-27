<template>
  <!-- 城市管理 -->
  <section class="city-list page_main">
    <page-search :searchData="searchData" v-model="searchForm" @onSearch="handleChange(1)"></page-search>
    <section class="page_card page_card_padding">
      <!-- <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新建场地</el-button> -->
      <template-table
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
import API from '@api/basic';
import Message from '@utils/message';

const OPEN = 1;
const CLOSE = 0;

export default {
  components: {
    TemplateTable,
    TemplatePage,
    PageSearch
  },
  data() {
    return {
      tableColumn: [
        {
          label: '城市名',
          name: 'addressName'
        },
        {
          label: '状态',
          name: 'status',
          render: (h, { row }) => {
            return <span>{row.status === OPEN ? '启用' : '禁用'}</span>;
          }
        }
      ],
      tableBtns: [
        {
          label: '禁用',
          role: 'close',
          showHandler: (index, row) => {
            return row.status === OPEN;
          }
        },
        {
          label: '启用',
          role: 'open',
          showHandler: (index, row) => {
            return row.status === CLOSE;
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
          label: '城市名:',
          name: 'cityName',
          type: 'text',
          value: ''
        },
        {
          label: '城市状态:',
          name: 'status',
          type: 'select',
          value: '',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '启用',
              value: OPEN
            },
            {
              label: '禁用',
              value: CLOSE
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
    handleEvent(row, role, index) {
      let status = OPEN;
      switch (role) {
        case 'open':
          status = OPEN;
          break;
        case 'close':
          status = CLOSE;
          break;
        default:
          break;
      }
      let title = status ? '启用' : '禁用';
      Message.confirm(`${title}提示`, `是否${title}该城市？`, () => {
        this.$service.post(API.updateCityStatus, { cityId: row.id, status }, true).then(res => {
          if (res && res.code === 0) {
            Message.success(`${status === OPEN ? '开启成功！' : '禁用成功！'}`);
            this.queryTableList();
          } else {
            Message.error(`${res.message || '设置失败！'}`);
          }
        });
      });
    },
    hadnleAdd() {
      this.$router.push({
        name: '场地详情'
      });
    },
    queryTableList() {
      const params = {
        ...this.searchForm,
        page: this.pageInit.page,
        limit: this.pageInit.pageSize
      };
      this.$service.post(API.queryCityList, params).then(res => {
        if (res) {
          this.tableList = res.list;
          this.pageInit.total = res.total;
        }
      });
    }
  },
  created() {
    this.queryTableList();
  }
};
</script>