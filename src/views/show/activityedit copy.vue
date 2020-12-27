<template>
  <!-- 活动详情-编辑-新建 -->
  <section class="show-edit page_main">
    <section class="page_card page_card_padding">
      <template-form
        class="show-edit__container"
        ref="form"
        title="活动详情"
        :renderData="renderData"
        v-model="form"
        @onChange="handleFormChange"
      >
        <template slot-scope="props">
          <!-- 头像上传 -->
          <template v-if="props.item.name === 'thumbnailUrl'">
            <image-upload
              :fileList.sync="form.thumbnailUrl"
              :limit="1"
            ></image-upload>
          </template>
          <!-- 城市选择-省 -->
          <template v-if="props.item.name === 'oneAddress'">
            <span>省</span>
          </template>
          <!-- 城市选择-市 -->
          <template v-if="props.item.name === 'twoAddress'">
            <span>市</span>
          </template>
        </template>
      </template-form>
      <footer class="page_footer">
        <el-button size="medium" type="primary" @click="handleConfirm"
          >确 认</el-button
        >
        <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
      </footer>
    </section>
  </section>
</template>
<script>
import TemplateForm from "@components/template-form";
import ImageUpload from "@components/image-upload";
import Message from "@utils/message";
import { uniqBy, uniq, get } from "lodash";
import { isContains, formatDate } from "@utils/utils";
import { getToken } from "@utils/auth";
import Editor from "wangeditor";
import API from "@api/show";
import Basic from "@api/basic";

