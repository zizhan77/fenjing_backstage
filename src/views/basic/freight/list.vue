
<template>
  <!-- 运费管理 -->
  <section class="freight-list page_main">
    <section class="page_card page_card_padding" v-loading="loading">
      <form-title>{{$route.name}}</form-title>
      <!-- <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新建场地</el-button> -->
      <section class="mb20 freight-list__edit">
        <label-item label="默认运费:">
          <span v-if="!showEdit">{{defaultFreight}}元</span>
          <el-input
            v-if="showEdit"
            class="freight-list__edit-inner ml10"
            type="text"
            v-model="freight"
          ></el-input>
          <el-button
            v-if="!showEdit"
            type="text"
            class="freight-list__edit-btn"
            @click="handleShowEdit"
          >修改</el-button>
          <template v-if="showEdit">
            <el-button type="primary" @click="handleEditFreight(freight, defaultFreightId)">确定</el-button>
            <el-button @click="showEdit = false">取消</el-button>
          </template>
        </label-item>
      </section>
      <form-title class="ml15">特殊省份运费：</form-title>
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
import TemplateTable from '@components/template-table';
import TemplatePage from '@components/template-page';
import LabelItem from '@components/label-item';
import FormTitle from '@components/form-title';
import Message from '@utils/message';
import API from '@api/basic';

export default {
  components: {
    TemplateTable,
    TemplatePage,
    LabelItem,
    FormTitle
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '特殊省份',
          name: 'oneAddressName'
        },
        {
          label: '特殊运费（元）',
          name: 'freight'
        }
      ],
      tableBtns: [
        {
          label: '修改',
          role: 'edit'
        }
        // {
        //   label: '删除',
        //   role: 'del'
        // }
      ],
      // 输入的运费值
      freight: '',
      // 默认运费
      defaultFreight: '',
      // 默认运费id
      defaultFreightId: '',
      showEdit: false,
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 999,
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
    // 显示运费输入框
    handleShowEdit() {
      this.showEdit = true;
      this.freight = this.defaultFreight;
    },
    // 修改运费
    async handleEditFreight(value = this.freight, id = this.defaultFreightId) {
      const res = await this.editFreight(value, id);
      if (res && res.code === 0) {
        Message.success('修改成功！');
        this.defaultFreight = this.freight;
        this.showEdit = false;
        this.queryTableList();
      } else {
        Message.error(`${res.message || '修改失败！'}`);
      }
    },
    handleEvent(row, role, index) {
      switch (role) {
        case 'edit':
          this.$prompt('运费（元）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: row.freight || 0,
            inputPattern: /^(?:0\.\d{1,2}|[1-9]\d{0,2}(?:\.\d{1,2})?|1000)$/,
            inputType: 'number',
            inputErrorMessage: '请输入0-1000数字(保留两位小数)'
          })
            .then(async ({ value }) => {
              await this.handleEditFreight(value, row.id);
            })
            .catch(() => {});
          break;
        case 'del':
          // 跳转区域列表
          Message.confirm('删除提示', '确定删除该条运费信息？', () => {});
          break;
        case 'del':
          break;
        default:
          break;
      }
    },
    // 修改运费
    async editFreight(value, id) {
      return this.$service.post(API.updateById, { freightId: id, freight: value }, true);
    },
    queryTableList() {
      this.loading = true;
      const params = {
        page: this.pageInit.page,
        limit: this.pageInit.pageSize
      };
      this.$service.post(API.queryInfo, params).then(res => {
        this.loading = false;
        const { defaultFreight = {}, freightVoList = [] } = res;
        this.defaultFreight = this.freight = defaultFreight.freight || 0;
        this.defaultFreightId = defaultFreight.id;

        this.tableList = freightVoList || [];
        if (freightVoList && freightVoList.length) {
          this.pageInit.total = freightVoList.length;
        }
      });
    }
  },
  created() {
    this.queryTableList();
  }
};
</script>
<style lang="scss">
.freight-list {
  &__edit-inner {
    max-width: 100px;
    margin-right: 15px;
  }
  &__edit-btn {
    font-size: 14px;
    margin-left: 15px;
  }
}
</style>
