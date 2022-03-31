<template>
  <el-menu
    class="categories"
    default-active="0"
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
    name: 'SideMenu',
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
          Cookies.set("sid",sid)
      },
     async getAllCategory(){
        const{data:res} = await this.$http.post("/index/getAllCategory");
        console.log("getAllCategory");
        console.log(res.category);
        this.categoryList=res.category;
      }
    }
  }
</script>

<style scoped>
.el-menu-item {
background: rgb(208, 208, 219);
}
  .categories {
      margin-top: 105px;
  }
</style>

