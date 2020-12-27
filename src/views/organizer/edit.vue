<template>
  <!-- 主办方配置 -->
  <section class="sponsor-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-small">
        <template-form
          :title="userId ? '主办方修改': '主办方开通'"
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
import Md5 from 'js-md5';
import API from '@api/organizer';

export default {
  data() {
    return {
      btnLoading: false,
      originName: '',
      originPhone: '',
      renderData: [
        {
          type: 'text',
          label: '主办方名称:',
          name: 'name',
          value: '',
          required: true,
          validator: async (rule, value, callback) => {            
            if (!value) {
              return callback(new Error('主办方名称不能为空'));
            }
            if (this.isEdit && value === this.originName) {
              return callback();
            }
            const res = await this.$service.post(API.querySponsor, { name: value });
            console.log(res);
            return res && res.length ? callback(new Error('主办方名称已被注册')) : callback();
          }
        },
        {
          type: 'text',
          label: '手机号码:',
          value: '',
          name: 'phone',
          required: true,
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error('请填写手机号码'));
            }
            if (this.isEdit && value === this.originPhone) {
              return callback();
            }
            const res = await this.$service.post(API.querySponsor, { phone: value });
            return res && res.length ? callback(new Error('手机号码已被注册')) : callback();
          }
        },
        {
          type: 'text',
          label: '账号密码:',
          value: '',
          name: 'password',
          required: true
        },
        {
          type: 'text',
          label: '负责人姓名:',
          value: '',
          name: 'chargeName',
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
    queryDetail() {
      this.$service.post(API.querySponsor, { id: this.userId }).then(res => {
        
        if (res && res.length) {
          this.form = res[0];
          this.originName = this.form.name;
          this.originPhone = this.form.phone;
        }
      });
    },
    handleConfirm() {
      this.$refs.form.validate('', valid => {
        if (!valid) {
          Message.warning('表单验证未通过！');
          return false;
        }
        this.btnLoading = true;

        const { createTime, updateTime, createUser, ...others } = this.form;
        const params = {
          ...others
        };
        const uri = this.isEdit ? API.updateById : API.sponsorAdd;
        this.$service.post(uri, params, true).then(res => {
          this.btnLoading = false;
          if (res && res.code === 0) {
            Message.success('保存成功！');
            this.$router.push({
              name: '主办方列表'
            });
          } else {
            Message.error(`${res.message || '保存失败！'}`);
          }
        });
      });
    }
  },
  created() {
    this.isEdit && this.queryDetail();
  }
};
</script>