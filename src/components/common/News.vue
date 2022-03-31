<template>
  <div>
    <el-row style="height: 430px;padding-left:60px;margin-top:-40px;">
      <!--<search-bar></search-bar>-->
   
       
        <el-card
          style="width: 310px;margin-bottom: 20px;height: 320px;margin-left:50px;float: left;margin-right: 15px;margin-top:20px"
          class="book"
         
          shadow="hover"
          v-for="(item,pos) in  newsList.slice((currentPage-1)*PageSize,currentPage*PageSize)"
      
        :key="item.id"
        >
          <div class="cover">
            <img
              :src="require('D://workspace//img//' + item.newsImg+'.jpg')"
              @click="showInfo(item.id)"
            />
            
          </div>
          <div class="info">
            <h3 >{{item.title}}</h3>
            <h4>By: <font style="color:green">管理员</font>&nbsp;&nbsp;<font style="font-size:14px">{{item.date}}</font></h4>
            <h5>{{item.cdesc}}</h5>
           
            <h5 class="read"  @click="getInfo(item.id,pos)" type="primary">阅读全文-></h5>
          </div>
     <el-drawer
  :title="showNew.title"
  :visible.sync="drawer"
  :direction="direction"
  class=""
  v-bind="posi"
  :before-close="handleClose">
  
         <div class="drewer">
            <p>By: <font style="color:green">管理员</font>&nbsp;&nbsp;<font style="font-size:14px">{{showNew.date}}</font>
             &nbsp;&nbsp;
              <span v-if="showNew.status=='1'"  style="color: green">发布中</span>
         <span v-else style="color: red">废弃</span>
            </p>
           <p style="font-size:16px">  &nbsp;&nbsp;【简介】: {{showNew.cdesc}}</p>
             <viewer  >
           <img class="newImg" :src="require('D://workspace//img//' + newsList[posi].newsImg+'.jpg')" alt=""/>
             </viewer>
           <br>
           <br> 
           <p> &nbsp;&nbsp;【内容】:{{showNew.content}}</p>
         
         </div>
</el-drawer>
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

  },
  props:{
    newsList:{
      type:Array,
      require:true
    },

  },
  watch: {
		// newVal 获取props中的值，方法名 = props中的参数			
		newsList(newVal, oldVal) {
			this.totalCount = newVal.length
		}
	},
  data() {
    return{
       drawer: false,
       showNew:[],
       newsImg:'',
       // 总数据
           tableData:[],
           // 默认显示第几页
           currentPage:1,
           // 总条数，根据接口获取数据长度(注意：这里不能为空)
           totalCount:1,
           // 个数选择器（可修改）
           pageSizes:[3],
           // 默认每页显示的条数（可修改）
           PageSize:3,
           posi:'0',


    }
  },
mounted:{

},
  methods:{
     async getInfo(newic,posi){
       const posij=(this.currentPage-1)*3+posi;
    
       const _this=this;
        const{data:res} = await this.$http.get("/news/getShow?id="+newic);
        this.showNew=res.showNew;
      _this.posi=posij;
this.drawer=true;

// this.showNew=res.data;
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

     
  }
};
</script>

<style scoped>
 /deep/ .el-drawer{
background: grey;

}

 /deep/ .el-drawer__header{
   color: black;
   font-style: bold;
  margin-left: 100px;
  font-size: 30px;
  font-family: bold;
  
}
.newImg{
  margin-left:75px ;
  height: 130px;
  width: 260px;
}
.c1{
  display: inline;
}
.tabListPage{

  margin-left: 30px;
}
.read:hover{
  color: red;

}
.cover {
  width: 250px;
  height: 120px;
  margin-bottom: 7px;
  overflow: hidden;
  cursor: pointer;
}

img {
  width: 250px;
  height: 172px;
  /*margin: 0 auto;*/
}
h3{
  font-size: 25px;
  font-weight: bold;
}
h4{
  font-size: 18px;
  color: #8d8d8d;
      line-height: 1.8em;
}
h5{
  font-size: 14px;
   color: #8d8d8d;
       line-height: 1.8em;
   
}
.read{
  font-size: 20px;
  font-weight: bold;
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
