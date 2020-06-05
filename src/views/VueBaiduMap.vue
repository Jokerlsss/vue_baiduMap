<template>
  <!-- scroll-wheel-zoom:允许鼠标滚轮缩放
  -->
  <baidu-map @ready="handler" class="map" :center="center" :zoom="zoom" scroll-wheel-zoom>
    <!-- 获取选择车辆的标注点 -->
    <!-- :icon="{url: '../static/icon/48car.png', size: {width: 48, height: 48}}" -->
    <!-- v-if="isShowMarker" -->
    <bm-marker
      v-for="(pointItem,index) in projectOfEntity"
      :key="index"
      :position="{lng: pointItem.latest_location.longitude, lat: pointItem.latest_location.latitude}"
      @click="infoWindowOpen"
      :rotation="pointItem.latest_location.direction"
      :icon="{url: '../static/icon/32direction.png', size: {width: 32, height: 32}}"
    >
      <!-- 信息窗体 -->
      <bm-info-window
        :position="{lng: pointItem.latest_location.longitude, lat: pointItem.latest_location.latitude}"
        title="<div style='display:flex;align-items:center;justify-content:center'><img src='../static/icon/car.png' width='20px' height='20px'/>&nbsp;地图信息</div>"
        :show="infoWindow.show"
        @close="infoWindowClose"
        @open="infoWindowOpen"
      >
        <div class="bmInfoWindowDiv">
          <p
            v-text="'定位：'+keepDecimal(pointItem.latest_location.longitude,3)+' , '+keepDecimal(pointItem.latest_location.latitude,3)"
          ></p>
          <p v-text="'最新定位时间：'+timestampToTime(pointItem.latest_location.loc_time)"></p>
          <p v-text="'速度：'+keepDecimal(pointItem.latest_location.speed,2)+'km/h'"></p>
        </div>
        <button class="trackBtn" @click="selectTrack">轨迹</button>
      </bm-info-window>
    </bm-marker>

    <!-- 自定义控件 => 终端展示、搜索框 -->
    <bm-control id="bmControl">
      <div class="operateFrame">
        <operateFrame
          @itemClickEvent="changeCenter"
          ref="operateFrame"
          @getTrackInfo="handelMoreRequest"
          :trackDistance="keepDecimal(distance,0)"
          :tollDistance="keepDecimal(tollDistance,0)"
        ></operateFrame>
      </div>
      <div class="cityList">
        <!-- 城市列表 -->
        <bm-city-list anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-city-list>
      </div>
    </bm-control>

    <!-- 添加轨迹折线 -->
    <bm-polyline
      @click="polyWinShowOpen"
      :path="polylinePath"
      stroke-color="blue"
      :stroke-opacity="0.5"
      :stroke-weight="5"
      :icons="icons"
    ></bm-polyline>

    <!-- 轨迹点击窗体 -->
    <bm-info-window
      :position="{lng: this.polyClickPoint.lng, lat: this.polyClickPoint.lat}"
      title="<div style='display:flex;align-items:center;justify-content:center'><img src='../static/icon/car.png' width='20px' height='20px'/>&nbsp;地图信息</div>"
      :show="polyWinShow"
      @close="polyWinShowClose"
      @open="polyWinShowOpen"
    >
      <div class="bmInfoWindowDiv">
        <p v-text="'定位：'+this.polyClickPoint.lat+' , '+this.polyClickPoint.lng"></p>
        <p v-text="'最新定位时间：'+timestampToTime(this.trackWinshowInfo.loc_time)"></p>
        <p v-text="'速度：'+this.trackWinshowInfo.speed+'km/h'"></p>
      </div>
    </bm-info-window>

    <!-- 比例尺 -->
    <bm-scale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-scale>

    <!-- 缩放 -->
    <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>

    <!-- 海量点 -->
    <bm-point-collection
      @click="polyWinShowOpen"
      @mouseover="mouseover"
      @mouseout="mouseout"
      :points="polylinePath"
      :color="pointColor"
      size="BMAP_POINT_SIZE_NORMAL"
    ></bm-point-collection>
  </baidu-map>
