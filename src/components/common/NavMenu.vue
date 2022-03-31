<template>

  <el-container>
  

    <el-menu
      :default-active="currentPath"
      router
      mode="horizontal"
      background-color="gray"
      text-color="#222"
      active-text-color="red"
     
      style="min-width: 1300px;padding-left:50px;">

      <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name" >
        {{ item.navItem }}
      </el-menu-item>
      
 
      
      

    </el-menu>
      <el-main>
          <!-- 路由在这里展示 -->
          <router-view></router-view>
        </el-main>
  </el-container>
  
</template>

<script>
import Welcome from "../Welcome.vue"
  export default {
    components:{Welcome},
    name: 'NavMenu',
    data () {
      return {
        
        navList: [
          {name: '/indexCar', navItem: '首页'},
          {name: '/commodityList1', navItem: '商品清单'},
                {name: '/aboutUs', navItem: '我的收藏'},
          {name: '/notice', navItem: '网站公告'},
    
        ],
        keywords: ''
      }
    },
    computed: {
      hoverBackground () {
        return '#ffd04b'
      },
      currentPath () {
        var x = this.$route.path.indexOf('/', 1)
      console.log(this.$route.path)
        console.log(x+"ddd")
        if (x !== -1) {
          
          return this.$route.path.substring(0, x)
        } else {
          return this.$route.path
        }
      }
    }
  }
</script>

<style scoped>
 
  a{
    text-decoration: none;
  }

  span {
    pointer-events: none;
  }
  .logopos{
    position: absolute;

}

</style>
