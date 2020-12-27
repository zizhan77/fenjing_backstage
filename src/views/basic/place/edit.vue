<template>
  <!-- 场地详情 -->
  <section class="place-edit page_main">
    <section class="page_card page_card_padding page_card_full">
      <div class="mx-medium">
        <template-form
          @onChange="handleFormChange"
          title="场地详情"
          ref="form"
          :render-data="renderData"
          v-model="form"
        >
          <template slot-scope="props">
            <span v-if="props.item.name === 'oneAddress'">省</span>
            <span v-if="props.item.name === 'twoAddress'">市</span>
            <span v-if="props.item.name === 'threeAddress'">区/县</span>
            <span v-if="props.item.name === 'lowPrice'" class="input_tips">最低</span>
            <span v-if="props.item.name === 'topPrice'" class="input_tips">最高</span>
            <span v-if="props.item.name === 'lowCount'" class="input_tips">最低</span>
            <span v-if="props.item.name === 'topCount'" class="input_tips">最高</span>
            <div v-if="props.item.name ==='location'" id="map"></div>
             <!-- 历史艺人 -->
            <template v-if="props.item.name === 'historyActor'">
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
import TemplateForm from '@components/template-form';
import {uniqBy, uniq,get } from 'lodash';
import Message from '@utils/message';
import API from '@api/basic';

