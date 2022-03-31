<template>

  <el-container style="margin-top:-42px">
      
    <el-aside style="width: 200px;">
      <switch></switch>
      <SideMenu @click.native="getSid"></SideMenu>
    </el-aside>
    <el-main>
      <commodity class="books-area" v-bind:carList="carList"></commodity>
    </el-main>
  </el-container>
</template>

<script>
  import Commodity from './Commodity.vue'
  import SideMenu from '../common/SideMenu'
import IndexUser from '../indexUser.vue'
import Cookies from "js-cookie";
  export default {
    name:"clist",
     created(){
        this.getCookie();
this.getSid1(0);

     },
    components: {SideMenu,IndexUser,Commodity},
    data(){
        return{
          sid:0,
          carList:[],
          queryForm:{
            cid:'',
            type:'',
          },
          concernForm:{
            cid:'',
            uid:'',
          }
        }
    },
    props:{
      type:{
        type:Number,
        require:true
      }
    },
     mounted() {
        this,getCookie();
  getSid();

  },
    methods:{
         getCookie(){
     
      const uid=Cookies.get("uid");
      this.concernForm.uid=uid;

  
   
    },
      async getSid1(){
        this.queryForm.cid=0;
        this.concernForm.cid=0;
        this.queryForm.type=this.type;
        if(this.type==1){
          const {data:res}= await this.$http.post("/index/getAllCar",this.queryForm);
              this.carList=res.carList;
        }else{
             const uid=Cookies.get("uid");
      this.concernForm.uid=uid;
          const {data:res}= await this.$http.post("/commodity/getMyLove",this.concernForm);
              this.carList=res.carList;
        }
     
      
      },
      async getSid(){
      
 const sid= Cookies.get("sid");

        this.sid=sid;
      
        this.queryForm.cid=sid;
          this.concernForm.cid=sid;
        this.queryForm.type=this.type;
          console.log(this.queryForm.cid+"this.queryForm")
           if(this.type==1){
          const {data:res}= await this.$http.post("/index/getAllCar",this.queryForm);
              this.carList=res.carList;
        }else{
             const uid=Cookies.get("uid");
      this.concernForm.uid=uid;
          const {data:res}= await this.$http.post("/commodity/getMyLove",this.concernForm);
              this.carList=res.carList;
        }
     
          this.carList=res.carList;
          console.log("111");
          console.log(this.carList);
      },
     
    }
  }
</script>

<style scoped>
 .books-area {
   background: rgb(194, 209, 194);
    width: 1065px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 93px;
    margin-left: 20px;
  }
</style>

