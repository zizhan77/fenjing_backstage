<template>
  <!-- 关卡设置 -->
  <section class="pass-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-medium">
        <template-form
          :title="isEdit ? '编辑关卡' : '新增关卡'"
          ref="form"
          :render-data="renderData"
          labelWidth="150px "
          v-model="form"
        >
          <template slot-scope="props">
            <!-- 上传品牌方图片 -->
            <image-upload
              title="尺寸要求: 200x200"
              v-if="props.item.name === 'logo'"
              :fileList.sync="form.logo"
              :limit="1"
              :size="{
                width: 200,
                height: 200
              }"
            ></image-upload>
            <!-- 上传视频 -->
            <image-upload
              title="仅限mp4格式"
              v-if="props.item.name === 'video'"
              :fileList.sync="form.video"
              :limit="1"
              listType="fileList"
              accept=".mp4"
            ></image-upload>
            <!-- 上传答案 -->
            <section class="pass-qs" v-if="props.item.name === 'question'">
              <!-- 录入问题 -->
              <section>
                <section class="pass-qs__wrap">
                  <el-input class="pass-qs__inner" v-model.trim="currentQs.qs"></el-input>
                  <ul>
                    <li v-for="(ans, index) in currentQs.ans" :key="index">
                      <el-radio v-model="currentQs.val" :label="index">
                        <el-input
                          v-model.trim="currentQs.ans[index]"
                          :placeholder="`请输入选项${index+1}`"
                        ></el-input>
                      </el-radio>
                    </li>
                  </ul>
                </section>
                <el-button class="pass-qs__btn" type="primary" @click="addQs">添加问题</el-button>
              </section>
              <!-- 问题list -->
              <el-tag
                class="pass-qs__tag mr10"
                @close="delQs(index)"
                size="medium"
                closable
                v-for="(tag, index) in form.question"
                :key="index"
              >{{tag.qs}}</el-tag>
            </section>
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
import { get } from 'lodash';
import Message from '@utils/message';
import { isContains } from '@utils/utils';

export default {
  data() {
    return {
      form: {},
      currentQs: {
        // 问题
        qs: '',
        // 正确答案
        val: '',
        // 答案list
        ans: ['', '', '', '']
      }
    };
  },
  computed: {
    passId() {
      return get(this.$route, 'params.passId', '');
    },
    isEdit() {
      return !!this.passId;
    },
    renderData() {
      return [
        {
          type: 'text',
          label: '关卡名称:',
          name: 'name',
          value: '',
          required: true
        },
        {
          type: 'text',
          label: '关卡序号(1-9999):',
          value: '',
          name: 'index',
          required: true,
          pattern: /^\d+$/
        },
        {
          label: '品牌方图片:',
          value: [],
          name: 'logo',
          required: true
        },
        {
          type: 'checkboxGroup',
          label: '关卡类型:',
          name: 'type',
          required: true,
          value: [1],
          options: [
            {
              label: '广告任务',
              value: 1
            },
            {
              label: '知识问答',
              value: 2
            }
          ]
        },
        {
          label: '广告任务-视频上传:',
          name: 'video',
          value: []
        },
        {
          label: '知识问答-问题上传:',
          name: 'question',
          value: []
        },
        {
          type: 'radioGroup',
          label: '是否启用:',
          name: 'enable',
          value: 1,
          required: true,
          options: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 2
            }
          ]
        }
      ];
    }
  },
  methods: {
    // 添加问题
    addQs() {
      if (!this.currentQs.qs) {
        Message.warning('请填写问题');
        return false;
      }
      if (this.currentQs.ans.filter(_ => _).length < 3) {
        Message.warning('答案选项不能为空');
        return false;
      }
      if (this.currentQs.val === '') {
        Message.warning('请勾选正确答案');
        return false;
      }
      if (this.form.question.find(({ qs }) => qs === this.currentQs.qs)) {
        Message.warning('问题不能重复');
        return false;
      }
      this.form.question.push(this.currentQs);
      this.currentQs = Object.assign({}, this.currentQs, {
        qs: '',
        val: '',
        ans: ['', '', '', '']
      });
    },
    delQs(index) {
      this.form.question.splice(index, 1);
    },
    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
    },
    queryFromInfo() {}
  },
  created() {
    if (this.isEdit) {
      this.queryFromInfo();
    }
  }
};
</script>
<style lang="scss">
.pass-qs {
  &__wrap,
  &__btn {
    display: inline-block;
    vertical-align: top;
  }
  &__inner {
    width: 223px;
  }
  &__wrap {
    .el-input {
      margin-bottom: 10px;
    }
  }
}
</style>
