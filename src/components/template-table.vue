<template>
  <div class="page_table_main">
    <el-table
      ref="table"
      :border="false"
      stripe
      v-if="tableColumn.length"
      :data="list"
      :height="height"
      :row-class-name="rowClassName"
      @selection-change="handleSelectionChange"
    >
      <!-- checkbox列 -->
      <el-table-column v-if="selection" type="selection" fixed="left" width="55"></el-table-column>
      <!-- 列数 -->
      <el-table-column v-if="hasIndex" type="index" :label="indexLabel || '序号'" width="55"></el-table-column>

      
      <!-- zt -->
      <el-table-column  type="index" :label="indexLabel || '序号'" width="55"></el-table-column>


      <!-- end -->

      <!--正常列-->
      <el-table-column
        v-for="item in tableColumn"
        v-if="!item.render"
        show-overflow-tooltip
        :key="item.name"
        :prop="item.name"
        :label="item.label"
        :width="item.width"
        :filters="item.filters"
        :filter-method="item.filterFun"
        :render-header="item.headRender"
      ></el-table-column>
      <!--自定义渲染-->
      <el-table-column
        v-else
        :prop="item.name"
        :label="item.label"
        :width="item.width"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <table-body-render
            :index="scope.$index"
            :row="scope.row"
            :col="item"
            :render="item.render"
          ></table-body-render>
        </template>
      </el-table-column>
      <!--操作列-->
      <el-table-column
        v-if="hasButton && showOperation"
        prop="operation"
        label="操作"
        fixed="right"
        :width="operationBtnWidth"
      >
        <template slot-scope="scope">
          <div class="table_operation">
            <el-button
              v-for="bItem in getButtonArr(scope.$index, scope.row)"
              :role="bItem.role"
              size="small"
              :key="bItem.label"
              type="text"
              @click="operationEvent(scope.$index, scope.row, bItem.role)"
              :icon="bItem.icon"
            >{{bItem.label}}</el-button>
            <el-dropdown
              class="btn_dropdown"
              trigger="click"
              v-if="getDropdownArr(scope.$index, scope.row).length"
            >
              <el-button type="text" class="btn_more">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in getDropdownArr(scope.$index, scope.row)"
                  :key="item.role"
                  :role="item.role"
                  @click.native="operationEvent(scope.$index, scope.row, item.role)"
                >{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="拖拽排序" width="100" fixed="right" v-if="sortable">
        <template slot-scope="scope">
          <i class="rank el-icon-rank"></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import TableBodyRender from './table-body-render';
import Draggable from '@utils/draggable';
import { cloneDeep } from 'lodash';

export default {
  name: 'templateTable',
  components: {
    TableBodyRender
  },
  props: {
    tableColumn: {
      type: Array
    },
    tableList: {
      type: Array
    },
    tableBtns: {
      type: Array
    },
    columnWidth: {
      type: Number
    },
    operationBtnWidth: {
      type: Number,
      default: 180
    },
    selection: {
      type: Boolean
    },
    hasIndex: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 是否可拖拽排序
    // 支持拖拽排序时，tableList需添加sync修饰符
    sortable: {
      type: Boolean,
      default: false
    },
    // 是否显示拖拽列
    // showSortIcon: {
    //   type: Boolean,
    //   default: false
    // },
    // 显示操作列
    showOperation: {
      type: Boolean,
      default: true
    },
    rowClassName: Function,
    height: Number,
    indexLabel: {
      type: String,
      default: ''
    }
  },
  // 计算下是否有操作按钮列
  computed: {
    hasButton() {
      return this.tableBtns && this.tableBtns.length;
    }
  },
  data() {
    return {
      container: null,
      // 本地列表数据
      list: this.tableList
    };
  },
  methods: {
    getButtonArr(index, row) {
      return this.tableBtns.filter(btn => this.handleFunc(btn.showHandler, index, row, btn.role)).slice(0, 2);
    },
    getDropdownArr(index, row) {
      return this.tableBtns.filter(btn => this.handleFunc(btn.showHandler, index, row, btn.role)).slice(2);
    },
    // 操作表格自定义按钮显示隐藏
    // 出参为当前行下标、行数据、按钮标识
    // funcT为传递的回调函数，必须返回true或者false
    handleFunc(funcT = true, index, row, role) {
      if (funcT && typeof funcT === 'function') {
        if (funcT) {
          return funcT(index, row, role);
        }
      } else {
        return !!funcT;
      }
    },
    /**
     * 当数据中有操作按钮时，按钮的单击事件
     * @param index 操作行index
     * @param row   操作行数据
     * @param role  按钮角色
     */
    operationEvent(index, row, role) {
      this.$emit('handleEvent', row, role, index);
    },

    /**
     * table的左侧checkbox改变触发事件
     * @param {Array} rowList 选中的行所成的数组
     */
    handleSelectionChange(rowList) {
      this.$emit('getCheckedRow', rowList);
    },

    // 调整数组顺序
    computedIndex(array, from, to) {
      let list = cloneDeep(array);
      const targetItem = list.splice(from, 1);
      list.splice(to, 0, targetItem[0]);
      return list;
    },
    // 为列表每一项绑定拖拽事件
    bindingDraggable() {
      this.container = this.$refs.table.$el.querySelector('.el-table__fixed-right .el-table__fixed-body-wrapper tbody');
      this._sortable = Draggable.create(this.container, {
        drop: (from, to) => {
          this.list = [].concat(this.computedIndex(this.list, from, to));
          this.$emit('onSwop', this.list, from, to);
        }
      });
    }
  },
  created(){
     console.log(this.tableList)
  },
  mounted() {
    // 大屏增大表格固定高度
   
  },
  destroyed() {
    this._sortable && this._sortable.remove();
    this._sortable = null;
  },
  watch: {
    tableList(val) {
      this.list = val;
    },
    list: {
      handler(val) {
        this.$emit('update:tableList', val);
      },
      deep: true
    },
    sortable: {
      handler(val) {
        if (val && this.tableList.length) {
          this.$nextTick(() => {
            this.bindingDraggable();
          });
        } else {
          // 重置本地列表数据
          this.list = this.tableList.slice();
          this.$nextTick(() => {
            this._sortable && this._sortable.remove();
            this._sortable = null;
          });
        }
      },
      immediate: true
    },
    'list.length'(newVal, oldVal) {
      if (newVal > oldVal && this.sortable) {
        this.$nextTick(() => {
          this.bindingDraggable();
        });
      }
    }
  }
};
</script>
<style lang="scss">
.table_operation {
  display: flex;
  align-items: center;
  .btn_dropdown {
    margin-top: -1px;
    float: right;
    .el-button {
      padding: 0;
      &:not(:first-child) {
        margin-right: 5px;
      }
    }
  }
}
.page_table_main {
  .el-button {
    min-width: 0;
    margin: 0;
    &:not(:first-child) {
      padding: 0 10px;
    }
  }
  .btn_more {
    span {
      color: #444444 !important;
    }
    .el-icon-arrow-down {
      background: none;
    }
  }
  .rank {
    font-size: 18px;
    cursor: all-scroll;
  }
}
</style>
