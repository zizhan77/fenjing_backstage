<template>
  <!-- 赞助商配置 -->
  <section class="sponsor-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-small">
        <template-form
          ref="form"
          v-model="form"
          title="修改抽奖次数"
          :render-data="renderData"
        />
        <footer class="page_footer">
          <el-button size="medium" type="primary" :loading="btnLoading" @click="handleConfirm">确 认</el-button>
          <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
        </footer>
      </div>
    </section>
  </section>
</template>
<script>
import { get } from 'lodash'
import Message from '@utils/message'
import Md5 from 'js-md5'
import API from '@api/user'

export default {
  data() {
    return {
      btnLoading: false,
      fant: 0,
      tid: 0,
      tcode: '',
      form: {}
    }
  },
  computed: {
    renderData() {
      return [
        {
          type: 'text',
          label: '抽奖次数:',
          name: 'lotteryqty',
          value: this.fant,
          required: true
        }
      ]
    }
  },
  created() {
    const tp = JSON.parse(this.$route.params.row)
    this.fant = tp.lotteryqty
    this.tid = tp.activityid
    this.tcode = tp.usercode
  },
  methods: {
    queryDetail() {
      this.$service.post(API.querySponsor, { id: this.userId }).then(res => {
        if (res && res.length) {
          this.form = res[0]
          this.originName = this.form.name
          this.originPhone = this.form.phone
        }
      })
    },
    handleConfirm() {
      this.$refs.form.validate('', valid => {
        if (!valid) {
          Message.warning('表单验证未通过！')
          return false
        }
        this.btnLoading = true

        const { ...others } = this.form
        const params = {
          usercode: this.tcode,
          activityid: this.tid,
          ...others
        }
        this.$service.post(API.setChouj, params, true).then(res => {
          this.btnLoading = false
          console.log(res)
          if (res && res.code === 0) {
            Message.success('设置成功！')
            this.$router.push({
              name: '用户列表'
            })
          } else {
            Message.error(`${res.message || '设置失败！'}`)
          }
        })
      })
    }
  }
}
</script>
