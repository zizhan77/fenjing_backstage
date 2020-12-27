<template>
  <!-- 艺人列表 -->
  <section class="actor-list page_main">
    <!-- <page-search
      :searchData="searchData"
      v-model="searchForm"
      @onSearch="handleChange(1)"
    ></page-search> -->
    <section class="page_card page_card_padding" v-loading="loading">
      <div>{{ name }} 行程管理</div>
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd"
        >新增行程</el-button
      >
      <template-table
        :table-list="tableList"
        :table-column="tableColumn"
        :operationBtnWidth="220"
        :table-btns="tableBtns"
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
import { get } from "lodash";

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
          label: "城市",
          name: "address",
        },
        {
          label: "行程名称",
          name: "intro",
        },
        {
          label: "时间",
          name: "time",
        },
        {
          label: "行程简介",
          name: "tripname",
        },
      ],
      tableBtns: [
        {
          label: "行程修改",
          role: "edit",
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
    actorId() {
      return get(this.$route, "params.actorId", "");
    },
    name() {
      return get(this.$route, "params.name", "");
    },
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    handleEvent(row, role, index) {
      console.log(row, "");
      switch (role) {
        case "edit":
          this.$router.push({
            name: "艺人行程",
            params: {
              actorId: this.actorId,
              editData: row,
              name: this.name,
            },
          });
          break;
        case "trip":
          this.$router.push({
            name: "艺人行程",
            params: {
              actorId: row.id,
            },
          });
          break;
        case "del":
          Message.confirm("删除提示", "确定删除该条艺人行程？", () => {
            this.$service
              .post(
                API.deleteActorTrip,
                {
                  id: row.id,
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
        name: "艺人行程",
        params: {
          actorId: this.actorId,
        },
      });
    },

    queryTableList() {
      this.loading = true;
      const params = {
        actorid: this.actorId,
        page: this.pageInit.page,
        pageSize: this.pageInit.pageSize,
      };
      this.$service.post(API.getActorTripList, params).then((res) => {
        this.loading = false;
        if (res) {
          this.pageInit.total = res.total;
          this.tableList = res.lists;
        }
      });
    },
  },
  mounted() {
    console.log(this.actorId, "this.actorId");
    this.queryTableList();
  },
};
</script>
