<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>审核商品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="demo-input-suffix">
      <span class="demonstration"></span>
      <el-input
        class="input1"
        placeholder="请输入商品名称"
        v-model="queryForm.comname"
        clearable
        @clear="getList()"
      >
      </el-input>
       <el-select
            v-model="queryForm.cid"
            placeholder="请选择分类"
            style="width:187px"
          >
          <el-option
              v-for="item in allSelect1"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
          </el-option>
            <el-option
              v-for="item in categoryList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="queryForm.status"
            placeholder="请选择审核状态"
            style="width:187px"
          >
     
            <el-option
              v-for="item in statusList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
        prop="comname"
        label="商品名"
        width="130"
      >
      </el-table-column>
      <el-table-column prop="img" label="展示图片" width="130">
         <template slot-scope="scope">
     <viewer  >
  <img   style="width:100px;height:50px"    :src="require('D://workspace//img//'+scope.row.img+'.jpg')" 
    
  >
     </viewer>
          
         </template>
      </el-table-column>
      <el-table-column label="价格" width="80">
        <template slot-scope="scope">
        <span style="color:red">￥{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="info" label="简述" width="130"> </el-table-column>

      <el-table-column  label="种类" width="80">

          <template slot-scope="scope">
              <span >  {{computedSiteType(scope.row.cid-1)}}</span>
          </template>
         </el-table-column>
      <el-table-column  label="状态" width="120">

        <template slot-scope="scope">
              <span :style="addClass(scope.row.status)">  {{computeStatusType(scope.row.status)  |  typeFilter}} 
                <br>
                <span v-if="scope.row.status==3">({{scope.row.remark}})</span></span>
             
          </template>

      </el-table-column>
      <el-table-column prop="total" label="数量" width="130">
      </el-table-column>
       <!-- <el-table-column label="类型" width="80">
          <template slot-scope="scope">
              <span :style="addClass(scope.row.type)">  {{computeType(scope.row.type)}}</span>
          </template>
      </el-table-column> -->
      <el-table-column label="操作" width="175">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.status != 1" type="primary" size="small" @click="updateStatus(scope.row.id,'2')"
            >通过</el-button
          >
          <el-button type="primary"  :disabled="scope.row.status != 1" style="background:red" size="small" @click="updateStatus2(scope.row.id,'3')"
            ><span>不通过</span></el-button
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
    

   <el-dialog
      :visible.sync="addDiaLog"
      inline="true"
      width="52%"
      @close="addDialogClose"
    >
  <el-form
      :inline="true"
        :model="remarkForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="110px"
   >
    <el-form-item  width="150" prop="remark" label="未通过理由" >
      <el-input v-model="remarkForm.remark"></el-input>
    </el-form-item>
  
  </el-form>
  <span slot="footer" class="dialog-footer">
        <el-button @click="addDiaLog = false">取消</el-button>
        <el-button type="primary" @click="update3()">确定</el-button>
      </span>
</el-dialog>
  </div>
</template>
<script>
import ImgUpload from "../common/ImageUpload.vue";
import Cookies from "js-cookie";
export default {
  components: { ImgUpload },
 
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
      remark1:'',
       // 总数据
           tableData:[],
           // 默认显示第几页
           currentPage:1,
           // 总条数，根据接口获取数据长度(注意：这里不能为空)
           totalCount:1,
           pageSizes:[5,10,15],
           // 默认每页显示的条数（可修改）
           PageSize:5,

      queryForm: {
        comname: "",  
        status:'',
        cid:'',
      },
     
      list: [],
      showList: [],
      categoryList: [],
      catergoryList: [],
      myCourselist: [],
      addDiaLog: false,
      updateDiaLog: false,
      myCourseDiaLog: false,
      statusList:[
        {
          value:"0",
          label:"全部",
        },
        {
          value:"1",
          label:"待审核",
        },
        {
          value:"2",
          label:"已上架",
        },
        {
          value:"3",
          label:"审核未通过",
        },
        
        
      ],
      allSelect:[
        {
          value:'0',
          label:"全部"
        }
      ],
      allSelect1:[
        {
          value:'0',
          label:"全部"
        }
      ],
      typeList:[
        {

          value:"1",
          label:"出售",
        },
        {
          value:"2",
          label:"共享",
        },
        
      ],
      updateForm:{
          id:'',
          status:'',
      },
      addForm: {
        type: "1",
        comname: "",
        price: "",
        info: "",
        img: "",
        cid: "",
        status: 1,
        turnover: 0,
        remark: "",
        uid:'',
      },

      addRules: {
         remark:[
          { required:true,message:"该理由为必填项", trigger: 'blur' },      //自定义验证
           
        ],
      },
      dialogTableVisible:false,
      remarkForm:{
        id:'',
        status:'',
      remark:'',
      }
    };
  },
