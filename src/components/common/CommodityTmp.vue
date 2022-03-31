<template>
  <div>
    <el-row style="height: 500px;padding-left:40px;margin-top:-30px">
      <!--<search-bar></search-bar>-->
   
       
        <el-card
          style="width: 135px;margin-bottom: 20px;height: 233px;float: left;margin-right: 15px"
          class="book"
          bodyStyle="padding:10px"
          shadow="hover"
          v-for="item in pageTicket"
          :data="pageTicket"
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
    <el-row>
      <el-pagination
           @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentpage"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

    </el-row>
  </div>
</template>

<script>

export default {
  created() {

  },
  props:{
    carList:{
      type:Array,
      require:true
    }
  },
  data() {
    return{
        total:0,  //总数据条数
      currentpage:1,  //当前所在页默认是第一页
      pagesize:10,  //每页显示多少行数据 默认设置为10
      ticket:[],
      pageTicket:[],//分页后的当前页数据

    }
  },

  methods:{
     getTicket(){
 this.ticket=carList;
 this.total=ticket.length;
 this.getPageInfo;
     },
     getPageInfo(){
       alert()
        //清空pageTicket中的数据
      this.pageTicket=[];
      // 获取当前页的数据
      for(let i=(this.currentpage-1)*this.pagesize;i<this.total;i++){
        //把遍历的数据添加到pageTicket里面
        this.pageTicket.push(this.carList[i]);
        //判断是否达到一页的要求
        if(this.pageTicket.length===this.pagesize) break;
      }
     },
      //分页时修改每页的行数,这里会自动传入一个size
    handleSizeChange(size){
      //修改当前每页的数据行数
      this.pagesize=size;
      //数据重新分页
      this.getPageInfo();
    },
   //调整当前的页码
    handleCurrentChange(pageNumber){
      //修改当前的页码
      this.currentpage=pageNumber;
      //数据重新分页
      this.getPageInfo()
  },
      showInfo(itemId){
         this.$router.push({path:"/carInfo",query:{id:itemId}});
         window.location.reload()
      }
  }
};
</script>

<style scoped>
.cover {
  width: 115px;
  height: 172px;
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
