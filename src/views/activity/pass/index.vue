<template>
  <!-- 关卡列表 -->
  <section class="pass-list page_main">
    <section class="page_card page_card_padding">
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新增关卡</el-button>
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
import Message from '@utils/message';

export default {
  props: {
    activityId: [Number, String]
  },
  data() {
    return {
      tableColumn: [
        {
          label: '序号',
          name: 'index'
        },
        {
          label: '关卡名称',
          name: 'name'
        },
        {
          label: '品牌方图片',
          name: 'img'
        },
        {
          label: '启用状态',
          name: 'isOpen'
        }
      ],
      tableBtns: [
        {
          label: '修改',
          role: 'edit'
        },
        {
          label: '删除',
          role: 'del'
        }
      ],
      tableList: [{}],
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
            name: '关卡设置',
            params: {
              passId: 1
            }
          });
          break;
        case 'del':
          Message.confirm('删除提示', '是否删除当前关卡？', () => {});
          break;
        default:
          break;
      }
    },
    hadnleAdd() {
      this.$router.push({
        name: '关卡设置'
      });
    },
    handleSearch() {
      this.queryTableList();
    },
    queryTableList() {}
  },
  created() {
    this.queryTableList();
  }
};
</script>