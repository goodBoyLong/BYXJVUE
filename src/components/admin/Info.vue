<template>
    <div class="mainClass">
        修改权限
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>个人信息</el-breadcrumb-item>
        </el-breadcrumb>

         <span class="infoSpan">个人详细信息</span>

        <div class="infoForm">
            <el-form ref="form" :model="info" label-width="80px">
               
              
                <el-form-item label="账号:" style="width:400px">
                    <el-input v-model="info.username" readonly></el-input>
                </el-form-item>
               
               
                <el-form-item label="地址:" style="width:400px">
                    <el-input v-model="info.address" readonly></el-input>
                </el-form-item>
                <el-form-item label="手机号:" style="width:400px">
                    <el-input v-model="info.phone" readonly></el-input>
                </el-form-item>
                <el-form-item label="邮箱:" style="width:400px">
                    <el-input v-model="info.email" readonly></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="margin-left:20px"  type="primary" @click="editPsw">更改密码</el-button>
                 
                </el-form-item>
                <el-form-item>
             
                    <el-button class="bt2" type="primary" @click="edit">修改信息</el-button>
                </el-form-item>
            </el-form>
            <!-- 修改个人信息对话框 -->
            <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="35%" >
                <el-form  :model="info" :rules="editRules" label-width="80px" >
                   
                    <el-form-item label="账号:" style="width:400px" prop="username">
                        <el-input  v-model="info.username" readonly ></el-input>
                    </el-form-item>
                  
                   
                    <el-form-item label="住址:" style="width:400px" prop="address">
                        <el-input v-model="info.address" ></el-input>
                    </el-form-item>
                    <el-form-item label="手机号:" style="width:400px" prop="phone">
                        <el-input v-model="info.phone" ></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱:" style="width:400px" prop="email">
                        <el-input v-model="info.email" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  class="btn1" type="primary" @click="editDialogVisible=false">取消</el-button>
                        <el-button class="btn" type="primary" @click="submit()">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 修改密码 -->
            <el-dialog title="更改密码" :visible.sync="editPswDialogVisible" width="35%" @close>
                <el-form  :model="pswForm" :rules="editPswRules" ref="editFormRef" label-width="80px" >
                    <el-form-item label="旧密码:" style="width:400px" prop="oldPsw">
                        <el-input  v-model="pswForm.oldPsw" placeholder="请输入旧密码"  show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码:" style="width:400px" prop="newPsw">
                        <el-input  v-model="pswForm.newPsw" placeholder="请输入新密码"  show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认:" style="width:400px" prop="surePsw">
                        <el-input  v-model="pswForm.surePsw" placeholder="请再次输入新密码"  show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  class="btn1" type="primary" @click="editPswDialogVisible=false">取消</el-button>
                        <el-button class="btn" type="primary" @click="editPswSure()">确认</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
    data(){
         
       

        return{
            info:'',
            form: {
                trueName:'',
                username:'',
                sex:'',
                birth:'',
                address:'',
                phone:'',
                idcard:'',
                email:''
            },
            form1: {
                trueName:'',
                username:'',
                sex:'',
                birth:'',
                address:'',
                phone:'',
                idcard:'',
                email:'',
            },
            pswForm:{
                username:'',
                oldPsw:'',
                newPsw:'',
                surePsw:''
            },
       

            editDialogVisible:false,
            editRules:{
                
               
                address: [
                    {required: true, message: '不可为空', trigger: 'blur'}],
                phone: [
                    {required: true, message: '不可为空', trigger: 'blur'},
                    {pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }],
                
                  email:[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            },
            editPswDialogVisible:false,
            editPswRules:{
                oldPsw: [
                    {required: true, message: '请输入旧密码', trigger: 'blur'},
                ],
                newPsw: [
                    {required: true, message: '请输入新密码', trigger: 'blur'},
                ],
                surePsw: [
                    {required: true, message: '请在此输入新密码', trigger: 'blur'},
                ],
            }
        }
    },
    created(){
        this.queryUserInfo()
        this.form.username=Cookies.get("username");
        this.pswForm.username=Cookies.get("username");
    },
    methods:{
       async  editPswSure(){
           
                if(this.pswForm.newPsw!==this.pswForm.surePsw){
                  
                    this.$message({
                    message: '请确定新密码一致',
                    type: 'error'
                   
                   }); 
                
                }
                else{
                    const {data:res} = await this.$http.post("user/editPwd",this.pswForm);
                    if(res.code==200){
                        this.$message({
                    message: '重置密码成功，请重新登录',
                    type: 'success'
                   
                   }); 
                     this.$router.push({path:"/login"});
                    }else{
                          this.$message({
                    message: '旧密码输入错误，请重新输入',
                    type: 'error'
                   
                   }); 
                   this.pswForm.oldPsw=''
                   this.pswForm.newPsw=''
                   this.pswForm.surePsw=''
                    }
               
                }
        },
        editPsw(){
            this.editPswDialogVisible=true;
        },
        async submit(){
  const {data:res} = await this.$http.post("user/updateInfo",this.info);
    this.$message({
                    message: '修改信息成功',
                    type: 'success'
                   
                   }); 
                   this.editDialogVisible=false;
        },
       async queryUserInfo(){
            const username =Cookies.get("username");
            const {data:res} = await this.$http.get("user/getInfo?username="+username); 
            this.info=res.info;
           
             //   this.$http.get("queryUserInfo?username="+username).then(function(res){})
        }, 
        edit(){
            this.editDialogVisible=true;
        }
             
    },
}
</script>

<style scoped lang="less">
.avator{
    margin-left: 100px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.bt2{
    position: absolute;
    margin-top: -62px;
    margin-left: 180px;
}
.mainClass{
   margin:0 auto;
 
}
  .el-breadcrumb{
        padding-top: 20px;
        margin-bottom: 15px;
        font-size: 17px;
    }
    .infoSpan{
        padding-top: 20px;
        padding-left: 450px;
        font-size: 18px;
    }
    .infoForm{
         padding-top: 20px;
        padding-left: 300px;
         padding-right: 550px;
    }
    .btn{
      float: right;
    }
    .btn1{
      float: left;
    }
</style>