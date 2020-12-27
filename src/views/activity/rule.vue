<template>
  <!-- 活动列表 -->
  <section class="activity-list page_main">
    <section class="page_card page_card_padding">        
      <template-form
        class="show-edit__container"
        ref="form"
        title="活动规则"
        :renderData="renderData"
        v-model="form"        
      >
      <template slot-scope="props">
       <template v-if="props.item.name === 'detail'">          
          <div id="editor-wrap"></div>
        </template>
      </template>
      </template-form>

       <footer class="page_footer">
        <el-button size="medium" type="primary" @click="handleConfirm">确 认</el-button>
        <el-button size="medium" @click="$router.go(-1)">退 出</el-button>
      </footer>      
    </section>
  </section>
</template>
<script>
import { uniqBy, uniq, get } from 'lodash';
import { getToken } from '@utils/auth';
import TemplateForm from '@components/template-form';
import ImageUpload from '@components/image-upload';
import Message from '@utils/message';
import Editor from 'wangeditor';
import API from '@api/activity';
import { isContains,formatDate } from '@utils/utils';

export default {
  components: {
    TemplateForm,
    ImageUpload    
  },
  data() {
    return {
      form: {},
      thisId:0,      
     // 文本编辑器
      Editor: null,
    };
  },
  props: {
    showId: {
      type: [String, Number],
      default: ''
    }
  },
  computed:{
    renderData(){
      return [
        {
          label: '活动规则:',
          name: 'detail',
          value: '',
          required: true
        },
        ]
      }
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
       const {detail}=this.form;       
       const params={id:this.thisId,url:detail}
      this.$service.post(API.updateRule, params, true).then(res => {
      // this.btnLoading = false;
      if (res && res.code === 0) {
        Message.success('保存成功！');
      } else {
        Message.error(`${res.message || '保存失败！'}`);
      }
    });
    },
    getNowInfo(){
      this.$service.post(API.getRule,{},true).then(res=>{
        // console.log("请求结果：",res);
        this.thisId=res.data[0].id;
        this.Editor.txt.html(res.data[0].url)
      })
    },
  },
  created() {
    this.getNowInfo();
    this.$nextTick(()=>{
      
    //初始化编辑器
    this.Editor = new Editor('#editor-wrap');   
    this.Editor.customConfig.uploadFileName = 'fileName';
    this.Editor.customConfig.uploadImgServer = process.env.NODE_ENV === 'production' ? window.origin : 'http://47.92.115.105' + '/file/uploadFile'; // 上传图片到服务器
    this.Editor.customConfig.withCredentials = true;
    this.Editor.customConfig.onchange = html => {
      // html 即变化之后的内容
      this.form.detail = html;
    };
    this.Editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'justify', // 对齐方式
      'image'
    ];
    this.Editor.customConfig.customUploadImg = (files, insert) => {
      let data = new FormData();      
      data.append('fileName', files[0]);
      console.log("传图片数据：",data.get("fileName"));
      this.$axios
        .request({
          url: `${process.env.NODE_ENV === 'production' ? window.origin : 'http://47.92.115.105'}/file/uploadFile`,//http://192.168.3.144:8080  http://47.92.115.105
          method: 'POST',
          headers: {
            token: getToken(),
            'content-type': 'multipart/form-data'
          },
          cache: false,    
          processData: false,
          contentType: false,
          data,
          timeout: 30000,
          withCredentials: true
        })
        .then(res => {
          let { data } = res;
          if (data.code === 0) {
            Message.success("上传成功~")
            insert(data.data);
          } else {
            Message.error('上传失败！' + data.errStr);
          }
        })
        .catch(error => {
          console.log(error);
          Message.error('上传失败！' + error);
        });
    };
    this.Editor.create();
    //编辑器初始化完毕
    })    
  }
};
</script>
<style type="scss">
.show-edit {
  &__container {
    max-width: 900px;
  }
  &__confirm { 
  }
}
.w-e-menu {
  z-index: 1001 !important;
}
.w-e-text-container {
  z-index: 999 !important;
}
  table tr td img{max-width:200px;height:auto;}
</style>