<template>
  <!-- 优惠券设置 -->
  <section class="sponsor-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-medium" v-loading="loading">
        <template-form
          :title="isEdit ? '修改优惠券': '增加优惠券'"
          ref="form"
          :render-data="renderData"
          v-model="form"
          @onChange="onFormChange"
        >
          <template
            slot-scope="props"
            v-if="props.item.name === 'discountCondition' || props.item.name === 'discountAmount'"
          >元</template>
        </template-form>
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
import ShowApi from '@api/show';

export default {
  data() {
    return {
      loading: false,
      showList: [],
      form: {
        dateType: 1
      },
      btnLoading: false
    };
  },
  computed: {
    couponId() {
      return get(this.$route, 'params.couponId', '');
    },
    isEdit() {
      return !!this.couponId;
    },
    renderData() {
      return [
        {
          type: 'text',
          label: '优惠券名称:',
          name: 'title',
          value: '',
          required: true
        },
        // {
        //   type: 'number',
        //   label: '抵扣金额:',
        //   value: '',
        //   name: 'discount',
        //   required: true
        // },
        {
          label: '满:',
          type: 'text',
          value: '',
          inline: true,
          width: '100px',
          name: 'discountCondition',
          required: true,
          errorMsg: '请输入满多少元'
        },
        {
          label: '减:',
          type: 'text',
          value: '',
          width: '100px',
          inline: true,
          name: 'discountAmount',
          required: true,
          labelWidth: '50px',
          errorMsg: '请输入减多少元'
        },
        {
          type: 'radioGroup',
          label: '优惠券时间类型:',
          name: 'dateType',
          value: 1,
          options: [
            {
              label: '时间段（绝对时间）',
              value: 1
            },
            {
              label: '天数（相对时间）',
              value: 2
            }
          ]
        },
        {
          type: 'daterange',
          label: '有效期限:',
          name: 'limitTime',
          value: [],
          required: true,
          isHide: this.form.dateType !== 1
        },
        {
          type: 'number',
          label: '有效期限:',
          name: 'usefulDays',
          value: '',
          required: true,
          isHide: this.form.dateType === 1
        },
        {
          type: 'select',
          label: '适用演出:',
          name: 'performanceShowIds',
          value: [''],
          required: true,
          multiple: true,
          options: [
            {
              label: '全部',
              value: ''
            },
            ...this.showList
          ]
        },
        {
          label: '使用说明:',
          name: 'description',
          type: 'textarea',
          value: '',
          required: true
        }
      ];
    }
  },
  methods: {
    onFormChange(key, val) {
      if (key === 'dateType') {
        console.log(key, val);
        this.form.limitTime = [];
        this.form.usefulDays = '';
      }
    },
    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      this.btnLoading = true;

      let params = {};

      let { limitTime, performanceShowIds = [], ...others } = this.form;
      if (this.form.dateType === 1) {
        params.startTime = limitTime[0];
        params.endTime = limitTime[1];
      } else {
        params.usefulDays = limitTime;
      }
      // 场次全部时全选
      performanceShowIds = performanceShowIds.filter(_ => _);
      performanceShowIds = !performanceShowIds.length ? this.showList.map(item => item.value) : performanceShowIds;
      params = Object.assign(params, {
        ...others,
        id: this.couponId,
        performanceShowIds: performanceShowIds.join(',')
      });

      const uri = this.isEdit ? API.updateCouponModel : API.addCouponModel;
      this.$service.post(uri, params, true).then(res => {
        this.btnLoading = false;
        if (res && res.code === 0) {
          Message.success('保存成功！');
          this.$router.push({
            name: '优惠券列表'
          });
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    },
    // 查询演出列表
    async queryShowList() {
      return this.$service.post(ShowApi.queryAllActivityLst, { page: 1, limit: 9999 }).then(res => {
        if (res) {
          console.log(res,'rsssss')
          this.showList = res.data.map(item => {
            return {
              label: item.activityTitle,
              value: item.id
            };
          });
        }
      });
    },
    async queryDetail() {
      this.loading = true;
      this.$service.post(API.getCouponListByPage, { id: this.couponId }).then(res => {
        this.loading = false;
        if (res && res.list.length) {
          let ret = res.list.find(item => item.id === this.couponId);
          if (ret.dateType === 1) {
            ret.limitTime = [ret.startTime, ret.endTime];
            ret.usefulDays = '';
          } else {
            ret.limitTime = ret.usefulDays;
            ret.limitTime = [];
          }
          ret.performanceShowIds = ret.performanceShowIds.split(',').map(item => Number(item));
          if (ret.performanceShowIds.length === this.showList.length) {
            ret.performanceShowIds = [''];
          }
          this.form = Object.assign({}, this.form, ret);
        }
      });
    }
  },
  async created() {
    await this.queryShowList();
    this.isEdit && (await this.queryDetail());
  }
};
</script>