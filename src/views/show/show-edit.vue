<template>
  <!-- 演出详情-编辑-新建 -->
  <section class="show-edit page_main">
    <section class="page_card page_card_padding">
      <template-form
        class="show-edit__container"
        ref="form"
        title="演出详情"
        :renderData="renderData"
        v-model="form"
        @onChange="handleFormChange"
      >
        <template slot-scope="props">
          <!-- 艺人 -->
          <template v-if="props.item.name === 'actorList'">
            <el-select
              v-model="actor"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
            >
              <el-option
                v-for="item in actorOps"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="handleSelectActor">添加</el-button>
            <section class="actor-list">
              <el-tag
                class="mt20 mr10"
                size="medium"
                closable
                v-for="(tag, index) in form.actorList"
                :key="index"
                @close="handleRemoveActor(index)"
              >{{tag.label}}</el-tag>
            </section>
          </template>

          <!-- 场地 -->                    
            <el-input style="width:150px;"
             v-if="props.item.name === 'place'"
            v-model="filterPlace" placeholder="输入关键字筛选"  @blur="handleFilterPlace"></el-input>  

          <!-- 关键字 -->
          <template v-if="props.item.name === 'keyword'">
            <el-input v-model="keyword"></el-input>
            <el-button type="primary" @click="handleAddKeyword">添加</el-button>
            <section class="keyword-list">
              <el-tag
                class="mt20 mr10"
                size="medium"
                closable
                v-for="(tag, index) in form.keyword"
                :key="index"
                @close="handleRemoveKeyword(index)"
              >{{tag}}</el-tag>
            </section>
          </template>
          <!-- 场次管理 -->
          <template v-if="props.item.name === 'frequency'">
            <section class="frequency-wrapper">
              <el-input v-model="frequency.name" type="text" placeholder="场次名称"></el-input>
              <!-- <el-input v-model="frequency.startTime" type="text" placeholder="开始时间"></el-input> -->
              <el-date-picker
                v-model="frequency.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
              ></el-date-picker>
              <el-input
                class="mt20"
                v-model="frequency.stopTime"
                type="text"
                placeholder="结束时间，如无，则不填"
              ></el-input>
              <el-button type="primary" @click="handleAddFrequency">添加</el-button>
            </section>
            <section class="frequency-list">
              <el-tag
                class="mt20 mr10"
                size="medium"
                closable
                v-for="(tag, index) in form.frequency"
                :key="index"
                @close="handleDelFrequency(index)"
              >{{tag.name}}/{{formatDate(tag.startTime, 'yyyy-MM-dd w HH:mm:ss')}}/{{tag.stopTime}}</el-tag>
            </section>
          </template>
          <!-- 票档管理 -->
          <template v-if="props.item.name === 'ticket'">
            <el-input type="text" v-model="ticket.name" placeholder="票档名称"></el-input>
            <el-input type="number" v-model="ticket.price" placeholder="票档价格"></el-input>
            <!-- 选择区域 -->
            <el-select v-model="ticket.area" v-if="isChoosePlace" placeholder="请选择区域">
              <el-option
                v-for="(item, index) in areaOps"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button class type="primary" @click="handleAddTicket">添加</el-button>
            <section class="ticket-list">
              <el-tag
                class="mt20 mr10"
                size="medium"
                closable
                v-for="(tag, index) in form.ticket"
                :key="index"
                @close="handleRemoveTicket(index)"
              >{{tag.name}}/{{tag.price}}元/{{tag.areaName}}</el-tag>
            </section>
          </template>
          <!-- 头像上传 -->
          <template v-if="props.item.name === 'thumbUrl'">
            <image-upload :fileList.sync="form.thumbUrl" :limit="1"></image-upload>
          </template>
          <!-- 演出详情 -->
          <template v-if="props.item.name === 'detail'">
            <!-- <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.detail"></el-input> -->
            <div id="editor-wrap"></div>
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
        <el-button size="medium" type="primary" @click="handleConfirm">确 认</el-button>
        <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
      </footer>
    </section>
  </section>
</template>
<script>
import TemplateForm from '@components/template-form';
import ImageUpload from '@components/image-upload';
import Message from '@utils/message';
import { uniqBy, uniq, get } from 'lodash';
import { isContains, formatDate } from '@utils/utils';
import { getToken } from '@utils/auth';
import Editor from 'wangeditor';
import API from '@api/show';
import Basic from '@api/basic';

