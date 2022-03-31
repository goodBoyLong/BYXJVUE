<template>
  <el-menu
    class="categories"
    default-active="0"
    style="height:450px;width:200px"
    @select="handleSelect"
    active-text-color="red">
    <el-menu-item index="0">
      <i class="el-icon-menu"></i>
      <span slot="title" @click="setSid(0)">全部</span>
    </el-menu-item>
    <el-menu-item :index="item.id" v-for="item in categoryList" :key="item.id">
          <i class="el-icon-menu"></i>
      <span @click="setSid(item.id)" >{{item.name}}</span>
    </el-menu-item>
    
  </el-menu>
</template>

<script>
import Cookies from "js-cookie";
  export default {
 
    created(){
      this.setSid(0)
    },
    data(){
      return{
        sid:'',
        categoryList:[],
      }
    },
    mounted(){
      this.getAllCategory();
    },
    methods:{
      setSid(sid){
          Cookies.set("nid",sid)
      },
     async getAllCategory(){
        const{data:res} = await this.$http.post("/news/getCategory");
        console.log("getCategory");
        console.log(res.category);
        this.categoryList=res.category;
      }
    }
  }
</script>

<style scoped>
.el-menu-item {
background: rgb(218, 218, 228);
}
  .categories {
      margin-top: 83px;
  
  }
</style>

