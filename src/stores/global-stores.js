/*
 * @Author: Jokerls
 * @Date: 2020-05-28 11:31:53
 * @LastEditTime: 2020-06-05 08:51:09
 * @FilePath: \baiduMap\src\stores\global-stores.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
/* eslint-disable */
export default new Vuex.Store({
    // 项目筛选按钮状态
    state: {
        // 浏览器高度
        clientHeight: '',
        // 选择车辆的经纬度
        choosenLng: '',
        choosenLat: '',
        // 选择车辆的信息 => 百度API
        carInfo: '',
        // 选择车辆的信息 => 公司API
        carInfoDetail: '',
        // 当前路由缓存地址
        currentPageRouter: '',
        // 某工程相关的所有终端
        projectOfEntity: []
    },
    mutations: {
        // 重新搜索时，清空某工程相关的所有终端
        clearProjectOfEntity: (state) => {
            state.projectOfEntity = []
        },
        // 某工程相关的所有终端
        pushProjectOfEntity: (state, entity) => {
            state.projectOfEntity.push(entity)
        },
        // 记录刷新前的缓存路由地址
        cutCurrentPageRouter: (state, index) => {
            state.currentPageRouter = index
        },
        // 获取选择车辆的详细信息 => 百度API
        set_carInfo: (state, carInfo) => {
            state.carInfo = carInfo
            // console.log('state.carInfo', state.carInfo)
        },
        // 获取选择车辆的详细信息 => 公司API
        set_carInfoDetail: (state, carInfoDetail) => {
            state.carInfoDetail = carInfoDetail
        },
        // 清空汽车详细信息
        clearCarInfoDetail: (state) => {
            state.carInfoDetail = ''
        },
        // 改变选择车辆的经纬度
        set_choosenLng: (state, choosenLng) => {
            state.choosenLng = choosenLng
            // console.log('state.choosenLng', state.choosenLng)
        },
        set_choosenLat: (state, choosenLat) => {
            state.choosenLat = choosenLat
            // console.log('state.choosenLat', state.choosenLat)
        },
        // 获取浏览器高度
        set_clientHeight: (state, clientHeight) => {
            state.clientHeight = clientHeight
        },
        // 项目页面-切换成列表形式
        cutPage: (state, page) => {
            var stockIn = '1-1-1'
            var inventory = '2-1-1'
            var stockOut = 3
            if (page === stockIn) {
                state.currentPage = '入库单汇总'
            } else if (page === inventory) {
                state.currentPage = '库存'
            } else if (page === stockOut) {
                state.currentPage = '出库单汇总'
            }
            // 记录刷新前的缓存路由地址
            state.currentPageRouter = page
        }
    }
})
