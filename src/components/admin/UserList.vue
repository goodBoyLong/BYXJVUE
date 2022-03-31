<template>
  <div>用户列表
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表主体部分 -->
    <el-card>
      <el-row :gutter="25"> 
        <!--搜索区域 -->
        <el-col :span="5"> 
             <!--搜索按钮 -->                                      <!--clearable 清除按钮，添加此属性会出现一个小x的按钮 -->
            <el-input placeholder="请输入账号" v-model="queryName" clearable @clear="getUserList">
                <el-button slot="append" icon="el-icon-search" @click="getList()"></el-button>
            </el-input>
        </el-col>

        <!-- 添加按钮 -->
        <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>

     

      </el-row>

      <!-- 用户列表  stripe 隔行变色-->
      <el-table :data="userList.slice((currentPage-1)*PageSize,currentPage*PageSize)" border stripe>
      
           <el-table-column label="账号" prop="username"></el-table-column>
           <el-table-column label="邮箱" prop="email"></el-table-column>
           <el-table-column label="联系方式" prop="phone"></el-table-column>
           <el-table-column label="地址" prop="address"></el-table-column>
           
           <el-table-column label="角色" prop="role"></el-table-column>
           <el-table-column label="状态" prop="enabled">
            <template slot-scope="scope"> 
                <span v-if="scope.row.enabled==1" style="color:green">正常</span>
                <span v-else style="color:red">违规处理中</span>
            </template>
             </el-table-column>
           <el-table-column label="操作">
                <template slot-scope="scope">
                <!-- 修改 -->
                <el-tooltip effect="dark" content="修改用户信息" placement="top-start" :enterable="true"><!--文字提示 enterable 隐藏-->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.username)"></el-button>
                </el-tooltip>
                <!-- 删除 -->
                <el-tooltip effect="dark" content="重置用户" placement="top-start" :enterable="true"><!--文字提示 enterable 隐藏-->
                    <el-button type="danger" icon="el-icon-setting" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                </el-tooltip>
           
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
    </el-card>

    <!-- 新增用户对话框 -->
    <el-dialog title="添加用户" center="" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px"> <!--label-width="70px",这个属性影响form-item离对表单左边的距离 -->
            <!-- 用户名 -->
            <el-form-item label="用户名:" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="手机号:" prop="phone">
                <el-input v-model="addForm.phone"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱:" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
                 <el-form-item label="住址:" prop="address">
                <el-input v-model="addForm.address"></el-input>
            </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="addUser">确定</el-button>
        </span>
    </el-dialog>

     <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <!-- 用户名 -->
            <el-form-item label="账号:" prop="username">
                <!-- 用户名不能修改，添加disabled属性，不能修改 -->
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
        
            
            <!-- 邮箱 -->
            <el-form-item label="邮箱:" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
             <el-form-item label="地址:" prop="address">
                <el-input v-model="editForm.address"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="enabled">
          <el-select v-model="editForm.enabled">
            <el-option
              label="正常"
              :value="1"
            ></el-option>
            <el-option
              label="封号"
              :value="2"
          
            ></el-option>
          </el-select>
        </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="editdUserInfo">确定</el-button>
        </span>
    </el-dialog>

  
    
  </div>
</template>

<script>
export default {
    created(){
        this.getUserList();
     
    },
     mounted(){
      this.getCookie();
    },
    data(){
        return{
            //查询信息实体
            // 总数据
           tableData:[],
           // 默认显示第几页
           currentPage:1,
           // 总条数，根据接口获取数据长度(注意：这里不能为空)
           totalCount:1,
           pageSizes:[1,2,3],
           // 默认每页显示的条数（可修改）
           PageSize:1,
            queryName:'',
            userList:[], //用户列表
            total:0,  //总记录数
            addDialogVisible:false, //对话框状态
            //添加用户信息
            addForm:{
                username:"",
                password:"111111",
                phone:'',
                email:"",
                address:"",
            },
            //添加用户表单验证
            addFormRules:{
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                email:[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            },
            //修改用户信息
            editForm:{},
            //显示隐藏修改用户栏
            editDialogVisible:false,
            
            

            //对话框状态
            changeDialogVisible:false,
            
            value:'',
            editUser:''
        }
    },
    methods:{
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
        async getList(){
            const{data:res}=await this.$http.get("/user/getByName?username="+this.queryName);
            this.userList=res.userList;
          this.totalCount=this.userList.length

        },
        async deleteUser(id){
const {data:res}= await this.$http.get("user/updatePwd?id="+id);
this.$message({
                    message: '重置成功',
                    type: 'success'
                   
                   }); 
        },
        async editdUserInfo(){
            const {data:res}= await this.$http.post("user/updateInfo",this.editForm);
                 this.$message({
                    message: '更新成功',
                    type: 'success'
                   
                   }); 
                   this.editDialogVisible=false;
                   window.location.reload();
        },
       //获取所有用户
       getCookie() {
          const username = Cookies.get("username");
       },
       async addUser(){
  const {data:res}= await this.$http.post("/user/regist",this.addForm);
    this.$message({
                    message: '更新成功',
                    type: 'success'
                   }); 
                   this.addDialogVisible=false;
                   window.location.reload()
;       },
        //获取所有用户
       async getUserList(){
          const {data:res}= await this.$http.get("user/getAll");
          this.userList=res.userList; 
          this.totalCount=this.userList.length
          console.log(this.userList)//用户列表数据封装,对应java中的data
           //总用户数封装,numbers对应java中的UserController的numbers
        },
        async showEditDialog( username){
                this.editDialogVisible=true;
                  const {data:res}= await this.$http.get("user/getInfo?username="+username);
                  this.editForm=res.info;
        }
      
    }
}
</script>
 
<style lang="less">

</style>