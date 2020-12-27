<template>
  <!-- 批量导入兑换码 -->
  <section class="cdkey page_main">
    <section class="page_card page_card_padding">
      <form-title>奖品名称</form-title>
      <div class="cdkey-container">
        <h5>{{prizeName}}</h5>
        <el-upload
          name="fileName"
          class="upload-demo"
          accept=".xls, .xlsx"
          :data="fileData"
          :show-file-list="false"
          :action="url"
          :file-list.sync="fileList"
          :on-success="handleSuccess"
          :headers="headers"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
        <section class="cdk-success" v-if="uploadRes">
          <h3>{{uploadRes}}</h3>
          <p>结果请到抽奖记录中查看</p>
        </section>
      </div>
      <el-button class="mt20" size="medium" @click="$router.go(-1)">返 回</el-button>
    </section>
  </section>
</template>
<script>
import { getToken } from '@utils/auth';
import API from '@api/activity';
import Message from '@utils/message';
const ORIGIN = process.env.NODE_ENV === 'production' ? window.origin : 'http://47.92.115.105';

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
  data() {
    return {
      url: `${ORIGIN}/` + API.uploadExcel,
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
  methods: {
    handleSuccess(res, file, fileList) {
      if (res && res.code === 0) {
        this.uploadRes = res.data;
        Message.success(`上传成功！`);
      } else {
        this.uploadRes = '';
        Message.error(`${res.message || '上传失败！'}`);
      }
    }
  }
};
</script>
<style lang="scss">
.cdk-success {
  margin-bottom: 20px;
}
.cdkey-container {
  line-height: 2;
}
</style>
