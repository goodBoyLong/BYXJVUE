<template>
  <div class="login_container">
      <!-- 动态背景 -->
    
      <!-- 登录块 -->
      <div class="login_box">
       
          <!-- 表单区域 -->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login_form" status-icon label-width="0">
              
              <!-- 学号/工号 -->
              <el-form-item prop="username">
                  <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-yonghu3"></el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item prop="password">
                  <el-input v-model="loginForm.password"  prefix-icon="iconfont icon-mima5" type="password" show-password></el-input>
              </el-form-item>
              <!-- 验证码 -->
               <el-form-item prop="seccode">
                  <el-input
                            class="log-input"
                            v-model="loginForm.seccode"
                            placeholder="请输入验证码(区别大小写)"
                            prefix-icon="iconfont icon-mimadunpai"
                            @keydown.enter.native="checkCode"
                  >
                  </el-input>
                  <span class="checkCode" @click="createCode">{{ checkCode}}</span>
              </el-form-item>
              <!-- 按钮 -->
              <el-form-item class="btns">
                  <el-button type="primary" @click="login()">登录</el-button>
                  <el-button type="info" @click="restForm">重置</el-button>
                  <el-button type="success" @click="regist()">注册</el-button>
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
            //表单数据
            loginForm:{
                username:"admin",
                password:"123456",
       
            },
            checkCode:'',
            //验证对象
            loginRules:{
                //校验用户名
                username:[
                    { required: true, message: '用户名称为必填项', trigger: 'blur' },       //必填项验证
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }   //长度验证
                ],
                //校验密码
                password:[
                    { required: true, message: '密码为必填项', trigger: 'blur' },      //必填项验证
                    { min: 6, max: 10, message: '长度在 6 ~ 10 个字符', trigger: 'blur' }   //长度验证
                ],
                seccode: [{ required: true, message: "请输验证码", trigger: "blur" }]
            },
        };
    },
    mounted(){
        this.createCode();
        this.getCookie();
    },
    methods:{
         //验证码
         createCode(){
            var code = "";
            const codeLength = 4; //验证码的长度
            const random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','a','b','c','d','e','f','c','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'); //随机数
            for(let i = 0; i < codeLength; i++) { //循环操作
                let index = Math.floor(Math.random() * 60); //取得随机数的索引（0~60）
                code += random[index]; //根据索引取得随机数加到code上
            }
            this.checkCode = code; //把code值赋给验证码
            /*loginForm.seccode=code;*/
        },
        getCookie() {
            const username = Cookies.get("username");
            const password = Cookies.get("password");
            this.loginForm = {
                username: username === undefined ? this.loginForm.username : username,
                password: password === undefined ? this.loginForm.password : password
            };
        },
        //重置表单内容
        restForm(){
            this.$refs.loginFormRef.resetFields();  //重置表单的方法
            this.createCode(); //刷新验证码
        },
        //登录方法
        login(){
            //验证校验规则
            this.$refs.loginFormRef.validate(async valid =>{  //async 解析数据
                // console.log(valid); //如果验证成功返回ture，否则false
                //1如果验证失败，直接结束
                if(!valid) return; 
                //如果验证码输入正确就进行校验，每次校验失败刷新验证码
                if(this.loginForm.seccode == this.checkCode) {
                    const {data:res}=await this.$http.post("/user/login",this.loginForm); //访问后台//await,解析数据;解析结果返回data数据
                    console.log(res);

                    //2是否登录后台
                    if(res.code===200){
                      
                        window.sessionStorage.setItem('flag','ok'); // session 放置
                        //3显示登录成功
                        this.$message.success("登录成功！！！"+res.result.name);  //信息提示

                        //4存储user对象
                        window.sessionStorage.setItem("user",res.result); 
                          Cookies.set("num",1);
                        //console.log(res.user);
                        console.log(res.result.username)
                        Cookies.set("username", res.result.username);
                        Cookies.set("name",res.result.name)
                        Cookies.set("uid",res.result.id);
                    //    Cookies.set("userid",res.user.userid);
                    const {data:res1}=await this.$http.get("/user/getRoles?uid="+res.result.id);
                    const roles=res1.roles;
                    Cookies.set("roles",roles);
                        //5进入首页，页面路由跳转到首页
                        this.$router.push({path:"/indexCar"}); //跳转地址

                    }else{
                        this.$message.error("账号或密码错误！！！");  //错误提示
                        this.createCode(); //刷新验证码
                    }
           
                }else{
          
                    this.$message.error("验证码错误！！！");
                    this.createCode();//刷新验证码
                    return false;
                }
            });
        },
        //注册
        regist(){
            this.$router.push({path:"/regist"}); //跳转地址
        },
    }
}
</script>
<style lang="less" scpoed>
//根节点样式
.login_container{
    // 设置背景图铺满整个屏幕
    background-image: url("../assets/img/b1.jpg");
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    height: 100%;
}

// 登录框
.login_box{
    width: 400px;
    height: 350px;
    background-color: #010b16;
    border-radius: 3px;// 圆角
    position: absolute;// 绝对定位
    opacity:0.8;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);// 根据自己位置 以自己为长度位移
    
    
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

.btns{
    display:flex;// 弹性布局
    justify-content: flex-end;// 尾部对齐
    }
.login_form{
    position: absolute;
    bottom:0%;
    width:100%;
    padding:0 10px;
    box-sizing:border-box;// 设置边框
}


video{  
    position: fixed;  
    right: 0px;  
    bottom: 0px;  
    min-width: 100%;  
    min-height: 100%;  
    height: 100%;  
    width: auto;  
    /*加滤镜*/
    /*filter: blur(15px); //背景模糊设置 */
    /*-webkit-filter: grayscale(100%);*/  
    /*filter:grayscale(100%); //背景灰度设置*/  
    z-index:-11
}  
source{  
    min-width: 100%;  
    min-height: 100%;  
    height: auto;  
    width: auto;  
}
</style>