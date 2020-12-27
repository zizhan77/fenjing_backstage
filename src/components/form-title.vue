<template>
  <section class="form_title mb20">
    <h1 v-if="$slots.default || title" class="vertical_divid is-primary">
      <slot>{{title}}</slot>
    </h1>
  </section>
</template>
<script>
export default {
  name: 'formTitle',
  props: {
    title: {
      type: [String, Number],
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
.form_title {
  display: block;
  h1 {
    // display: inline-block;
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
