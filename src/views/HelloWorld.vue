<template>
  <div class="baidumap" :style="{height:mapHeight}" id="allmap"></div>
</template>

<script>
import { MP } from '@/common/map.js'
// import globalStore from '../stores/global-stores'
export default {
  computed: {
    // mapHeight () {
    //   console.log('globalStore.state.clientHeight', globalStore.state.clientHeight)
    //   const height = globalStore.state.clientHeight - 60 + 'px'
    //   return height
    // }
  },
  name: 'Bmap',
  components: {

  },
  data () {
    return {
      ak: 'AYn9SKWfe4VkrFxywtADGVteISl6OULF',
      startPoint: '',
      endPoint: '',
      pointsArrGet: ''
      // mapHeight: '500px'
    }
  },
  created () {
    this.getTrackInfo()
    // this.$nextTick(() => {
    //   var _this = this
    //   MP(_this.ak).then(BMap => {
    //     this.baiduMap(BMap)
    //   })
    // })
    console.log('created')
  },
  mounted () {
    // this.getTrackInfo()
    console.log('mounted')
    this.$nextTick(() => {
      var _this = this
      console.log('mounted.nextTick')
      MP(_this.ak).then(BMap => {
        console.log('mounted.MP')
        this.baiduMap(BMap)
      })
    })
  },
  methods: {
    // 获取轨迹信息
    getTrackInfo () {
      var params = {
        ak: 'HD5qKGOAdqzf7MmNCm4ZRNHPaKwGA2mQ',
        service_id: '221094',
        entity_name: '爱上你是我的错',
        // mcode: 'F7:E2:AD:B2:D7:04:94:F5:E9:55:B4:60:4E:50:CB:95:D9:EB:CF:A0;com.example.lieying',
        start_time: 1589904000,
        end_time: 1589990400,
        dataType: 'jsonp',
        page_size: 5000
      }
      console.log(params)
      this.$jsonp('http://yingyan.baidu.com/api/v3/track/gettrack?mcode=F7:E2:AD:B2:D7:04:94:F5:E9:55:B4:60:4E:50:CB:95:D9:EB:CF:A0;com.example.lieying', params).then(res => {
        console.log('res', res)
        this.startPoint = res.start_point
        this.endPoint = res.end_point

        // 获取历史轨迹
        this.pointsArrGet = res.points
      }).catch(err => {
        console.log('err', err)
      })
    },
    /** 生成 baidu 地图 */
    baiduMap (BMap) {
      var map = new BMap.Map('allmap')

      var startPoint = new BMap.Point(this.startPoint.longitude, this.startPoint.latitude) // 创建点坐标
      var endPoint = new BMap.Point(this.endPoint.longitude, this.endPoint.latitude) // 创建点坐标

      map.centerAndZoom(startPoint, 16) // 初始化地图，设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放

      map.addControl(new BMap.NavigationControl())
      map.addControl(new BMap.ScaleControl())
      map.addControl(new BMap.OverviewMapControl())
      map.addControl(new BMap.MapTypeControl())
      // map.setMapStyle({ style: 'midnight' }) // 地图风格

      var startMarker = new window.BMap.Marker(startPoint) // 创建起点标注
      var endMarker = new window.BMap.Marker(endPoint) // 创建终点标注

      map.addOverlay(startMarker) // 将起始标注添加到地图中
      map.addOverlay(endMarker) // 将结束标注添加到地图中

      /** ***************** 点击 => 弹出提示信息窗口 *******************/

      // 鼠标单击事件
      map.addEventListener('click', function (e) {
        // alert('纬度:' + e.Ag.lat + ';经度:' + e.Ag.lng)
        var opts = {
          // 信息窗口宽度
          width: 250,
          // 信息窗口高度
          height: 100,
          // 信息窗口标题
          title: '车辆信息'
        }
        var infoWindow = new BMap.InfoWindow('经度:' + e.Ag.lng + '\n纬度:' + e.Ag.lat, opts)
        // 创建点击位置的坐标 => 在哪里点击就在哪里打开
        var clickPoint = new BMap.Point(e.Ag.lng, e.Ag.lat)
        // map.openInfoWindow(infoWindow, map.getCenter()) => 信息框永远在界面的中间打开
        map.openInfoWindow(infoWindow, clickPoint)
      })

      // 创建轨迹
      let polyline = this.polylineDraw(this.pointsArrGet, BMap)
      // 增加折线
      map.addOverlay(polyline)

      // 鼠标移上标注点要发生的事
      // marker.addEventListener('mouseover', function () {
      //   this.openInfoWindow(infoWindow)
      // })

      // 鼠标移开标注点要发生的事
      // marker.addEventListener('mouseout', function () {
      //   this.closeInfoWindow(infoWindow)
      // })
    },
    /** ******** 创建轨迹 *********/
    polylineDraw (pointsArr, BMap) {
      // 声明：轨迹经纬度数组
      let temp = []
      for (let i = 1; i < pointsArr.length - 1; i++) {
        let point = new BMap.Point(pointsArr[i].longitude, pointsArr[i].latitude)
        temp.push(point)
      }
      // 声明折线所经过的经纬度
      let polyline = new BMap.Polyline(temp, { strokeColor: 'blue', strokeWeight: 6, strokeOpacity: 0.5 })
      return polyline
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html {
  /* height: 100%; */
}
body {
  /* height: 100%; */
  margin: 0px;
  padding: 0px;
}
.baidumap {
  width: 100%;
  padding: 0;
  height: 100%;
  position: relative;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

/* 去除百度地图版权那行字 和 百度logo */
.baidumap > .BMap_cpyCtrl {
  display: none !important;
}
.baidumap > .anchorBL {
  display: none !important;
}
</style>
