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
import Clist from '../common/CListTemp.vue'

  export default {
      
    components: {Clist,IndexUser},
     data(){
        return{
          
          type:"2",
        }
    },
  }
</script>

<style scoped>

</style>

