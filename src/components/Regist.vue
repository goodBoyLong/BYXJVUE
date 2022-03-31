<template>
  <div class="reg_container">
      <!-- 动态背景 -->
   

    <!-- 注册模块 -->
    <div class="box">
      <!-- 头像 -->
     

      <el-form :model="registForm" ref="registFormRef" :rules="registRules" status-icon label-width="100px" class="regist_form">

   <el-form-item label="手机号" prop="mobilephone">
          <el-input placeholder="请输入手机号" v-model="registForm.mobilephone" ></el-input>
        </el-form-item>

        <el-form-item label="账号" prop="username"> <!-- 使用status-icon属性为输入框添加了表示校验结果的反馈图标。 -->
          <el-input  v-model="registForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
       <el-form-item label="昵称" prop="name"> <!-- 使用status-icon属性为输入框添加了表示校验结果的反馈图标。 -->
          <el-input  v-model="registForm.name" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="registForm.password" show-password autocomplete="off"></el-input>
        </el-form-item>
     
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="registForm.email"></el-input>
        </el-form-item>

        <!-- 验证码 -->
         <el-form-item prop="vercode" label="验证码">
          <el-input
             
              v-model="registForm.vercode"
              placeholder="请输入手机验证码"
              
          >
          </el-input>
         
        </el-form-item>
        <el-form-item>

           <el-button @click="getCode()" >获取验证码</el-button>
        </el-form-item> 

        <el-form-item class="btn">
          <el-button type="primary" @click="regist()">注册</el-button>
          <el-button type="success" @click="backLogin()">返回登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data(){
    
    return{
     registForm:{
        username:'',
        name:"",
        password:'',
        mobilephone:'',
        email:'',
        vercode:"",
     },
    isdisabled:true,
      
      //表单验证
      registRules:{
        username:[
          { required: true, message: '账号为必填项', trigger: 'blur' },       //必填项验证
          { pattern:/^\d{6,10}$/, message: '账号格式错误', trigger: 'blur' },   //长度验证
        ],
         name:[
          { required:true,message:"昵称为必填项", trigger: 'blur' },      //自定义验证
          { pattern:/^.{6,10}$/, message: '长度在 6 ~ 10 个字符', trigger: 'blur' }   //长度验证
        ],
        password:[
          { required:true,message:"密码为必填项", trigger: 'blur' },      //自定义验证
          { min: 6, max: 10, message: '长度在 6 ~ 10 个字符', trigger: 'blur' }   //长度验证
        ],
        mobilephone:[
          { required:true,message:"手机号为必填项", trigger: 'blur' },      //自定义验证
          { pattern:/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '手机格式错误', trigger: 'blur' }   //长度验证
        ],
        email:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {  pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        vercode: [{ required: true, message: "请输验证码", trigger: "blur" }]
      },
    }
  },
 mounted(){

 },
  methods:{
    
     async getCode(){
      var reg=/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
      if(!reg.test(this.registForm.mobilephone)){
        this.$message.error("您输入的手机号码不存在")
      }else{
            const {data:res}=await this.$http.get("/user/getRegCode?phone="+this.registForm.mobilephone);
            if(res.code==400){
              this.$message.error("该手机号已经被注册")
            }
          else if(res.code==200) {
            this.$message.success("验证码发送成功")
            const regCode=res.regCode;
            Cookies.set("code",regCode);
         
            
          }
      }
    },
    regist(){
      //验证校验规则
      this.$refs.registFormRef.validate(async valid=>{
        if(!valid) return;
   const code=Cookies.get("code");
      
         if(code==this.registForm.vercode){
 const {data:res}=await this.$http.post("/user/regist",this.registForm);
   
          if(res.code === 200){
             window.sessionStorage.setItem('flag','ok'); // session 放置
                        //3显示登录成功
                        this.$message.success("登录成功！！！");  //信息提示
                        console.log("res.result"+res.result)

                        // 4存储user对象
                        window.sessionStorage.setItem("user",res.result); 
                         Cookies.set("num",1);
                        Cookies.set("username", res.result.username);
                    Cookies.set("uid",res.result.id);
                    
                        //5进入首页，页面路由跳转到首页
                        this.$router.push({path:"/indexCar"}); //跳转地址
          }else{
            this.$message.error("请检查验证码");
          }
         }else{
            this.$message.error("验证码错误")
         }
         
      });
    },
  
    backLogin(){
      this.$router.push("/login");  //回到登录
    }
  }

}
</script>

<style lang="less" scpoed>
.reg_container{

    background-image: url("../assets/img/b2.jpg");
background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
   
    height: 100%;
}
.box{
  width: 450px;
 height: 520px;
  border-radius: 4px;
  margin:0 auto;
  position: absolute;// 绝对定位
  left: 50%;
  top:50%;
  background-color:    #010b16;
  opacity: 0.8;
  transform: translate(-50%,-50%);// 根据自己位置 以自己为长度位移
  // 头像框
 
    //输入验证码框
    .log-input{
    width: 60%;
    }
    .checkCode{
   position: relative;
    top: 6px;
    background: white;
    align-content: bottom;
    font-size: 30px;
    margin-left: 36px;
    color: #df5000;
  }
}
.regist_form{
    position: absolute;
    bottom:0%;
    width:80%;
    padding:0 10px;
    box-sizing:border-box;// 设置边框
    margin-top:200px;
}
  
source{  
   
    height: auto;  
    width: auto;  
}
</style>