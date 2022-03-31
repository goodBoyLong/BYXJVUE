<template>

  <el-container>
      <el-header><index-user style="margin-bottom:100px"></index-user></el-header>
<el-main>
  <clist v-bind:type="type"></clist>
</el-main>
  </el-container>
</template>

<script>

import IndexUser from '../indexUser.vue'
import Cookies from "js-cookie";
import Clist from '../common/CListTemp.vue'
  export default {
     created(){
this.getSid1(0)
this. getParams()
     },
    components: {Clist,IndexUser},
    data(){
        return{
          sid:0,
          carList:[],
          type:1,
        }
    },
     mounted() {
  getSid();
  },
    methods:{
         async  getParams(){
        var url = window.location.href;
        let params = url.substr(url.lastIndexOf("?") + 1).split("&");
        for (let i = 0; i < params.length; i++) {
let param = params[i];
let key = param.split("=")[0];
let value = param.split("=")[1];
const a=false;
if(key==="out_trade_no"){
a=true
}
if(a){


        var url = window.location.href;
        let params = url.substr(url.lastIndexOf("?") + 1).split("&");
        for (let i = 0; i < params.length; i++) {
let param = params[i];
let key = param.split("=")[0];
let value = param.split("=")[1];

if(key==="out_trade_no"){
  
   const {data:res} = await this.$http.get("/order/update11?oid="+value);
       if(res.code==200){
             this.$message({
                    message: '支付成功',
                    type: 'success'
                   
                   });
          }

}
     
    


        }
}   
        }

      },
      async getSid1(){
const {data:res}= await this.$http.get("/index/getAllCar?id="+0);
     
          this.carList=res.carList;
      },
      async getSid(){
      
 const sid= Cookies.get("sid");

        this.sid=sid;
        console.log(this.sid+"sid")
          const {data:res}= await this.$http.get("/index/getAllCar?id="+sid);
     
          this.carList=res.carList;
          console.log("111");
          console.log(this.carList);
      },
     
    }
  }
</script>

<style scoped>
 .books-area {
width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
</style>