export default {
  components: {
    TemplateForm,
    ImageUpload,
  },
  props: {
    id: {
      type: [String, Number],
      default: "",
    },
    formItem: {
      type: Object,
      default: ()=>{},
    },
  },
  data() {
    return {
      // 提交表单
      form: {},
      // 艺人下拉项
      actorOps: [],
      // 当前选择艺人
      actor: "",
      // 当前输入关键字
      keyword: "",
      // 当前输入场次信息
      frequency: {
        // 场次名称
        name: "",
        // 开始时间
        startTime: "",
        // 结束时间
        stopTime: "",
      },
      // 当前输入票档信息
      ticket: {
        name: "",
        price: "",
        area: "",
      },
      // 省-下拉项
      provinceOps: [],
      // 市下拉项
      cityOps: [],
      // 场地下拉项
      allPlaceOps: [],
      placeOps: [],
      sponsorLst: [],
      place: "",
      // 文本编辑器
      Editor: null,
      // 区域下拉项
      areaOps: [],
      filterPlace: "",
      nowCityId: "",
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
    // 所选场地是否支持选座
    // 支持则可以选择区域，否则不支持
    isChoosePlace() {
      let isChooseSeat = true;
      const ret = this.placeOps.find((item) => item.value === this.form.place);
      if (ret) {
        isChooseSeat = ret.chooseSeat === 1;
      }
      return isChooseSeat;
    },
    renderData() {
      return [
        {
          label: "活动标题:",
          name: "activityTitle",
          type: "text",
          value: "",
          required: true,
        },
        {
          label: "活动状态:",
          name: "status",
          type: "select",
          value: 1,
          required: true,
          options: [
            {
              label: "不启用",
              value: 0,
            },
            {
              label: "启用",
              value: 1,
            },
          ],
        },
        {
          label: "开始时间:",
          name: "startDate",
          type: "datetimepicker",
          value: "",
          required: true,
          // isHide: this.form.status === 2
        },
        {
          label: "结束时间:",
          name: "endDate",
          type: "datetimepicker",
          value: "",
          required: true,
          // isHide: this.form.status === 2
        },
        {
          label: "排行榜状态:",
          name: "rankstart",
          type: "select",
          value: 1,
          required: true,
          options: [
            {
              label: "不启用",
              value: 0,
            },
            {
              label: "启用",
              value: 1,
            },
          ],
        },
        {
          label: "活动链接:",
          name: "activityUrl",
          value: "",
          type: "text",

          required: true,
        },
        {
          label: "赞助商:",
          name: "sponsorId",
          type: "select",
          value: "",
          required: true,
          options: this.sponsorLst,
        },
        {
          label: "是否独家:",
          name: "isOnly",
          type: "select",
          value: 1,
          required: true,
          options: [
            {
              label: "否",
              value: 0,
            },
            {
              label: "是",
              value: 1,
            },
          ],
        },
        {
          label: "缩略图上传:",
          name: "thumbnailUrl",
          value: [],
          required: true,
        },
        {
          label: "饭团数:",
          name: "number",
          type: "number",
          value: "",
        },
        {
          label: "城市选择:",
          name: "oneAddress",
          type: "select",
          value: "",
          required: false,
          options: this.provinceOps,
        },
        {
          name: "twoAddress",
          type: "select",
          value: "",
          required: true,
          options: this.cityOps,
        },
        // 预售填写活动时间

        {
          label: "排序(1-9999):",
          name: "sort",
          type: "text",
          max: 4,
          value: "",
          required: true,
        },

        {
          label: "抽奖人数:",
          name: "peoplenum",
          type: "number",
          value: "",
        },

        {
          label: "抽奖次数:",
          name: "numclick",
          type: "number",
          value: "",
        },
        {
          label: "应援人数:",
          name: "rankprople",
          type: "number",
          value: "",
        },
        {
          label: "应援次数:",
          name: "ranknum",
          type: "number",
          value: "",
        },
      ];
    },
  },
  methods: {
    formatDate(...args) {
      return formatDate(...args);
    },
    // 远程搜索艺人
    async remoteMethod(query) {
      if (query) {
        this.actorOps = [];
        // 查询艺人列表
        const { list } = await this.$service.post(API.queryArtistList, {
          actorName: query,
          page: 1,
          limit: 9999,
        });
        if (list && Array.isArray(list) && list.length) {
          this.actorOps = list.map(({ id, artistName }) => {
            return {
              label: artistName,
              value: id,
            };
          });
        }
      }
    },

    async handleFormChange(key, val, form) {
      if (key === "oneAddress") {
        // 重置市选项
        this.$refs.form.resetForm("twoAddress");
        this.$refs.form.resetForm("place");
        this.cityOps = [];
        this.placeOps = [];
        this.allPlaceOps = [];
        this.cityOps = await this.queryCityList(val);
      }
      if (key === "twoAddress") {
        this.$refs.form.resetForm("place");
        this.placeOps = [];
        this.allPlaceOps = [];
        // 查询场地
        this.nowCityId = val;
        // this.allPlaceOps=this.placeOps=await this.queryPlaceOps(val,"");
      }
      if (key === "place") {
        this.areaOps = await this.queryAreaOps(val);
        this.form.ticket = [];
      }
    },
    // 根据场地查询区域
    async queryAreaOps(placeId) {
      const list =
        (await this.$service.post(Basic.queryAreaListByPlaceId, { placeId })) ||
        [];
      return list.map((item) => {
        return {
          label: item.areaName,
          value: item.id,
        };
      });
    },
    // 查询城市
    async queryCityList(query) {
      const list =
        (await this.$service.post(API.queryListByParent, {
          parentCode: query,
        })) || [];
      return list.map(({ addressCode, addressName }) => {
        return {
          label: addressName,
          value: addressCode,
        };
      });
    },
    // 获取赞助商列表
    async getSponsor() {
      this.$service
        .post(API.getSponsor, { page: 1, limit: 999 })
        .then((res) => {
          // this.loading = false;
          if (res && res.length) {
            var sponsors = res.map(({ id, name }) => {
              return {
                label: name,
                value: id + "+**" + name,
              };
            });
            this.sponsorLst = Object.assign([], this.sponsorLst, sponsors);
          }
        });
    },
    // 查询场地下拉项
    async queryPlaceOps(cityId, placeName) {
      var param = {};
      if (cityId) {
        param = { cityId, placeName };
      }
      const { list } =
        (await this.$service.post(API.getPlaceList, param)) || [];
      if (list.length > 0) {
        Message.success("获取场地成功，您可以开始选择场地了~");
      }
      return list.map((item) => {
        return {
          label: item.name,
          value: item.id,
          ...item,
        };
      });
    },
    // 查询活动详情-配置项
    async queryConditions() {
      // 查询省
      this.provinceOps = await this.queryCityList(0);
    },

    // 保存
    handleConfirm() {
      this.form.thumbnailUrl = get(this.form, "thumbnailUrl.0.url", "");
      console.log(this.form, "this.form");

      return false;

      if (!this.$refs.form.validate()) {
        Message.warning("表单验证未通过！");
        return false;
      }
      const params = {
        id: this.id,
        // 活动标题
        activityTitle: this.form.activityTitle,
        // 活动简介
        activityIntro: this.form.activityIntro,
        // 互动类型
        type: this.form.type,
        // 艺人列表
        artistIds: this.form.actorList.map((item) => item.value).join("~"),
        // 开始时间
        startDate: this.form.startDate,
        // 结束时间
        endDate: this.form.endDate,
        // 排序
        sort: this.form.sort,
        // 一级地址
        oneAddress: this.form.oneAddress,
        // 二级地址
        twoAddress: this.form.twoAddress,
        // 表演场次
        activityUrl: this.form.activityUrl,
        // 票档
        ticketGearIds: this.form.ticket.map(({ id }) => id).join("~"),
        // 票品信息
        ticketDeliverType: this.form.ticketDeliverType,
        // 头像
        thumbUrl: get(this.form, "thumbUrl.0.url", ""),
        // 场地
        placeId: this.form.place,
        // 活动状态
        // status: this.form.status,
        // 开售时间
        startSaleDateStr: this.form.sellStartTime,
        // 排序序号
        sort: this.form.sort,
        // 活动分类
        performanceType: this.form.showType,
        // 活动详情
        detail: this.form.detail,
        // 购买须知
        buyNotes: this.form.remark,
        // 活动性质
        performanceNature: this.form.performanceNature,
        // 限购张数
        limitNumber: this.form.limit,
      };

      this.$msgbox({
        title: "保存提示",
        customClass: "show-box",
        message: (
          <section class="show-edit__confirm">
            <p>是否确定上传活动？</p>
          
            <h3 class="tc">是否确定？</h3>
          </section>
        ),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            this.$service.post(API.addPerformance, this.form, true).then((res) => {
              instance.confirmButtonLoading = false;
              done();
              if (res && res.code === 0) {
                Message.success("保存成功！");
                this.$router.push({
                  path: "/show/list",
                });
              } else {
                Message.error(`${res.message || "保存失败！"}`);
              }
            });
          } else {
            done();
          }
        },
      })
        .then((action) => {})
        .catch(() => {});
    },
  },
  async mounted() {
    this.Editor = new Editor("#editor-wrap");
    this.Editor.customConfig.uploadFileName = "fileName";
    this.Editor.customConfig.uploadImgServer =
      process.env.NODE_ENV === "production"
        ? window.origin
        : "http://47.92.115.105" + "/file/uploadFile"; // 上传图片到服务器
    this.Editor.customConfig.withCredentials = true;
    this.Editor.customConfig.onchange = (html) => {
      // html 即变化之后的内容
      this.form.detail = html;
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
            process.env.NODE_ENV === "production"
              ? window.origin
              : "http://47.92.115.105"
          }/file/uploadFile`,
          method: "POST",
          headers: {
            token: getToken(),
            "content-type": "multipart/form-data",
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
    await this.queryConditions();

    // this.allPlaceOps=this.placeOps = await this.queryPlaceOps();
  },
  async created() {
    if (this.isEdit) {
      this.formItem.url = [{ url: this.formItem.thumbnailUrl }];
      this.formItem.thumbnailUrl = this.formItem.url;
      this.form = this.formItem;
    }
    await this.getSponsor();

    console.log(this.form);
    this.$nextTick(() => {
      this.$refs.form.clearValidate();
    });
  },
};
</script>
<style lang="scss">
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
</style>
