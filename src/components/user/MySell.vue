<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>售卖订单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="demo-input-suffix">
      <span class="demonstration"></span>
      <el-input
        class="input1"
        placeholder="请输入商品名称"
        v-model="queryForm.cname"
        clearable
        @clear="getList()"
      >
      </el-input>

      <el-button
        class="input3"
        slot="append"
        type="primary"
        icon="el-icon-search"
        @click="getList()"
      ></el-button>
     
    </div>
    <el-table :data="list.slice((currentPage-1)*PageSize,currentPage*PageSize)" border stripe style="width: 100%">
         <el-table-column
        aria-disabled="false"
        prop="oid"
        label="订单编号"
        width="160"
      >
      </el-table-column>

      <el-table-column
        aria-disabled="false"
        prop="cname"
        label="商品名"
        width="130"
      >
      </el-table-column>
     
      <el-table-column label="价格" width="80">
        <template slot-scope="scope">
        <span style="color:red">￥{{scope.row.price}}</span>
        </template>
      </el-table-column>
  <el-table-column prop="" label="购买时间" width="130">
    <template slot-scope="scope">
              <span >  {{  scope.row.purchaseTime|  dateFormat}}</span>
          </template>
         </el-table-column>

     
      <el-table-column  label="状态" width="80">

        <template slot-scope="scope">
              <span :style="addClass(scope.row.status)">  {{computeStatusType(scope.row.status)  |  typeFilter}}</span>
          </template>

      </el-table-column>
      <el-table-column prop="phone" label="联系电话" width="130">
      </el-table-column>
       <el-table-column prop="address" label="收货地址" width="80">
          
      </el-table-column>
      <el-table-column label="操作" width="175">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="scope.row.status > 1" size="small" @click="updateInfo(scope.row.oid,'2')"
            >发货</el-button
          >
          <el-button type="primary" :disabled="scope.row.status != 4 " style="background:red" size="small" @click="updateInfo(scope.row.oid,'5')"
            >同意退货</el-button
          >

          <!--删除-->
        </template>
      </el-table-column>
    </el-table>

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
import ImgUpload from "../common/ImageUpload.vue";
import Cookies from "js-cookie";
export default {
  components: { ImgUpload },
  name: "CarMenu",
  created() {
    this.getList();
  },
  mounted() {
    this.getList();
    this.getCookie();
    this.getAllCategory();

  },
  data() {
    return {
      // 总数据
           tableData:[],
           // 默认显示第几页
           currentPage:1,
           // 总条数，根据接口获取数据长度(注意：这里不能为空)
           totalCount:1,
          pageSizes:[10,15,20],
           // 默认每页显示的条数（可修改）
           PageSize:15,
      queryForm:
       {
        cname: "",
        sid:'',
        uid: "",
      },
     updateForm:{
        oid:'',
        status:''
     },
      list: [],
      showList: [],
      catergoryList: [],
      myCourselist: [],
      addDiaLog: false,
      updateDiaLog: false,
      myCourseDiaLog: false,
      statusList:[
         {
          value:"0",
          label:"待发货",
        },
        {
          value:"1",
          label:"待发货",
        },
        {
          value:"2",
          label:"运输中",
        },
        {
          value:"3",
          label:"已收货",
        },
      {
          value:"4",
          label:"退货中",
        },
        {
          value:"5",
          label:"已退货",
        },
      ],
    
        
      
     

      
    };
  },
computed:{
  
    computeStatusType(){
        return function(siteType){
            return this.statusList[siteType]['label']
        }
    },


},
  methods: {

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
    
  async del(id){
      const confimResust=await this.$confirm('确定下架本商品','提示',{
           confirmButtonText:'确定',
                cancelButtonText:'取消',
                 type:'warning'
                }).catch(err=>err)
                 if(confimResust!='confirm'){
              return this.$message.info("已取消下架本商品");
      }
      
      const {data:res} = await this.$http.get("/index/delMyComm?id="+id);
       
                      this.addDiaLog=false;
                     this.getList()
                     this.$message({
                    message: '下架商品成功',
                    type: 'success'
                   
                   });
                    
                    window.location.reload();
                
      
    },



    
  async updateInfo(id,status){
    this.updateForm.oid=id;
    this.updateForm.status=status;
      if(this.updateForm.status==5){
          const{data:res}=await this.$http.get("/order/refund?oid="+this.updateForm.oid);
  console.log(res.code)
      if(res.code==200){
         this.$message({
                    message: '退款成功',
                    type: 'success'
                   });            
                    window.location.reload();
      }
      else{
         this.$message({
                    message: '退款失败',
                    type: 'success'
                   });            
                    window.location.reload();
      }
      window.location.reload();
      }else{
        const {data:res} =await this.$http.post("/order/updateInfo",this.updateForm);
        window.location.reload();
      }
    
    
    },


addClass(i) {
      switch (i) {
        case 0:
          return 'color:red';
        case 1:
          return 'color:blue';
           case 2:
          return 'color:#708069';
        case 3:
          return 'color:	green';
           case 4:
          return 'color:red';
           case 5:
          return 'color:red';
          

      }
    },
    getCookie() {
      const username = Cookies.get("username");
      const uid=Cookies.get("uid");
      this.addForm.uid=uid;
      //console.log(username);
    },

    async getList() {
      const uid=Cookies.get("uid");
      this.queryForm.sid=uid;
      const { data: res } = await this.$http.post("/order/getMySell",this.queryForm);

      this.list = res.mySell;
      this.totalCount=this.list.length
      console.log("111");
      console.log(this.list);
    },
  
    
  },
};
</script>
<style scoped lang="less" scoped>
.el-breadcrumb {
  padding-top: 20px;
  margin-bottom: 15px;
  font-size: 17px;
}
.input1 {
  padding-top: 10px;
  padding-right: 10px;
  padding-left: 20px;
  width: 200px;
}
.input2 {
  padding-top: 10px;
  padding-right: 10px;
  padding-left: 20px;
  width: 200px;
}
.slect1 {
  width: 200px;
}
</style>
