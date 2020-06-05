<template>
  <div class="container">
    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames" @change="handleChange" class="el-collapse">
      <el-collapse-item name="1" class="el-collapse-item">
        <!-- 标题 -->
        <template slot="title" class="el-collapse-item-title">
          <p class="dialogTitle">鹰眼轨迹系统管理</p>
        </template>

        <!-- 内容 -->
        <div class="content-div">
          <!-- 选项卡一 -->
          <el-tabs type="card" class="el-tabs" v-model="tabActiveName">
            <el-tab-pane class="el-tab-pane" name="monitoring">
              <span slot="label">
                <i class="el-icon-date"></i> 实时监控
              </span>
              <!-- 实时监控搜索框 -->
              <el-input
                placeholder="请输入工程名称"
                v-model="monitoringSearchInput"
                class="el-input-inner"
                clearable
              >
                <el-button slot="append" icon="el-icon-search" @click="getEntityByAxios"></el-button>
              </el-input>

              <!-- 搜索结果 -->
              <div class="searchResult">
                <!-- // TODO 改成 components -->
                <div
                  class="resultItem"
                  :class="{bgColor:index==current}"
                  v-for="(searchResultItem,index) in ResultList_Entity_Pager"
                  :key="index"
                  @click="itemClickEvent(searchResultItem,index)"
                >
                  <div class="icon">
                    <img :src="iconSrc" class="iconImg" />
                  </div>
                  <div class="entity_name">{{searchResultItem.truck}}</div>
                  <div class="otherInfo">{{searchResultItem.man}}</div>
                </div>
              </div>

              <!-- 卡片中的 div -->
              <!-- 分页 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange_Entity"
                :current-page.sync="currentPage_Entity"
                :page-size="pageSize_Entity"
                layout="prev, pager, next, jumper"
                :total="total_Entity"
              ></el-pagination>
            </el-tab-pane>

            <!------------------------ 选项卡二 -------------------------->
            <el-tab-pane class="el-tab-pane" name="trackSelect">
              <span slot="label">
                <i class="el-icon-date"></i> 轨迹查询
              </span>
              <!-- 时间段选择框 -->
              <el-date-picker
                class="el-date-picker"
                v-model="dateValue"
                type="datetimerange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :editable="false"
                @change="dateChagneEvent"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm"
              ></el-date-picker>
              <!-- 轨迹查询搜索框 -->
              <el-input
                placeholder="请输入终端名称"
                v-model="trackSearchInput"
                class="el-input-inner"
                clearable
                disabled
              >
                <el-button slot="append" icon="el-icon-search" @click="getTrackInfo"></el-button>
              </el-input>

              <!-- 搜索结果 -->
              <!-- // TODO 加上 v-if ，当无查询轨迹时，这些字段隐藏 -->
              <div class="searchResult">
                <div class="carInfoDetailDiv" v-if="carInfoDetail===''?false:true">
                  <div class="infoTitle">
                    <i class="el-icon-document" style="color:#1296DB;"></i>&nbsp;运单信息
                  </div>
                  <div class="content">运单号：{{carInfoDetail.num===''?'暂无数据':carInfoDetail.num}}</div>
                  <!-- 文字提示 ：工程名称可能过长 -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="carInfoDetail.project===''?'暂无数据':carInfoDetail.project"
                    placement="bottom-end"
                  >
                    <div
                      class="content"
                    >工程名称：{{carInfoDetail.project===''?'暂无数据':strSubstring(carInfoDetail.project,15)}}</div>
                  </el-tooltip>
                  <div
                    class="content"
                  >发货日期：{{carInfoDetail.delivery===''?'暂无数据':carInfoDetail.delivery}}</div>
                  <div
                    class="content"
                  >预计到货日期：{{carInfoDetail.arrival===''?'暂无数据':carInfoDetail.arrival}}</div>
                  <div
                    class="content"
                  >出发时间：{{carInfoDetail.startDate===''?'暂无数据':carInfoDetail.startDate}}</div>
                  <div
                    class="content"
                  >结束时间：{{carInfoDetail.endDate===''?'暂无数据':carInfoDetail.endDate}}</div>
                  <div class="content">承运人：{{carInfoDetail.man===''?'暂无数据':carInfoDetail.man}}</div>
                  <div
                    class="content"
                  >承运人电话：{{carInfoDetail.mobile===''?'暂无数据':carInfoDetail.mobile}}</div>
                  <div class="content">车牌号：{{carInfoDetail.truck===''?'暂无数据':carInfoDetail.truck}}</div>
                </div>
                <div class="trackInfoDiv">
                  <div class="infoTitle">
                    <i class="el-icon-position" style="color:#1296DB;"></i>&nbsp;轨迹信息
                  </div>
                  <div class="content">里程数：{{trackDistance}} 米</div>
                  <div class="content">收费里程数：{{tollDistance}} 米</div>
                </div>
              </div>

              <!-- 卡片中的 div -->
              <!-- 分页 -->
              <!-- <el-pagination
                @size-change="handleSizeChange_Track"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage3"
                :page-size="pageSize_Track"
                layout="prev, pager, next, jumper"
                :total="total_Track"
                :page-index="pageIndex_Track"
              ></el-pagination>-->
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import globalStore from '../stores/global-stores'
export default {
  props: {
    // Track 字段 => 展示在轨迹查询框
    // 里程数
    trackDistance: '',
    // 收费里程数
    tollDistance: ''
  },
  computed: {
    // 前端分页
    ResultList_Entity_Pager () {
      return this.searchResultList_Entity.slice((this.currentPage_Entity - 1) * this.pageSize_Entity, this.currentPage_Entity * this.pageSize_Entity)
    },
    // 公司API获取的车辆信息
    carInfoDetail () {
      return globalStore.state.carInfoDetail
    }
  },
  destroyed () {
    // 在页面卸载时，清空查询出来的结果
    globalStore.commit('clearCarInfoDetail')
  },
  data () {
    return {
      activeNames: ['1'],
      monitoringSearchInput: '',
      // 轨迹查询 => 展示车牌号
      trackSearchInput: '',
      // 轨迹查询 => 真正作为参数的 轨迹id
      trackSearchParams: '',
      iconSrc: '../static/icon/car.png',

      /** -------- 终端 -------- */
      // 查询列表
      searchResultList_Entity: '',
      // 查询总数
      total_Entity: 0,
      // 单页数量
      pageSize_Entity: 10,
      currentPage_Entity: 1,

      /** -------- 轨迹 -------- */
      // 查询列表
      searchResultList_Track: '',
      // 查询总数
      total_Track: 0,
      // 单页数量
      pageSize_Track: 10,
      pageIndex_Track: 1,

      // 选中车辆的具体信息
      carInfo: '',

      // 选项卡初始选中框
      tabActiveName: 'monitoring',
      dateValue: '',

      // 标识 => 选中具体项目保持底部颜色改变
      current: null,

      // 日期选择范围限制
      minTime: null,
      // maxTime: new Date().getTime(),
      pickerOptions: {
        // 设置每一项 time（如：2020-5-20 这一项）的禁用状态，返回值为 Boolean
        disabledDate (time) {
          // TODO 如何设置 minTime 的禁用状态
          let maxTime = new Date().getTime()
          return time.getTime() > maxTime
        }
      },

      // 开始 & 结束时间戳
      endTimeStamp: null,
      startTimeStamp: null,

      // 轨迹点数组
      polylinePath: [],

      // 查询出来的终端 id 保存数组
      entityIdList: []
    }
  },
  methods: {
    // 日期格式转换为时间戳 => 保留10位（要除以1000）
    timeToTimestamp (params) {
      var moment = require('moment')
      return moment(params).format('x') / 1000
    },
    // 时间选择之后的日期选择框值
    dateChagneEvent () {
      // 开始时间
      this.startTimeStamp = this.timeToTimestamp(this.dateValue[0])
      // 结束时间
      this.endTimeStamp = this.timeToTimestamp(this.dateValue[1])
    },
    // 展示框点击轨迹 -> 左上角展示框切换到轨迹查询
    // monitoring & trackSelect ：实时监控 & 轨迹查询
    selectTrack (entityName, truck) {
      // 将终端名称绑定到轨迹查询的终端名上
      this.trackSearchInput = truck
      this.trackSearchParams = entityName
      // 切换选项卡 => 轨迹查询
      this.tabActiveName = 'trackSelect'
      // 以创建时间为最小值
      // this.minTime = createTime
    },
    // 点击终端 item => 读取经纬度 => 生成标注点
    itemClickEvent (carInfoDetail, index) {
      var moment = require('moment')
      // 点击时根据 id 获取对应终端信息
      let id = carInfoDetail.id

      /** 查询轨迹的三个参数 */
      // 转换为时间戳
      this.startTimeStamp = moment(carInfoDetail.startDate).format('x') / 1000
      this.trackSearchInput = carInfoDetail.truck
      this.trackSearchParams = carInfoDetail.id
      // 当 endDate 为空时，默认为当前时间
      if (carInfoDetail.endDate === '') {
        this.endTimeStamp = Math.floor(moment(new Date()).format('x') / 1000)
      } else {
        this.endTimeStamp = moment(carInfoDetail.endDate).format('x') / 1000
      }

      // 获取轨迹
      this.$emit('getTrackInfo', this.trackSearchParams, this.startTimeStamp, this.endTimeStamp)

      // 获取终端名称
      this.getEntity(id)
      // carInfoDetail => 公司API的详细信息
      globalStore.commit('set_carInfoDetail', carInfoDetail)

      // 保持点击态样式
      this.current = index

      // 点击的同时打开在地图上的信息窗体
      // this.$emit('infoWindowOpen')
    },
    searchEvent_Entity () {
      this.getEntity()
    },
    // 处理分页:Entity
    handleCurrentChange_Entity (val) {
      this.currentPage_Entity = val
      // this.getEntity()
    },
    // 处理分页:Track
    handleCurrentChange_Track (val) {
      this.pageIndex_Track = val
    },
    // 查询获取终端 ：公司内部API
    getEntityByAxios () {
      if (this.monitoringSearchInput === '') {
        this.$message({
          message: '请输入工程名称',
          type: 'warning'
        })
      } else {
        // 每次重新搜索时，清空原先搜索出来的数组
        globalStore.commit('clearProjectOfEntity')
        this.$http({
          method: 'get',
          url: `http://192.168.103.80:22026/Map/PF_PackOut/search`,
          params: {
            project: this.monitoringSearchInput
          }
        }).then((res) => {
          this.searchResultList_Entity = res.data.data
          // 提取 id 向百度API发起请求
          for (let i = 0; i < this.searchResultList_Entity.length; i++) {
            // this.entityIdList.push(this.searchResultList_Entity[i].id)
            this.getEntityForPoints(this.searchResultList_Entity[i].id)
          }
        })
      }
    },
    // 点击具体终端 => 查询终端信息 ：百度API
    getEntity (id) {
      var params = {
        ak: 'HD5qKGOAdqzf7MmNCm4ZRNHPaKwGA2mQ',
        service_id: '221094',
        dataType: 'jsonp',
        filter: 'entity_names:' + id
      }
      this.$jsonp('http://yingyan.baidu.com/api/v3/entity/list?mcode=F7:E2:AD:B2:D7:04:94:F5:E9:55:B4:60:4E:50:CB:95:D9:EB:CF:A0;com.example.lieying', params).then(res => {
        console.log('baiduApi_Entity', res)

        this.carInfo = res.entities

        // 字符分割
        let carInfoSplited = this.carInfoSplit(this.carInfo[0])

        // 将百度API查询出来的信息传给信息窗口
        globalStore.commit('set_carInfo', carInfoSplited)

        // 传递经纬度作为标注点生成依据
        // [0] => 用唯一标识查询出来的只有一个数据
        globalStore.commit('set_choosenLat', res.entities[0].latest_location.latitude)
        globalStore.commit('set_choosenLng', res.entities[0].latest_location.longitude)
        // 触发项目点击，生成标注点
        this.$emit('itemClickEvent')
      })
    },
    // 搜索后根据 id 查找对应终端经纬度 => 生成标注点
    getEntityForPoints (id) {
      var params = {
        ak: 'HD5qKGOAdqzf7MmNCm4ZRNHPaKwGA2mQ',
        service_id: '221094',
        dataType: 'jsonp',
        filter: 'entity_names:' + id
      }
      this.$jsonp('http://yingyan.baidu.com/api/v3/entity/list?mcode=F7:E2:AD:B2:D7:04:94:F5:E9:55:B4:60:4E:50:CB:95:D9:EB:CF:A0;com.example.lieying', params).then(res => {
        // 将搜索出来的关于某工程相关的所有终端，保存在数组中
        let pointInfo = this.carInfoSplit(res.entities[0])
        globalStore.commit('pushProjectOfEntity', pointInfo)
      })
    },
    // 查询获取轨迹
    getTrackInfo () {
      if (this.checkDateRange(this.carInfoDetail.startDate, this.carInfoDetail.endDate)) {
        this.$emit('getTrackInfo', this.trackSearchParams, this.startTimeStamp, this.endTimeStamp)
      } else {
        this.$message.error('不在合法时间段内，请在出发与结束时间之间选择')
      }
    },
    // 进行字符串截取
    strSubstring (str, substring) {
      if (str.length > substring) {
        return str.substring(0, substring) + '...'
      } else {
        return str
      }
    },
    // 汽车信息字符串分割，返回新的数组 => 百度API
    carInfoSplit (paramsList) {
      // ---------------------- 分割、赋值 --------------------------
      // 卸货地址 + 发货日期 + 到货日期
      let addressDeliveryArrival = paramsList.address_delivery_arrival
      let addressDeliveryArrivalArray = addressDeliveryArrival.split('#')

      let address = addressDeliveryArrivalArray[0]
      let delivery = addressDeliveryArrivalArray[1]
      let arrival = addressDeliveryArrivalArray[2]
      // 承运人 + 承运人电话 + 车牌号
      let manMobileTruck = paramsList.man_mobile_truck
      let manMobileTruckArray = manMobileTruck.split('#')

      let man = manMobileTruckArray[0]
      let mobile = manMobileTruckArray[1]
      let truck = manMobileTruckArray[2]
      // 运单号 + 工程名
      let numProject = paramsList.num_project
      let numProjectArray = numProject.split('#')

      let num = numProjectArray[0]
      let project = numProjectArray[1]

      // 声明分割后的返回值
      let splitResult = {
        address: address,
        delivery: delivery,
        arrival: arrival,
        create_time: paramsList.create_time,
        entity_desc: paramsList.entity_desc,
        entity_name: paramsList.entity_name,
        latest_location: paramsList.latest_location,
        man: man,
        mobile: mobile,
        truck: truck,
        modify_time: paramsList.modify_time,
        num: num,
        project: project
      }
      return splitResult
    },
    checkDateRange (startTime, endTime) {
      // 如何判断时间段是否在某个时间段内？
      // 时间 A ~ B
      // if startTime >= A && endTime <= B 则符合
      let starTimeTimestamp = this.timeToTimestamp(startTime)
      let endTimeTimestamp = this.timeToTimestamp(endTime)

      if (this.startTimeStamp >= starTimeTimestamp && this.endTimeStamp <= endTimeTimestamp) {
        // 符合要求，可提交
        return true
      } else {
        // 不在规定时间段内，不可提交
        return false
      }
    }
  }
}
</script>
<style>
/* 标题 */
.el-collapse-item__header {
  color: #ffffff;
  background-color: #1296db;
  font-size: 16px;
}
/* 内容 */
.content-div {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.el-input-inner {
  width: 90%;
}
.el-collapse-item {
}
/* 切换 tab */
.el-tabs__item {
  /* 边框1px，width:350px，故用174px刚好 */
  width: 174px;
  text-align: center;
}
.el-collapse-item-title {
}
.el-tab-pane {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.dialogTitle {
  margin-left: 110px;
}
</style>
<style scoped>
.container {
  font-family: PingFang SC;
  width: 350px;
}
/* 终端展示 => item 项 */
.searchResult {
  height: 400px;
  align-content: flex-start;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
/* 轨迹信息展示 ：公司API信息 */
.carInfoDetailDiv {
  height: 300px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-content: flex-start;
}
/* 标题，如：运单信息 */
.infoTitle {
  font-size: 14px;
  font-weight: bold;
  width: 90%;
  height: 35px;
  display: flex;
  align-items: center;
}
/* 内容，如：里程数：XXX */
.content {
  width: 90%;
  padding-left: 40px;
  height: 30px;
  display: flex;
  align-items: center;
}
/* 轨迹信息查询：百度API查询 */
.trackInfoDiv {
  padding-top: 10px;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-content: flex-start;
}
/* 每个查询出来的 item  */
.resultItem {
  width: 90%;
  height: 40px;
  display: flex;
  align-items: center;
}
/* hover 样式 */
.resultItem:hover {
  background-color: aliceblue;
  cursor: pointer;
}
/* 点击后保持底部颜色样式 */
.bgColor {
  background-color: aliceblue;
}
.resultItem:visited {
  background-color: aliceblue;
}
/* 汽车图标 */
.icon {
  width: 50px;
  /* padding-left: 10px; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.iconImg {
  width: 20px;
  height: 20px;
}
/* 终端名称 */
.entity_name {
  width: 220px;
}
/* 其他信息，如：车牌 */
.otherInfo {
  width: 80px;
}
/* 轨迹查询 => 轨迹详细信息展示框 */
.trackResultItem {
  height: 40px;
  width: 90%;
  display: flex;
  align-items: center;
}
/* 日期选择框 */
.el-date-picker {
  width: 314px;
  margin-bottom: 10px;
}
</style>
