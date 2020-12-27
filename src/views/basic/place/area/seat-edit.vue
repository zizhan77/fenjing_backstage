<template>
  <!-- 选座配置 -->
  <section class="seat-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div>
        <template-form title="座位配置" ref="form" :render-data="renderData" v-model="form">
          <template slot-scope="props">
            <section class="mt20" v-if="props.item.name === 'checkNums'">
              <!-- 增加间隔 -->
              <el-button size="medium" @click="handleAddSeat(1)">增加座位</el-button>
              <el-button size="medium" @click="handleAddSeat(0)">增加间隔</el-button>
              <div class="seat-list mt10">
                <el-tag
                  @close="handleDelSeat(index)"
                  class="mr10"
                  size="medium"
                  closable
                  :type="tag.status === 0 ? 'info' : ''"
                  v-for="(tag, index) in seats"
                  :key="index"
                >{{(tag.status === 0 ? '间隔' :'座位' )+ `(${tag.nums})`}}</el-tag>
              </div>
            </section>
            <template class="mt20" v-if="props.item.name === 'lineNo'">
              <!-- 添加行 -->
              <el-button class="btn_small" @click="handleAddRow">添加行</el-button>
              <!-- 座位列表 -->
              <template-table
                class="mt20"
                :hasIndex="false"
                :table-column="tableColumn"
                :table-list="tableList"
                :table-btns="tableBtns"
                @handleEvent="handleEvent"
              ></template-table>
            </template>
          </template>
        </template-form>
        <footer class="page_footer">
          <el-button size="medium" type="primary" @click="handleConfirm">确 认</el-button>
          <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
        </footer>
      </div>
    </section>
  </section>
</template>
<script>
import TemplateForm from '@components/template-form';
import TemplateTable from '@components/template-table';
import { get, flattenDeep } from 'lodash';
import Message from '@utils/message';
import API from '@api/basic';

const EMPTY = 0;
const OPEN = 1;
const CLOSE = 2;
const SOLD = 3;

