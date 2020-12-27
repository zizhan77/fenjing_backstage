<template>
  <div class="template_form">
    <div class="mb20" v-if="title">
      <h1 class="template_form_title f14 vertical_divid is-primary">{{title}}</h1>
    </div>
    <el-form
      class="template_form_content"
      :model="form"
      ref="form"
      :label-position="align"
      :label-width="labelWidth"
    >
      <template v-for="(item, key) in renderForm">
        <div
          class="template_form_wrapper"
          :class="formWrapperCls(item, item.name, renderForm)"
          :key="key"
          v-if="!item.isHide && item.type !=='custom'"
          @click="handleItemClick($event, item, key)"
        >
          <el-form-item
            v-if="!readonly"
            :show-message="!!item.label"
            :label="item.label || ''"
            :prop="item.name || String(key)"
            :rules="customRules(item)"
            :label-width="item.labelWidth"
          >
            <!-- 展示数据 -->
            <label
              class="form_item_text"
              v-if="item.type==='label'"
              v-html="form[item.name]"
            >{{item.value}}</label>
            <!-- input输入框 -->
            <el-input
              v-if="item.type === 'text' || item.type === 'number'"
              v-model.trim="form[item.name]"
              :type="item.type"
              :maxlength="item.max"
              :minlength="item.min"
              :placeholder="item.placeholder ? item.placeholder : `请输入${item.label.replace(':','').replace('：','')}`"
              :disabled="item.disabled"
              :style="{width: `${item.width}`}"
              @change="handleInputChange(...arguments, item.name)"
            ></el-input>
            <!-- textarea输入框 -->
            <el-input
              v-if="item.type === 'textarea'"
              type="textarea"
              resize="none"
              :disabled="item.disabled"
              :maxlength="item.maxlength || item.max"
              :placeholder="item.placeholder ? item.placeholder : '请输入内容'"
              v-model.trim="form[item.name]"
            ></el-input>
            <!-- 颜色选择器 -->
            <el-color-picker
              v-if="item.type === 'color'"
              size="medium"
              :predefine="['#30B08F', '#dd6312']"
              v-model="form[item.name]"
            ></el-color-picker>
            <!-- select选择器 -->
            <el-select
              v-mutation
              ref="select"
              v-if="item.type === 'select'"
              :style="{width: `${item.width}`}"
              :collapse-tags="item.multiple && (typeof item.tags === 'undefined' || !!item.tags)"
              v-model="form[item.name]"
              size="mini"
              clearable
              :multiple="!!item.multiple"
              :disabled="item.disabled"
              :placeholder="item.placeholder ? item.placeholder : '请选择'"
              @change="handleSelectChange(...arguments, item.name, item.options.find(ops => ops.value === form[item.name]), item)"
            >
              <el-option
                v-for="ops in item.options"
                :label="ops.label"
                :value="ops.value"
                :key="ops.value"
              ></el-option>
            </el-select>
            <!-- 远程select选择器 -->
            <el-select
              v-mutation
              v-if="item.type === 'remote'"
              v-model="form[item.name]"
              clearable
              filterable
              remote
              :disabled="item.disabled"
              :placeholder="item.placeholder ? item.placeholder : '请输入关键字'"
              :remote-method="item.remoteMethod || remoteMethod"
              @change="handleSelectChange(...arguments, item.name, item.options.find(ops => ops.value === form[item.name]), item)"
            >
              <el-option
                v-for="ops in item.options"
                :label="ops.label"
                :value="ops.value"
                :key="ops.value"
              ></el-option>
            </el-select>
            <!-- 日期时间范围选择器 -->
            <el-date-picker
              v-if="item.type === 'datetimerange'"
              :style="{width: `${item.width}`}"
              v-model="form[item.name]"
              type="datetimerange"
              :disabled="item.disabled"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :placeholder="item.placeholder || '请选择时间'"
              :picker-options="item.pickerOptions || defaultPickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="handleTimeChange(...arguments, item.name)"
            ></el-date-picker>
            <!-- 日期选择器 -->
            <el-date-picker
              ref="date"
              class="template_form_date_input"
              :style="{width: `${item.width}`}"
              v-if="item.type === 'date'"
              v-model="form[item.name]"
              type="date"
              :disabled="item.disabled"
              :picker-options="item.pickerOptions || {}"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
            <!-- 日期范围选择器 -->
            <el-date-picker
              v-if="item.type === 'daterange' || item.type === 'datePicker'"
              :style="{width: `${item.width}`}"
              v-model="form[item.name]"
              type="daterange"
              :disabled="item.disabled"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="item.pickerOptions || defaultPickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
            <!-- 时间范围选择器 -->
            <el-time-picker
              v-if="item.type === 'datetime'"
              :style="{width: `${item.width}`}"
              v-model="form[item.name]"
              :is-range="!item.noRange"
              :disabled="item.disabled"
              :diable-restrict="true"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              @change="handleTimeChange(...arguments, item.name)"
            ></el-time-picker>
            <!-- 日期+时间选择器 -->
            <el-date-picker
              v-if="item.type === 'datetimepicker'"
              type="datetime"
              v-model="form[item.name]"
              :disabled="item.disabled"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="item.pickerOptions || defaultPickerOptions"
              :default-value="form[item.name] || currentDate"
              placeholder="选择时间"
              @change="handleTimeChange(...arguments, item.name)"
            ></el-date-picker>
            <!-- 年选择器 -->
            <el-date-picker
              v-if="item.type === 'year'"
              v-model="form[item.name]"
              type="year"
              :disabled="item.disabled"
              :picker-options="item.pickerOptions || {}"
              value-format="yyyy"
              placeholder="请选择"
            ></el-date-picker>
            <!-- 多选框 -->
            <el-checkbox
              :true-label="item.trueLabel"
              :false-label="item.falseLabel"
              :disabled="item.disabled"
              @change="handleCheckChange(...arguments, item.name)"
              v-if="item.type==='checkbox'"
              v-model="form[item.name]"
            >
              {{item.text}}
              <span class="template_form_content_desc" v-if="item.desc">{{item.desc}}</span>
            </el-checkbox>
            <!-- 多选框组 -->
            <el-checkbox-group
              v-if="item.type==='checkboxGroup'"
              :disabled="item.disabled"
              @change="checkboxChange(...arguments, item.name)"
              v-model="form[item.name]"
            >
              <el-checkbox
                v-for="(checkboxList, index) in item.options"
                :key="index"
                :disabled="item.disabled || checkboxList.disabled"
                :label="checkboxList.value"
              >{{checkboxList.label}}</el-checkbox>
            </el-checkbox-group>
            <el-radio-group v-model="form[item.name]" v-if="item.type==='radioGroup'">
              <el-radio
                v-for="(radioList, index) in item.options"
                :key="index"
                :label="radioList.value"
                :disabled="item.disabled"
                @change="handleRadioChange(...arguments, item.name)"
                @click.native="handleRadioClick(radioList.value, item.name, index, item.disabled)"
              >{{radioList.label}}</el-radio>
            </el-radio-group>
            <!-- 右侧浮动的input输入框 -->
            <template v-if="item.type === 'textRight'">
              <el-input
                class="select_input_right"
                v-model.trim="form[item.name]"
                placeholder="请输入"
                :disabled="item.disabled"
              ></el-input>
              {{item.text}}
            </template>
            <slot :item="item"></slot>
          </el-form-item>
          <label-item v-else :labelWidth="labelWidth" :label="item.label" :required="item.required">
            <slot :item="item">{{getReadLabel(key, item, renderForm)}}</slot>
          </label-item>
        </div>
        <!-- 自定义表单项 -->
        <div :key="key" v-else-if="item.type === 'custom'" class="template_form_custom">
          <slot :item="item"></slot>
        </div>
        <slot :name="key"></slot>
        <slot name="last" v-if="key >= renderForm.length - 1"></slot>
      </template>
    </el-form>
  </div>
