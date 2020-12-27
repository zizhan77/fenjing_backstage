<template>
  <!-- banner管理 -->
  <section class="banner-list page_main">
    <section class="page_card page_card_padding">
      <form-title>{{$route.name}}</form-title>
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新增</el-button>
      <template-table
        :hasIndex="false"
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
import TemplateTable from '@components/template-table';
import TemplatePage from '@components/template-page';
import Message from '@utils/message';
import API from '@api/banner';

export default {
  components: {
    TemplateTable,
    TemplatePage
  },
  data() {
    return {
      tableColumn: [
        {
          label: '排序序号',
          name: 'sort'
        },
        {
          label: '名称',
          name: 'bannerName'
        },
        {
          label: '图片',
          name: 'thumbUrl',
          render: (h, { row }) => {
            const origin = window.location.origin;
            const src = row.thumbUrl;
            return <img src={src} width="50" height="50" />;
          }
        },
        {
          label: '上线时间',
          name: 'onlinetime'         
        },
        {
          label: '下线时间',
          name: 'offlinetime'
        },        
        {
          label: '启动状态',
          name: 'enable',
          render: (h, { row }) => {
            return <span>{row.enable === 1 ? '启用' : '停用'}</span>;
          }
        },
        {
          label: '平台',
          name: 'platform',
          render(h) {
            return <span>小程序</span>;
          }
        },
        {
          label: '类型',
          name: 'type',
          render: (h, { row }) => {
            return <span>{row.type === 1 ? 'banner' : '开屏页'}</span>;
          }
        },
        {
          label: '城市',
          name: 'city',
          render(h, { row }) {
            const { allPlace, oneAddressName, twoAddressName } = row;
            return <span>{allPlace === 1 ? '全国' : `${oneAddressName}-${twoAddressName}`}</span>;
          }
        },
        {
          label: '链接地址',
          name: 'url',
          render: (h, { row }) => {
            return <span>{row.thumbType == 1 ? '活动' : (row.thumbType == 2 ? '演出' :row.thumbType == 3 ? 'h5:':row.thumbType == 4 ? "小程序appid:":row.thumbType == 5 ? "公众号：":"不跳转")}{row.url}</span>;
          }
        }
      ],
      tableBtns: [
        {
          label: '编辑',
          role: 'edit'
        },
        {
          label: '删除',
          role: 'del'
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
            name: 'banner设置',
            params: {
              bannerId: row.id
            }
          });
          break;
        case 'del':
          Message.confirm('删除提示', '确定删除该条banner信息？', () => {
            this.$service.post(API.deleteById, { id: row.id }, true).then(res => {
              if (res && res.code === 0) {
                Message.success('删除成功！');
                this.queryTableList();
              } else {
                Message.error(`${res.message || '删除失败！'}`);
              }
            });
          });
          break;
        case 'del':
          break;
        default:
          break;
      }
    },
    hadnleAdd() {
      this.$router.push({
        name: 'banner设置'
      });
    },
    handleSearch() {
      this.queryTableList();
    },
    queryTableList() {
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize
      };
      this.$service.post(API.queryOpeningPage, params).then(res => {
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