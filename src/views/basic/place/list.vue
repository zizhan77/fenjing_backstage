<template>
  <!-- 场地列表 -->
  <section class="place-list page_main">
    <page-search :searchData="searchData" v-model="searchForm" @onSearch="handleChange(1)"></page-search>
    <section class="page_card page_card_padding">
      <el-button class="btn_small mb10 fr" type="primary" @click="hadnleAdd">新建场地</el-button>
      <template-table
        v-loading="loading"
        :table-list="tableList"
        :table-column="tableColumn"
        :table-btns="tableBtns"
        :operationBtnWidth="220"
        @handleEvent="handleEvent"
      ></template-table>
      <template-page :pagination-init="pageInit" @change="handleChange"></template-page>
    </section>
  </section>
</template>
<script>
import PageSearch from '@components/page-search';
import TemplateTable from '@components/template-table';
import TemplatePage from '@components/template-page';
import API from '@api/basic';
import Message from '@utils/message';
import { formatDate } from '@utils/utils';

export default {
  components: {
    TemplateTable,
    TemplatePage,
    PageSearch
  },
  data() {
    return {
      loading: false,
      tableColumn: [
        {
          label: '场地名称',
          name: 'name'
        },
        {
          label: '场馆状态',
          name: 'enable',
          render: (h, { row }) => {
            return <span>{row.enable === 1 ? '启用' : '未启用'}</span>;
          }
        },
        {
          label: '场地介绍',
          name: 'introduce'
        },
        {
          label: '场地价格',
          name: 'price',
          render:(h,{row})=>{
            return <span>{row.lowPrice}——{row.topPrice}</span>
          }
        },
        {
          label: '场地人数',
          name: 'price',
          render:(h,{row})=>{
            return <span>{row.lowCount}——{row.topCount}</span>
          }
        },
         {
          label: '场地历史艺人',
          name: 'price',
          render:(h,{row})=>{            
            let th="";
            for(let o in row.artistList){              
              th+="【"+row.artistList[o].artistName+"】 "              
            }
            return <span>{th}</span>
          }
        },
        {
          label: '是否支持选座',
          name: 'chooseSeat',
          render: (h, { row }) => {
            return <span>{row.chooseSeat === 1 ? '支持' : '不支持'}</span>;
          }
        },
        {
          label: '创建时间',
          name: 'createTime',
          render: (h, { row }) => {
            return <span>{formatDate(row.createTime, 'yyyy-MM-dd HH:mm:ss')}</span>;
          }
        },
        {
          label: '位置',
          name: 'location',
          render: (h, { row }) => {
            return (
              <span>
                {row.oneAddressName} / {row.twoAddressName} {row.threeAddressName}
              </span>
            );
          }
        },
        {
          label: '联系方式',
          name: 'phone'
        },
      ],
      tableBtns: [
        {
          label: '信息修改',
          role: 'edit'
        },
        {
          label: '区域配置',
          role: 'area'
        },
        {
          label: '删除',
          role: 'del'
        }
      ],
      tableList: [],
      pageInit: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      searchForm:{}
    };
  },
  computed: {
    searchData(){
      return [
        {
          label: '场地名称:',
          name: 'placeName',
          type: 'text',
          value: ''
        },
        {
          label: '是否启用:',
          name: 'enable',
          type: 'select',
          value: '',
          options:[
            {
              label: '全部',
              value: ''
            },
            {
              label: '启用',
              value: 1
            },
            {
              label: '未启用',
              value: 0
            }
          ]
        }
      ];
    }
  },
  methods: {
    handleChange(val) {
      this.pageInit.page = val;
      this.queryTableList();
    },
    handleEvent(row, role, index) {
      switch (role) {
        case 'edit':
          this.$router.push({
            name: '场地详情',
            params: {
              placeId: row.id
            }
          });
          break;
        case 'area':
          // 跳转区域列表
          this.$router.push({
            name: '区域列表',
            params: {
              placeId: row.id
            }
          });
          break;
        case 'del':
          Message.confirm('删除提示', '确定删除该条场地？', () => {
            this.$service.post(API.deleteById, { placeId: row.id }, true).then(res => {
              if (res && res.code === 0) {
                Message.success('删除成功！');
                this.queryTableList();
              } else {
                Message.error(`${res.message || '删除失败！'}`);
              }
            });
          });
          break;
        default:
          break;
      }
    },
    hadnleAdd() {
      this.$router.push({
        name: '场地详情'
      });
    },
    queryTableList(){
      const params = {
        ...this.searchForm,
        page: this.pageInit.page,
        limit: this.pageInit.pageSize
      };
      this.loading = true;
      this.$service.post(API.getPlaceList, params).then(res => {
        console.log('请求场地列表：',res);
        this.loading = false;
        if (res) {
          this.pageInit.total = res.total;
          this.tableList = res.list;
        }
      });
    }
  },
  mounted(){
    this.queryTableList();
  }
};
</script>
<style  lang="scss">
  .yellow_label{display:inline-block;padding:0 5px;margin:5px 5px;border-radius:3px;height:24px;line-height:24px;background:#4189ff;color:#fff;font-size:13px;opacity:0.7;}
</style>