computed:{
  computedSiteType(){
        return function(siteType){
            return this.categoryList[siteType]['name']
        }
    },
    computeStatusType(){
        return function(siteType){
          
            return this.statusList[siteType]['label']
        }
    },

    computeType(){
        return function(siteType){
          
            return this.typeList[siteType-1]['label']
        }
    },


   chagePrice:function(){
     if(this.addForm.type==2){
 this.addForm.price=0;
      return 0;
     }
   
     
   }
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
       updateStatus2(id,stat){
 this.addDiaLog=true;
 this.remarkForm.id=id;
 this.remarkForm.status=stat;
       },
      async update3(){
     const {data:res} = await this.$http.post("/index/updateStat",this.remarkForm);
        this.getList()
                     this.$message({
                    message: '操作成功',
                    type: 'success'
                   
                   });
                    
                    window.location.reload();
                    this.remarkForm.remark='';
this.addDiaLog=false;
       },
   async updateStatus(id,stat){
      this.updateForm.id=id;  
     this.updateForm.status=stat;
      const {data:res} = await this.$http.post("/index/updateStat",this.updateForm);
        this.getList()
                     this.$message({
                    message: '操作成功',
                    type: 'success'
                   
                   });
                    
                    window.location.reload();
      
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



      async updateMyComm() {
        
      console.log(this.showList)
      const { data: res } = await this.$http.post("/index/updateMyComm", this.showList);
      this.updateDiaLog = false;
      window.location.reload()
    },
  async updateInfo(id){
       const {data:res} =await this.$http.get("/index/getCarInfoById?carId="+id);
       this.showList=res.carInfo
this.updateDiaLog=true;
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
          return 'color:	red';
             case 4:
          return 'color:	red';
          

      }
    },
    getCookie() {
      const username = Cookies.get("username");
      const uid=Cookies.get("uid");
      this.addForm.uid=uid;
      //console.log(username);
    },
 async changePrice(){
this.addForm.price="";
  },
    async getAllCategory() {
      const { data: res } = await this.$http.post("/index/getAllCategory");
      console.log("getAllCategory");
      console.log(res.category);
      this.categoryList = res.category;
    },
    async getList() {
      const uid=Cookies.get("uid");
      this.queryForm.uid=uid;
      const { data: res } = await this.$http.post("/index/getAllComm",this.queryForm);

      this.list = res.allComm;
      console.log("111");
      console.log(this.list);
      this.totalCount=this.list.length
    },
    async addCar() {
      console.log(this.addForm);
      const { data: res } = this.$http.post("/index/addCar", this.addForm);
      this.addDiaLog = false;
      window.location.reload()
    },
    uploadImg() {
      console.log("this.$refs.imgUpload.url" + this.$refs.imgUpload.url);
      this.addForm.img = this.$refs.imgUpload.url;
      
    },
      uploadImgUpdate() {
      console.log("this.$refs.imgUpload.url" + this.$refs.imgUpload.url);
      this.showList.img = this.$refs.imgUpload.url;
      
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
