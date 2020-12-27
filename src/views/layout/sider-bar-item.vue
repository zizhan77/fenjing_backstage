<template>
  <section class="menu-wrapper">
    <template v-if="hasChildren(route.children)">
      <el-menu-item
        v-if="!(route.meta&&route.meta.hidden)"
        :index="route.path"
        :class="{'submenu-title-noDropdown':!isNest}"
      >
        <section>
          <svg-icon :icon-class="route.icon"></svg-icon>
          <span class="route-title">{{route.name}}</span>
        </section>
      </el-menu-item>
    </template>
    <el-submenu v-else ref="subMenu" :index="route.path" popper-append-to-body>
      <section slot="title">
        <!-- <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" /> -->
        <svg-icon :icon-class="route.icon"></svg-icon>
        <span class="route-title">{{route.name}}</span>
      </section>
      <sider-bar-item
        v-for="child in route.children"
        :key="child.path"
        :is-nest="true"
        :route="child"
        :base-path="child.path"
        class="nest-menu"
      />
    </el-submenu>
  </section>
</template>
<script>
import SvgIcon from '@components/svg-icon';

export default {
  name: 'SiderBarItem',
  components: {
    SvgIcon
  },
  props: {
    // route object
    route: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  methods: {
    hasChildren(children = []) {
      const showChildren = children.filter(child => !(child.meta && child.meta.hidden));
      return !showChildren.length;
    }
  }
};
</script>
<style lang="scss">
.menu-wrapper {
  .svg-icon {
    margin-right: 16px;
  }
}
.sider-bar {
  .is-active {
    .el-submenu__title {
      .route-title {
        color: #f4f4f5 !important;
      }
    }
  }
}
</style>
