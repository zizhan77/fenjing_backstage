<template>
  <!-- layout -->
  <div :class="mainCls">
    <!-- 侧边栏 -->
    <sider-bar class="sider-container"></sider-bar>
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <nav-bar></nav-bar>
      <!-- 面包屑 -->
      <breadcrumb></breadcrumb>
      <!-- 视图 -->
      <section class="app-main">
        <router-view></router-view>
      </section>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import SiderBar from './sider-bar';
import NavBar from './nav-bar';
import AppMain from './app-main';
import Breadcrumb from './breadcrumb';

export default {
  name: 'Layout',
  components: {
    SiderBar,
    NavBar,
    AppMain,
    Breadcrumb
  },
  computed: {
    ...mapState({
      siderStatus: state => state.app.siderStatus
    }),
    mainCls() {
      return [
        'app-wrapper',
        {
          'hide-sider': this.siderStatus
        }
      ];
    }
  }
};
</script>
<style lang="scss">
@import '~@/styles/mixin.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
.hide-sider {
  .main-container {
    margin-left: 54px !important;
  }
}
.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: 210px;
  position: relative;
}
</style>

