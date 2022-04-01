<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的商品</el-breadcrumb-item>
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
          <el-select
            v-model="queryForm.did"
            placeholder="请选择商品状态"
            style="width:187px"
          >
     
            <el-option
              v-for="item in degrees"
              :key="item.name"
              :label="item.name"
              :value="item.id"
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
      <el-button
        type="primary"
        icon="el-icon-circle-plus"
        @click="addDiaLog = true"
        >添加</el-button
      >
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
  <img   style="width:100px;height:50px" :src="require('D://workspace//img//'+scope.row.img+'.jpg')" 
    
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
         <el-table-column  label="商品状态" width="80">

          <template slot-scope="scope">
              <span >  {{computedDegreeType(scope.row.did)}}</span>
              
          </template>
         </el-table-column>
      <el-table-column  label="状态" width="80">

        <template slot-scope="scope">
              <span :style="addClass(scope.row.status)">  {{computeStatusType(scope.row.status)  |  typeFilter}}
                    <br>
                <span v-if="scope.row.status==3">({{scope.row.remark}})</span></span>
          </template>

      </el-table-column>
      <el-table-column prop="total" label="剩余数量" width="130">
      </el-table-column>
  
      <el-table-column label="操作" width="175">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="scope.row.status>1" size="small" @click="updateInfo(scope.row.id)"
            >维护信息</el-button
          >
          <el-button type="primary" style="background:red" size="small" @click="del(scope.row.id)"
            >下架</el-button
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
      title="发布商品"
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
        <el-form-item label="   物品类型" prop="type">
          <el-select v-model="addForm.type">
            <el-option
              label="出售"
              value="1"
              @click.native="changePrice()"
            ></el-option>
          
          </el-select>
        </el-form-item>
        <el-form-item label=" 物品名 " prop="comname">
          <el-input v-model="addForm.comname"></el-input>
        </el-form-item>

        <el-form-item prop="price" label="  售价">
          <!-- v-if="addForm.type == 1" -->
          <el-input  v-model="addForm.price" placeholder="请输入价格" ></el-input>
          <!-- <el-input
            v-if="addForm.type == 2"
            :disabled="true"
            v-model="chagePrice"
          ></el-input> -->
        </el-form-item>

        <el-form-item prop="info" label=" 简介 ">
          <el-input v-model="addForm.info"></el-input>
        </el-form-item>
        <el-form-item prop="img" label="   展示">
          <el-input v-model="addForm.img" placeholder="请选择图片"></el-input>
          <img-upload @onUpload="uploadImg" ref="imgUpload"></img-upload>
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
         <el-form-item prop="did" label=" 商品状态">
          <el-select
            v-model="addForm.did"
            placeholder="请选择分类"
            style="width:187px"
          >
            <el-option
              v-for="item in degrees"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
<el-form-item  v-if="addForm.type==2" label="急需" prop="urgent">
          <el-select v-model="addForm.urgent">

            <el-option :value="1" label="是"></el-option>
            <el-option :value="2" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="total">
          <el-input v-model="addForm.total"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDiaLog = false">取消</el-button>
        <el-button type="primary" @click="addCar()">确定</el-button>
      </span>
    </el-dialog>


    <el-dialog
      title="更新商品"
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
        <el-form-item label="   物品类型" prop="type">
          <el-select v-model="showList.type">
            <el-option
              label="出售"
              :value="1"
              @click.native="changePrice()"
            ></el-option>
            <el-option
              label="共享"
              :value="2"
          
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 物品名 " prop="comname">
          <el-input v-model="showList.comname"></el-input>
        </el-form-item>

        <el-form-item prop="price" label="  售价">
          <el-input  v-model="showList.price" placeholder="请输入价格" ></el-input>
       
        </el-form-item>

        <el-form-item prop="info" label=" 简介 ">
          <el-input v-model="showList.info"></el-input>
        </el-form-item>
        <el-form-item prop="img" label="   展示">
          <el-input v-model="showList.img" placeholder="请选择图片"></el-input>
          <img-upload @onUpload="uploadImgUpdate" ref="imgUpload"></img-upload>
        </el-form-item>
        <el-form-item prop="cid" label=" 种类">
          <el-select
            v-model="showList.cid"
            placeholder="请选择分类"
            style="width:187px"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.name"
              :label="item.name"
              :value="item.id-1"
            >
            </el-option>
          </el-select>
                 </el-form-item>
          <el-form-item prop="did" label=" 商品状态">
          <el-select
            v-model="showList.did"
            placeholder="请选择商品状态"
            style="width:187px"
          >
            <el-option
              v-for="item in degrees"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
