<template>
  <section class="label_item" :style="{display: `${inline ? 'inline-block' : 'block'}`}">
    <label
      :class="{ label_item_label: true, is_required: required }"
      :style="{width: getLabelWidth, textAlign: `${align}`, color: `${color}`}"
    >{{label}}</label>
    <div class="label_item_text" :style="{marginLeft: getLabelWidth}">
      <slot></slot>
    </div>
  </section>
</template>
<script>
export default {
  name: 'labelItem',
  props: {
    // label
    label: {
      type: String,
      default: ''
    },
    // label对齐方式
    align: {
      type: String,
      default: 'right'
    },
    // label-width
    labelWidth: {
      type: [Number, String],
      default: 80
    },
    // display-inline
    inline: {
      type: Boolean,
      default: false
    },
    // color
    color: {
      type: String,
      default: '#757678'
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getLabelWidth() {
      return String(this.labelWidth).indexOf('px') > -1 ? this.labelWidth : `${this.labelWidth}px`;
    }
  }
};
</script>
<style lang="scss">
.label_item {
  margin: 0 10px 0 0;
  vertical-align: middle;
  &_label {
    box-sizing: border-box;
    padding: 0 16px 0 0;
    line-height: 32px;
    font-size: 14px;
    float: left;
    color: #757678;
    &.is_required {
      &::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }

  &_text {
    font-size: 14px;
    // display: inline-block;
    min-height: 32px;
    line-height: 32px;
  }
}
</style>