export default {
  components: {
    TemplateForm,
    TemplateTable
  },
  props: {
    placeId: [String, Number],
    areaId: [String, Number],
    areaName: String
  },
  data() {
    return {
      renderData: [
        {
          label: '区域:',
          name: 'areaName',
          value: '',
          type: 'label'
        },
        {
          type: 'text',
          label: '方格数量:',
          name: 'checkNums',
          value: '',
          required: true,
          pattern: /^[1-9]\d*$/
        },
        {
          type: 'text',
          label: '行数:',
          name: 'lineNo',
          value: '',
          required: true
        }
      ],
      // 座位配置
      form: {
        areaName: this.areaName
      },
      // 当前添加的座位信息
      seats: [],
      // 座位信息
      tableList: [],
      tableColumn: [
        {
          label: '行数',
          name: 'lineNo'
        },
        {
          label: '座位数量',
          name: 'seatNums'
        },
        {
          label: '间隔数量',
          name: 'emptyNums',
          render: (h, { row }) => {
            const { seats = [] } = row;
            const emptySeats = seats.filter(({ status }) => !status).map(({ nums }) => nums);
            return <span>{emptySeats.join('+')}</span>;
          }
        }
      ],
      tableBtns: [
        {
          label: '删除',
          role: 'del'
        }
      ]
    };
  },
  computed: {
    isEdit() {
      return !!this.areaId;
    }
  },
  methods: {
    // 删除一行座位
    delLineSeat(index, row) {
      const { isEdit, lineNo } = row;
      if (!isEdit) {
        this.tableList.splice(index, 1);
        return false;
      } else {
        this.$service.post(API.deleteSeatList, { lineNo, areaId: this.areaId, placeId: this.placeId }, true).then(res => {
          if (res && res.code === 0) {
            Message.success('删除成功');
            this.tableList.splice(index, 1);
          } else {
            Message.error(`${res.message || '删除失败！'}`);
          }
        });
      }
    },
    handleEvent(row, role, index) {
      switch (role) {
        case 'del':
          Message.confirm('删除提示', '确定删除该条座位？', () => {
            this.delLineSeat(index, row);
          });
          break;
        default:
          break;
      }
    },
    handleConfirm() {
      if (!this.tableList.length) {
        Message.warning('请添加座位信息！');
        return false;
      }

      let params = this.tableList.map(item => item.flatSeat);
      params = flattenDeep(params);
      this.$service.post(API.initSeatList, { seatsListJson: JSON.stringify(params) }, true).then(res => {
        if (res && res.code === 0) {
          Message.success('保存成功！');
          this.$router.go(-1);
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    },
    handleDelSeat(index) {
      this.seats.splice(index, 1);
    },
    handleAddSeat(status) {
      if (!this.form.checkNums) {
        Message.warning('请输入方格数量！');
        return false;
      }
      if (this.form.checkNums < 1) {
        Message.warning('方格数量不能小于！');
        return false;
      }
      if (!/^[1-9]\d*$/.test(this.form.checkNums)) {
        Message.warning('请输入正整数！');
        return false;
      }
      this.seats.push({
        status,
        nums: this.form.checkNums
      });
      this.form.checkNums = '';
    },
    handleAddRow() {
      if (!this.seats.length) {
        Message.warning('请先添加方格数量！');
        return false;
      }
      if (!this.form.lineNo) {
        Message.warning('请添加行数！');
        return false;
      }
      if (this.tableList.some(({ lineNo }) => lineNo === this.form.lineNo)) {
        Message.warning('已存在重复行数！');
        return false;
      }
      const seats = this.seats.slice();
      this.tableList.push({
        isEdit: false,
        placeId: this.placeId,
        areaId: this.areaId,
        lineNo: this.form.lineNo,
        // 座位数量
        seatNums: this.getSeatNums(OPEN),
        seats,
        // 二维数组抻平
        flatSeat: this.getFlatSeats(seats, { placeId: this.placeId, areaId: this.areaId, lineNo: this.form.lineNo })
      });
      this.form = {};
      this.seats = [];
    },
    getSeatNums(status) {
      return this.seats.reduce((total, item) => {
        if (item.status === status) {
          return parseInt(total) + parseInt(item.nums);
        } else {
          return parseInt(total);
        }
      }, 0);
    },
    // 座位扁平化处理
    getFlatSeats(seats, obj) {
      const flatSeats = seats.map(({ status, nums }) => {
        let arr = Array.from({ length: Number(nums) }, () => Object.assign({}, obj, { status }));
        return arr;
      });
      return flattenDeep(flatSeats);
    },
    // 合并单行下的座位数
    mergeSeat(lineSeats) {
      let ret = [];
      if (!lineSeats || !lineSeats.length) {
        return [];
      }
      let index = 0;
      while (lineSeats.length && index !== -1) {
        let start = lineSeats[0];
        index = lineSeats.findIndex(item => item.status !== start.status);
        lineSeats = lineSeats.slice(index);
        if (index > -1) {
          ret.push({
            status: start.status,
            nums: index
          });
        } else {
          ret.push({
            status: start.status,
            nums: lineSeats.length
          });
        }
      }
      return ret;
    },
    // 处理表格每行的数据
    calcLinNo(seats) {
      let list = {};
      let arr = [];
      seats.forEach(item => {
        if (!list[item.lineNo]) {
          list[item.lineNo] = [item];
        } else {
          list[item.lineNo].push(item);
        }
      });
      const keys = Object.keys(list);
      arr = keys.map(key => {
        const seatNumList = list[key].filter(({ status }) => status);
        return {
          isEdit: true,
          lineNo: key,
          seatNums: seatNumList.length,
          flatSeat: list[key],
          seats: this.mergeSeat(list[key])
        };
      });
      return arr;
    },
    queryFormDetail() {
      // this.calcLinNo([{ status: 1, lineNo: 1 }, { status: 1, lineNo: 1 }, { status: 0, lineNo: 1 }, { status: 0, lineNo: 1 }, { status: 1, lineNo: 1 }, { status: 1, lineNo: 2 }, { status: 1, lineNo: 2 }, { status: 1, lineNo: 2 }, { status: 0, lineNo: 2 }, { status: 0, lineNo: 2 }, { status: 1, lineNo: 2 }, { status: 1, lineNo: 2 }]);
      this.$service.post(API.querySeatModel, { areaId: this.areaId }).then(res => {
        if (res) {
          this.tableList = this.calcLinNo(res);
        }
      });
    }
  },

  created() {
    if (this.isEdit) {
      this.queryFormDetail();
    }
  }
};
</script>