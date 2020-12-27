<template>
  <!-- 活动修改 -->
  <section class="activity-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-medium">
        <template-form
          title="艺人修改行程"
          ref="form"
          :render-data="renderData"
          v-model="form"
          @onChange="onChange"
        >
          <template slot-scope="props">
            <image-upload
              v-if="props.item.name === 'thumbUrl'"
              :fileList.sync="form.thumbUrl"
              :limit="1"
            ></image-upload>
            <image-upload v-if="props.item.name === 'bgUrl'" :fileList.sync="form.bgUrl" :limit="1"></image-upload>
            <image-upload
              v-if="props.item.name === 'crossimage'"
              :fileList.sync="form.crossimage"
              :limit="1"
            ></image-upload>
            <!-- <span v-if="props.item.name=='sponsorId'">勾选的顺序即是前端页面展示的顺序</span> -->

            <template v-if="props.item.name === 'activityIntro'">
              <div id="editor-wrap"></div>
            </template>
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
import TemplateForm from "@components/template-form";
import { get } from "lodash";
import Message from "@utils/message";
import ImageUpload from "@components/image-upload";
import API from "@api/activity";
import Editor from "wangeditor";
import { getToken } from "@utils/auth";

export default {
  components: {
    TemplateForm,
    ImageUpload,
    Editor
  },
  data() {
    return {
      btnLoading: false,
      activityList: [],
      sponsors: [],
      havespons: [],
      form: {},
      rules: [],
      rankingid: 0,
      // 文本编辑器
      Editor: null
    };
  },
  computed: {
    renderData() {
      return [
        {
          label: "姓名:",
          name: "name",
          type: "text",
          value: "",
          required: true
          // pattern: /^.{1,11}$/
        },
        {
          label: "头像",
          name: "thumbUrl",
          required: true,
          value: []
        },
        {
          label: "饭团数量:",
          name: "count",
          type: "text",
          required: false,
          value: "0",
          pattern: /^\d*$/
        }
      ];
    },
    activityId() {
      return get(this.$route, "params.activityId", "");
    },
    isEdit() {
      return !!this.activityId;
    }
  },
  methods: {
    // onChange(key, val, form) {
    //     console.log(222222)
    //     console.log(key)
    //     console.log(val)
    //     console.log(form)
    //   if (key === "sponsorId") {
    //     this.setRoleMenuIds(val);
    //   }
    //   if (key === "sponsorId") {
    //     this.havespons = val.map(it => {
    //       return {
    //         label: it.split("+**")[1],
    //         value: it.split("+**")[0]
    //       };
    //     });
    //     this.form.topsp = "";
    //   }
    // },
    onChange(key, val, form) {
      console.log(key);
      console.log(val);
      console.log(form);
      this.form = form;
    },
    setRoleMenuIds(val) {
      // this.$set(this.roles[this.currentIndex], 'menuIds', val);
    },

    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning("表单验证未通过！");
        return false;
      }
      //   const {
      //     activityTitle,
      //     time,
      //     status,
      //     thumbUrl,
      //     // bgUrl,
      //     count,
      //     startDate,
      //     endDate,
      //     createTime,
      //     createUser,
      //     updateTime,
      //     updateUser,
      //     sponsors,
      //     rankstatus,
      //     rankstart,
      //     rankend,
      //     ...others
      //   } = this.form;

      const params = {
        page: 1,
        pageSize: 1,
        url: this.form.thumbUrl.length ? this.form.thumbUrl[3] : "",
        // url: thumbUrl.length ? thumbUrl[0].url : "",
        id: get(this.$route, "params.activityId", ""),
        name: this.form.name,
        integral: this.form.count
      };
      console.log(params);
      var ti = 1;
      //   if (this.isEdit) {
      //     ti = 0;
      //     params.id = this.activityId;
      //     this.$service.post(API.starPeopleList, param, true).then(res => {
      //       console.log("保存完了排行", res);
      //       if (res.code == 0) {
      //         ti++;
      //         checke();
      //       } else {
      //         Message.error(`${res.message || "保存失败！"}`);
      //       }
      //     });
      //   } else {
      //     params.count = count;
      //   }
      //   params.sponsorId = params.sponsorId
      //     .map(it => {
      //       return it.split("+**")[0];
      //     })
      //     .join("~");
      //   params.topsp=params.topsp.split("+**")[0]
      //   console.log("准备提交的参数:", params);

      this.btnLoading = true;
      const url = this.isEdit ? "actor/pc/updateActor" :"actor/pc/addActor";
      console.log(url);
      this.$service.post(url, params, true).then(res => {
        this.btnLoading = false;
        console.log("保存完了活动：", res);
        if (res && res.code === 0) {
          ti++;
          checke();
        } else {
          Message.error(`${res.message || "保存失败！"}`);
        }
      });
      var _this = this;
      function checke() {
        if (ti == 2) {
          Message.success("保存成功！");
          _this.$router.push({
            name: "演出列表"
          });
        }
      }
    },
    // async queryActorInfo() {
    //   await this.$service
    //     .post(API.activityQueryOne, { id: this.activityId })
    //     .then(res => {
    //       console.log("要编辑的信息：", res);
    //       if (res.data) {
    //         res = res.data;
    //         var tmp = res.find(item => item.id === this.activityId);
    //         console.log("获取到的单条信息：", tmp);
    //         this.rankingid = tmp.ofranking;
    //         tmp.sponsorId = [];

    //         let havespos = tmp.sponsors.map(it => {
    //           return it.id + "+**" + it.name;
    //         });
    //         tmp.sponsorId = havespos;
    //         this.havespons = tmp.sponsors.map(it => {
    //           return {
    //             label: it.name,
    //             value: it.id
    //           };
    //         });

    //         this.form = tmp;
    //         let timg = this.form.thumbnailUrl;
    //         var tobj = {};
    //         tobj.url = timg;
    //         tobj.uid = "13466456454654";
    //         tobj.status = "success";
    //         this.form.thumbUrl = [tobj];

    //         var tobj1 = {};
    //         tobj1.uid = "985345sdfd";
    //         tobj1.status = "success";
    //         tobj1.url = this.form.bgUrl;
    //         this.form.bgUrl = [tobj1];

    //         // var tobj2={};
    //         // tobj2.uid="9853234sdfd";
    //         // tobj2.status="success";
    //         // tobj2.url=this.form.crossimage
    //         // this.form.crossimage=[tobj2]
    //         this.Editor.txt.html(this.form.activityIntro);
    //         console.log("表单：", this.form);
    //       }
    //     });
    // },
    queryActorInfo1() {
      //   this.$service
      //     .post(API.getDetail, { id: this.$route.params.rankingId })
      //     .then(res => {
      //       console.log("获取的饭团数：", res, this.$route.params.rankingId);
      //       if (res.data) {
      //         res = res.data;
      //         var tars = res.find(
      //           item => item.id == this.$route.params.rankingId
      //         );
      //         this.form.count = tars.count || 0;
      //       }
      //     });
    },
    // 查询演出列表
    async queryShowList() {
      var tar = this;
      this.$service
        .post(API.getShowList, { page: 1, limit: 9999 })
        .then(res => {
          if (res) {
            tar.activityList = res.list.map(item => {
              return {
                label: item.performanceVo.title,
                value: item.performanceVo.id
              };
            });
          }
          // console.log(tar.activityList)
        });
    },

    // 查询菜单列表
    async queryMenuList() {
      await this.$service.post(API.getSponsor).then(res => {
        if (res) {
          var sponsors = res.map(({ id, name }) => {
            return {
              label: name,
              value: id + "+**" + name
            };
          });

          this.sponsors = Object.assign([], this.sponsors, sponsors);
          console.log("赞助商liebiao :", this.sponsors);
        }
      });
    }
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
    this.Editor.customConfig.onchange = html => {
      // html 即变化之后的内容
      this.form.activityIntro = html;
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
      "image"
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
            token: getToken()
            // 'content-type': 'multipart/form-data'
          },
          data,
          timeout: 30000,
          withCredentials: true
        })
        .then(res => {
          let { data } = res;
          if (data.code === 0) {
            insert(data.data);
          } else {
            Message.error("上传失败！" + data.errStr);
          }
        })
        .catch(error => {
          console.log(error);
          Message.error("上传失败！" + error);
        });
    };
    this.Editor.create();
  },

  async created() {
    var tar = this;
    // this.queryMenuList();
    // await this.queryShowList();
    if (this.isEdit) {
      // console.log(this.$route.params)
      this.rankingid = this.$route.params.rankingId;
      //   await this.queryActorInfo();
      //   this.queryActorInfo1();
      const params = {
        page: 1,
        pageSize: 1,
        id: get(this.$route, "params.activityId", "") + "",
        name: "",
        url: "",
        integral: ""
      };
      this.$service.post(API.starPeopleList, params).then(res => {
        this.form = {
          name: res.lists[0].name,
          thumbUrl: [{ url: res.lists[0].url }],
          count: res.lists[0].integral
        };
      });
    } else {
      this.form = {};
    }
  }
};
</script>