export default {
  components: {
    TemplateForm
  },
  data() {
    return {
      form: {actorList:[]},
      rules: [],
      actorOps: [],      
      // 当前选择艺人
      actor: '',
      frequency: {
        // 场次名称
        name: '',
        // 开始时间
        startTime: '',
        // 结束时间
        stopTime: ''
      },
      // 省列表
      oneOps: [],
      // 市列表
      twoOps: [],
      // 县列表
      threeOps: [],
      // 检索服务
      geocoder: null,
      // 控件
      geoControl: null,
      latLng: {
        lat: 39.916527,
        lng: 116.397128
      },
      // 覆盖层
      marker: null,
      // 地图类
      map: null
    };
  },
  computed: {
    placeId(){
      return get(this.$route, 'params.placeId', '');
    },
    isEdit() {
      return !!this.placeId;
    },
    renderData() {
      return [
        {
          type: 'text',
          label: '场地名称:',
          name: 'name',
          value: '',
          required: true
        },
        {
          type: 'select',
          label: '场地位置:',
          value: '',
          name: 'oneAddress',
          required: true,
          options: this.oneOps
        },
        {
          type: 'select',
          value: '',
          name: 'twoAddress',
          required: true,
          options: this.twoOps
        },
        {
          type: 'select',
          value: '',
          name: 'threeAddress',
          required: true,
          options: this.threeOps
        },
        {
          type: 'text',
          label: '详细地址:',
          name: 'address',
          value:'',
          required: true
        },
        {
          value: {},
          label: '具体位置:',
          name: 'location',
          required: true
        },
        {
          type: 'textarea',
          label: '场地介绍:',
          name: 'introduce',
          value: '',
          required: false
        },
        {
          type: 'number',
          label: '场租参考价(元/天):',
          name: 'lowPrice',
          value: '',
          required: false
        },
        {
          type: 'number',
          label: '',
          name: 'topPrice',
          value: '',          
          required: false
        },
        {
          type: 'number',
          label: '容纳人数:',
          name: 'lowCount',
          value: '',
          required: false
        },
        {
          type: 'number',
          label: '',
          name: 'topCount',
          value: '',          
          required: false
        },
         {
          type: 'text',
          label: '场地联系方式:',
          name: 'phone',
          value:'',
          required: false
        },
       {
          type: 'disable',
          label: '场地演出历史艺人:',
          name: 'historyActor',
          required: false
        },
        {
          type: 'radioGroup',
          label: '支持选座:',
          name: 'chooseSeat',
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
    },
    // 获取详细地址
    getAddress() {
      const { oneAddress, twoAddress, threeAddress, address } = this.form;
      const oneAddressLabel = get(this.oneOps.find(({ value }) => value === oneAddress), 'label', '');
      const twoAddressLabel = get(this.twoOps.find(({ value }) => value === twoAddress), 'label', '');
      const threeAddressLabel = get(this.threeOps.find(({ value }) => value === threeAddress), 'label', '');
      return [oneAddressLabel, twoAddressLabel, threeAddressLabel, address].filter(_ => _).join(',');
    }
  },
  methods: {
    handleConfirm() {
      if (!this.$refs.form.validate()) {
        Message.warning('表单验证未通过！');
        return false;
      }
      const { actorList,createTime, ...others } = this.form;
      let actortar=[];
      for(let o in actorList){        
        actortar[o]={};
        actortar[o].artistId=actorList[o].value;
      }
      // const params = {
      //   ...others,
      //   artistList:JSON.stringify(actortar),
      //   id: this.placeId,
      //   // 1添加  2修改
      //   optionType: this.isEdit ? 2 : 1,
      //   longitude: this.latLng.lng,
      //   latitude: this.latLng.lat
      // }; 
      var tobj={
         ...others,
          id: this.placeId,
          longitude: this.latLng.lng,
          latitude: this.latLng.lat
      }
      const params = {
        str:JSON.stringify(tobj),
        list:JSON.stringify(actortar),        
        // 1添加  2修改
        optionType: this.isEdit ? 2 : 1,        
      };     
      // console.log("所有传递的数据：",JSON.stringify(params));return;
      this.$service.post(API.addOrUpdatePlace,params, true).then(res => {
        // console.log("返回结果：",res);
        if (res && res.code === 0) {
          Message.success('保存成功！');
          this.$router.push({
            name: '场地列表'
          });
        } else {
          Message.error(`${res.message || '保存失败！'}`);
        }
      });
    },  
    async handleFormChange(key, val, form) {
      if (key === 'oneAddress') {
        // 重置市选项
        this.$refs.form.resetForm('twoAddress');
        this.$refs.form.resetForm('threeAddress');
        this.twoOps = [];
        this.twoOps = await this.queryCityList(val);
      }
      if (key === 'twoAddress') {
        this.$refs.form.resetForm('threeAddress');
        this.threeOps = [];
        this.threeOps = await this.queryCityList(val);
      }
      if (['oneAddress', 'twoAddress', 'threeAddress'].includes(key)) {
        this.form.address = '';
        this.geocoder.click = false;
        this.geocoder.getLocation(this.getAddress);
      }
      if (['oneAddress', 'twoAddress', 'threeAddress', 'address'].includes(key)) {
        this.geocoder.click = false;
        this.geocoder.getLocation(this.getAddress);
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
    handleRemoveActor(index) {
      this.form.actorList.splice(index, 1);
    },
    handleSelectActor() {
      const matchs = this.actorOps.filter(({ value }) => this.actor.includes(value));
      this.form.actorList.push(...matchs);
      this.form.actorList = uniqBy(this.form.actorList, 'value');
      this.actor = [];
      console.log("当前艺人信息：",this.form.actorList);
    },
    handleRemoveActor(index) {
      this.form.actorList.splice(index, 1);
    },
    // 远程搜索艺人
    async remoteMethod(query){
      if (query){
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
    async queryFormDetail() {
      this.$service.post(API.queryDetail, { placeId: this.placeId }).then(async res => {
        if (res) {          
          this.form = Object.assign({}, this.form, res);
          var tart=[];
          for(let o in res.artistList){
            tart[o]={}
            tart[o].label=res.artistList[o].artistName;
            tart[o].value=res.artistList[o].artistId;
          }
          this.form.actorList=tart;
          const { oneAddress, twoAddress, threeAddress } = this.form;
          this.twoOps = await this.queryCityList(oneAddress);
          this.threeOps = await this.queryCityList(twoAddress);
          this.latLng = {
            lng: res.longitude,
            lat: res.latitude
          };
          if (this.marker && this.map) {
            this.latLng = new window.qq.maps.LatLng(this.latLng.lat, this.latLng.lng);
            // 设置地图中心
            this.map.setCenter(this.latLng);
            // 设置覆盖物
            this.marker.moveTo(this.latLng);
          }
        }
      });
    }
  },
  async mounted() {
    // 实例化地图
    this.latLng = new window.qq.maps.LatLng(this.latLng.lat, this.latLng.lng);
    this.map = new window.qq.maps.Map(document.querySelector('#map'), {
      center: this.latLng,
      zoom: 14
    });
    this.marker = new qq.maps.Marker({
      map: this.map,
      position: this.latLng
    });

    //调用地址解析类
    this.geocoder = new qq.maps.Geocoder({
      complete: result => {
        if (this.geocoder && this.geocoder.click) {
          // 单击事件下地址回填
          const { streetNumber = '' } = result.detail.addressComponents || {};
          const [near] = result.detail.nearPois || [];
          this.form.address = [streetNumber, near.name].map(a => a.trim()).join('');
        } else {
          this.map.setCenter(result.detail.location);
          this.marker.moveTo(result.detail.location);
        }
        this.marker.setPosition(result.detail.location);
      }
    });
    // 监听单击事件
    window.qq.maps.event.addListener(this.map, 'click', ({ latLng }) => {
      this.marker.moveTo(latLng);
      // click表示将地址回显
      this.geocoder.click = true;
      this.geocoder.getAddress(latLng);
      this.latLng = latLng;
    });

    // 查询城市
    this.oneOps = await this.queryCityList(0);
    if (this.isEdit) {
      // 编辑时查询场地信息
      await this.queryFormDetail();
    }
  }
};
</script>
<style lang="scss">
#map {
  min-height: 500px;
}
.input_tips{position:absolute;display:block;height:100%;font-size:12px;color:#4189ff;width:40px;white-space:nowrap;text-align:right;top:0;right:5px;z-index:9999;transform:scale(0.8,0.8);-webkit-transform:scale(0.8,0.8);}
</style>