</template>
<script>
import LabelItem from '@components/label-item';
import { isArray, isEmpty, forEach, debounce, map, cloneDeep, flattenDeep } from 'lodash';
import { isUndef, formatDate, currentDate } from '@utils/utils';

export default {
  name: 'courseForm',
  components: {
    LabelItem
  },
  props: {
    // 绑定数据项
    value: {
      type: [Object, Array],
      default: () => {}
    },
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 绑定渲染项
    renderData: {
      type: [Object, Array],
      default: () => {}
    },
    // 表单对其方式
    align: {
      type: String,
      default: 'right'
    },
    // 标签宽度
    labelWidth: {
      type: String,
      default: '112px'
    },
    // 是否为水平表单
    inline: {
      type: Boolean,
      default: false
    },
    // 表单输入框尺寸
    size: {
      type: String,
      default: 'large',
      validator: val => {
        return ['small', 'large'].includes(val);
      }
    },
    // 纯展示模式
    // 不支持时间类型控件
    readonly: {
      type: Boolean,
      default: false
    },
    // 默认展开表单
    expand: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentDate,
      gradeLabel: '',
      form: {},
      remoteOption: [], // 远程查询的结果值
      renderForm: [],
      defaultPickerOptions: {
        disabledDate: time => {
          return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000*365*2;
        }
      }
    };
  },
  methods: {
    handleItemClick(e, item, key) {
      this.$emit('onItemClick', e, item, key);
    },
    // 将map对象转换为带唯一name的数组
    mapRenderFormToArr(form) {
      return map(form, (data, key) => {
        let item = cloneDeep(data);
        return Object.assign(item, { name: key });
      });
    },
    // 后一个表单元素未设置label或者设置type为textRight
    // 将当前元素设置为行内块级元素
    formWrapperCls(item, name, forms) {
      const index = forms.findIndex(value => value.name === name);
      const afterIndex = parseInt(index) + 1;
      return [
        `form_item_${this.size}`,
        {
          ml10: !item.label,
          form_item_textarea: item.type === 'textarea',
          form_item_inline: !item.label || item.inline || this.inline || (forms[afterIndex] && !forms[afterIndex].label)
        }
      ];
    },
    // 公用校验规则
    customRules(item) {
      let rules = [];
      let label = item.label;
      if (label) {
        label = label.replace(/：\s*/, '').replace(/:/, '');
      }

      // 校验是否必填
      const baseRule = {
        required: item.required || false,
        message: item.errorMsg || `${typeof item.value === 'object' || item.type === 'select' ? '请选择' : '请输入'}${label}`,
        trigger: `${item.type === 'text' ? 'blur' : 'change'}`
      };
      // 格式校验
      const patternRule = {
        pattern: item.pattern || true,
        message: item.errorMsg || '格式非法',
        trigger: ['change', 'blur']
      };
      // 自定义校验
      const customVailder = {
        validator: item.validator,
        trigger: ['blur']
      };

      rules.push(baseRule);
      if (item.pattern) {
        rules.push(patternRule);
      }
      if (item.validator) {
        rules.push(customVailder);
      }
      return rules;
    },
    // checkbox按钮组点击事件
    checkboxChange(val, key) {
      this.$nextTick(() => {
        this.$emit('onChange', key, val, this.form);
      });
    },
    // 输入框更改
    handleInputChange(val, key) {
      this.$emit('onChange', key, val, this.form);
    },
    // 选择框改变时回调函数
    // 当前改变值
    // 对应表单项字段 如：'grade'、'subject'
    handleSelectChange(val, key, item = {}, obj) {
      if (Array.isArray(val)) {
        const { checkAll = '' } = obj;
        let select = [];
        let len = val.length;
        let value = len > 0 ? val[len - 1] : true;
        if (len > 0 && (value || typeof value === 'number') && value !== checkAll) {
          select = val.filter(item => item !== checkAll);
        } else if (value === checkAll) {
          select = [checkAll];
        }
        this.form[key] = [].concat(select);
      }
      this.$emit('onChange', key, val, this.form, item);
    },
    handleRadioChange(val, key) {
      this.$nextTick(() => {
        this.$emit('onChange', key, val, this.form);
      });
    },
    handleRadioClick(val, key, index, disabled) {
      if (disabled) return false;
      if (val) {
        this.$set(this.form, key, '');
      }
    },
    // 日期时间选择器change事件
    handleTimeChange(val, key) {
      this.$nextTick(() => {
        this.$emit('onChange', key, val, this.form);
      });
    },
    // checkbox值发生改变时回调函数
    handleCheckChange(val, e, key) {
      this.$nextTick(() => {
        this.$emit('onChange', key, val, this.form);
      });
    },
    // 根据name获取数组的某一项
    getItemFromArray(list, name) {
      let item = { value: '' };
      forEach(list, (form, index) => {
        if ((form.name && form.name === name) || index === name) {
          item = Object.assign(item, form);
        }
      });
      return item;
    },
    // 获取对应展示字段
    getReadLabel(key, obj, array) {
      const { type, name = key } = obj;
      let value = this.form[name];
      switch (type) {
        case 'select':
        case 'checkboxGroup':
        case 'radioGroup':
          const { options = [] } = obj;
          value = flattenDeep([value]);
          value = options.filter(item => value.includes(item.value));
          value = value.map(item => item.label).join('、');
          break;
        case 'checkbox':
          const { trueLabel = true } = obj;
          value = value === trueLabel ? '是' : '否';
          break;
        case 'datetimerange':
        case 'daterange':
        // case 'date':
          const { valueFormat = 'timestamp' } = obj;
          if (valueFormat === 'timestamp') {
            value = value.map(time => formatDate(time)).join(' 至 ');
          }
          break;
        case 'datetimepicker':
          value = formatDate(value);
          break;
        default:
          break;
      }
      return value;
    },
    // 动态添加表单
    append(form) {
      if (form) {
        this.renderForm.push(form);
        this.form[form.name] = form.value;
      } else {
        forEach(this.renderForm, item => {
          // 如果本地数据项不存在该项，则赋值
          if (isUndef(this.form[item.name]) && item.name) {
            this.$set(this.form, item.name, item.value);
            this.$nextTick(() => {
              this.clearValidate([item.name]);
            });
          }
        });
      }
    },
    // 动态删除表单
    remove(index) {
      if (index) {
        let item = this.renderForm[index];
        this.$delete(this.form, item.name);
      } else {
        forEach(this.form, (item, key) => {
          if (this.renderForm.findIndex(form => form.name === key) < 0) {
            this.$delete(this.form, key);
          }
        });
      }
    },
    // 初始化动态表单
    initFormValue() {
      let obj = {};
      if (!isEmpty(this.renderForm)) {
        forEach(this.renderForm, (item, key) => {
          if (item.name) {
            obj[item.name] = item.value !== undefined ? item.value : '';
          }
        });
      }
      // 合并value初始绑定值
      this.form = Object.assign({}, obj, this.value);
      this.$emit('input', this.form);
    },
    // 重置表单对象值
    // name为表单对应的prop
    // 可为数组或者单个值，空值重置整个表单
    resetForm(name = 'resetFormAll') {
      if (name && isArray(name)) {
        name.forEach(item => {
          if (item && this.form[item]) {
            this.$set(this.form, item, this.getItemFromArray(this.renderData, item).value);
          }
        });
      } else if (name && this.form[name]) {
        this.$set(this.form, name, this.getItemFromArray(this.renderData, name).value);
      } else if (name === 'resetFormAll') {
        this.$refs.form.resetFields();
      }
    },
    // select父组件容器存在动画时，
    // select-dropdown会在动画开始时计算宽度，
    // 导致dropdown宽度未撑开
    resizeComponent(change, el, vnode) {
      if (vnode.componentInstance.handleResize) {
        vnode.componentInstance.handleResize();
      }
    },
    // 验证表单
    validate(prop = '', cb = () => {}) {
      let isValid = false;
      if (prop && !Array.isArray(prop)) {
        this.$refs.form.validateField(prop, valid => {
          isValid = !valid;
          cb(isValid);
        });
      } else {
        this.$refs.form.validate(valid => {
          isValid = valid;
          cb(isValid);
        });
      }
      return isValid;
    },
    // 清楚校验结果
    clearValidate(props) {
      return this.$refs.form.clearValidate(props);
    },
    // 远程查询所得值
    remoteMethod: debounce(function(query) {
      this.$emit('queryRemote', query);
    }, 200)
  },
  created() {
    // 初始化form内容
    this.initFormValue();
  },
  mounted() {
    this.$on('onMutation', this.resizeComponent);
    this.clearValidate();
  },
  watch: {
    value: {
      handler(val) {
        this.form = val;
      },
      deep: true
    },
    form: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true
    },
    renderData: {
      handler(val) {
        this.renderForm = Array.isArray(val) ? val : this.mapRenderFormToArr(val);
      },
      immediate: true,
      deep: true
    },
    'renderForm.length'(newVal, oldVal) {
      // 判断表单是否新增或者删除
      newVal > oldVal ? this.append() : this.remove();
    }
  }
};
</script>
<style lang="scss">
.template_form {
  .page_form {
    width: 550px;
  }
  .el-form {
    position: relative;
    .el-input {
      // width: 178px;
    }
  }
  .el-select {
    // width: 100%;
  }
  &_wrapper {
    position: relative;
    height: auto;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }
  &_content {
    width: auto;
    .el-form-item {
      height: auto;
      margin-bottom: 0;
      &__content {
        height: auto !important;
        .el-date-editor {
          // padding: 0 !important;
        }
        .template_form_date_input {
          padding: 0 !important;
        }
        .el-input__prefix {
          left: 0;
        }
        .el-input {
          max-width: 300px;
        }
      }
      &__label {
        padding: 0 16px 0 0;
      }
    }
    &_desc {
      margin-left: 10px;
      font-size: 12px;
      color: #969799;
    }
  }
  &_title {
    line-height: 30px !important;
    font-weight: 700;
    display: inline-block;
  }
  .el-checkbox + .el-checkbox {
    margin: 0 !important;
  }
  .el-checkbox {
    &:not(:last-child) {
      margin-right: 30px !important;
    }
  }
  .form_item {
    &_text {
      display: block;
      width: 200px;
    }
    &_inline {
      display: inline-block;
      .el-form-item__content {
        display: inline-block;
        margin-left: 0 !important;
      }
      .select_input_right {
        width: 100px;
      }
    }
    &_textarea {
      width: 100%;
      height: auto;
      .el-form-item__content {
        height: auto;
      }
    }
    &_large {
      input.el-input__inner {
        height: 32px;
      }
      .el-date-editor {
        height: 32px !important;
        max-width: 330px;
      }
    }
    &_small {
      input.el-input__inner {
        height: 28px;
      }
      .el-date-editor {
        height: 28px !important;
      }
    }
  }
}
</style>
