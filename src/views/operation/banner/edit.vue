<template>
  <!-- banner设置 -->
  <section class="banner-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-medium">
        <template-form
          title="Banner/开屏页设置"
          ref="form"
          :render-data="renderData"
          v-model="form"
          @onChange="handleFormChange"
        >
          <template slot-scope="props">
            <image-upload
              v-if="props.item.name === 'thumbUrl'"
              :fileList.sync="form.thumbUrl"
              :limit="1"
            ></image-upload>
            <span v-if="props.item.name === 'oneAddress'">省</span>
            <span v-if="props.item.name === 'twoAddress'">市</span>
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
import TemplateForm from '@components/template-form';
import { get } from 'lodash';
import Message from '@utils/message';
import ImageUpload from '@components/image-upload';
import API from '@api/banner';
import ShowApi from '@api/show';

export default {
  components: {
    TemplateForm,
    ImageUpload
  },
  data() {
    return {
      showList: [],
      tShowList:[],
      tActiveList:[],
      btnLoading: false,
      form: {},
      oneAddressOps: [],
      twoAddressOps: []
    };
  },
  computed: {
    bannerId() {
      return get(this.$route, 'params.bannerId', '');
    },
    isEdit() {
      return !!this.bannerId;
    },
    renderData() {
      return [
        {
          type: 'text',
          label: 'banner/开屏页名称:',
          name: 'bannerName',
          value: '',
          required: true,
          pattern:/^.{1,20}$/
        },
        {
          type: 'text',
          label: '排序序号:',
          value: '',
          name: 'sort',
          required: true,
          pattern: /^\d+$/
        },
        {
          type: 'radioGroup',
          label: '类型:',
          name: 'type',
          required: true,
          value: 1,
          options: [
            {
              label: 'Banner',
              value: 1
            },
            {
              label: '开屏页',
              value: 2
            }
          ]
        },
        {
          type: 'select',
          label: '城市选择:',
          name: 'oneAddress',
          value: '',
          options: this.oneAddressOps
        },
        {
          type: 'select',
          name: 'twoAddress',
          value: '',
          options: this.twoAddressOps
        },
        {
          type: 'checkbox',
          name: 'allPlace',
          desc: '全国',
          trueLabel: 1,
          falseLabel: 0
        },
        {
          type: 'datetimepicker',
          name: 'onlinetime',
          label:"上线时间",
          value:'',
          required:true
        },
        {
          type: 'datetimepicker',
          name: 'offlinetime',
          label:"下线时间",
          value:'',
          required:true
        },
        {
          name: 'thumbUrl',
          label: '图片:',
          required: true,
          value: []
        },
        {
          type: 'radioGroup',
          name: 'thumbType',
          label: '跳转类别:',
          required: true,
          value: 0,
          options: [
             {
              label: '公众号文章',
              value: 5
            },
            {
              label: '小程序appid',
              value: 4
            },
            {
              label: '已配置的h5链接',
              value: 3
            },
            {
              label: '演出',
              value: 2
            },
            {
              label: '活动',
              value: 1
            },
            {
              label: '不跳转',
              value: 0
            }
          ]
        },
        {
          type: 'select',
          label: '跳转演出或活动:',
          name: 'url',
          value: ' ',
          required: false,
          options: this.showList
        },
        {
          type: 'text',
          label: '跳转小程序或H5:',
          name: 'url1',
          value: '',
          required: false
        },
        {
          type: 'radioGroup',
          name: 'enable',
          label: '是否启用:',
          required: true,
          value: 0,
          options: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        }
      ];
    }
  },
  methods: {
    // 查询演出列表
    async queryShowList() {
      return this.$service.post(ShowApi.getShowList, { page: 1, limit: 9999 }).then(res => {
        // console.log(res);
        // this.tShowList=res.list;        
        if (res) {
          this.tShowList = res.list.map(item => {
            return {
              label: item.performanceVo.title,
              value: item.performanceVo.id
            };
          });
        }
      });
    },
    // 查询活动列表
    async queryActiveList() {
      return this.$service.post(ShowApi.getActiveList, { page: 1, limit: 9999 }).then(res => {
        console.log(res);
      //  this.tActiveList=res;
        if (res) {
          this.tActiveList = res.data.map(item => {
            return {
              label: item.activityTitle,
              value: item.id
            };
          });
          console.log("生成的活动列表L",this.tActiveList)
        }
      });
    },
    handleConfirm(){
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      if (!this.form.oneAddress && !this.form.allPlace){
        Message.warning('请选择城市！');
        return false;
      }
      this.btnLoading = true;
      const { thumbUrl,thumbType,url,url1,createtime, ...others } = this.form;
      var turl;
     
      if(thumbType==5 || thumbType==4 || thumbType==3){
        if(url1===""){Message.warning("请填写链接或appid");return false;}
        turl=url1;
      }else{
        if(url===""){Message.warning("请选择跳转的链接");return false;}
        if(url===" "){turl=0}
        else{turl=url;}
      }
      const params = {
        ...others,
        thumbType,
        thumbUrl: thumbUrl.length ? thumbUrl[0].url : '',
        url:turl,
        id: this.bannerId,
        optType: this.isEdit ? 2 : 1
      };
      console.log(params);
      this.$service.post(API.addOrUpdate, params, true).then(res => {
        this.btnLoading = false;
        if (res && res.code === 0) {
          Message.success('保存成功！');
          this.$router.push({
            name: 'banner/开屏页列表'
          });
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    },
    async handleFormChange(key, val, form) {//每个交互件操作都会触发
      // console.log(key,val)
      if (key === 'oneAddress') {
        // 重置市选项
        this.$refs.form.resetForm('twoAddress');
        this.twoAddressOps = [];
        this.twoAddressOps = await this.queryCityList(val);
      }
      if ((key === 'twoAddress' || key === 'oneAddress') && val) {
        this.form.allPlace = 0;
      }
      if (key === 'allPlace' && val) {
        this.$refs.form.resetForm(['twoAddress', 'oneAddress']);
        this.twoAddressOps = [];
      }
      if(key==="thumbType"){
        this.$refs.form.resetForm(['url']);
        if(val==2){
         this.showList=this.tShowList;
        }else if(val==1){
          this.showList=this.tActiveList
        }else{
          this.form.url=" ";
          this.showList=[];
        }
      }
      if(key==="offlinetime" || key==="onlinetime"){
        // console.log(this.form)
        let tst=new Date(this.form.onlinetime).getTime(),
            sen=new Date(this.form.offlinetime).getTime();
        if(sen<tst){
          Message.error("上线时间不能大于下线时间");
        }
      }
    },
    // 查询城市
    async queryCityList(query) {
      const list = (await this.$service.post(API.queryListByParent, { parentCode: query })) || [];
      return list.map(({ addressCode, addressName }) => {
        return {
          label: addressName,
          value: addressCode
        };
      });
    },
    async queryActorInfo() {
      this.$service.post(API.queryOpeningPage, { id: this.bannerId }).then(async res => {
        if (res && res.data.length) {
          var ret = res.data.find(item => item.id === this.bannerId) || {};
          if(ret.thumbType==3 || ret.thumbType==4 || ret.thumbType==5){
            ret.url1=ret.url
            ret.url="";
          }else if(ret.thumbType==0){ret.url=' ';ret.url1='';}
          else{
            ret.url1='';
          }
          ret.thumbUrl = [{ url: ret.thumbUrl || '' }];
          ret.url = Number(ret.url);
          ret.thumbType=Number(ret.thumbType)          
          if (ret.allPlace) {
            ret.oneAddress = '';
            ret.twoAddress = '';
          } else {
            this.oneAddressOps = await this.queryCityList(0);
            this.twoAddressOps = await this.queryCityList(ret.oneAddress);
          }

          this.form = Object.assign({}, this.form, ret);
        }
      });
    }
  },
  async created() {
    await this.queryShowList();    
    await this.queryActiveList();    
    this.oneAddressOps = await this.queryCityList(0);
    this.isEdit && (await this.queryActorInfo());
  }
};
</script>