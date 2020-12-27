<template>
  <!-- 活动列表 -->
  <section class="activity-list page_main">
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
import Message from '@utils/message';
import API from '@api/activity';
import TemplatePage from '@components/template-page';
import TemplateTable from '@components/template-table';
import { formatDate } from '@utils/utils';

export default {
  components: {
    TemplateTable,
    TemplatePage    
  },
  data() {
    return {
      tableColumn: [
        {
          label: '序号',
          name: 'sort',
          width: 100
        },
        {
          label: '活动标题',
          name: 'activityTitle'
        },
  
        {
          label: '活动封面',
          name: 'thumbnailUrl',
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
                                        'src': row.thumbnailUrl,
                                        onerror:'this.src="https://goss.veer.com/creative/vcg/veer/800water/veer-133632476.jpg"'
                                    }
                                }),
                            ]
                        )}
        },
        {
            label: '排序字段',
            name: 'sort',   
            width:200,  
             render: (h, { row }) => {
            var _this = this
            return h('span', [
              h('el-input', {
                props: {
                  value: row.sort
                },
                on: {
                  'input'(even) {
                    row.sort = even
                  },
                  'change'(event) {
                    const sort = event
                    const id = row.id
                    const params = {
                      sort,
                      id
                    }
                     _this.$service.post(API.updateById, params, true).then(res => {
                    //  this.btnLoading = false;
                      console.log("保存完了活动：",res);
                      if (res && res.code === 0){          
                       
                      } else {
                        Message.error(`${res.message || '保存失败！'}`);
                      }
                    });
           
                  }
                }
              })
            ])
             }
        },
        {
          label: '活动类型',
          name: 'type',
          render(h) {
            return <span>赞助商活动</span>;
          }
        },
        {
          label: '活动日期',
          name: 'startDate',
          render: (h, { row }) => {
            return <span>{formatDate(row.startDate)}</span>;
          }
        }
      ],
      tableBtns: [
        {
          label: '修改',
          role: 'edit'
        },        
        {
          label: '奖品管理',
          role: 'prize'
        },
        // {
        //   label: '抽奖记录',
        //   role: 'record'
        // }
        ,
        {
          label: '删除',
          role: 'delete'
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
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    handleEvent(row, role, index) {
      //  console.log(row.sponsorId);return;
      console.log(row)
      
      switch (role) {
        case 'edit':
          this.$router.push({
            name: '活动配置',
            params: {
              activityId: row.id,
              rankingId:row.ofranking
            }
          });
          break;
          case 'delete'://删除活动
            {
              Message.confirm('删除提示', '确定删除该条活动信息？', () => {
                //这里就是确认的
              let id=row.id;
              this.$service.post(API.deleteById, {id}).then(res => {
                  console.log("删除结果",res)
                  this.queryTableList();
                });
              });
            }
          break;
        case 'prize':
          this.$router.push({
            name: '奖品列表',
            params: {
              activity: row.id,
              title: row.activityTitle,
              sponsorId:row.sponsorId
            }
          });
          break;
        case 'record':
          this.$router.push({
            name: '抽奖记录',
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
        name: '活动配置'
      });
    },
    handleSearch() {
      this.queryTableList();
    },
    queryTableList() {
      const params = {
        page: this.pageInit.page,
        limit:this.pageInit.pageSize
      };
      this.$service.post(API.activityQueryAll, params).then(res => {
        console.log("活动列表：",res)
        var arr=[]
        if(res instanceof Array){arr=res}
        else if(res.data instanceof Array){arr=res.data}
        else if (res.data.data instanceof Array) { arr = res.data.data}
        else if (res.data.data.data instanceof Array) { arr = res.data.data.data}
          
          this.tableList = arr;
          this.pageInit.total=res.total;
        
      });
    }
  },
  created() {
    this.queryTableList();
  }
};
</script>
<style type="scss">
  table tr td img{max-width:200px;height:auto;}
</style>

