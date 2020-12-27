<template>
  <!-- 艺人列表 -->
  <section class="actor-list page_main">
    <page-search
      :searchData="searchData"
      v-model="searchForm"
      @onSearch="handleChange(1)"
    ></page-search>
    <section class="page_card page_card_padding" v-loading="loading">
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd"
        >新增艺人</el-button
      >
      <template-table
        :table-list="tableList"
        :table-column="tableColumn"
        :table-btns="tableBtns"
        :operationBtnWidth="220"
        @handleEvent="handleEvent"
      ></template-table>
      <template-page
        :pagination-init="pageInit"
        @change="handleChange"
      ></template-page>
    </section>
  </section>
</template>

<script>
import PageSearch from "@components/page-search";
import TemplateTable from "@components/template-table";
import TemplatePage from "@components/template-page";
import Message from "@utils/message";
import API from "@api/basic";

export default {
  components: {
    TemplateTable,
    TemplatePage,
    PageSearch,
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: "艺人名称",
          name: "artistName",
        },
        {
          label: "艺人头像",
          name: "thumbUrl",
          render: (h, { row }) => {
            const origin = window.location.origin;
            const src = row.thumbUrl;
            return <img src={src} width="50" height="50" />;
          },
        },
        {
          label: "出生地",
          name: "birthplace",
          render: (h, { row }) => {
            return (
              <span>
                {" "}
                {row.birthOneAddressName} {row.birthTwoAddressName}{" "}
              </span>
            );
          },
        },
        {
          label: "基本信息",
          name: "basicInfo",
        },
      ],
      tableBtns: [
        {
          label: "修改",
          role: "edit",
        },
        {
          label: "行程管理",
          role: "trip",
        },
        {
          label: "删除",
          role: "del",
        },
      ],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      searchForm: {},
    };
  },
  computed: {
    searchData() {
      return [
        {
          label: "艺人名称:",
          name: "actorName",
          type: "text",
          value: "",
        },
      ];
    },
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    handleEvent(row, role, index) {
      switch (role) {
        case "edit":
          this.$router.push({
            name: "艺人编辑",
            params: {
              actorId: row.id,
            },
          });
          break;
        case "trip":
          this.$router.push({
            name: "行程管理",
            params: {
              actorId: row.id,
            },
           
          });
          break;
        case "del":
          Message.confirm("删除提示", "确定删除该条艺人信息？", () => {
            this.$service
              .post(
                API.deleteArtById,
                {
                  actorId: row.id,
                },
                true
              )
              .then((res) => {
                if (res && res.code === 0) {
                  Message.success("删除成功");
                  this.queryTableList();
                } else {
                  Message.error(`${res.message || "删除失败！"}`);
                }
              });
          });
          break;
        default:
          break;
      }
    },
    hadnleAdd() {
      this.$router.push({
        name: "艺人编辑",
      });
    },
    queryTableList() {
      this.loading = true;
      const params = {
        actorName: this.searchForm.actorName,
        page: this.pageInit.page,
        limit: this.pageInit.pageSize,
      };
      this.$service.post(API.queryArtistList, params).then((res) => {
        this.loading = false;
        if (res) {
          this.pageInit.total = res.total;
          this.tableList = res.list;
        }
      });
    },
  },
  mounted() {
    this.queryTableList();
  },
};
</script>
