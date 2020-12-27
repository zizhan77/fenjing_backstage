<template>
  <!-- banner设置 -->
  <section class="banner-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-medium">
        <template-form
          title="任务编辑"
          ref="form"
          :render-data="renderData"
          v-model="form"
          @onChange="handleFormChange"
        >
        <template slot-scope="props">          
          <template v-if="props.item.name==='newadd'">
              <!-- 添加 -->
              <el-input v-model="addrule.count" placeholder="请输入次数" type="number"></el-input>天 额外奖励
              <el-input v-model="addrule.number" placeholder="奖励饭团数" type="nubmer"></el-input>饭团
              <el-button class type="primary" @click="handleAddRule">添加</el-button>
              <section class="actor-list">
                  <el-tag
                  class="mt20 mr10"
                  size="medium"
                  closable
                  v-for="(tag, index) in form.newadd"
                  :key="index"
                  @close="handRemoveRule(index)"
                >签到{{tag.count}}天，送{{tag.number}}饭团</el-tag>
              </section>
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
import TemplateForm from '@components/template-form';
import { get } from 'lodash';
import Message from '@utils/message';
import ImageUpload from '@components/image-upload';
import API from '@api/active';

export default {
  components: {
    TemplateForm,
    ImageUpload
  },
  data() {
    return {  
      isGetNew:true,    
      showList: [],      
      btnLoading: false,
      form: {},      
      addrule:{
        count:0,
        number:0
      }
    };
  },
  computed: {
    suport(){
      return{
        1:[
          {
            label:"任务名",
            type:"text",
            disabled:true,
            name:"name",
            value:''
          },
          { label:"首次登陆小程序，可获得",
            type:"number",
            name:"otherjson",
            value:0
          },
          { label:"领取新人礼包，可获得",
            type:"number",
            name:"addcount",
            value:0
          },
          { label:"次数限制",
            type:"number",
            name:"number",
            value:1,
            disabled:true
          },
          { label:"状态",
            type:"radioGroup",
            name:"status",
            value:0,
            options:[
              {
                label:"开启",
                value:0
              },
              {
                label:"关闭",
                value:1
              }
            ]
          },
        ],
        2:[
          {
            label:"任务名",
            type:"text",
            disabled:true,
            name:"name",
            value:''
          },
          { label:"每日签到，可获得",
            type:"number",
            name:"addcount",
            value:'',
            required:true
          },
          { 
            label:"连续签到",            
            name:"newadd",            
            value: [],
            required: true
          }, 
          { label:"次数限制",
            type:"number",
            name:"numofday",
            value:1,
            disabled:true
          },                   
          { label:"状态",
            type:"radioGroup",
            name:"status",
            value:0,
            options:[
              {
                label:"开启",
                value:0
              },
              {
                label:"关闭",
                value:1
              }
            ]
          },
        ],
        3:[
          {
            label:"任务名",
            type:"text",
            disabled:true,
            name:"name",
            value:''
          },
          { label:"每日最多邀请（人）",
            type:"number",
            name:"numofday",
            value:0,
            required: true
          },
          {
            label:"每人助力奖励(饭团)",
            type:"number",
            name:"addcount",
            value: 0,
            required: true
          },                              
          { label:"状态",
            type:"radioGroup",
            name:"status",
            value:0,
            options:[
              {
                label:"开启",
                value:0
              },
              {
                label:"关闭",
                value:1
              }
            ]
          },
        ],
        4:[
          {
            label:"任务名",
            type:"text",
            disabled:true,
            name:"name",
            value:''
          },
          { label:"用户拉新奖励(饭团)",
            type:"number",
            name:"firstft",
            value:0,
            required: true
          },
          { 
            label:"每日限制(次)",
            name:"numofday",
            type:"number",
            value: 0,
            required: true
          },                              
          { label:"状态",
            type:"radioGroup",
            name:"status",
            value:0,
            options:[
              {
                label:"开启",
                value:0
              },
              {
                label:"关闭",
                value:1
              }
            ]
          },
        ],
        5:[
          {
            label:"任务名",
            type:"text",
            disabled:true,
            name:"name",
            value:''
          },
          { label:"信息全部完善获得",
            type:"number",
            name:"addcount",
            value:0,
            required: true
          },
          { 
            label:"次数限制",            
            name:"number",            
            type:"number",
            value: 1,
            required: true,
            disabled:true
          },
          { label:"状态",
            type:"radioGroup",
            name:"status",
            value:0,
            options:[
              {
                label:"开启",
                value:0
              },
              {
                label:"关闭",
                value:1
              }
            ]
          },
        ],
      }
    },
    bannerId() {
      return get(this.$route, 'params.id', '');
    },
    isEdit() {
      return !!this.bannerId;
    },
    renderData() {
      // console.log(this.suport[this.$route.params.type])
      return this.suport[this.$route.params.id]      
    }
  },
  methods: {
    handRemoveRule(ti){
       this.form.newadd.splice(ti,1)
    },
    handleAddRule(){      
      this.form.newadd.push(this.addrule)
      this.addrule=null;
      this.addrule={
        count:0,
        number:0}
    },    
    handleConfirm(){
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      this.btnLoading = true;
      const { ...others } = this.form;
      
      if(this.$route.params.id==2){
        let otherj=others.newadd,tmps=[];
        for(let i in otherj){
          tmps[i]=otherj[i].count+','+otherj[i].count
        }
        let otherjson=tmps.join("-");
        others.otherjson=otherjson;
        delete others.newadd;
      }
      if(others.number && others.number==0){
        Message.fail("限制次数不能为0");        
      }else if(others.number){
        others.numofday=0
      }else{
        others.number=0
      }
      const params = {
        ...others,       
        id: this.bannerId      
      };
      console.log(params);
      this.$service.post(API.updateintegralRole, params, true).then(res => {
        this.btnLoading = false;
        if (res && res.code === 0) {
          Message.success('保存成功！');
          this.$router.push({
            name: '饭团互动活动'
          });
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    },
    async handleFormChange(key, val, form){//每个交互件操作都会触发
      // console.log(key,val)
      
    },
    queryTableList() {
      const params = {
        id:this.$route.params.id
        // page: this.pageInit.page,
        // limit: this.pageInit.pageSize
      };
      this.$service.post(API.integralRoleList, params).then(res => {
        console.log("任务列表",res);
        if (res) {         
          let tar=res[0];
          if(this.$route.params.id==2){
            if(tar.otherjson==''){}
            let otherj=tar.otherjson.split("-"),tmps=[];
              for(let i in otherj){
                tmps[i]={}
                tmps[i].count=otherj[i].split(",")[0]
                tmps[i].number=otherj[i].split(",")[1]
              }
              tar.newadd=tmps;
          }
            this.form = Object.assign(this.form,tar);
        }
      });
    }
  },
  created() {
    this.queryTableList()
  }
}
</script>