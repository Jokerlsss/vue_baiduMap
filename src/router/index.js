import Vue from 'vue'
import Router from 'vue-router'
// import TrackMonitoring from '@/views/TrackMonitoring'
import TerminalManage from '@/views/TerminalManage'
// import HelloWorld from '@/views/HelloWorld'
import VueBaiduMap from '@/views/VueBaiduMap'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'VueBaiduMap',
      component: VueBaiduMap
    },
    {
      path: '/1',
      name: 'VueBaiduMap',
      component: VueBaiduMap
    },
    {
      path: '/2',
      name: 'TerminalManage',
      component: TerminalManage
    }
  ]
})
