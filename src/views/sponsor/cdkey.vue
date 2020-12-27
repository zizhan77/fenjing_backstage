<template>
  <!-- 批量导入兑换码 -->
  <section class="cdkey page_main">
    <section class="page_card page_card_padding">
      <form-title>选择excel文件</form-title>
      <div style="width:80%;border:1px solid #ddd;border-radius:10px;box-sizing:border-box;padding:15px;text-algin:justify;font-size:13px;color:#999;line-height:26px;margin:10px 0;">兑换码格式：<br/>①卡密格式，第一列为卡号，第二列为密码；<br/>②兑换码（cdkey）/不可重复使用的兑换链接，写在第一列；<br/>③可重复使用的兑换码或者兑换链接，复制对应的行数（库存数量）写在第一列。<br/><b>注意：第一行直接写兑换码。</b></div>
      <!-- action="http://www.jiyilive.com/changeCode/up" -->
      <form id="upcode" class="cdkey-container" method="post" enctype="multipart/form-data">
          <input type="file" name="file" style="display:none;" id="upexc" @change="upImgnew"/>
          <input type="text" name="codeTypeId" id="caled" style="display:none;" value="1"/>
          <label style="width:120px;height:120px;display:block;text-align:center;line-height:120px;box-sizing:border-box;font-size:100px;color:#f0f0f0;border:1px solid #ddd;cursor:pointer;" for="upexc">
            +
          </label>                  
      </form>
      <el-button class="mt20" size="medium" @click="$router.go(-1)">返 回</el-button>
    </section>
  </section>
</template>

<script>
import { getToken } from '@utils/auth';
import API from '@api/sponsor';
import Message from '@utils/message';
import 'jquery'
const ORIGIN = 'http://www.jiyilive.com';//'http://192.168.3.144:8080''http://47.92.115.105'
export default {
  props: {
    prizeName: {
      type: String,
      default: ''
    },
    activityId: [String, Number],
    prizeId: {
      type: [String, Number]
    }
  },
  data(){
    return {
      url: `${ORIGIN}/`,// + API.uploadCode,
      fileList: [],
      uploadRes: '',
      headers: {
        token: getToken()
      },
      fileData: {
        activityId: this.activityId
      }
    };
  },
  computed:{
    },
  methods:{
    upImgnew:function(){
      document.getElementById("caled").value=this.$route.params.codeId;
      var ele=document.getElementById("upcode"); 
      var file= document.getElementById("upexc"); 
      let data = new FormData();
           
      data.append('file', file.files[0]);
      data.append('codeTypeId', this.$route.params.codeId);
      console.log(data.get("codeTypeId"),data.get("file"));
      this.$axios
        .request({
          url: ORIGIN+'/'+API.uploadCode,//http://192.168.3.144:8080  http://47.92.115.105
          method: 'POST',
          headers: {
            token: getToken(),
            'content-type': 'multipart/form-data'
          },
          data,
          cache: false,
          processData: false,
          contentType: false,          
          timeout: 30000,
          withCredentials: true
        })
        .then(res => {
          console.log(res);
          let { data } = res;
          if (data.code === 0) {
            Message.success("上传成功");
            this.$router.go(-1)
          } else {
            Message.error('上传失败！' + data.errStr);
          }
        })
        .catch(error => {
          console.log(error);
          Message.error('上传失败！' + error);
        });
    },
    handleSuccess(res, file, fileList) {//这个暂时不用
      // console.log(file)
      let data = new FormData();
      data.append('file', file[0].raw);
      data.append('codeTypeId', this.$route.params.codeId);
      this.$axios
        .request({
          url: `${process.env.NODE_ENV === 'production' ? window.origin : 'http://47.92.115.105'}${API.uploadCode}`,//http://192.168.3.144:8080  http://47.92.115.105
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
            Message.success("上传成功");
            return;
            this.$router.go(-1)
          } else {
            Message.error('上传失败！' + data.errStr);
          }
        })
        .catch(error => {
          console.log(error);
          Message.error('上传失败！' + error);
        });
      return;
      if (res && res.code === 0) {
        this.uploadRes = res.data;
        Message.success(`上传成功！`);
      } else {
        this.uploadRes = '';
        Message.error(`${res.message || '上传失败！'}`);
      }
    }
  },
  created(){
    //  console.log(Message)
    // console.log(this.$route.params)
  }
};
</script>
<style lang="scss">
.button{width:120px;height:120px;text-align:center;line-height:120px;font-size:100px;color:#f0f0f0;}
.cdk-success {
  margin-bottom: 20px;
}
.cdkey-container {
  line-height: 2;
}
</style>
