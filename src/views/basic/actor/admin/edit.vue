<template>
  <!-- 管理员配置 -->
  <section class="admin-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-small">
        <template-form title="管理员配置" ref="form" :render-data="renderData" v-model="form"></template-form>
        <footer class="page_footer">
          <el-button size="medium" type="primary" @click="handleConfirm" :loading="btnLoading">确 认</el-button>
          <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
        </footer>
      </div>
    </section>
  </section>
</template>
<script>
import TemplateForm from '@components/template-form';
import { get } from 'lodash';
import Message from '@utils/message';
import API from '@api/basic';
import Md5 from 'js-md5';

export default {
  name: 'AdminEdit',
  components: {
    TemplateForm
  },
  data() {
    return {
      originPhone: '',
      btnLoading: false,
      form: {},
      rules: [],
      roleList: []
    };
  },
  computed: {
    userId() {
      return get(this.$route, 'query.userId', '');
    },
    isEdit() {
      return !!this.userId;
    },
    renderData() {
      return [
        {
          type: 'text',
          label: '账号:',
          name: 'accountNumber',
          value: '',
          required: true,
          pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('手机号不能为空！'));
            }
            if (this.isEdit && value === this.originPhone) {
              return callback();
            }
            const list = await this.$service.post(API.getAdminList, { phoneNumber: value });
            const res = list.list.find(({ accountNumber }) => accountNumber === value);
            return res ? callback(new Error('手机号已被注册')) : callback();
          }
        },
        {
          type: 'text',
          label: '密码:',
          value: '',
          name: 'password',
          required: true
        },
        {
          type: 'select',
          label: '角色:',
          name: 'role',
          required: true,
          value: 1,
          options: this.roleList
        }
      ];
    }
  },
  methods: {
    handleConfirm() {
      this.$refs.form.validate('', valid => {
        if (!valid) {
          Message.warning('表单验证未通过！');
          return false;
        }
        this.btnLoading = true;
        const { password, ...others } = this.form;
        const uri = this.isEdit ? API.updatePassword : API.administrator;
        const params = {
          password: Md5(password),
          ...others
        };
        this.$service.post(uri, params, true).then(res => {
          this.btnLoading = false;
          if (res && res.code === 0) {
            Message.success('保存成功！');
            this.$router.push({
              name: '管理员列表'
            });
          } else {
            Message.error(`${res.message || '保存失败！'}`);
          }
        });
      });
    },
    // 查询角色列表
    queryRules() {
      this.$service.post(API.getRoleList).then(res => {
        if (res) {
          this.roleList = res.map(({ id, name }) => {
            return {
              label: name,
              value: id
            };
          });
        }
      });
    },
    queryUserInfo() {
      const { query = {} } = this.$route;
      this.form = Object.assign({}, this.form, query);
      this.originPhone = this.form.accountNumber;
    }
  },
  created() {
    this.queryRules();

    this.isEdit && this.queryUserInfo();
  }
};
</script>