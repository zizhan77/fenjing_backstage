<template>
  <!-- 库存管理 -->
  <section class="show-stock page_main">
    <section class="page_card page_card_padding">
      <form-title>{{title}}</form-title>
      <template-table
        :tableList="tableList"
        :tableColumn="tableColumn"
        :tableBtns="tableBtns"
        @handleEvent="handleEvent"
      ></template-table>
      <footer class="page_footer">
        <el-button type="primary" size="medium" @click="handleConfirm">提交</el-button>
        <el-button size="medium" @click="$router.go(-1)">取消</el-button>
      </footer>
    </section>
  </section>
</template>
<script>
import FormTitle from '@components/form-title';
import TemplateTable from '@components/template-table';
import Message from '@utils/message';
import API from '@api/show';
import { formatDate } from '@utils/utils';

export default {
  components: {
    FormTitle,
    TemplateTable
  },
  props: {
    showId: [String, Number],
    title: String,
    chooseSeat: [String, Number]
  },
  data() {
    return {
      tableList: [{ frequency: 'asd', nums: 1 }]
    };
  },
  computed: {
    tableBtns() {
      return this.chooseSeat === 1
        ? []
        : [
            {
              label: '批量生成兑换码',
              role: 'genCode'
            }
          ];
    },
    tableColumn() {
      return [
        {
          label: '场次',
          name: 'showName'
        },
        {
          label: '票档',
          name: 'ticketGearName'
        },
        {
          label: '库存（张）',
          name: 'storeNum',
          width: '180px',
          render: (h, { index, row }) => {
            const props = {
              on: {
                input: val => {
                  row.storeNum = val;
                }
              }
            };
            return this.chooseSeat === 1 ? <span>{row.storeNum}</span> : <el-input-number min={row.saleNum} value={row.storeNum} {...props} />;
          }
        },
        {
          label: '已售（张）',
          name: 'saleNum'
        }
      ];
    }
  },
  methods: {
    handleEvent(row, role) {
      if (role === 'genCode') {
        // 不支持选座演出批量生成兑换码
        this.$prompt('请输入生成兑换码数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(0|\+?[1-9][0-9]*)$/,
          inputErrorMessage: '请输入正整数'
        })
          .then(({ value }) => {
            this.$service.post(API.exchangeCode, { ticketStoreId: row.id, number: value }, true).then(res => {
              if (res && res.code === 0) {
                Message.success('批量生成成功！');
                this.queryTableList();
              } else {
                Message.error(`生成失败！`);
              }
            });
          })
          .catch(() => {});
      }
    },
    queryTableList() {
      const params = {
        performanceId: this.showId
      };
      this.$service.post(API.queryStoreList, params).then(res => {
        if (res) {
          this.tableList = res.list;
        }
      });
    },
    handleConfirm() {
      const params = this.tableList.map(item => {
        return {
          id: item.id,
          storeNum: item.storeNum
        };
      });
      this.$role.post(API.updateStore, params, true).then(res => {
        if (res && res.code === 0) {
          Message.success('保存成功！');
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    }
  },
  created() {
    this.queryTableList();
  }
};
</script>
