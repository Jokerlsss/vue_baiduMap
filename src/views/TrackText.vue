<template>
  <div class="page">
    <!-- header -->
    <mt-header fixed title="地图详情">
      <mt-button icon="back" slot="left" @click="backPage()"></mt-button>
    </mt-header>
    <div id="allmap" style></div>
  </div>
</template>

<script>
import Tokens from "../../token";
import { MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      doId: '',
      pointAllArr: [], // 坐标数组, 用于划线
    };
  },
  methods: {
    go (link, param) {
      let self = this;
      this.$transfer.go(self, link, param);
    },
    back (link, param) {
      let self = this;
      this.$transfer.back(self, link, param);
    },
    backPage () {//返回哪个页面
      let self = this;
      let backPath = Tokens.fetch(dbType + "CTPdynamicMapBackPath");
      self.back(backPath);
    },
    theLocationWay () {
      setTimeout(() => {
        // 百度地图API功能
        let map = new BMap.Map('allmap'); // 创建Map实例
        //清除覆盖物
        map.clearOverlays();
        map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 11);
        // map.centerAndZoom("中国", 5); // 地图创建完成后显示的地方
        map.enableScrollWheelZoom(true);// 开启鼠标滚轮缩放
        // 放大系数为18
        map.setZoom(map.getZoom());
        /** 画出运动轨迹 */
        let pointArr = [];   // 坐标数组, 用于划线 维度lat，经度lng
        let pointEnd = null; // 最后的点 point
        // TODO v、i 分别代表什么？
        // TODO lan、lat 分别代表什么？ =>  lat 纬度，lng 经度
        this.pointAllArr.map((v, i) => {
          let point = new BMap.Point(v.lng, v.lat);
          pointArr.push(point);
          // TODO 为什么需要 -1 ？
          if (i === this.pointAllArr.length - 1) {
            // 根据经纬度画出最后到达的点
            pointEnd = new BMap.Point(v.lng, v.lat);
          }
        })
        let polyline = new BMap.Polyline(pointArr, {
          strokeColor: "#FE595D",
          strokeWeight: 6,
          strokeOpacity: 0.5
        });
        // 画出运动轨迹
        map.addOverlay(polyline);

        // map.centerAndZoom(pointEnd, 10); // 让最后的点显示在屏幕正中心
        map.setViewport(pointArr);// 根据提供的地理区域或坐标设置地图视野，调整后的视野会保证包含提供的地理区域或坐标
        // 最后的点--带文字标签的覆盖物
        let marker = new BMap.Marker(pointEnd); // 创建点
        map.addOverlay(marker);                 // 加载标注
        let label = new BMap.Label("当前位置", { offset: new BMap.Size(20, -10) });
        marker.setLabel(label);
      }, 1000);
    },
    getMapData () {
      // 获取地图定位数据
      let query = {
        action: "/gps/queryGPS ",
        params: {
          doId: this.doId,
        }
      }
      this.$Indicator.open();
      doAjaxQuery(query, (data) => {

        if (data[0].state == 0) {
          this.$Indicator.close();
          MessageBox.alert('暂时无GPS数据信息').then(action => {
            this.backPage();
          });
          return false;
        } else if (data[0].state == 1) {
          this.$Indicator.close();
          let newArr = data[0].data;
          this.pointAllArr = newArr;
          this.theLocationWay();
        }
      });
    },

  },
  beforeRouteEnter (to, from, next) {
    // 进入页面
    next(vm => {
      vm.doId = vm.$route.query.doId;
      if (from) {
        Tokens.save(dbType + "CTPdynamicMapBackPath", from.fullPath);
      }
      vm.getMapData();

    });
  },
  beforeRouteLeave (to, from, next) {
    // 离开页面
    next();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page,
#allmap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  font-family: '微软雅黑';
}
</style>
