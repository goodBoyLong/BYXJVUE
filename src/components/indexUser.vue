<template>
<div class="header">
  
<el-row>
  <el-col :span="12">
      <div class="grid-content bg-purple head01" >  
       在线商城，为你提供在线售卖平台，发现更多好玩好物！
       </div>
       </el-col>
   <el-col :span="12">
       <div class="grid-content bg-purple-light head02" v-if="username===''">
        <el-button type="info" @click="login()">登录 & 注册</el-button>
       </div>
       <div class="grid-content bg-purple-light head02" v-else>
          <el-button type="info" @click="enter()">个人中心</el-button>
          <el-button type="info" @click="logout()">退出</el-button>
       </div>
       
       </el-col>

</el-row>

 <el-divider></el-divider>  
 <div class="divc">
    <el-carousel 
   :height="dataHeight"
    :interval=3000
   
    class="logo"
    >
      <el-carousel-item  v-for="(img,index) in logos" :key="index" style="background:">
        <p>{{img.content}}</p>
      </el-carousel-item>
    </el-carousel>
 </div>
  
   <div>
    <nav-menu style="margin-top:0px" ></nav-menu>
 
    <router-view/>
  </div>


</div>


</template>

<script>
import NavMenu from "../components/common/NavMenu.vue"
import Cookies from "js-cookie";
export default {
  components:{NavMenu},
    data(){
      
        return{
          username:"",
          dataHeight:'40px',
pics: [
        { url: require('D://workspace//img//1.jpg')},
        { url:require('D://workspace//img//2.jpg')},
        { url: require('D://workspace//img//3.jpg')},
        { url: require('D://workspace//img//4.jpg')}
      ],
      logos: [
       {
         content:"你的需求就是我的需求，你的满意就是我的满意"
       },
        {
         content:"小市场大甩卖，让闲置物带回家"
       },
        {
         content:"环保购物两不误，与你相约在校园商城"
       },
      ]

        };
    },
    mounted(){
   
        this.getCookie();
    },
    methods:{
    async login(){
            this.$router.push("/login"); 
    },
    getCookie(){
      const username=Cookies.get("username");
  
      if(username!=null&&username!=undefined){
        this.username=username;
        console.log(username+"username1");
      }else{
        // this.username="notUser";
        console.log(username+"username2");
      }
    },
    enter(){
      this.$router.push("/home");
    },
    logout(){
      this.username="";
      Cookies.remove("username");
       window.sessionStorage.clear();
    
  
    
      
    }
     
       
    }
}
</script>
<style lang="less" scpoed>

.logo{
  margin-top: -28px;
  

}
.logoitem{
    background-color: rgb(36, 79, 129);
}

  .el-carousel__item:nth-child(2n) {
     background-color: white;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
.el-carousel__item p{
  
  color: #015f2b;
}

.logosClass{
padding-top: 5px;
  display:block;
  text-align:center;
}
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
.head01{
     margin-bottom: 0;
      font-family: "Montserrat", sans-serif;
      font-size: 13px;
      text-align: left;
      color: #5b5b5b;
      line-height: 40px;
}
.head02{
    float: right;
}
.el-row {
    
    margin-bottom: -20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>