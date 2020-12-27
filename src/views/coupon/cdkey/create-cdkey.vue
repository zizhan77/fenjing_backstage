<template>
  <!-- 生成兑换码 -->
  <section class="cdkey-add page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-small">
        <template-form title="生成兑换码" ref="form" :render-data="renderData" v-model="form"></template-form>
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
import API from '@api/coupon';

export default {
  props: {
    id: [String, Number]
  },
  data() {
    return {
      form: {},
      btnLoading: false,
      couponList: []
    };
  },
  computed: {
    renderData() {
      return [
        {
          type: 'select',
          label: '选择优惠券:',
          name: 'businessKey',
          value: '',
          options: this.couponList,
          required: true
        },
        {
          type: 'number',
          label: '生成数量:',
          value: '',
          name: 'number',
          required: true
        },
        {
          type: 'textarea',
          label: '生成说明:',
          value: '',
          name: 'remark',
          required: true
        }
      ];
    }
  },
  methods: {
    queryCouponList() {
      this.$service.post(API.getCouponListByPage, { page: 1, limit: 9999 }).then(res => {
        if (res && res.list) {
          this.couponList = res.list.map(item => {
            return {
              label: item.title,
              value: item.id
            };
          });
        }
      });
    },
    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      this.btnLoading = true;
      const params = {
        businessTag: 1,
        id: this.is,
        optType: this.id ? 2 : 1,
        ...this.form
      };
      this.$service.post(API.generateCommonExchangeCode, params, true).then(res => {
        this.btnLoading = false;
        if (res && res.code === 0) {
          Message.success('保存成功！');
          this.$router.push({
            name: '优惠券兑换码'
          });
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    }
  },
  created() {
    this.queryCouponList();
  }
};
</script>