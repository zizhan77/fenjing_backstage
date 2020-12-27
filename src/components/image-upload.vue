<template>
  <div class="image_upload">
    <h1 class="upload_title" v-if="title || subTitle">
      {{title}}
      <span class="upload_subtitle">{{subTitle}}</span>
    </h1>
    <el-upload
      ref="upload"
      class="image_upload_wrapper"
      name="fileName"
      :list-type="listType"
      :disabled="disabled"
      :accept="accept"
      :action="imageUrl"
      :limit="limit"
      :file-list.sync="imgFileList"
      :auto-upload="true"
      :on-preview="handlePreview"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :headers="headers"
    >
      <i class="el-icon-upload2"></i>
    </el-upload>
  </div>
</template>
<script>
import Message from '@utils/message';
import { isEmpty } from 'lodash';
import { isContains } from '@utils/utils';
import { getToken } from '@utils/auth';
import API from '@api/show';

const ORIGIN = process.env.NODE_ENV === 'production' ? window.origin : 'http://47.92.115.105';//'http://47.92.115.105';'http://192.168.31.48:8080'

export default {
  name: 'imageUpload',
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    // 文件列表
    // 单元项结构：{name:'',url:''}
    fileList: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 999
    },
    size: {
      type: [Object, Array],
      default: () => {}
    },
    // 图片上传大小限制
    storageSize: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    beforeUpload: Function,
    showUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: 'picture-card'
    }
  },
  data() {
    return {
      imageUrl: `${ORIGIN}/` + API.uploadFile,
      dialogVisible: false,
      imgFileList: this.fileList,
      dialogImageUrl: [],
      iconWrapper: null,
      headers: {
        token: getToken()
      }
    };
  },
  methods: {
    // 上传文件之前
    handleBeforeUpload(file) {
      if (this.beforeUpload) {
        return this.beforeUpload(file);
      }
      if (!isEmpty(this.size)) {
        const fileSize = file.size / 1024 / 1024;
        let img = new Image();
        img.src = window.URL.createObjectURL(file);
        return new Promise((resolve, reject) => {
          img.onload = () => {
            if (Array.isArray(this.size)) {
              const rule = {
                w: img.width,
                h: img.height
              };
              if (isContains(this.size, rule) && fileSize <= this.storageSize) {
                resolve();
              } else {
                Message.warning('图片尺寸不符合要求！');
                reject();
              }
            } else {
              let { width = '', height = '', size = 999 } = this.size;
              if (img.width !== width || img.height !== height || fileSize > size) {
                Message.warning(`请上传尺寸为 ${width} * ${height} ${this.size.size ? `，尺寸为${size}M` : ''} 的图片`);
                // eslint-disable-next-line
                reject();
              } else {
                resolve();
              }
            }
          };
        });
      }
    },
    // 文件预览
    handlePreview(file) {
      let { url = '' } = file;
      this.$set(this.dialogImageUrl, '0', url);
      this.$nextTick(() => {
        this.dialogVisible = true;
      });
    },
    // 文件移除
    handleRemove(file, fileList) {
      this.imgFileList = this.imgFileList.filter(item => item.uid !== file.uid);
    },
    handleError(err, file) {
      Message.error(`文件上传失败！${err}`);
    },
    // 文件上传成功
    handleSuccess(res, file, fileList) {
     
      if (res && res.code === 0) {
        Message.success('上传成功！');
        const { uid } = file;
        this.imgFileList.push({
          uid,
          url: res.data
        });
      } else {
        Message.warning(res.errstr);
      }
    },
    // 文件超出个数限制
    handleExceed(files, fileList) {
      Message.warning(`${this.title}最多只能上传${this.limit}个！`);
    }
  },
  watch: {
    imgFileList(val) {
      this.$emit('update:fileList', val);
    },
    fileList(val) {
      this.imgFileList = val;
    }
  }
};
</script>
<style lang="scss">
.image_upload {
  .upload_title {
    margin: 10px 0;
    height: 15px;
    line-height: 15px;
    font-size: 12px;
    color: #333;
  }
  .upload_subtitle {
    color: #969799;
    // margin-left: 10px;
  }
  .img-check {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
    font-size: 18px;
    cursor: pointer;
  }
  .el-upload-list__item-actions:hover {
    .img-check {
      display: block;
    }
  }
}
</style>
