// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
// jsonp
import VueJsonp from 'vue-jsonp'

// Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// vue-baidu-map
import BaiduMap from 'vue-baidu-map'
// vxe-table
// import VXETable from 'vxe-table'
// import 'xe-utils'
// import 'vxe-table/lib/index.css'

// Vue.use(VXETable)
Vue.use(BaiduMap, {
  ak: 'AYn9SKWfe4VkrFxywtADGVteISl6OULF'
})

Vue.use(VueJsonp)

Vue.config.productionTip = false

Vue.prototype.$http = axios

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
