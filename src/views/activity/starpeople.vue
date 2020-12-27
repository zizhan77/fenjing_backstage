<template>
  <!-- 艺人列表 -->
  <section class="activity-list page_main">
    <!-- <form  name="myform"> -->
    <div style="width:200rpx;">
      <label>艺人姓名</label>
      <input type="text" value name="starname"  />
      <input type="submit" value="提交" @click="submit()"/>
    </div>
    <!-- </form> -->
    <section class="page_card page_card_padding">
      <form-title>{{$route.name}}</form-title>
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新增</el-button>
      <template-table
        :hasIndex="false"
        :table-list="tableList"
        :table-column="tableColumn"
        :table-btns="tableBtns"
        :operationBtnWidth="220"
        @handleEvent="handleEvent"
      ></template-table>
    </section>
    <template-page :pagination-init="pageInit" @change="handleChange"></template-page>
  </section>
</template>
<script>
import Message from "@utils/message";
import API from "@api/activity";
import TemplatePage from "@components/template-page";
import TemplateTable from "@components/template-table";
import { formatDate } from "@utils/utils";

export default {
  components: {
    TemplateTable,
    TemplatePage
  },
  data() {
    return {
      tableColumn: [
        {
          label: "id",
          name: "id",
          width: 100
        },
        {
          label: "姓名",
          name: "name"
        },
         {
          label: '活动封面',
          name: 'url',
          width:150,
          render:(h,{row}) => {
                            return h('div',[
                                h('img',{
                                    style:{
                                        'margin-top':'10px',
                                        'margin-bottom':'10px',
                                        'border-radius':'4px',
                                        width:'80px',
                                        height:'100px',
                                        cursor: 'pointer',
                                    },
                                    attrs:{
                                        'src': row.url,
                                        onerror:'this.src="https://goss.veer.com/creative/vcg/veer/800water/veer-133632476.jpg"'
                                    }
                                }),
                            ]
                        )}
        },
        {
          label: "饭团数",
          name: "integral"
        }
      ],
      tableBtns: [
        {
          label: "行程",
          role: "add"
        },
        {
          label: "修改",
          role: "editzt"
        },
        ,
        {
          label: "删除",
          role: "del"
        }
      ],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 15,
        total: 0
      },
      searchForm: {}
    };
  },
  watch:{
      val(e){
        console.log(e);
        
      }
  },
  methods: {
    submit(e) {
      console.log(999);
       const params = {
        page: this.pageInit.page,
        pageSize: this.pageInit.pageSize,
        id: "",
        name: "肖",
        url: "",
        integral: ""
      };
      this.$service.post(API.starPeopleList, params).then(res => {
        console.log(res);
        this.tableList = res.lists;
        // var arr=[]
        // if(res instanceof Array){arr=res}
        // else if(res.data instanceof Array){arr=res.data}
        // else if (res.data.data instanceof Array) { arr = res.data.data}
        // else if (res.data.data.data instanceof Array) { arr = res.data.data.data}
        //   this.tableList = arr;
        //   this.pageInit.total=res.total;
      })
    
    },
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    handleEvent(row, role, index) {
        console.log(role)
      switch (role) {
        case "editzt":
          this.$router.push({
            name: "艺人修改行程",
            params: {
              activityId: row.id,
            }
          });
          break;
        case "del": //删除活动
          {
            Message.confirm("删除提示", "确定删除该条活动信息？", () => {
              //这里就是确认的
              let id = row.id;
              this.$service.post("actor/pc/deleteActor", { id }).then(res => {
                console.log("删除结果", res);
                this.queryTableList();
              });
            });
          }
          break;
        case "add":
          console.log(row,'row')
          this.$router.push({
            name: "行程管理",
            params: {
              actorId: row.id,
              name: row.name,
              // sponsorId: row.integral
            }
          });
          break;
        case "record":
          this.$router.push({
            name: "抽奖记录",
            params: {
              prizeId: row.id
            }
          });
          break;
        default:
          break;
      }
    },
    hadnleAdd() {
      this.$router.push({
        name: "艺人修改行程"
      });
    },
    handleSearch() {
      this.queryTableList();
    },
    queryTableList() {
      const params = {
        page: this.pageInit.page,
        pageSize: this.pageInit.pageSize,
        id: "",
        name: "",
        url: "",
        integral: ""
      };
      this.$service.post(API.starPeopleList, params).then(res => {
        console.log(res);
        this.tableList = res.lists;
        // var arr=[]
        // if(res instanceof Array){arr=res}
        // else if(res.data instanceof Array){arr=res.data}
        // else if (res.data.data instanceof Array) { arr = res.data.data}
        // else if (res.data.data.data instanceof Array) { arr = res.data.data.data}
        //   this.tableList = arr;
        //   this.pageInit.total=res.total;
      });
    }
  },
  created() {
    this.queryTableList();
  }
};
</script>
<style type="scss">
table tr td img {
  max-width: 200px;
  height: auto;
}
</style>

