<template>
  <!-- 赞助商配置 -->
  <section class="sponsor-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-small">
        <template-form
          :title="userId ? '赞助商修改' : '赞助商开通'"
          ref="form"
          :render-data="renderData"
          v-model="form"
          @onChange="handleFormChange"
        >
          <template slot-scope="props">
            <image-upload
              v-if="props.item.name === 'thumburl'"
              :fileList.sync="form.thumburl"
              :limit="1"
            ></image-upload>
            <span v-if="props.item.name === 'oneAddress'">省</span>
            <span v-if="props.item.name === 'twoAddress'">市</span>
            <div v-if="props.item.name === 'intro'" id="editor-wrap"></div>
          </template>
        </template-form>
        <footer class="page_footer">
          <el-button
            size="medium"
            type="primary"
            @click="handleConfirm"
            :loading="btnLoading"
            >确 认</el-button
          >
          <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
        </footer>
      </div>
    </section>
  </section>
</template>
<script>
import { get } from "lodash";
import Message from "@utils/message";
import Md5 from "js-md5";
import API from "@api/sponsor";
import ImageUpload from "@components/image-upload";
import Editor from "wangeditor";

export default {
  components: {
    ImageUpload,
  },
  data() {
    return {
      btnLoading: false,
      originName: "",
      originPhone: "",
      showList: [],
      tShowList: [],
      tActiveList: [],
      form: {},
    };
  },
  computed: {
    renderData() {
      return [
        {
          type: "text",
          label: "赞助商名称:",
          name: "name",
          value: "",
          required: true,
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error("赞助商名称不能为空"));
            }
            if (this.isEdit && value === this.originName) {
              return callback();
            }
            const res = await this.$service.post(API.querySponsor, {
              name: value,
            });
            return res && res.length
              ? callback(new Error("赞助商名称已被注册"))
              : callback();
          },
        },
        {
          type: "text",
          label: "手机号码:",
          value: "",
          name: "phone",
          required: true,
          validator: async (rule, value, callback) => {
            if (!value) {
              return callback(new Error("请填写手机号码"));
            }
            if (this.isEdit && value === this.originPhone) {
              return callback();
            }
            const res = await this.$service.post(API.querySponsor, {
              phone: value,
            });
            return res && res.length
              ? callback(new Error("手机号码已被注册"))
              : callback();
          },
        },
        {
          type: "text",
          label: "账号密码:",
          value: "",
          name: "password",
          required: true,
        },
        {
          label: "赞助商简介:",
          name: "intro",
          required: true,
          value: "",
        },
        {
          type: "text",
          label: "负责人姓名:",
          value: "",
          name: "contactName",
          required: true,
        },
        {
          name: "thumburl",
          label: "图片:",
          required: true,
          value: [],
        },
        {
          type: "radioGroup",
          name: "thumbtype",
          label: "跳转类别:",
          required: true,
          value: 0,
          options: [
            {
              label: "公众号文章",
              value: 5,
            },
            {
              label: "小程序appid",
              value: 4,
            },
            {
              label: "已配置的h5链接",
              value: 3,
            },
            {
              label: "演出",
              value: 2,
            },
            {
              label: "活动",
              value: 1,
            },
            {
              label: "不跳转",
              value: 0,
            },
          ],
        },
        {
          type: "select",
          label: "跳转演出或活动:",
          name: "url",
          value: " ",
          required: false,
          options: this.showList,
        },
        {
          type: "text",
          label: "跳转小程序或H5:",
          name: "url1",
          value: "",
          required: false,
        },
        {
          type: "radioGroup",
          label: "账号状态:",
          name: "status",
          value: 1,
          options: [
            {
              label: "启用",
              value: 1,
            },
            {
              label: "冻结",
              value: 2,
            },
          ],
        },
        {
          type: "radioGroup",
          label: "是否输出给小程序:",
          name: "isshow",
          value: 1,
          options: [
            {
              label: "输出",
              value: 1,
            },
            {
              label: "不输出",
              value: 0,
            },
          ],
        },
      ];
    },
    userId() {
      return get(this.$route, "params.userId", "");
    },
    isEdit() {
      return !!this.userId;
    },
  },

  methods: {
    queryDetail() {
      this.$service.post(API.querySponsor, { id: this.userId }).then((res) => {
        if (res && res.length) {
          let ret = res[0];
          if (ret.thumbtype == 3 || ret.thumbtype == 4 || ret.thumbtype == 5) {
            ret.url1 = ret.url;
            ret.url = "";
          } else if (ret.thumbtype == 0) {
            ret.url = " ";
            ret.url1 = "";
          } else {
            ret.url = Number(ret.url);
            if (ret.thumbtype == 1) {
              this.showList = this.tActiveList;
            } else {
              this.showList = this.tShowList;
            }
            ret.url1 = "";
          }
          console.log(this.showList);

          ret.thumbtype = Number(ret.thumbtype);
          ret.thumburl = [{ url: ret.thumburl || "" }];
          this.form = ret; // res[0];
           this.Editor.txt.html(this.form.intro);
          this.originName = this.form.name;
          this.originPhone = this.form.phone;
        }
      });
    },
    handleConfirm() {
      this.$refs.form.validate("", (valid) => {
        if (!valid) {
          Message.warning("表单验证未通过！");
          return false;
        }
        this.btnLoading = true;

        const {
          createTime,
          updateTime,
          url,
          url1,
          thumburl,
          thumbtype,
          createUser,
          ...others
        } = this.form;
        var turl;
        if (thumbtype == 5 || thumbtype == 4 || thumbtype == 3) {
          if (url1 === "") {
            Message.warning("请填写链接或appid");
            return false;
          }
          turl = url1;
        } else {
          if (url === "") {
            Message.warning("请选择跳转的链接");
            return false;
          }
          if (url === " ") {
            turl = 0;
          } else {
            turl = url;
          }
        }
        const params = {
          ...others,
          thumbtype,
          thumburl: thumburl.length ? thumburl[0].url : "",
          url: turl,
        };
        if (this.isEdit) {
          params.id = this.userId;
        }
        console.log("上川岛额：", params);
        const uri = this.isEdit ? API.updateById : API.sponsorAdd;
        this.$service.post(uri, params, true).then((res) => {
          this.btnLoading = false;
          if (res && res.code === 0) {
            Message.success("保存成功！");
            this.$router.push({
              name: "赞助商列表",
            });
          } else {
            Message.error(`${res.message || "保存失败！"}`);
          }
        });
      });
    },
    handleFormChange(key, val, form) {
      //每个交互件操作都会触发
      if (key === "thumbtype") {
        this.$refs.form.resetForm(["url"]);
        if (val == 2) {
          this.showList = this.tShowList;
        } else if (val == 1) {
          this.showList = this.tActiveList;
        } else {
          this.form.url = " ";
          this.showList = [];
        }
      }
    },
    // 查询演出列表
    async queryShowList() {
      return this.$service
        .post(API.getShowList, { page: 1, limit: 9999 })
        .then((res) => {
          console.log("演出列表", res);
          // this.tShowList=res.list;
          if (res) {
            this.tShowList = res.list.map((item) => {
              return {
                label: item.performanceVo.title,
                value: item.performanceVo.id,
              };
            });
          }
        });
    },
    // 查询活动列表
    async queryActiveList() {
      return this.$service
        .post(API.getActiveList, { page: 1, limit: 9999 })
        .then((res) => {
          console.log("活动列表：", res);
          //  this.tActiveList=res;
          if (res) {
            this.tActiveList = res.data.map((item) => {
              return {
                label: item.activityIntro,
                value: item.id,
              };
            });
          }
        });
    },
  },
  mounted() {
    const tmpurl = "http://47.92.115.105"; //'http://47.92.115.105' 'http://192.168.31.48:8080'
    this.Editor = new Editor("#editor-wrap");
    this.Editor.customConfig.uploadFileName = "fileName";
    this.Editor.customConfig.uploadImgServer =
      process.env.NODE_ENV === "production"
        ? window.origin
        : tmpurl + "/file/uploadFile"; // 上传图片到服务器
    this.Editor.customConfig.withCredentials = true;
    this.Editor.customConfig.onchange = (html) => {
      // html 即变化之后的内容
      this.form.intro = html;
    };
    this.Editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "justify", // 对齐方式
      "image",
    ];
    this.Editor.customConfig.customUploadImg = (files, insert) => {
      let data = new FormData();
      // console.log("传图片数据：",data);
      data.append("fileName", files[0]);
      this.$axios
        .request({
          url: `${
            process.env.NODE_ENV === "production" ? window.origin : tmpurl
          }/file/uploadFile`,
          method: "POST",
          headers: {
            token: getToken(),
            // 'content-type': 'multipart/form-data'
          },
          data,
          timeout: 30000,
          withCredentials: true,
        })
        .then((res) => {
          let { data } = res;
          if (data.code === 0) {
            insert(data.data);
          } else {
            Message.error("上传失败！" + data.errStr);
          }
        })
        .catch((error) => {
          console.log(error);
          Message.error("上传失败！" + error);
        });
    };
    this.Editor.create();
  },
  async created() {
    await this.queryShowList();
    await this.queryActiveList();
    this.isEdit && this.queryDetail();
  },
};
</script>