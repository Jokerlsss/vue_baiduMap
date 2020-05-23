<template>
  <div class="baidumap" id="allmap"></div>
</template>

<script>
import { MP } from '@/common/map.js'
export default {
  name: 'Bmap',
  components: {

  },
  data () {
    return {
      ak: 'AYn9SKWfe4VkrFxywtADGVteISl6OULF'
    }
  },
  mounted () {
    this.$nextTick(() => {
      var _this = this
      MP(_this.ak).then(BMap => {
        this.baiduMap(BMap)
      })
    })
  },
  methods: {
    baiduMap (BMap) {
      var map = new BMap.Map('allmap')

      var point = new BMap.Point(115.043096, 38.592132) // 创建点坐标
      map.centerAndZoom(point, 12) // 初始化地图，设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放

      map.addControl(new BMap.NavigationControl())
      map.addControl(new BMap.ScaleControl())
      map.addControl(new BMap.OverviewMapControl())
      map.addControl(new BMap.MapTypeControl())
      // map.setMapStyle({ style: 'midnight' }) // 地图风格

      var marker = new window.BMap.Marker(point) // 创建标注
      map.addOverlay(marker) // 将标注添加到地图中

      // 提示信息
      var infoWindow = new BMap.InfoWindow('这是提示信息')
      // 鼠标移上标注点要发生的事
      marker.addEventListener('mouseover', function () {
        this.openInfoWindow(infoWindow)
      })

      // 鼠标移开标注点要发生的事
      marker.addEventListener('mouseout', function () {
        // this.closeInfoWindow(infoWindow)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.baidumap {
  width: 100%;
  height: 100%;
  border: 1px solid red;
  position: absolute;
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
