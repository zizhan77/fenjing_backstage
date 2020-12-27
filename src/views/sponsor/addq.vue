<template>
  <!-- 赞助商配置 -->
  <section class="sponsor-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-small">
        <template-form
          :title="qumaId ? '券码修改': '券码添加'"
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
import API from '@api/sponsor';

export default {
  data() {
    return {
      btnLoading: false,
      originName: '',
      originPhone: '',
      renderData: [
        {
          type: 'text',
          label: '券码名称:',
          name: 'name',
          value: '',
          required: true          
        },
        {
          type: 'textarea',
          label: '券码描述:',
          value: '',
          name: 'des',
          required: true
        },
        {
          type: 'text',
          label: '兑奖链接:',
          value: '',
          name: 'url',
          required: false
        }    
      ],
      form: {}
    };
  },
  computed: {
    qumaId() {
      return get(this.$route, 'params.qumaId', '');
    },
    userId() {
      return get(this.$route, 'params.userId', '');
    },
    isEdit() {
      return !!this.qumaId;
    }
  },
  methods: {
    queryDetail() {
      this.$service.post(API.queryById, {id: this.qumaId }).then(res => {
        // console.log("请求的数据：",res);
        if (res) {
          this.form = res;         
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

        const {...others } = this.form;
        const params = {
          sponsorId:this.userId,
          ...others
        };        
        if(this.$route.params.qumaId){
          params.id=this.$route.params.qumaId;
        }
        // console.log(params);return;
        this.$service.post(API.edit, params, true).then(res => {
          this.btnLoading = false;          
          if (res && res.code === 0) {
            Message.success('保存成功！');
            this.$router.push({
              name: '券码列表',
              params:{
                userId:this.userId
              }
            });
          } else {
            Message.error(`${res.message || '保存失败！'}`);
          }
        });
      });
    }
  },
  created() {
    if(this.isEdit){
      this.queryDetail();
    }
  }
};
</script>