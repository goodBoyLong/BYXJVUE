<template>

  <el-container  style="">
   <el-header><index-user style="margin-bottom:120px">


   </index-user>
         </el-header>
 
    <el-main style="margin-top:59px">
      <div class="search">
 
    <input
      v-model="inputValue"
      @input="inputFunc"
      type="text"
      placeholder="请输入商品名"
    >
    <div v-show="isShow">
      <div
        v-for="(item,index) in searchData"
        :key="index"
      >
      <span style="background:white" v-html="brightenKeyword(item.comname, inputValue)" @click="showInfo(item.id)"></span>
      </div>
    </div>



      </div>
     <el-carousel 
    type="card"
    :interval=3000
    class="carousel"
    >
      <el-carousel-item v-for="(img,index) in pics" :key="index" >
        <img :src="img.url" width="100%" height="100%">
      </el-carousel-item>
    </el-carousel>

        <h3 >销售商品</h3>
     <clist v-bind:type="1"></clist>
      
  </el-main>
   <el-main>  
     <el-carousel 
    type="card"
    :interval=3000
    class="carousel"
    >
      <el-carousel-item v-for="(img,index) in pics1" :key="index">
        <img :src="img.url" width="100%" height="100%">
      </el-carousel-item>
    </el-carousel>
     <h3>推荐物品</h3>
     <clist v-bind:type="2"></clist>
    </el-main>

         
    <el-main>
<el-carousel 
    type="card"
    :interval=3000
    class="carousel"
    >
      <el-carousel-item v-for="(img,index) in pics2" :key="index">
        <img :src="img.url" width="100%" height="100%">
      </el-carousel-item>
    </el-carousel>
 <h3>网站公告</h3>
<br>
      <notice-temp style="margin-top:20px"></notice-temp>
    </el-main>
  </el-container>
</template>

<script>
  

import IndexUser from '../indexUser.vue'
import Cookies from "js-cookie";
import Clist from '../common/CListTemp.vue'
import NoticeTemp from '../common/NoticeTemp.vue'
  export default {
      created(){
          this.getList();
        this.showNotice();
        this.getParams();
      },
    components: {IndexUser,Clist,NoticeTemp},
    data(){
      return{
         list:[],
         keyWords: '',
              inputValue: "",//输入框中的内容
      isShow: false,//控制搜索的问题显示隐藏
         keyWords: '',
      results: "",
        showNotice1:true,
        logos: [
       {
         content:"你的需求就是我的需求，你的满意就是我的满意"
       },
        {
         content:"小市场大甩卖，把心仪物带回家"
       },
        {
         content:"环保购物两不误，与你相约在在线商城"
       },
      ],
pics: [
        { url: require('D://workspace//img//d1.jpg')},
        { url:require('D://workspace//img//d2.jpg')},
        { url: require('D://workspace//img//d3.jpg')},
      ],
      pics1: [
        { url: require('D://workspace//img//d4.jpg')},
        { url:require('D://workspace//img//d5.jpg')},
        { url: require('D://workspace//img//d6.jpg')},
      ],
      pics2: [
        { url: require('D://workspace//img//d7.jpg')},
        { url:require('D://workspace//img//d8.jpg')},
        { url: require('D://workspace//img//d9.jpg')},
      ],
      }
      
    },
            computed: {
	searchData() {
      const _this = this
      const fuzzyQueryList = []
      this.list.forEach(function (item) {
        // map filter some 都可以
        if (item.comname.indexOf(_this.inputValue) > -1) {
          fuzzyQueryList.push(item)
        }
      })
      return fuzzyQueryList

    }
},

    methods:{
          async getList(){
          const {data:res} = await this.$http.get("/commodity/getAll");
          this.list=res.list;
      },
           //监听输入事件，当input中有内容时，下面的搜索列表显示出来
    inputFunc () {
      if (this.inputValue.length > 0) {
        this.isShow = true;
      } else {
        this.isShow = false
      }
    },
        showInfo(itemId){
         this.$router.push({path:"/carInfo",query:{id:itemId}});
         window.location.reload()
      },
        brightenKeyword(val, keyword) {
       const Reg = new RegExp(keyword, 'i');
       if (val) {
          const res = val.replace(Reg, `<span style="color: red;">${keyword}</span>`);
             // console.log(res); 
             return res;
       }
   },
      getParams(){
        var url = window.location.href;
        let params = url.substr(url.lastIndexOf("?") + 1).split("&");
        for (let i = 0; i < params.length; i++) {
let param = params[i];
let key = param.split("=")[0];
let value = param.split("=")[1];

if(key==="out_trade_no"){
  alert(value)
}
        }

      },
      showNotice(){
      
  const num=Cookies.get("num");
       if(num==1){
          this.$notify({
          title: '温馨提示',
           dangerouslyUseHTMLString: true,
         
          message: 
          '<p style="font-size:12px">1.应去医药品类务室或者正规药店购买，不可放在这里买卖，属于违禁品，否则后果自负，轻者由学校处置，重者承担相关法律责任。</p><br/>'+
          '<p style="font-size:12px">2.买家发现商品与实物不符，可无理由退货退款。但商品本身没有缺陷，不可恶意退货退款，必须与卖家协商同意</p><br/>'+
          '<p style="font-size:12px">3.针对买家购买后突然不想要，在没有损坏、不影响二次销售的情况下，可退货退款</p><br/>'+
          '<p style="font-size:12px">4.针对资源共享，遵循的是资源的有效利用，不可额外收费。</p><br/>'+
          '<p style="font-size:12px">5.针对公告，不可发布低俗虚假公告，共同维护网络文明</p><br/>'+
          '<p style="font-size:12px">6.身为大学生，应该展示该有的素质，遵循你情我愿、理智购物、文明买卖规则。</p><br/>',
             type: 'warning',
        });
       Cookies.set("num",2)
       }
      },
      clearTimer () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
   async handleQuery (event) {
      this.clearTimer()
      console.log(event.timeStamp)
      this.timer = setTimeout(() => {
        console.log(event.timeStamp)
        // console.log(this.lastTime)
        // if (this.lastTime - event.timeStamp === 0) {
          // const {data:res} = await this.$http.post("/index/searchComm",);
        this.$http.post('/commodity/searchComm',{
          comname:this.keyWords
        }).then(res => {
        //  alert(res.clist)
          this.results=res.clist;
          console.log(res.clist.get(0))
        })
        // }
      }, 2000)
    },
 
  


    }
  }
</script>

<style scoped>
  .search{
     position:absolute;
     z-index: 5;
      margin-top: -50px;
      margin-right: 100px;
     margin-left: 800px;
    }
.logo{
  height: 20px;
}
.carousel{
  background: rgb(201, 191, 191);
}
h3{
     height: 20px;
    margin-bottom: -80px;
    margin-top: 20px;
    color: rebeccapurple;
}
</style>