<el-form-item  v-if="showList.type==2" label="急需" prop="urgent">
          <el-select v-model="showList.urgent">

            <el-option :value="1" label="是"></el-option>
            <el-option :value="2" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="total">
          <el-input v-model="showList.total"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDiaLog = false">取消</el-button>
        <el-button type="primary" @click="updateMyComm()">确定</el-button>
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
        this.getDegree();
    this.getCookie();
    this.getAllCategory();

  },
  data() {
    return {
      degrees:'',
      // 总数据
           tableData:[],
           // 默认显示第几页
           currentPage:1,
           // 总条数，根据接口获取数据长度(注意：这里不能为空)
           totalCount:1,
           pageSizes:[10,15,20],
           // 默认每页显示的条数（可修改）
           PageSize:10,
      queryForm: {
        comname: "",
        uid: "",
      },
     
      list: [],
      showList: [],
      categoryList:[],
      catergoryList: [],
      myCourselist: [],
      addDiaLog: false,
      updateDiaLog: false,
      myCourseDiaLog: false,
        queryForm: {
        comname: "",  
        status:'',
        cid:'',
        uid:'',
        did:'',
      },
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
      addForm: {
        type: "1",
        comname: "",
        price: "",
        info: "",
        img: "",
        cid: "",
        status: 1,
        urgent: 2,
        total: "",
        uid:'',
      },

      addRules: {
          comname:[
          { required:true,message:"商品名为必填项", trigger: 'blur' },      //自定义验证
          { pattern:/^.{2,10}$/, message: '长度在 6 ~ 10 个字符', trigger: 'blur' }   //长度验证
        ],
          info:[
          { required:true,message:"简介为必填项", trigger: 'blur' },      //自定义验证
          { pattern:/^.{6,50}$/, message: '长度在 6 ~ 20 个字符', trigger: 'blur' }   //长度验证
        ],
          img:[
          { required:true,message:"图片未上传", trigger: 'blur'  },      //自定义验证
         
        ],
          cid:[
          { required:true,message:"商品种类未选择", trigger: 'blur'  },      //自定义验证
           //长度验证
        ],
        price:[
          { required:true,message:"价格为必填项", trigger: 'blur' },      //自定义验证
          { pattern:/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/, message: '价格输入非法', trigger: 'blur' }   //长度验证
        ],
          total:[
          { required:true,message:"数量为必填项", trigger: 'blur' },      //自定义验证
          { pattern:/^[1-9]*[1-9][1-9]*$/, message: '数量最小为1', trigger: 'blur' }   //长度验证
        ],
      }
    };
  },
computed:{
   computedDegreeType(){
        return function(siteType){
            return this.degrees[siteType-1]['name']
        }
    },
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
    addDialogClose(){
      this.updateDiaLog=false;
    },
      async getDegree() {
      const { data: res } = await this.$http.post("/commodity/getDegree");
      console.log(res.degrees);
      this.degrees = res.degrees;
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
         this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return;
      console.log(this.showList)
      const { data: res } = await this.$http.post("/index/updateMyComm", this.showList);
      this.updateDiaLog = false;
      window.location.reload()
       });
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
      const { data: res } = await this.$http.post("/index/getMySellComm",this.queryForm);

      this.list = res.myComm;
       this.totalCount=this.list.length
      console.log("111");
      console.log(this.list);
    },
    async addCar() {
       this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return;
      console.log(this.addForm);
      const { data: res } = this.$http.post("/index/addCar", this.addForm);
      this.addDiaLog = false;
      window.location.reload();
       });
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
