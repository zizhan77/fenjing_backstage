<template>
  <!-- 艺人编辑 -->
  <section class="actor-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-medium">
        <template-form
          :title="'艺人行程'"
          ref="form"
          :render-data="renderData"
          v-model="form"
          @onChange="handleFormChange"
        >
          <template slot-scope="props">
            <el-date-picker
              v-if="props.item.name === 'time'"
              v-model="form.time"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
            <!-- <el-date-picker
              v-if="props.item.name === 'createtime'"
              v-model="form.createtime"
              :type="'datetime'"
              :value-format="'yyyy-MM-dd'"
              placeholder="选择日期"
            ></el-date-picker> -->
            <span v-if="props.item.name === 'province'">省</span>
            <span v-if="props.item.name === 'city'">市</span>
          </template>
        </template-form>
        <footer class="page_footer">
          <el-button size="medium" type="primary" @click="handleConfirm"
            >确 认</el-button
          >
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
import API from "@api/basic";
import { isContains, formatDate } from "@utils/utils";

export default {
  components: {
    TemplateForm,
    ImageUpload,
  },
  data() {
    return {
      form: {
        time: "", //创建shijian
        tripname: "", //行程时间
        address: "", //行程地
        activityid: "", //关联活动ID
        intro: "", //行程介绍
        province: "",
        city: "",
      },
      rules: [],
      provinceOps: [],
      cityOps: [],
      activityLst: [],
    };
  },
  computed: {
    actorId() {
      return get(this.$route, "params.actorId", "");
    },
    name() {
      return get(this.$route, "params.name", "");
    },
    editData() {
      return get(this.$route, "params.editData", "");
    },
    isEdit() {
      return !!this.editData.id;
      // if(this.editData.id)
    },
    renderData() {
      return [
        {
          type: "text",
          label: "行程名称:",
          name: "tripname",
          value: "",
          required: true,
        },
        {
          label: "行程时间:",
          value: [],
          name: "time",
          required: true,
        },
        {
          type: "select",
          label: "行程地点:",
          name: "birthOneAddress",
          required: true,
          value: "",
          options: this.provinceOps,
        },
        {
          type: "select",
          name: "birthTwoAdddress",
          required: false,
          value: "",
          options: this.cityOps,
        },
        {
          type: "select",
          name: "activityid",
          label: "关联活动:",
          required: false,
          value: "",
          options: this.activityLst,
        },
        {
          type: "textarea",
          name: "intro",
          label: "行程简介:",
          required: true,
          value: "",
        },
      ];
    },
  },

  methods: {
    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning("表单验证未通过！");
        return false;
      }
      // this.getCityName(this.form.birthTwoAdddress)
      const params = {
        id: this.editData.id,
        tripname: this.form.tripname,
        time: this.form.time,
        actorid: this.actorId,
        address: this.getCityName(this.form.birthTwoAdddress),
        activityid: this.form.activityid,
        intro: this.form.intro,
      };

      console.log(params, "params");
      if (this.isEdit) {
        //编辑updateActorTrip
        // params;
        this.$service.post(API.updateActorTrip, params, true).then((res) => {
          if (res && res.code === 0) {
            Message.success("编辑成功");
            // this.$router.go(-1);
            this.$router.push({
              name: "行程管理",
              params: {
                actorId: this.actorId,
                name: this.name || "",
              },
            });
          } else {
            Message.error(`${res.message || "保存失败！"}`);
          }
        });
      } else {
        this.$service.post(API.addActorTrip, params, true).then((res) => {
          if (res && res.code === 0) {
            Message.success("保存成功");
             this.$router.push({
              name: "行程管理",
              params: {
                actorId: this.actorId,
                name: this.name || "",
              },
            });
          } else {
            Message.error(`${res.message || "保存失败！"}`);
          }
        });
      }
    },
    async handleFormChange(key, val, form) {
      if (key === "birthOneAddress") {
        // 重置市选项
        this.$refs.form.resetForm("birthTwoAdddress");
        this.cityOps = [];
        this.cityOps = await this.queryCityList(val);
      }
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
    getCityName(num) {
      let label = "";
      this.cityOps.map((res) => {
        if (res.value == num) {
          label = res.label;
        }
      });
      return label;
    },
    //   // 查询活动列表
    async queryActivityLst(query) {
      let list = [];
      this.$service.post(API.activityQueryAll, {}).then((res) => {
        if (res) {
          list = res.data;
          this.activityLst = list.map((f) => {
            return {
              label: f.activityIntro,
              value: f.id,
            };
          });
        }
      });
    },
  },
  async created() {
    console.log(this.editData, "this.editData");
    this.provinceOps = await this.queryCityList(0);
    this.queryActivityLst();
    if (this.isEdit) {
      // await this.queryActorInfo();
      this.form = this.editData;
      //  Object.assign( this.form,obj2);
    }
  },
};
</script>
