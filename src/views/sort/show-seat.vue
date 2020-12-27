<template>
  <!-- 座位配置 -->
  <section class="show-seat page_main">
    <section class="page_card page_card_padding">
      <form-title>座位配置</form-title>
      <!-- <i class="iconfont iconkexuan"></i> -->
      <section class="show-seat__wrap">
        <div class="show-seat__opera mb10">
          <label-item class="fr" label="操作：">
            <el-button type="primary" @click="handleSelectAll">全选</el-button>
            <el-button @click="handleSeatOpera('open')" v-if="!showId">开启座位</el-button>
            <el-button @click="handleSeatOpera('close')" v-if="!showId">关闭座位</el-button>
            <el-tooltip effect="light" content="生成兑换码即代表已售出" placement="top" v-if="showId">
              <el-button @click="handleSeatOpera('code')">生成兑换码</el-button>
            </el-tooltip>
            <el-button @click="querySeatDetails">重置</el-button>
          </label-item>
        </div>
        <section class="show-seat__container">
          <el-scrollbar class="scrollbar-wrapper">
            <div class="show-seat__stage">
              <!-- 舞台 -->
              <h2 class="show-seat__container-top">舞台方向</h2>
              <!-- 座位 -->
              <table>
                <tbody v-if="seat.length">
                  <tr v-for="(row, rowInx) in seat" :key="rowInx">
                    <template v-if="row.length">
                      <td v-for="(col, colInx) in row" :key="colInx" @click="handleSelect(col)">
                        <!-- <i :class="seatCls(col)"></i> -->
                        <i
                          :class="seatCls(col)"
                          :style="{color: col.status === 1 ? col.areaVo.areaColor : ''}"
                        ></i>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-scrollbar>
          <div class="show-seat__tips">
            <div class="show-seat__tips-content">
              <h3>图例</h3>
              <!-- <label-item label="已开启">
                <i class="iconfont iconkexuan is--open"></i>
              </label-item>-->
              <label-item v-for="(color, name) in colorList" :key="name" :label="name">
                <i class="iconfont iconkexuan" :style="{color: color}"></i>
              </label-item>
              <label-item label="已售出">
                <i class="iconfont iconkexuan is--sold"></i>
              </label-item>
              <label-item label="已关闭">
                <i class="iconfont iconbukexuan"></i>
              </label-item>
            </div>
          </div>
        </section>
        <footer class="page_footer">
          <el-button type="primary" size="medium" @click="confirm" :loading="btnLoading">确 认</el-button>
          <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
        </footer>
      </section>
    </section>
  </section>
</template>
<script>
import FormTitle from '@components/form-title';
import LabelItem from '@components/label-item';
import { isContains } from '@utils/utils';
import { flattenDeep } from 'lodash';
import Message from '@utils/message';
import API from '@api/show';

// 空座位
const EMPTY = 0;
// 已开启座位
const OPEN = 1;
// 已关闭
const CLOSE = 2;
// 已售卖
const SOLD = 3;

