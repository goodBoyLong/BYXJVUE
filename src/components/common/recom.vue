<template>
  <div>
    <el-row style="height: 480px;padding-left:40px;margin-top:-20x">
      <!--<search-bar></search-bar>-->
   
       
        <el-card
          style="width: 135px;margin-bottom: 20px;height: 200px;float: left;margin-right: 15px"
          class="book"
          bodyStyle="padding:10px"
          shadow="hover"
          
          v-for="item in  carList.slice((currentPage-1)*PageSize,currentPage*PageSize)"
      
        :key="item.id"
        >
          <div class="cover">
            <img
              :src="require('D://workspace//img//' + item.img+'.jpg')"
             
              alt="封面"
              @click="showInfo(item.id)"
            />
          </div>
          <div class="info">
            <div class="title">
              <a href="">{{ item.cid }}</a>
            </div>
          </div>
          <div class="author">{{ item.comname }}</div>
        </el-card>
    
    </el-row>
      <div class="tabListPage">
           <el-pagination @size-change="handleSizeChange" 
                          @current-change="handleCurrentChange" 
                          :current-page="currentPage" 
                          :page-sizes="pageSizes" 
                          :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" 
                          :total="totalCount">
             </el-pagination>
       </div>

  </div>
</template>

<script>

export default {
  created() {
this.getList();
  },

  data() {
    return{
       // 总数据
           tableData:[],
           // 默认显示第几页
           currentPage:1,
           // 总条数，根据接口获取数据长度(注意：这里不能为空)
           totalCount:1,
           pageSizes:[6,12],
           // 默认每页显示的条数（可修改）
           PageSize:6,
           carList:'',


    }
  },

  methods:{
         async getList(){
const {data:res}= await this.$http.post("/index/getReco?uid=1");
     
          this.carList=res.reco;
          this.totalCount=res.list.reco
          
      },
     // 分页
        // 每页显示的条数
       handleSizeChange(val) {
           // 改变每页显示的条数 
           this.PageSize=val
           // 注意：在改变每页显示的条数时，要将页码显示到第一页
           this.currentPage=1
       },
         // 显示第几页
       handleCurrentChange(val) {
           // 改变默认的页数
           this.currentPage=val
       },

      showInfo(itemId){
         this.$router.push({path:"/carInfo",query:{id:itemId}});
         window.location.reload()
      }
  }
};
</script>

<style scoped>
.c1{
  display: inline;
}
.tabListPage{
  margin-left: 30px;
}
.book{
  background: #ced8e0;
}
.cover {
  
  width: 115px;
  height: 120px;
  margin-bottom: 7px;
  overflow: hidden;
  cursor: pointer;
}

img {
  width: 115px;
  height: 172px;
  /*margin: 0 auto;*/
}

.title {
  font-size: 14px;
  text-align: left;
}

.author {
  color: #333;
  width: 102px;
  font-size: 13px;
  margin-bottom: 6px;
  text-align: left;
}

.abstract {
  display: block;
  line-height: 17px;
}

a {
  text-decoration: none;
}

a:link,
a:visited,
a:focus {
  color: #3377aa;
}
</style>
