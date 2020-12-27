<template>
  <!-- 艺人编辑 -->
  <section class="actor-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-medium">
        <template-form
          :title="isEdit ? '艺人修改':'艺人新增'"
          ref="form"
          :render-data="renderData"
          v-model="form"
          @onChange="handleFormChange"
        >
          <template slot-scope="props">
            <image-upload
              v-if="props.item.name === 'thumbUrl'"
              subTitle="建议尺寸：240*320"
              :fileList.sync="form.thumbUrl"
              :limit="1"
            ></image-upload>
            <span v-if="props.item.name === 'province'">省</span>
            <span v-if="props.item.name === 'city'">市</span>
          </template>
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
import ImageUpload from '@components/image-upload';
import API from '@api/basic';

export default {
  components: {
    TemplateForm,
    ImageUpload
  },
  data() {
    return {
      form: {},
      rules: [],
      provinceOps: [],
      cityOps: []
    };
  },
  computed: {
    actorId() {
      return get(this.$route, 'params.actorId', '');
    },
    isEdit() {
      return !!this.actorId;
    },
    renderData() {
      return [
        {
          type: 'text',
          label: '艺人名称:',
          name: 'artistName',
          value: '',
          required: true
        },
        {
          label: '艺人图片:',
          value: [],
          name: 'thumbUrl',
          required: true
        },
        {
          type: 'select',
          label: '出生地:',
          name: 'birthOneAddress',
          required: false,
          value: '',
          options: this.provinceOps
        },
        {
          type: 'select',
          name: 'birthTwoAdddress',
          required: false,
          value: '',
          options: this.cityOps
        },
        {
          type: 'textarea',
          name: 'basicInfo',
          label: '基本信息:',
          required: true,
          value: ''
        }
      ];
    }
  },
  methods: {
    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      const { thumbUrl, createTime, ...others } = this.form;
      const params = {
        optType: this.isEdit ? 2 : 1,
        id: this.actorId,
        thumbUrl: thumbUrl && thumbUrl.length ? thumbUrl[0].url : '',
        ...others
      };
      this.$service.post(API.addOrUpdate, params, true).then(res => {
        if (res && res.code === 0) {
          Message.success('保存成功');
          this.$router.go(-1);
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    },
    async handleFormChange(key, val, form) {
      if (key === 'birthOneAddress') {
        // 重置市选项
        this.$refs.form.resetForm('birthTwoAdddress');
        this.cityOps = [];
        this.cityOps = await this.queryCityList(val);
      }
    },
    // 查询城市
    async queryCityList(query) {
      const list = (await this.$service.post(API.queryListByParent, { parentCode: query })) || [];
      return list.map(({ addressCode, addressName }) => {
        return {
          label: addressName,
          value: addressCode
        };
      });
    },
    async queryActorInfo() {
      return this.$service.post(API.queryArtistDetail, { actorId: this.actorId }).then(async res => {
        this.form = res;
        this.form.thumbUrl = [{ url: this.form.thumbUrl }];
        if (this.form.birthOneAddress) {
          this.cityOps = await this.queryCityList(this.form.birthOneAddress);
        }
      });
    }
  },
  async created() {
    this.provinceOps = await this.queryCityList(0);
    if (this.isEdit) {
      await this.queryActorInfo();
    }
  }
};
</script>