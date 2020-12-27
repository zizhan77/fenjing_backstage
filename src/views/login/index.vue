<template>
  <div class="login-container">
    <div class="login-wrap">
      <div class="login-form-wrap">
        <el-form
          inline
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">记忆之声后台管理系统</h3>
          </div>

          <el-form-item prop="username" :show-message="false">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入手机号"
              type="text"
              tabindex="1"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="已打开大写" placement="right" manual>
            <el-form-item prop="password" :show-message="false">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入密码"
                tabindex="2"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
          </el-tooltip>
          <!-- 记住密码 -->
          <el-checkbox class="remember" v-model="loginForm.remember">记住密码</el-checkbox>
          <el-button
            class="login-btn"
            :loading="loading"
            type="primary"
            @click.native.prevent="handleLogin"
          >登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate';
import { mapActions } from 'vuex';
import Md5 from 'js-md5';
import Message from '@utils/message';
import { localStorage } from '@utils/utils';

export default {
  name: 'Login',
  data(){
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入手机号码'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码，密码至少6位'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入手机号码' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  watch:{
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    let loginForm = localStorage.getItem('login');
    if (loginForm) {
      loginForm = JSON.parse(loginForm);
      this.loginForm = Object.assign({}, this.loginForm, loginForm.remember ? loginForm : {});
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus();
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus();
    }
  },
  methods: {
    ...mapActions({
      lognIn: 'user/lognIn'
    }),
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if ((shiftKey && (key >= 'a' && key <= 'z')) || (!shiftKey && (key >= 'A' && key <= 'Z'))) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    // 记住密码
    handleRemember() {
      localStorage.setItem('login', JSON.stringify(this.loginForm));
    },
    async handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          if (this.loginForm.remember) {
            this.handleRemember();
          } else {
            localStorage.removeItem('login');
          }
          this.loading = true;
          const password = Md5(this.loginForm.password);
          const res = await this.lognIn({ phoneNumber: this.loginForm.username, password });
          this.loading = false;
          if (res) {
            // Message.success('登陆成功！');
            this.$router.push('/');
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.login-container {
  background: url('../../assets/login-bg.jpg') no-repeat;
  background-size: cover;
  width: 100%;
  min-width: 1280px;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  .login-wrap {
    width: 1280px;
    min-width: 1280px;
    height: 746px;
    margin: 0 auto;
    background: url('../../assets/login-bg-top.png') no-repeat;
    background-size: contain;
    text-align: right;
  }
  .login-form-wrap {
    margin-right: 100px;
    display: flex;
    align-items: center;
    width: 360px;
    height: 100%;
    float: right;
  }
  .login-form {
    position: relative;
    background-color: $white;
    overflow: hidden;
    text-align: left;
    .el-form-item__content {
      position: relative;
      width: 100%;
      .el-input {
        input {
          padding-left: 38px;
          border: none;
          border-bottom: 1px solid #dcdfe6;
          font-size: 18px;
          vertical-align: middle;
        }
        input:-webkit-autofill {
          box-shadow: inset 0 0 0 1000px #fff;
        }
      }
      .el-input__inner {
        border-radius: 0;
      }
    }
    .el-input,
    input {
      height: 62px;
      line-height: 62px;
    }
    .el-form-item {
      width: 100%;
      text-align: left;
      &.is-success {
        input {
          border-color: $green;
        }
      }
      &.is-error {
        input {
          border-color: $red;
        }
      }
    }
    .login-btn {
      margin-top: 40px;
      width: 100%;
      height: 60px;
      border-radius: 42px;
      font-size: 25px;
      background-color: $main-color;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    z-index: 10;
    svg {
      fill: $main-color;
    }
  }

  .title-container {
    position: relative;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      font-size: 36px;
      color: rgb(51, 51, 51);
    }
  }
  .remember {
    color: rgba(169, 169, 169, 0.5);
    span {
      font-size: 17px;
      vertical-align: middle;
    }
    .el-checkbox__inner {
      width: 20px;
      height: 20px;
      &::after {
        height: 12px;
        left: 7px;
      }
    }
  }
}

@media screen and (min-width: 1280px) and (max-width: 1366px) {
  .login-container {
    .login-wrap {
      width: 1080px;
      min-width: 1080px;
      height: 630px;
    }
    .login-form-wrap {
      margin-right: 80px;
      width: 282px;
      .title {
        font-size: 28px;
      }
    }
    .login-btn {
      height: 48px;
      font-size: 22px;
    }
  }
}

@media screen and (max-width: 1280px) {
  .login-container {
    .login-wrap {
      width: 980px;
      min-width: 980px;
      height: 572px;
    }
    .login-form-wrap {
      margin-right: 70px;
      width: 244px;
      .title {
        font-size: 24px;
      }
    }
    .login-btn {
      height: 48px;
      font-size: 22px;
    }
    .login-form {
      .el-input input {
        font-size: 16px !important;
      }
      .svg-container {
        font-size: 18px;
      }
      .el-checkbox {
        font-size: 12px;
      }
      .remember span {
        font-size: 16px;
      }
      .login-btn {
        font-size: 22px;
        height: 48px;
      }
    }
  }
}
</style>
