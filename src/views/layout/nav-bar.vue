<template>
  <section class="nav-bar">
    <hamburger id="hamburger-container" class="hamburger-container"/>
    <section class="avator-container">
      <el-dropdown @visible-change="visibleChange">
        <span class="el-dropdown-link">
          <i class="icon-user"></i>
          <i class="avator-arrow el-icon-arrow-down el-icon--right" :class="{'is-rotate': visible}"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="tc p5">欢迎您：{{userInfo.phone || ''}}</el-dropdown-item>
          <el-dropdown-item class="tc" divided @click.native="handleLogout">退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </section>
  </section>
</template>
<script>
import Hamburger from './hamburger';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'NavBar',
  components: {
    Hamburger
  },
  data() {
    return {
      visible: false,
      user: {
        phone: ''
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo || {}
    })
  },
  methods: {
    ...mapActions({
      loginOut: 'user/loginOut'
    }),
    visibleChange(val) {
      this.visible = val;
    },
    async handleLogout() {
      const res = await this.loginOut();
      if (res) {
        this.$router.push({
          name: '登陆'
        });
      }
    }
  },
  async created() {
    // this.user.phone = phone;
  }
};
</script>
<style lang="scss" scope>
.nav-bar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    display: inline-block;
    height: 50px;
    line-height: 50px;
  }
  .avator-container {
    margin-right: 16px;
    float: right;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
  }
  .avator-arrow {
    transition: transform 0.3s ease;
    &.is-rotate {
      transform: rotate(180deg);
    }
  }
}
</style>
