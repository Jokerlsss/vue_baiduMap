<!--
 * @Author: Jokerls
 * @Date: 2020-05-23 10:36:19
 * @LastEditTime: 2020-06-02 10:25:53
 * @FilePath: \baiduMap\src\App.vue
-->
<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          active-text-color="#1296DB"
          router
        >
          <el-menu-item index="1">轨迹监控</el-menu-item>
          <el-menu-item index="2">终端管理</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import '//api.map.baidu.com/api?v=2.0&ak=AYn9SKWfe4VkrFxywtADGVteISl6OULF'
import globalStore from '@/stores/global-stores'
export default {
  name: 'App',
  data () {
    return {
      // 默认进入的 index
      activeIndex: '1',

      // 轨迹监控的 index
      trackMonitoringIndex: '1'
    }
  },
  created () {
    const clientHeight = `${document.documentElement.clientHeight}`
    globalStore.commit('set_clientHeight', clientHeight)
  },
  mounted () {
    // window.onresize => 监听窗体变化
    window.onresize = function () {
      const clientHeight = `${document.documentElement.clientHeight}`
      globalStore.commit('set_clientHeight', clientHeight)
    }
  },
  methods: {
    handleSelect (index) {
      if (index === this.trackMonitoringIndex) {
        // 触发子组件 => 生成地图的方法
        // ? 无法定义 ref
      }
    }
  }
}
</script>
<style>
html,
body,
#app {
  padding: 0;
  margin: 0;
  height: 100%;
}
.el-container {
  height: 100%;
  /* 外部间距为 0  */
  margin: 0;
  /* 设置内部填充为 0 ，布局元素之间没有间距 */
  padding: 0;
}

.el-header {
  /* border-bottom: 1px solid #9898a0; */
  height: 60px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
}

.el-aside {
  background-color: #2b303b;
  color: #333;
}

.el-main {
  background-color: #e9eef3;
  padding: 0;
}
/** 菜单栏样式 */
.el-menu-demo {
}
</style>
