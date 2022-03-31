<template>

  <el-container style="margin-top:-20px">
      
    <!-- <el-aside style="width: 200px;height:600px">
      <switch></switch>
      <news-menu @click.native="getSid"></news-menu>
    </el-aside> -->
    <el-main>
      <news class="books-area" v-bind:newsList="newsList"></news>
    </el-main>
  </el-container>
</template>

<script>
import News from '../common/News.vue'

  import NewsMenu from '../common/NewsMenu'
import IndexUser from '../indexUser.vue'
import Cookies from "js-cookie";

  export default {
   
     created(){
this.getSid1(0)
     },
    components: {NewsMenu,IndexUser,News, NewsMenu},
    data(){
        return{
          sid:0,
          newsList:[],
        
            cid:'',
       
          
        }
    },
    props:{
      type:{
        type:Number,
        require:true
      }
    },
     mounted() {
  getSid();
  },
    methods:{
      async getSid1(){
        this.cid=0;
       
const {data:res}= await this.$http.get("/news/getByCid?cid="+this.cid);
     
          this.newsList=res.newsList;
      },
      async getSid(){
      
 const sid= Cookies.get("nid");

        this.sid=sid;
      
        this.cid=sid;
      
          
          const {data:res}= await this.$http.get("/news/getByCid?cid="+this.cid);
     
          this.newsList=res.newsList;
          console.log("111");
     
      },
     
    }
  }
</script>

<style scoped>
 .books-area {
   background: rgb(211, 218, 211);
    width: 150%;
  
    margin-right: auto;
    margin-top: 110px;
    padding-left: -50px;
  }
</style>