export default {
  components: {
    FormTitle,
    LabelItem
  },
  props: {
    placeId: [String, Number],
    performanceId: [String, Number],
    showId: [String, Number]
  },
  data() {
    return {
      btnLoading: false,
      selectAll: false,
      selectSeats: [],
      // 二维数组
      // 0：间隔；1：已开启的座位；2：已关闭的座位；3：已售出的座位
      seat: [],
      list: [],
      // 区域颜色list
      colorList: {}
    };
  },
  methods: {
    seatCls(seat = { status: 1 }) {
      return {
        iconkexuan: seat.status != EMPTY,
        iconfont: true,
        'is--open': seat.status === OPEN,
        'is--close': seat.status === CLOSE,
        iconbukexuan: seat.status === CLOSE,
        'is--sold': seat.status === SOLD,
        iconyixuan: isContains(this.selectSeats, seat) && seat.status,
        'is--empty': seat.status === EMPTY
      };
    },
    // 选择座位
    handleSelect(seat) {
      if (![OPEN, CLOSE].includes(seat.status)) {
        return false;
      }
      if (isContains(this.selectSeats, seat)) {
        this.selectSeats = this.selectSeats.filter(item => item.id !== seat.id);
      } else {
        this.selectSeats.push(seat);
      }
    },
    // 选择全部
    handleSelectAll() {
      this.selectAll = !this.selectAll;
    },
    // 座位操作
    async handleSeatOpera(role) {
      if (!this.selectSeats.length) {
        Message.warning('请选择座位！');
        return false;
      }
      let status;
      switch (role) {
        case 'open':
          status = OPEN;
          break;
        case 'close':
          status = CLOSE;
          break;
        case 'code':
          status = SOLD;
          break;
        default:
          break;
      }
      this.selectSeats.forEach(item => {
        item.status = status;
      });
      this.selectAll = false;
      this.selectSeats = [];
    },
    confirm() {
      this.btnLoading = true;
      const params = {
        seatsJson: JSON.stringify(this.list)
      };
      const uri = this.showId ? API.createBatchSeatExchangeCode : API.editBatchSeatList;
      this.$service.post(uri, params, true).then(res => {
        this.btnLoading = false;
        if (res && res.code === 0) {
          Message.success('设置成功！');
          this.querySeatDetails();
        } else {
          Message.error(`${res.message || '设置失败！'}`);
        }
      });
    },
    querySeatDetails() {
      let uri;
      let params = {};
      if (this.showId) {
        uri = API.querySeatListByShowId;
        params = { showId: this.showId };
      } else {
        uri = API.querySeatListByPlaceId;
        params = {
          placeId: this.placeId
        };
      }

      this.$service.post(uri, params).then(res => {
        if (res && res.length) {
          this.list = res;
          this.list = res.sort((a, b) => {
            return Number(a.lineNo) - Number(b.lineNo);
          });
          const ret = {};
          this.list.forEach(seat => {
            const { areaVo } = seat;
            if (areaVo.areaColor && areaVo.areaName) {
              this.$set(this.colorList, areaVo.areaName, areaVo.areaColor);
            }
            const { lineNo } = seat;
            if (ret[lineNo]) {
              ret[lineNo].push(seat);
            } else {
              this.$set(ret, lineNo, [seat]);
            }
          });
          // 与list引用传递
          this.seat = Object.values(ret);
        }
      });
    }
  },
  created() {
    this.querySeatDetails();
  },
  watch: {
    selectAll(val) {
      if (this.showId) {
        // 生成兑换码情况
        this.selectSeats = val ? flattenDeep(this.seat).filter(item => item.status === OPEN) : [];
      } else {
        this.selectSeats = val ? flattenDeep(this.seat).filter(item => item.status === OPEN || item.status === CLOSE) : [];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.show-seat {
  &__opera {
    overflow: hidden;
  }
  &__tips {
    padding: 10px 20px;
    flex: 0 0 200px;
    // background: #eeeeee;
  }
  &__stage {
    display: inline-block;
    position: relative;
    flex: 1;
  }
  &__container {
    border: 1px solid #cccccc;
    padding: 20px 30px;
    text-align: center;
    display: flex;

    &-top {
      margin: 0 auto 20px;
      height: 50px;
      line-height: 50px;
      background: url('../../assets/screen.png') no-repeat;
      background-size: 100%;
      max-width: 500px;
      text-align: center;
    }
    table {
      margin: 0 auto;
      tr > td {
        // cursor: pointer;
      }
    }
    .iconfont {
      display: inline-block;
      margin: 0 5px;
      cursor: pointer;
      &.is--open {
        color: $icon-select;
      }
      &.is--close {
      }
      &.is--sold {
        color: #000000;
      }
      &.is--empty {
        background: none;
        cursor: auto;
      }
      &.is--select {
        // background-image: url('../../assets/seat_select.png');
      }
    }
  }
  .scrollbar-wrapper {
    flex: 1;
  }
}
</style>
