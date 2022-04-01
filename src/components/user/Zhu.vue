<template>
  <div class="echart" id="mychart" :style="myChartStyle"></div>
</template>

<script>
import * as echarts from "echarts";
import Cookies from "js-cookie";
export default {
  created(){
    this.getCookie();
    this.getZC();
   
  },
  data() {
    return {
      zc:'',
      sr:'',
      uid:"",
      xData:[], //横坐标
      // xData:["2021年11","2021年12","2022年1","2022年2","2022年3","2022年4"] , //横坐标
      yData: [], //人数数据
      taskDate: [],
      myChartStyle: { float: "left", width: "100%", height: "400px" } //图表样式
    };
  },
  mounted() {
  setTimeout(this.initEcharts,200)
     this.getZC();

  },
  methods: {
      getCookie() {
      const username = Cookies.get("username");
      const uid=Cookies.get("uid");
      this.uid=uid;
      //console.log(username);
    },
     async getZC() {
      const { data: res } = await this.$http.get("/order/TJ?uid="+this.uid);
      // console.log(res.zc)
      for(var i=0;i<res.tj.length;i++){
        this.xData[i] = res.tj[i].time;
      this.yData[i]=res.tj[i].sprice;
      this.taskDate[i]=res.tj[i].zprice;
      }
      console.log(res.tj,"11");
    },
   
    initEcharts() {
      // 多列柱状图
      const mulColumnZZTData = {
        xAxis: {
          data: this.xData
        },
        // 图例
        legend: {
          data: ["收入", "支出"],
          top: "0%"
        },
        yAxis: {},
        series: [
          
          {
            type: "bar", //形状为柱状图
            data: this.yData,
            name: "收入", // legend属性
            label: {
              // 柱状图上方文本标签，默认展示数值信息
              show: true,
              position: "top"
            }
          },
          {
            type: "bar", //形状为柱状图
            data: this.taskDate,
            name: "支出", // legend属性
            label: {
              // 柱状图上方文本标签，默认展示数值信息
              show: true,
              position: "top"
            }
          }
        ]
      };
      const myChart = echarts.init(document.getElementById("mychart"));
      
      myChart.setOption(mulColumnZZTData);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    }
  }
};
</script>
<style scoped lang="less" scoped>
.echart{
  margin-top: 100px;
}
</style>

