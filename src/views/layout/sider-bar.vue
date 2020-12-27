<template>
  <!-- 侧边栏 -->
  <div class="sider-bar">
    <el-menu
      :default-active="activeMenu"
      :collapse="siderStatus"
      background-color="#304156"
      text-color="#bfcbd9"
      :unique-opened="true"
      active-text-color="#409EFF"
      :collapse-transition="false"
      mode="vertical"
      router
    >
      <template v-for="(item) in menuList">
        <sider-bar-item v-if="item.path" :key="item.path" :route="item" :base-path="item.path" />
      </template>
    </el-menu>
  </div>
</template>
<script>
import { routes } from '@/router/routes';
import { mapState } from 'vuex';
import SiderBarItem from './sider-bar-item';
import { localStorage } from '@utils/utils';
import { uniqBy } from 'lodash';

export default {
  name: 'SiderBar',
  components: {
    SiderBarItem
  },
  data() {
    return {
      activeMenu: ''
    };
  },
  computed: {
    ...mapState({
      siderStatus: state => state.app.siderStatus,
      userInfo: state => state.user.userInfo
    }),
    menuList() {
      if (this.userInfo) {
        const { menuList = [] } = this.userInfo;
        const list = routes.filter(route => menuList.some(menu => String(route.meta.id) === String(menu.id)));
        return list;
      }
      return [];
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        const { meta } = to;
        const path = localStorage.getItem('path');
        if (path && !from) {
          this.activeMenu = path || '/';
        }
        if (!meta.hidden) {
          this.activeMenu = to.path;
        }
        localStorage.setItem('path', this.activeMenu);
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss">
.hide-sider {
  .sider-bar {
    width: 54px !important;
  }
}
.sider-bar {
  transition: width 0.28s;
  width: 210px !important;
  background-color: #304156;
  height: 100%;
  font-size: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1001;
  overflow-x: hidden;
  overflow-y: scroll;
  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }
}
</style>