</template>
<script>
// import newPolyline from '@/components/newPolyline'
import operateFrame from '@/components/operateFrame'
import globalStores from '../stores/global-stores'
export default {
  computed: {
    carInfo () {
      return globalStores.state.carInfo
    },
    carInfoDetail () {
      return globalStores.state.carInfoDetail
    },
    projectOfEntity () {
      if (globalStores.state.projectOfEntity.length === 0) {
        return null
      }
      console.log('globalStores.state.projectOfEntity', globalStores.state.projectOfEntity)
      return globalStores.state.projectOfEntity
    }
  },
  components: {
    operateFrame
    // newPolyline
  },
  data () {
    return {
      // point 颜色
      pointColor: 'red',

      infoWindow: {
        show: false,
        contents: '这是信息窗体'
      },
      polyWinShow: false,
      clickLng: '',
      clickLat: '',

      // 构成折线的点
      polylinePath: [],
      polyClickPoint: '',

      // 起始点 & 结束点
      startPoint: '',
      endPoint: '',

      center: { lng: 0, lat: 0 },
      zoom: 3,
      isShowMarker: false,

      // 轨迹里程
      distance: 0,
      tollDistance: 0,

      // 轨迹箭头绘制
      icons: [],

      // 保存轨迹返回值的数组
      trackAllInfo: [],
      // 点击某个轨迹弹出框的信息 => 暂时保存
      trackWinshowInfo: ''
    }
  },
  mounted () {
    // this.getTrackInfo()
  },
  methods: {
    // TODO 匹配经纬度去获取对应数据

    // 海量点鼠标移入移出事件
    mouseout (e) {
      this.pointColor = 'red'
    },
    mouseover (e) {
      this.pointColor = 'blue'
    },
    // 保留小数
    keepDecimal (num, decimal) {
      return num.toFixed(decimal)
    },
    // 时间戳转换为标准日期格式
    timestampToTime (timestamp) {
      var moment = require('moment')
      // dateParams * 1000 是因为此方法用的是毫秒进行转换，会导致日期出错
      // 因此先化为毫秒制
      return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    // 查询轨迹
    selectTrack () {
      this.$refs['operateFrame'].selectTrack(this.carInfo.entity_name, this.carInfo.truck)
    },
    // operateFrame 触发的改变 center 方法
    changeCenter () {
      this.center.lng = globalStores.state.choosenLng
      this.center.lat = globalStores.state.choosenLat
      this.isShowMarker = true
    },
    // @ready 之后改变初始化 center 位置
    handler ({ BMap, map }) {
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 15

      // 轨迹箭头声明
      // var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
      //   scale: 0.5, // 图标缩放大小
      //   strokeColor: '#fff', // 设置矢量图标的线填充颜色
      //   strokeWeight: '3' // 设置线宽
      // })
      // var icons = new BMap.IconSequence(sy, '5%', '15%')
      // this.icons.push(icons)
    },
    // 处理多时间段请求拼接
    /** 计算相差时间戳 => 以递增时间戳数组作为 startTime & endTime 的变化值 */
    /** List[0, 86400, 172800...] */
    /** start↑   end↑ */
    /**        start↑   end↑ */
    handelMoreRequest (entityName, startTime, endTime) {
      // 每次发起轨迹请求时将 distance 清零
      this.distance = 0
      this.tollDistance = 0

      // 计算两天之差
      let betweenTime = endTime - startTime
      let dayTimestamp = 86400
      // 相差天数
      // math.floor 向下取整
      let day = Math.floor(betweenTime / dayTimestamp)
      // 不足一天的相差值
      let notDay = betweenTime % dayTimestamp
      // ------------------ 存放递增时间戳的数组 ------------------
      let timestamp = [0]
      for (let i = 0; i < day; i++) {
        timestamp[i + 1] = 86400 + timestamp[i]
      }
      // 如果有余数，则往递增数组中加入不足一天的余数值
      if (notDay !== 0) {
        // 最后一位时间戳 + 不足一天的时间戳
        timestamp.push(timestamp[day] + notDay)
      }

      /** ------------- 根据 timestamp 来发起相应次数的请求 ------------ */
      for (let j = 0; j < timestamp.length - 1; j++) {
        let startTimeHandel = startTime + timestamp[j]
        let endTimeHandel = startTime + timestamp[j + 1]
        this.getTrackInfo(entityName, startTimeHandel, endTimeHandel)
      }
    },
    // 获取轨迹数据
    getTrackInfo (entityName, startTime, endTime) {
      this.infoWindowClose()
      var params = {
        ak: 'HD5qKGOAdqzf7MmNCm4ZRNHPaKwGA2mQ',
        service_id: '221094',
        entity_name: entityName,
        // mcode: 'F7:E2:AD:B2:D7:04:94:F5:E9:55:B4:60:4E:50:CB:95:D9:EB:CF:A0;com.example.lieying',
        start_time: startTime,
        end_time: endTime,
        dataType: 'jsonp',
        page_size: 5000,
        // 是否开启纠偏
        is_processed: 1,
        // 纠偏选项
        process_option: {
          // denoise_grade:是否去噪 [0-5]
          denoise_grade: 0
        }
      }
      this.$jsonp('http://yingyan.baidu.com/api/v3/track/gettrack?mcode=F7:E2:AD:B2:D7:04:94:F5:E9:55:B4:60:4E:50:CB:95:D9:EB:CF:A0;com.example.lieying', params).then(res => {
        console.log('getTrackInfo', res)
        // 将全部的轨迹 points 保存 => 供遍历匹配使用
        for (let j = 0; j < res.points.length; j++) {
          this.trackAllInfo.push(res.points[j])
        }

        // 计算里程 => 轨迹查询展示用
        this.distance += res.distance
        this.tollDistance += res.toll_distance
        // 获取历史轨迹
        for (let i = 0; i < res.points.length; i++) {
          let pointTemp = {
            lng: res.points[i].longitude,
            lat: res.points[i].latitude
          }
          this.polylinePath.push(pointTemp)
          console.log('this.polylinePath', this.polylinePath)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 关闭信息窗口
    infoWindowClose (e) {
      this.infoWindow.show = false
    },
    // 打开信息窗口
    infoWindowOpen (e) {
      this.infoWindow.show = true
    },
    // 轨迹上打开信息窗口
    polyWinShowOpen (e) {
      console.log('polyWinShowOpen', e)
      // 匹配经纬度 => 弹出信息窗口
      this.matchLngLat(e)
      console.log('this.trackWinshowInfo', this.trackWinshowInfo)
      // 点击的经纬度
      this.polyClickPoint = e.point
      this.polyWinShow = true
    },
    // 匹配经纬度 => 弹出信息窗口
    matchLngLat (e) {
      for (let i = 0; i < this.trackAllInfo.length; i++) {
        if (e.point.lng === this.trackAllInfo[i].longitude && e.point.lat === this.trackAllInfo[i].latitude) {
          this.trackWinshowInfo = this.trackAllInfo[i]
        }
      }
    },
    // 轨迹上关闭信息窗口
    polyWinShowClose (e) {
      this.polyWinShow = false
    }
  }
}
</script>
<style>
.map {
  width: 100%;
  height: 100%;
}
.bmControl {
  position: absolute;
}
.operateFrame {
  margin: 20px;
}
.cityList {
  margin-left: 100px;
}
/* 信息窗体 div */
.bmInfoWindowDiv {
  font-size: 14px;
}
.trackBtn {
  width: auto;
  background-color: #1296db;
  color: #ffffff;
  border: 0;
  font-size: 12px;
  border-radius: 5px;
  height: 20px;
  float: right;
}
</style>
