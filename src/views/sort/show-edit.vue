<template>
  <!-- 活动修改 -->
  <section class="activity-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-medium">
        <template-form title="演出详情" ref="form" :render-data="renderData" v-model="form" >
          <template slot-scope="props">
            <image-upload
              v-if="props.item.name === 'thumbUrl'"
              :fileList.sync="form.thumbUrl"
              :limit="1"
            ></image-upload>
          </template>
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
import TemplateForm from '@components/template-form';
import { get } from 'lodash';
import Message from '@utils/message';
import ImageUpload from '@components/image-upload';
import API from '@api/sort';

export default {
  components: {
    TemplateForm,
    ImageUpload
  },
  data() {
    return {
      btnLoading: false,
      renderData: [
         {
          label: '演出名称:',
          name: 'name',
          type: 'text',
          value: '',
          required: true
        },
        {
          label: '主图上传:',
          name: 'thumbUrl',
          value: [],
          required: false
        },       
        {
          label: '开始时间:',
          name: 'startTime',
          type: 'date',
          required:true,
          value: ''
        },
        {
          label: '结束时间:',
          name: 'endTime',
          type: 'date',
          required:true,
          value: ''
        },
        {
          label: '饭团数:',
          name: 'count',
          type: 'number',
          required:false,
          value: '0'
        },
      ],
      form: {},
      rules: []
    };
  },
  computed: {
    activityId() {
      return get(this.$route, 'params.showId', '');
    },
    isEdit() {
      return !!this.activityId;
    }
  },
  methods: {
    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      const { thumbUrl,...others } = this.form;

      const params = {
        ...others,
        thumbUrl,
        url: thumbUrl.length ? thumbUrl[0].url : ''
      };      
      if (this.isEdit) {
        params.id = this.activityId;
      }
      this.btnLoading = true;      
      console.log("所有参数：",params);//return;//后台没有存url
      this.$service.post(API.addPerformance, params, true).then(res => {
        this.btnLoading = false;
        if (res && res.code === 0){
          Message.success('保存成功！');
          this.$router.push({
            name: '排行列表'
          });
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    },
    queryActorInfo(){
      this.$service.post(API.getDetail, { id: this.activityId }).then(res => {
        console.log("要编辑的信息：",res)
        if (res.data) {
          res=res.data;
          this.form = res.find(item => item.id === this.activityId);
          let timg=this.form.url;  
          var tobj={};
          tobj.url=timg;
          tobj.uid="123466456454654";
          tobj.status="success";
          this.form.thumbUrl=[tobj]         
        }
      });
    }
  },
  created(){    
    if (this.isEdit) {
      this.queryActorInfo();
    }
  }
};
</script>