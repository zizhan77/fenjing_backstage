<template>
  <!-- 区域列表 -->
  <section class="area-list page_main">
    <section class="page_card page_card_padding">
      <form-title>区域列表</form-title>
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">添加区域</el-button>
      <template-table
        class
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
import FormTitle from '@components/form-title';
import TemplateTable from '@components/template-table';
import TemplatePage from '@components/template-page';
import Message from '@utils/message';
import API from '@api/basic';

export default {
  components: {
    TemplateTable,
    TemplatePage,
    FormTitle
  },
  props: {
    placeId: [String, Number],
    areaId: [String, Number]
  },
  data() {
    return {
      tableColumn: [
        {
          label: '区域名称',
          name: 'areaName'
        },
        {
          label: '区域颜色',
          name: 'areaColor',
          render(h, { row }) {
            return <div style={{ width: '30px', height: '30px', backgroundColor: row.areaColor }}></div>;
          }
        },
        {
          label: '创建时间',
          name: 'createTime'
        }
      ],
      tableBtns: [
        {
          label: '信息修改',
          role: 'edit'
        },
        {
          label: '选座配置',
          role: 'seat'
        }
        // {
        //   label: '删除',
        //   role: 'del'
        // }
      ],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 20,
        total: 0
      }
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
          // 区域配置
          this.$router.push({
            name: '区域配置',
            params: {
              areaId: row.id,
              placeId: row.placeId
            }
          });
          break;
        case 'seat':
          // 座位配置
          this.$router.push({
            name: '选座配置',
            params: {
              placeId: this.placeId,
              areaId: row.id,
              areaName: row.areaName
            }
          });
          break;
        case 'del':
          Message.confirm('删除提示', '确定删除该条区域？', () => {
            // this.$service.post(API., { areaId: row.id, placeId:this.placeId },true).then(res=>{
            //   if (res && res.code ===0) {
            //     Message.success('删除成功!')
            //     this.queryTableList()
            //   }else{
            //     Message.error(`${res.message || '删除失败！'}`)
            //   }
            // })
          });
          break;
        default:
          break;
      }
    },
    hadnleAdd() {
      this.$router.push({
        name: '区域配置',
        params: {
          placeId: this.placeId
        }
      });
    },
    queryTableList() {
      this.$service.post(API.queryAreaListByPlaceId, { placeId: this.placeId }).then(res => {
        if (res) {
          this.tableList = res;
        }
      });
    }
  },
  created() {
    this.queryTableList();
  }
};
</script>