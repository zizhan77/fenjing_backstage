<template>
  <!-- 区域详情 -->
  <section class="area-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div v-loading="loading">
        <template-form title="区域配置" ref="form" :render-data="renderData" v-model="form">
          <!-- <template slot-scope="props"></template> -->
        </template-form>
        <footer class="page_footer">
          <el-button size="medium" type="primary" @click="handleConfirm">确 认</el-button>
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

export default {
  components: {
    TemplateForm
  },
  props: {
    placeId: [String, Number],
    areaId: [String, Number]
  },
  data() {
    return {
      loading: false,
      renderData: [
        {
          type: 'text',
          label: '区域名称:',
          name: 'areaName',
          value: '',
          required: true
        },
        {
          type: 'color',
          label: '区域颜色:',
          value: '',
          name: 'areaColor',
          required: true,
          options: []
        }
      ],
      form: {}
    };
  },
  computed: {
    isEdit() {
      return !!this.areaId;
    }
  },
  methods: {
    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      const params = {
        placeId: this.placeId,
        id: this.areaId,
        ...this.form
      };
      const uri = this.isEdit ? API.updateArea : API.createArea;
      this.$service.post(uri, params, true).then(res => {
        if (res && res.code === 0) {
          Message.success('保存成功！');
          this.$router.go(-1);
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    },
    queryFormDetail() {
      this.loading = true;
      this.$service.post(API.queryAreaListByPlaceId, { placeId: this.placeId, id: this.areaId }).then(res => {
        this.loading = false;
        if (res && res.length) {
          this.form = res[0];
        }
      });
    }
  },
  created() {
    if (this.isEdit) {
      this.queryFormDetail();
    }
  }
};
</script>