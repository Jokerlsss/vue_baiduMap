<!--
 * @Author: Jokerls
 * @Date: 2020-06-04 08:35:17
 * @LastEditTime: 2020-06-04 11:00:36
 * @FilePath: \baiduMap\src\components\newPolyline.vue
-->
<script>
import commonMixin from 'vue-baidu-map/components/base/mixins/common.js'
import bindEvents from 'vue-baidu-map/components/base/bindEvent.js'
import { createPoint } from 'vue-baidu-map/components/base/factory.js'

export default {
  // 起新名字
  name: 'newPolyline',
  mixins: [commonMixin('overlay')],
  props: {
    path: {
      type: Array
    },
    // 新声明一个 icons
    icons: {
      type: Array
    },
    strokeColor: {
      type: String
    },
    strokeWeight: {
      type: Number
    },
    strokeOpacity: {
      type: Number
    },
    strokeStyle: {
      type: String
    },
    massClear: {
      type: Boolean,
      default: true
    },
    clicking: {
      type: Boolean,
      default: true
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    path: {
      handler (val, oldVal) {
        this.reload()
      },
      deep: true
    },
    strokeColor (val) {
      this.originInstance.setStrokeColor(val)
    },
    strokeOpacity (val) {
      this.originInstance.setStrokeOpacity(val)
    },
    strokeWeight (val) {
      this.originInstance.setStrokeWeight(val)
    },
    strokeStyle (val) {
      this.originInstance.setStrokeStyle(val)
    },
    editing (val) {
      val ? this.originInstance.enableEditing() : this.originInstance.disableEditing()
    },
    massClear (val) {
      val ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear()
    },
    clicking (val) {
      this.reload()
    }
  },
  methods: {
    load () {
      // 参数结构 加入 icons
      const { BMap, map, path, icons, strokeColor, strokeWeight, strokeOpacity, strokeStyle, editing, massClear, clicking } = this
      const overlay = new BMap.Polyline(path.map(item => createPoint(BMap, { lng: item.lng, lat: item.lat })), {
        strokeColor,
        strokeWeight,
        strokeOpacity,
        strokeStyle,
        // 配置 icons
        icons,
        enableEditing: editing,
        enableMassClear: massClear,
        enableClicking: clicking
      })
      this.originInstance = overlay
      map.addOverlay(overlay)
      bindEvents.call(this, overlay)
    }
  }
}
</script>
