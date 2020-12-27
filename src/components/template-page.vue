<template>
  <div class="page_pagination_main page_card_padding page_card">
    <el-pagination
      background
      v-if="paginationInit.total > paginationInit.pageSize"
      @current-change="handleCurrentChange"
      :current-page="paginationInit.page"
      :page-size="paginationInit.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="paginationInit.total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: 'templatePagination',
  props: {
    // 搜索选项（默认总数为0）
    paginationInit: {
      type: Object,
      default() {
        return {
          total: 0,
          page: 1,
          pageSize: 20
        };
      }
    }
  },
  methods: {
    // 页面改变事件（当前页）
    handleCurrentChange(currentPage) {
      this.$emit('change', currentPage);
    }
  }
};
</script>


