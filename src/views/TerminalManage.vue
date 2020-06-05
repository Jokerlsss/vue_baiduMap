<!--
 * @Author: Jokerls
 * @Date: 2020-05-28 10:28:02
 * @LastEditTime: 2020-06-05 10:12:21
 * @FilePath: \baiduMap\src\views\TerminalManage.vue
-->
<template>
  <div class="container">
    <!-- 终端搜索框 -->
    <el-input placeholder="请输入内容" v-model="monitoringSearchInput" class="el-input-inner" clearable>
      <el-button slot="append" icon="el-icon-search" @click="searchEvent_Entity"></el-button>
    </el-input>

    <!-- 终端展示表格 -->
    <div class="tableDiv">
      <el-table
        :data="EntityList"
        border
        style="width: 100%;margin-bottom:10px"
        :header-cell-style="headerCellStyle"
      >
        <el-table-column prop="num" label="运单号"></el-table-column>
        <el-table-column prop="project" label="工程名称" width="400"></el-table-column>
        <el-table-column prop="truck" label="车牌号"></el-table-column>
        <el-table-column prop="address" label="卸货地址"></el-table-column>
        <el-table-column prop="man" label="承运人"></el-table-column>
        <el-table-column prop="mobile" label="承运人手机号"></el-table-column>
        <el-table-column prop="delivery" label="发货时间"></el-table-column>
        <el-table-column prop="arrival" label="预计到货时间"></el-table-column>
        <el-table-column prop="modify_time" label="最后定位时间"></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      class="el-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="entityCurrentPage"
      :page-size="entityPageSize"
      background
      layout="total,  prev, pager, next, jumper"
      :total="entityTotal"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 每页展示条数
      entityPageSize: 15,
      // 总条目数
      entityTotal: 0,
      // 当前页数
      entityCurrentPage: 1,
      headerCellStyle: {
        'background-color': '#1296DB',
        'color': '#fff',
        'text-align': 'center'
      },
      EntityList: [],
      latestLocationList: ''
    }
  },
  mounted () {
    this.getEntity()
  },
  methods: {
    handleCurrentChange (val) {
      console.log(val)
      this.entityCurrentPage = val
      this.getEntity()
    },
    getEntity () {
      var params = {
        ak: 'HD5qKGOAdqzf7MmNCm4ZRNHPaKwGA2mQ',
        service_id: '221094',
        dataType: 'jsonp',
        page_size: this.entityPageSize,
        page_index: this.entityCurrentPage
      }
      this.$jsonp('http://yingyan.baidu.com/api/v3/entity/list?mcode=F7:E2:AD:B2:D7:04:94:F5:E9:55:B4:60:4E:50:CB:95:D9:EB:CF:A0;com.example.lieying', params).then(res => {
        // 每次发起新请求（换页）=> 清空原先数组
        this.EntityList = []
        // 对数组进行分割
        for (let i = 0; i < res.entities.length; i++) {
          let list = this.carInfoSplit(res.entities[i])
          this.EntityList.push(list)
        }

        console.log('entity_res', this.EntityList)
        this.entityTotal = res.total
      })
    },
    // 汽车信息字符串分割，返回新的数组 => 百度API
    carInfoSplit (paramsList) {
      // ---------------------- 分割、赋值 --------------------------
      // 若返回值为 undefined，则将其数据改为 “无”
      // console.log('paramsList.address_delivery_arrival', paramsList.address_delivery_arrival)

      // 卸货地址 + 发货日期 + 到货日期
      let addressDeliveryArrival = paramsList.address_delivery_arrival === undefined ? '无#无#无' : paramsList.address_delivery_arrival
      let addressDeliveryArrivalArray = addressDeliveryArrival.split('#')

      let address = addressDeliveryArrivalArray[0]
      let delivery = addressDeliveryArrivalArray[1]
      let arrival = addressDeliveryArrivalArray[2]
      // 承运人 + 承运人电话 + 车牌号
      let manMobileTruck = paramsList.man_mobile_truck === undefined ? '无#无#无' : paramsList.man_mobile_truck
      let manMobileTruckArray = manMobileTruck.split('#')

      let man = manMobileTruckArray[0]
      let mobile = manMobileTruckArray[1]
      let truck = manMobileTruckArray[2]
      // 运单号 + 工程名
      let numProject = paramsList.num_project === undefined ? '无#无#无' : paramsList.num_project
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
    }
  },
  components: {
  }
}
</script>

<style scoped>
.container {
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 40px;
  margin-right: 40px;
  font-family: PingFang SC;
}
.el-input-inner {
  width: 300px;
  margin-bottom: 10px;
}
.tableDiv {
  width: 100%;
  height: 779px;
}
.el-pagination {
  float: right;
}
</style>
