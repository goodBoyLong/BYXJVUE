<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告维护</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="demo-input-suffix">
      <span class="demonstration"></span>
      <el-input
        class="input1"
        placeholder="请输入公告主题"
        v-model="queryForm.title"
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
      <el-button
        type="primary"
        icon="el-icon-circle-plus"
        @click="addDiaLog = true"
        >添加</el-button
      >
    </div>
    <el-table :data=" list.slice((currentPage-1)*PageSize,currentPage*PageSize)" border stripe style="width: 100%">
      <el-table-column
        aria-disabled="false"
        prop="title"
        label="主题"
        width="150"
      >
      </el-table-column>
      <el-table-column prop="newsImg" label="展示图片" width="200">
         <template slot-scope="scope">
    <viewer  >
  <img   style="width:100px;height:50px"    :src="require('D://workspace//img//'+scope.row.newsImg+'.jpg')" 
    
  ></viewer>
          
         </template>
      </el-table-column>
       
      <el-table-column prop="cdesc" label="简述" width="200">
      </el-table-column>
      <el-table-column prop="content" label="内容" width="200"> </el-table-column>
    <el-table-column prop="status" label="状态"  width="140"> 
          <template scope="scope">
        <span v-if="scope.row.status=='1'"  style="color: green">发布中</span>
         <span v-else style="color: red">废弃</span>
           </template>
    </el-table-column>

      <el-table-column label="操作" width="175">
        <template slot-scope="scope">
          <el-button  v-if="scope.row.status=='1'" type="primary" size="small" @click="show(scope.row.id)"
            >更新公告</el-button>
            <el-button  v-else type="primary" size="small" @click="show(scope.row.id)" disabled
            >更新公告</el-button>
          <el-button  v-if="scope.row.status=='1'" type="primary" size="small" @click="del(scope.row.id)"
            >废弃</el-button>
              <el-button  v-else type="primary" size="small" @click="show(scope.row.id)" disabled
            >废弃</el-button>

            
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
      title="发布公告"
      :visible.sync="addDiaLog"
      inline="true"
      width="52%"
      @close="addDialogClose"
    >
      <el-form
        :inline="true"
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="110px"
      >
       
        <el-form-item label=" 主题 " prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>


        <el-form-item prop="desc" label=" 简述 ">
          <el-input v-model="addForm.cdesc"></el-input>
        </el-form-item>
         <el-form-item prop="cid" label=" 种类">
          <el-select
            v-model="addForm.cid"
            placeholder="请选择分类"
            style="width:187px"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="content" label=" 内容 ">
          <el-input type="textarea" :rows="4" v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item prop="newsImg" label=" 封面">
          <el-input v-model="addForm.newsImg" placeholder="请选择图片"></el-input>
          <img-upload @onUpload="uploadImg" ref="imgUpload"></img-upload>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDiaLog = false">取消</el-button>
        <el-button type="primary" @click="addNews()">确定</el-button>
      </span>
    </el-dialog>

     <el-dialog
      title="更新公告"
      :visible.sync="updateDiaLog"
      inline="true"
      width="52%"
      @close="addDialogClose"
    >
      <el-form
        :inline="true"
        :model="showList"
        :rules="addRules"
        ref="addFormRef"
        label-width="110px"
      >
       
        <el-form-item label=" 主题 " prop="title">
          <el-input v-model="showList.title"></el-input>
        </el-form-item>


        <el-form-item prop="desc" label=" 简述 ">
          <el-input v-model="showList.cdesc"></el-input>
        </el-form-item>
        <el-form-item prop="content" label=" 内容 ">
          <el-input type="textarea" :rows="4" v-model="showList.content"></el-input>
        </el-form-item>
        <el-form-item prop="newsImg" label=" 封面">
          <el-input v-model="showList.newsImg" placeholder="请选择图片"></el-input>
          <img-upload @onUpload="uploadImg" ref="imgUpload"></img-upload>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDiaLog = false">取消</el-button>
        <el-button type="primary" @click="updateNews()">确定</el-button>
      </span>
    </el-dialog>
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
       this.getAllNotice();
  },
  mounted() {
    this.getList();
    this.getCookie();
    this.getAllCategory();
    this.getAllNotice();
addNews();
  },
  data() {
    return {
        categoryList:[],
         // 总数据
           tableData:[],
           // 默认显示第几页
           currentPage:1,
           // 总条数，根据接口获取数据长度(注意：这里不能为空)
           totalCount:1,
           pageSizes:[1,2,3],
           // 默认每页显示的条数（可修改）
           PageSize:1,
      queryForm: {
        title:'',
      },
      list: [],
      showList:{
        id:'',
        status:'',
        title:'',
        cdesc:'',
        newsImg:'',
        content:'',
      },
      catergoryList: [],
      myCourselist: [],
      addDiaLog: false,
      updateDiaLog: false,
      myCourseDiaLog: false,
      addForm: {
        id:'',
        title:'',
        cdesc:'',
        content:'',
        cid:'',
        newsImg:'',
        status:1,
      },

      addRules: {
      }
    };
  },
computed:{
   chagePrice:function(){
     if(this.addForm.type==2){
 this.addForm.price=0;
      return 0;
     }
   
     
   },
    computedSiteType(){
        return function(siteType){
            return this.categoryList[siteType]['name']
        }
    },
},
  methods: {
        async getAllNotice() {
      const { data: res } = await this.$http.post("/index/getAllNotice");
      console.log("getAllCategory");
      console.log(res.category);
      this.categoryList = res.category;
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
stateFormat(row, column) {
    if (row.status == 1) {
      return '发布中'
    } else  {
      return '废弃'
    } 
  },
    async del(id){
      const confimResust=await this.$confirm('确定废弃本条公告','提示',{
           confirmButtonText:'确定',
                cancelButtonText:'取消',
                 type:'warning'
                }).catch(err=>err)
                 if(confimResust!='confirm'){
              return this.$message.info("已取消废弃公告");
      }
      
      const {data:res} = await this.$http.get("/news/delNews?id="+id);
       
                      this.addDiaLog=false;
                     this.getList()
                     this.$message({
                    message: '废弃公告成功！',
                    type: 'success'
                   
                   });
                    
                    window.location.reload();
                
      
    },
     async show(id){
       const {data:res} =await this.$http.get("/news/getById?id="+id);
       this.showList=res.showList
this.updateDiaLog=true;
    },
    getCookie() {
      const username = Cookies.get("username");
      const uid=Cookies.get("uid");
      this.addForm.uid=uid;
      console.log(username);
    },
 async changePrice(){
this.addForm.price="";
  },
   
    async getList() {
    
      const { data: res } = await this.$http.post("/news/getAll",this.queryForm);

      this.list = res.newsList;
      this.totalCount=this.list.length
      console.log("111");
      console.log(this.list);
    },
    async addNews() {
      console.log(this.addForm);
      const { data: res } = await this.$http.post("/news/add", this.addForm);
      this.addDiaLog = false;
      window.location.reload()
    },
      async updateNews() {
        
      console.log(this.showList)
      const { data: res } = await this.$http.post("/news/update", this.showList);
      this.updateDiaLog = false;
      window.location.reload()
    },
    uploadImg() {
      console.log("this.$refs.imgUpload.url" + this.$refs.imgUpload.url);
      this.addForm.newsImg = this.$refs.imgUpload.url;
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
