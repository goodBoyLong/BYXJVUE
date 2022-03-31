<template>

  <el-container>
     <el-header> <index-user style="margin-bottom:100px"></index-user></el-header>
  
  <el-main>
     <notice-temp class="news"></notice-temp>
 </el-main>
  </el-container>
</template>

<script>
  
  import SideMenu from '../common/SideMenu'
import IndexUser from '../indexUser.vue'
import NoticeTemp from '../common/NoticeTemp'
  export default {
      
    components: {SideMenu,IndexUser,NoticeTemp}
  }
</script>

<style scoped>

</style>