export default {
  components: {
    TemplateForm,
    ImageUpload
  },
  props: {
    showId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      // 提交表单
      form: {},
      // 艺人下拉项
      actorOps: [],      
      // 当前选择艺人
      actor: '',      
      // 当前输入关键字
      keyword: '',
      // 当前输入场次信息
      frequency: {
        // 场次名称
        name: '',
        // 开始时间
        startTime: '',
        // 结束时间
        stopTime: ''
      },
      // 当前输入票档信息
      ticket: {
        name: '',
        price: '',
        area: ''
      },
      // 省-下拉项
      provinceOps: [],
      // 市下拉项
      cityOps: [],
      // 场地下拉项
      allPlaceOps:[],
      placeOps: [],
      place:'',
      // 文本编辑器
      Editor: null,
      // 区域下拉项
      areaOps: [],
      filterPlace:'',
      nowCityId:''   
    };
  },
  computed: {
    isEdit() {
      return !!this.showId;
    },
    // 所选场地是否支持选座
    // 支持则可以选择区域，否则不支持
    isChoosePlace() {
      let isChooseSeat = true;
      const ret = this.placeOps.find(item => item.value === this.form.place);
      if (ret) {
        isChooseSeat = ret.chooseSeat === 1;
      }
      return isChooseSeat;
    },
    renderData() {
      return [
        {
          label: '演出名称:',
          name: 'showName',
          type: 'text',
          value: '',
          required: true
        },
        {
          label: '简短名称:',
          name: 'alias',
          type: 'text',
          value: '',
          required: true
        },
        {
          label: '演出推荐语:',
          name: 'recommend',
          type: 'text',
          value: '',
          required: true
        },
        {
          label: '艺人:',
          name: 'actorList',
          value: [],
          required: true
        },
        {
          label: '关键字:',
          name: 'keyword',
          value: []
        },
        // {
        //   label: '演出状态:',
        //   name: 'status',
        //   type: 'select',
        //   value: 1,
        //   required: true,
        //   options: [
        //     {
        //       label: '开售',
        //       value: 2
        //     },
        //     {
        //       label: '预售',
        //       value: 1
        //     }
        //   ]
        // },
        // 预售填写演出时间
        {
          label: '开售时间:',
          name: 'sellStartTime',
          type: 'datetimepicker',
          value: '',
          required: true
          // isHide: this.form.status === 2
        },
        {
          label: '排序序号(1-9999):',
          name: 'sort',
          type: 'text',
          max: 4,
          value: '',
          required: true
        },
        {
          label: '城市选择:',
          name: 'oneAddress',
          type: 'select',
          value: '',
          required: false,
          options: this.provinceOps
        },
        {
          name: 'twoAddress',
          type: 'select',
          value: '',
          required: true,
          options: this.cityOps
        },
        {
          label: '所属场地:',
          name: 'place',
          type:"select",
          value: '',
          required: true,
          options:this.placeOps
        },
        {
          label: '演出分类:',
          name: 'showType',
          type: 'select',
          value: 1,
          required: true,
          options: [
            {
              label: '演唱会',
              value: 1
            },
            {
              label: 'Livehouse',
              value: 2
            }
          ]
        },
        {
          label: '场次管理:',
          name: 'frequency',
          value: [],
          required: true
        },
        {
          label: '票档管理:',
          name: 'ticket',
          value: [],
          required: true
        },
        {
          label: '票品信息',
          type: 'select',
          value: 10,
          name: 'ticketDeliverType',
          required: true,
          options: [
            {
              label: '快递',
              value: 10
            },
            {
              label: '电子票',
              value: 20
            }
          ]
        },
        {
          label: '头像上传:',
          name: 'thumbUrl',
          value: [],
          required: true
        },
        {
          label: '演出详情:',
          name: 'detail',
          value: '',
          required: true
        },
        {
          label: '购买须知:',
          name: 'remark',
          type: 'textarea',
          value: ''
        },
        {
          label: '演出性质:',
          name: 'performanceNature',
          type: 'radioGroup',
          value: '',
          required: true,
          options: [
            {
              label: '赞助商任务+售卖',
              value: 1
            },
            {
              label: '纯赞助商任务',
              value: 2
            },
            {
              label: '纯售卖',
              value: 3
            }
          ]
        },
        {
          label: '用户每单限购张数:',
          name: 'limit',
          value: '',
          type: 'number',
          required: true
        }
      ];
    }
  },
  methods: {
    formatDate(...args) {
      return formatDate(...args);
    },
    handleSelectActor() {
      const matchs = this.actorOps.filter(({ value }) => this.actor.includes(value));
      this.form.actorList.push(...matchs);
      this.form.actorList = uniqBy(this.form.actorList, 'value');
      this.actor = [];
    },
  async handleFilterPlace(){
      if(this.filterPlace==""){this.placeOps=this.allPlaceOps;return;}
      this.placeOps=await this.queryPlaceOps(this.nowCityId,this.filterPlace);
    },
    handleRemoveActor(index) {
      this.form.actorList.splice(index, 1);
    },
    // 远程搜索艺人
    async remoteMethod(query) {
      if (query) {
        this.actorOps = [];
        // 查询艺人列表
        const { list } = await this.$service.post(API.queryArtistList, { actorName: query, page: 1, limit: 9999 });
        if (list && Array.isArray(list) && list.length) {
          this.actorOps = list.map(({ id, artistName }) => {
            return {
              label: artistName,
              value: id
            };
          });
        }
      }
    },
    // 添加关键字
    handleAddKeyword() {
      this.form.keyword.push(this.keyword);
      this.form.keyword = uniq(this.form.keyword);
      this.keyword = '';
    },
    // 删除关键字
    handleRemoveKeyword(index) {
      this.form.keyword.splice(index, 1);
    },
    // 新增场次
    handleAddFrequency() {
      if (this.frequency.name && this.frequency.startTime && !isContains(this.form.frequency, this.frequency)) {
        this.$service
          .post(
            API.addShow,
            {
              showName: this.frequency.name,
              startTimeStr: this.frequency.startTime.toString(),
              endTimeStr: this.frequency.stopTime.toString()
            },
            true
          )
          .then(res => {
            if (res && res.code === 0) {
              Message.success('添加成功！');
              this.form.frequency.push({ id: res.data, ...this.frequency });
              this.frequency = Object.assign({}, this.frequency, {
                name: '',
                startTime: '',
                stopTime: ''
              });
            } else {
              Message.error(`${res.message || '添加失败！'}`);
            }
          });
      }
    },
    // 删除场次
    handleDelFrequency(index) {
      if (this.form.frequency[index].id) {
        this.$service.post(API.deleteShow, { showId: this.form.frequency[index].id }, true).then(res => {
          if (res && res.code === 0) {
            this.form.frequency.splice(index, 1);
            Message.success('删除成功');
          } else {
            Message.error(`${res.message || '删除失败！'}`);
          }
        });
      } else {
        this.form.frequency.splice(index, 1);
        Message.success('删除成功！');
      }
    },
    // 检索所选场地及区域是否有座位，无座位不能建票
    async judgeHasSeats(placeId, areaId) {
      if (!this.isChoosePlace) {
        return true;
      }
      const ret = await this.$service.post(Basic.querySeatModel, { placeId, areaId });
      return !!(ret && ret.length);
    },
    // 增加票档
    async handleAddTicket() {
      if (this.ticket.name && this.ticket.price && !isContains(this.form.ticket, this.ticket)) {
        const ret = await this.judgeHasSeats(this.form.place, this.ticket.area);
        if (!ret) {
          Message.warning('该场地、区域未配置座位！请先去场地下配置座位！');
          return false;
        }
        this.$service.post(API.addGear, { ticketGearName: this.ticket.name, price: this.ticket.price, areaId: this.ticket.area }, true).then(res => {
          if (res && res.code === 0) {
            this.form.ticket.push({ id: res.data, ...this.ticket, areaName: this.queryLabelByOps(this.areaOps, this.ticket.area) });
            Message.success('添加成功！');
            this.ticket = Object.assign({}, this.ticket, {
              name: '',
              price: '',
              area: '',
              areaName: ''
            });
          } else {
            Message.error(`${res.message || '添加失败！'}`);
          }
        });
      }
    },
    // 删除场次
    handleRemoveTicket(index) {
      if (this.form.ticket[index].id) {
        this.$service.post(API.deleteGear, { gearId: this.form.ticket[index].id }, true).then(res => {
          if (res && res.code === 0) {
            Message.success('删除成功！');
            this.form.ticket.splice(index, 1);
          } else {
            Message.error(`${res.message || '删除失败！'}`);
          }
        });
      }
    },
    queryLabelByOps(list, value) {
      return get(this.areaOps.find(item => item.value === value), 'label', '');
    },
    async handleFormChange(key, val, form) {
      if (key === 'oneAddress') {
        // 重置市选项
        this.$refs.form.resetForm('twoAddress');
        this.$refs.form.resetForm('place');
        this.cityOps = [];
        this.placeOps = [];
        this.allPlaceOps=[];
        this.cityOps = await this.queryCityList(val);
      }
      if (key === 'twoAddress') {       
        this.$refs.form.resetForm('place');
        this.placeOps = [];
        this.allPlaceOps=[];
        // 查询场地
        this.nowCityId=val;
        // this.allPlaceOps=this.placeOps=await this.queryPlaceOps(val,"");
      }
      if (key === 'place') {
        this.areaOps = await this.queryAreaOps(val);
        this.form.ticket = [];
      }
    },
    // 根据场地查询区域
    async queryAreaOps(placeId) {
      const list = (await this.$service.post(Basic.queryAreaListByPlaceId, { placeId })) || [];
      return list.map(item => {
        return {
          label: item.areaName,
          value: item.id
        };
      });
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
    // 查询场地下拉项
    async queryPlaceOps(cityId,placeName) {
      var param={};
      if(cityId){
        param={cityId,placeName}
      }
      const { list } = (await this.$service.post(API.getPlaceList, param)) || [];
      if(list.length>0){
        Message.success("获取场地成功，您可以开始选择场地了~");
      }
      return list.map(item => {
        return {
          label: item.name,
          value: item.id,
          ...item
        };
      });
    },
    // 查询演出详情-配置项
    async queryConditions() {
      // 查询省
      this.provinceOps = await this.queryCityList(0);
      
    },
    // 查询演出详情
    async queryDetails() {
      const res = await this.$service.post(API.getDetail, { id: this.showId });
      if (!res) {
        return false;
      }
      console.log(res);
      const { performanceVo = {}, placeInfo = {} } = res;
      this.form = Object.assign({}, this.form, {
        showName: performanceVo.title,
        alias: performanceVo.simpleTitle,
        recommend: performanceVo.description,
        actorList: performanceVo.artistVoList.map(({ id, artistName }) => ({ value: id, label: artistName })),
        keyword: performanceVo.keyWords ? performanceVo.keyWords.split('~') : [],
        // status: performanceVo.status,
        sellStartTime: performanceVo.startSaleDate,
        sort: performanceVo.sort,
        oneAddress: placeInfo.oneAddress,
        twoAddress: placeInfo.twoAddress,
        place: placeInfo.id,
        showType: performanceVo.performanceType,
        frequency: performanceVo.showList.map(item => {
          return {
            id: item.id,
            name: item.showName,
            startTime: item.startTime,
            stopTime: item.endTimeStr
          };
        }),
        ticket: performanceVo.ticketGearList.map(item => {
          return {
            id: item.id,
            name: item.ticketGearName,
            price: item.price,
            area: item.areaId
          };
        }),
        ticketDeliverType: performanceVo.ticketDeliverType,
        thumbUrl: [{ url: performanceVo.thumbUrl }],
        remark: performanceVo.buyNotes,
        performanceNature: performanceVo.performanceNature,
        limit: performanceVo.limitNumber,
        detail: performanceVo.detail
      });
      console.log("获取的演出信息：",this.form)
      this.$refs.form.clearValidate();
      this.Editor.txt.html(performanceVo.detail);

      this.cityOps = await this.queryCityList(this.form.oneAddress);
      this.allPlaceOps=this.placeOps = await this.queryPlaceOps(this.form.twoAddress,"");
      this.areaOps = await this.queryAreaOps(this.form.place);

      this.form.ticket = this.form.ticket.map(item => {
        return {
          ...item,
          areaName: this.queryLabelByOps(this.areaOps, item.area)
        };
      });
    },
    // 保存
    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      const params = {
        id: this.showId,
        optType: this.isEdit ? 2 : 1,
        // 演出明晨
        title: this.form.showName,
        // 简单名称
        simpleTitle: this.form.alias,
        // 演出推荐语
        description: this.form.recommend,
        // 艺人列表
        artistIds: this.form.actorList.map(item => item.value).join('~'),
        // 关键词
        keyWords: this.form.keyword.join('~'),
        // 一级地址
        oneAddress: this.form.oneAddress,
        // 二级地址
        twoAddress: this.form.twoAddress,
        // 表演场次
        showIds: this.form.frequency.map(({ id }) => id).join('~'),
        // 票档
        ticketGearIds: this.form.ticket.map(({ id }) => id).join('~'),
        // 票品信息
        ticketDeliverType: this.form.ticketDeliverType,
        // 头像
        thumbUrl: get(this.form, 'thumbUrl.0.url', ''),
        // 场地
        placeId: this.form.place,
        // 演出状态
        // status: this.form.status,
        // 开售时间
        startSaleDateStr: this.form.sellStartTime,
        // 排序序号
        sort: this.form.sort,
        // 演出分类
        performanceType: this.form.showType,
        // 演出详情
        detail: this.form.detail,
        // 购买须知
        buyNotes: this.form.remark,
        // 演出性质
        performanceNature: this.form.performanceNature,
        // 限购张数
        limitNumber: this.form.limit
      };

      const placeChild = this.form.frequency.map(item => {
        return (
          <li>
            {item.name} / {formatDate(item.startTime, 'yyyy-MM-dd w HH:mm:ss')} / {item.stopTime}
          </li>
        );
      });
      const ticketChild = this.form.ticket.map(item => {
        return (
          <li>
            {item.name}/{item.price}元/{item.areaName}
          </li>
        );
      });
      this.$msgbox({
        title: '保存提示',
        customClass: 'show-box',
        message: (
          <section class="show-edit__confirm">
            <p>场次、票档一经上传，不可修改(修改请找管理员</p>
            <label-item label="场次列表:" labelWidth="80px">
              <ul>{placeChild}</ul>
            </label-item>
            <label-item label="票档列表">
              <ul>{ticketChild}</ul>
            </label-item>
            <h3 class="tc">是否确定？</h3>
          </section>
        ),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            this.$service.post(API.addPerformance, params, true).then(res => {
              instance.confirmButtonLoading = false;
              done();
              if (res && res.code === 0) {
                Message.success('保存成功！');
                this.$router.push({
                  path: '/show/list'
                });
              } else {
                Message.error(`${res.message || '保存失败！'}`);
              }
            });
          } else {
            done();
          }
        }
      })
        .then(action => {})
        .catch(() => {});
    }
  },
  async mounted() {
    this.Editor = new Editor('#editor-wrap');
    this.Editor.customConfig.uploadFileName = 'fileName';
    this.Editor.customConfig.uploadImgServer = process.env.NODE_ENV === 'production' ? window.origin : 'http://47.92.115.105' + '/file/uploadFile'; // 上传图片到服务器
    this.Editor.customConfig.withCredentials = true;
    this.Editor.customConfig.onchange = html => {
      // html 即变化之后的内容
      this.form.detail = html;
    };
    this.Editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'justify', // 对齐方式
      'image'
    ];
    this.Editor.customConfig.customUploadImg = (files, insert) => {
      let data = new FormData();
      // console.log("传图片数据：",data);
      data.append('fileName', files[0]);
      this.$axios
        .request({
          url: `${process.env.NODE_ENV === 'production' ? window.origin : 'http://47.92.115.105'}/file/uploadFile`,
          method: 'POST',
          headers: {
            token: getToken(),
            'content-type': 'multipart/form-data'
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
            Message.error('上传失败！' + data.errStr);
          }
        })
        .catch(error => {
          console.log(error);
          Message.error('上传失败！' + error);
        });
    };
    this.Editor.create();
    await this.queryConditions();   

  
    // this.allPlaceOps=this.placeOps = await this.queryPlaceOps();  
  },
  async created(){
    if (this.isEdit) {
      await this.queryDetails();
    }
    this.$nextTick(() => {
      this.$refs.form.clearValidate();
    });
  }
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
