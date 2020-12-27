<template>
  <section class="page-search bg_white">
    <form-title>{{$route.name}}</form-title>
    <div
      v-if="showExpand"
      :class="['page-search__expand', { 'is-open': isExpand, 'is-close': !isExpand }]"
    >
      <span class="page-search__txt" @click="isExpand = !isExpand">
        {{isExpand ? '收起' : '展开'}}
        <i
          :class="['el-icon-direction-chevron-down', { 'icon_arrow_up': this.isExpand, 'icon_arrow_down': !this.isExpand }]"
        ></i>
      </span>
    </div>
    <course-form
      v-expand="{
        isExpand: isExpand,
        el: '.page-search .template_form_content',
        childEl: '.template_form_wrapper'
      }"
      ref="form"
      :class="['page-search__form', { 'page-search__form-beyond': this.isRowBeyond }]"
      inline
      v-model="form"
      :renderData="searchData"
      :labelWidth="null"
      size="small"
      @onChange="handleChange"
    >
      <slot name="last" slot="last"></slot>
      <div ref="btn" class="page-search__btn" :slot="insertIndex">
        <el-button class="btn_small" type="primary" @click="handleSearch">查询</el-button>
        <el-button class="btn_small" type="primary" @click="getexcel" v-if="isexc">导出</el-button>
        <el-button class="btn_small" @click="handReset">重置</el-button>
        
      </div>
    </course-form>
  </section>
</template>
<script>
import CourseForm from '@components/template-form';
import ResizeObserver from 'resize-observer-polyfill';
import { cloneDeep, get } from 'lodash';

export default {
  name: 'pageSearch',
  components: {
    CourseForm
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    searchData: {
      type: Array,
      default: () => [],
      required: true
    },
    // 标签宽度
    labelWidth: {
      type: String,
      default: '80px'
    }
  },
  data() {
    return {
      insertIndex: 'last',
      // 是否展开
      isExpand: true,
      form: this.value,
      showExpand: false,
      wrapEl: null,
      wrapWidth: 0,
      btnWidth: 0,
      // 筛选组件每行宽度数组
      widthArr: [],
      // 筛选组件第一行数据
      firstWidthArr: [],
      // 筛选操作按钮是否超出筛选组件高度
      // 超出高度时会被覆盖
      isRowBeyond: false,
      Observe: null
    };
  },
  computed: {
    isexc(){
      return this.$route.name==="抽奖记录"
    },
    // 折叠状态的筛选栏
    fold() {
      return !!(this.showExpand && !this.isExpand && this.firstWidthArr && this.firstWidthArr.length);
    }
  },
  methods: {
    // 绑定resize监听
    bindObserve() {
      this.Observe = new ResizeObserver(() => {
        this.calcWidth();
        this.changeBeyondStatus();
      });
      this.Observe.observe(this.$el);
    },
    // 移除resize监听
    removeObserve() {
      if (!this.Observe) {
        return false;
      }
      this.Observe.disconnect();
      this.Observe = null;
    },
    // 计算筛选组件容器宽度
    calcWidth() {
      if (this.$refs && this.$refs.btn && this.$el) {
        this.wrapWidth = this.wrapEl.getBoundingClientRect().width;
        this.btnWidth = this.$refs.btn.getBoundingClientRect().width;
        this.widthArr = this.getRow().widthArr;
        this.firstWidthArr = this.widthArr[0];
        return this.firstWidthArr;
      }
      return false;
    },
    changeIndex() {
      if (!this.firstWidthArr || !this.firstWidthArr.length) {
        return false;
      }
      const total = this.firstWidthArr.reduce((sum, item) => item + sum, 0);
      const index = this.firstWidthArr.length - 1;
      if (total + this.btnWidth >= this.wrapWidth) {
        this.insertIndex = index - 1 > 0 ? index - 1 : 0;
      } else {
        this.insertIndex = index;
      }
    },
    // 计算展开时操作按钮是否超出表单高度
    changeBeyondStatus() {
      if (!this.widthArr || !this.widthArr.length) {
        return false;
      }
      const lastWidthArr = this.widthArr[this.widthArr.length - 1];
      const total = lastWidthArr.reduce((sum, num) => sum + num, 0);
      this.isRowBeyond = this.isExpand && total + this.btnWidth > this.wrapWidth;
    },
    resetForm(props) {
      this.$refs.form.resetForm(props);
    },
    handleSearch() {
      this.$emit('input', cloneDeep(this.form));
      this.$emit('onSearch', this.form);
    },
    handReset() {
      this.resetForm();
      this.$emit('onReset', this.form);
    },
    getexcel(){
      this.$emit('input', cloneDeep(this.form));
      this.$emit('onGet', this.form);
    },
    handleChange(...args) {
      this.$emit('onChange', ...args);
      this.$emit('handleMultChange', ...args);
      this.$emit('handleChange', ...args);
    }
  },
  mounted() {
    this.wrapEl = this.$el.querySelector('.template_form_content');
    this.bindObserve();
    this.$emit('input', cloneDeep(this.form));
    this.$on('showExpand', (val, row, heightArr, widthArr) => {
      // 筛选项是否显示展开收缩
      const containerWidth = this.wrapEl.getBoundingClientRect().width;
      // 计算一行表单时是否超出宽度
      const isOverWidth = get(widthArr, '0', []).reduce((sum, item) => sum + item, 0) + 180 >= containerWidth;
      this.showExpand = val || isOverWidth;
      if (this.showExpand && !this.isExpand) {
        this.changeIndex();
      }
    });
  },
  activated() {
    this.componentUpdated(
      null,
      {
        value: {
          isExpand: this.isExpand,
          el: '.page-search .template_form_content'
        }
      },
      null,
      null,
      true
    );
  },
  destroyed() {
    this.removeObserve();
  },
  watch: {
    value(val) {
      this.form = cloneDeep(val);
    },
    isExpand(val) {
      if (val) {
        this.insertIndex = 'last';
      }
    },
    fold(val) {
      if (val) {
        this.$nextTick(() => {
          this.calcWidth() && this.changeIndex();
        });
      } else {
        this.insertIndex = 'last';
      }
    },
    insertIndex(val) {
      if (val === 'last') {
        this.$nextTick(() => {
          this.changeBeyondStatus();
        });
      } else {
        this.isRowBeyond = false;
      }
    }
  }
};
</script>
<style lang="scss">
.page-search {
  position: relative;
  padding: 16px 0 0 16px;
  border-bottom: 1px solid rgba(225, 228, 235, 0.5);
  margin-bottom: 16px;
  .template_form_content {
    width: auto;
    box-sizing: content-box;
    .template_form_wrapper {
      margin: 0 24px 0 0;
    }
    .el-form-item {
      margin-bottom: 16px;
    }
  }
  &__form {
    margin-right: 88px;
  }
  &__form-beyond {
    .template_form_content {
      padding-bottom: 45px;
    }
  }
  &__btn {
    display: inline-block;
    margin-bottom: 16px;
  }
  &__expand {
    height: 28px;
    line-height: 28px;
    float: right;
    width: 88px;
    text-align: center;
  }
  &__txt {
    vertical-align: middle;
    cursor: pointer;
    font-size: 14px;
    color: #555555;
  }
  .icon_arrow {
    &_down,
    &_up {
      transition: all 0.2s ease-in-out;
    }
    &_up {
      transform: rotate(180deg);
    }
  }
}
</style>
