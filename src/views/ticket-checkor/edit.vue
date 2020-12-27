<template>
  <!-- 验票员配置 -->
  <section class="sponsor-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-small">
        <template-form
          :title="userId ? '验票员修改': '验票员开通'"
          ref="form"
          :render-data="renderData"
          v-model="form"
        ></template-form>
        <footer class="page_footer">
          <el-button size="medium" type="primary" @click="handleConfirm" :loading="btnLoading">确 认</el-button>
          <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
        </footer>
      </div>
    </section>
  </section>
</template>
<script>
import { get } from 'lodash';
import Message from '@utils/message';
import API from '@api/ticket';

export default {
  data() {
    return {
      originPhone: '',
      btnLoading: false,
      renderData: [
        {
          type: 'text',
          label: '验票员手机号:',
          name: 'phoneNumber',
          value: '',
          required: true,
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('手机号不能为空！'));
            }
            if (this.isEdit && String(value) === String(this.originPhone)) {
              return callback();
            }
            const res = await this.$service.post(API.queryList, { phoneNumber: value });
            if (!res || !res.data || !res.data.length) {
              return callback();
            }
            return callback(new Error('手机号已被注册'));
            // return res && res.list && res.list.length ? callback(new Error('手机号已被注册')) : callback();
          }
        },
        {
          type: 'text',
          label: '姓名:',
          value: '',
          name: 'name',
          required: true
        },
        {
          type: 'radioGroup',
          label: '账号状态:',
          name: 'status',
          value: 1,
          options: [
            {
              label: '启用',
              value: 1
            },
            {
              label: '冻结',
              value: 2
            }
          ]
        }
      ],
      form: {}
    };
  },
  computed: {
    userId() {
      return get(this.$route, 'params.userId', '');
    },
    isEdit() {
      return !!this.userId;
    }
  },
  methods: {
    handleConfirm() {
      this.$refs.form.validate('', valid => {
        if (!valid) {
          Message.warning('表单验证未通过！');
          return false;
        }
        const params = {
          id: this.userId,
          optType: this.isEdit ? 2 : 1,
          phoneNumber: this.form.phoneNumber,
          name: this.form.name,
          status: this.form.status
        };
        this.btnLoading = true;
        this.$service.post(API.addOrUpdateCheckMan, params, true).then(res => {
          this.btnLoading = false;
          if (res && res.code === 0) {
            Message.success('保存成功！');
            this.$router.push({
              name: '验票员列表'
            });
          } else {
            Message.error(`${res.message || '保存失败！'}`);
          }
        });
      });
    },
    queryUserInfo() {
      this.$service.post(API.queryList, { id: this.userId, page: 1, limit: 999 }).then(res => {
        if (res) {
          this.form = res.data.find(item => item.id === this.userId) || {};
          this.originPhone = this.form.phoneNumber;
        }
      });
    }
  },
  created() {
    this.isEdit && this.queryUserInfo();
  }
};
</script>