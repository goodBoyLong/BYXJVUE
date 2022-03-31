<template>
  <el-container >
      <el-header><index-user style="margin-bottom:100px"></index-user></el-header>
   
    <el-main class="main" >
    <div>
        <viewer  >
          <img style="float:left"
              :src="require('D://workspace//img//' + carInfo.img+'.jpg')"
             
            />
        </viewer>
    </div>
       <i v-if="this.love==0" @click="updateComm()"  class="el-icon-star-off love"></i>
           <i v-else @click="updateComm()"  class="el-icon-star-on love"></i>
    <div class="desc">
        <h2 style="margin-top:30px">{{carInfo.comname}}</h2>
        <h4 style="margin-top:20px"><img class="avator" :src="require('D://workspace//img//1.jpg')" alt="">{{uname}}</h4>

        <h2 style="margin-top:20px;font-size:15px"><span style="font-size:20px">【商品介绍】</span>{{carInfo.info}}</h2>
        <h3 style="color:#E7503C;margin-top:20px">￥{{carInfo.price}}</h3>
        <h3 style="margin-top:20px">{{carInfo.carInfo}}</h3>

         <div style="width:150px;height:30px;margin-top:20px" >
                         <el-input style="width:150px;padding-left:20px" v-model="count" :value="count"  @change="changeCount()" :min="1" :max="carInfo.total">
                          <el-button style="width:10px" slot="prepend" @click="changeQuantity('-')"><i class="el-icon-minus"></i></el-button>
                          <el-button style="width:10px" slot="append" @click="changeQuantity('+')"><i class="el-icon-plus"></i></el-button>
                           
                          </el-input>
                          <br />
                           <span style="color:#999;display: block;text-align:center">库存{{carInfo.total}}件</span>
                           <button  class="submit" style="" @click="purchase">购买</button>
                 
                        </div>
     
    </div>
    </el-main>
  <div style="background:grey;width:1300px;margin-left:21px">
    <hr>
      <comment style="margin-left:19px;padding-left:300px;width:2000px" v-bind:cidp="carId"></comment>
  </div>
  </el-container>

</template>
<script>
import vueQr from 'vue-qr'
import Cookies from "js-cookie";
import IndexUser from '../indexUser.vue'
import Comment from '../common/Comment.vue'
export default {
    components:{IndexUser,Comment,vueQr},
  created() {
this.getLove();
   this.carId=this.$route.query.id;
   this.getCarInfo();
      this.getCookie();
      this.getCommentList();
  },
  data() {
    return {


 love:'',
      count:1,
      carId:'',
      carInfo:'',
      uname:"",
      comments:[],
      orderForm:{
        oid:'',
        uid:"",
        cid:"",
        count:"",
        status:"0",
        price:"",
        sid:"",
      
      },
       concernForm:{
        uid:'',
        commid:'',
      },
      payInfo: {
        out_trade_no: "",
        subject: "",
        total_amount: 1,
        description: "",
      },
    };
  },
  mounted() {
     this.getCarInfo();
this.getLove();
      this.getCommentList();
      this.addOrder();
  },
  
  methods:{
  async updateComm(){
      this.concernForm.commid=this.carId;
      console.log(this.concernForm)
            const{data:res} =await this.$http.post("/commodity/update",this.concernForm);

            this.getLove();
    },
    async getLove(){
      this.concernForm.commid=this.carId;
            const{data:res} =await this.$http.post("/commodity/love",this.concernForm);
            this.love=res.concern.status;
    },
     async addOrder(){
 const{data:res} =await this.$http.get("/notifyUrl");
     },

    changeQuantity(opt){
    if(opt==="-"){
      if(this.count>1){
        this.count=this.count-1;
      }
    }else{
      if(this.count<this.carInfo.total){
this.count=this.count+1;
      }
    }
    },
    getCookie(){
     
     const uid=Cookies.get("uid");
      const role=Cookies.get("roles");
    this.role=role;

      this.concernForm.uid=uid;
      this.orderForm.uid=uid;
      console.log(uid)
  
   
    },
    async getCommentList(){
      const{data:res} =await this.$http.get("/comment/getByCid?cid="+this.carId);
      console.log(res+"3333")
      this.comments=res.commentList;
      console.log(this.comments)
    },
      async getCarInfo(){
            const{data:res}=await this.$http.get("/index/getCarInfoById?carId="+this.carId);
            this.carInfo=res.carInfo;
                   const{data:res1}=await this.$http.get("/user/getUserById?id="+this.carInfo.uid);
this.uname=res1.user.username;
            console.log("1111dd"+this,this.carId)
            console.log("carInfo"+this.carInfo)
      },
      async purchase(){
        if(this.carInfo.total<1){
          alert("该商品已经售罄!")
        }
         else{
    this.payInfo.description=this.carInfo.info;
    this.payInfo.total_amount=this.carInfo.price*this.count;
    this.payInfo.subject=this.carInfo.comname;
    this.orderForm.sid=this.carInfo.uid;
    this.orderForm.cid=this.carInfo.id;
    this.orderForm.status=0;
    this.orderForm.price=this.payInfo.total_amount;
    this.orderForm.count=this.count;
    
    const{data:res1} = await this.$http.post("/order/add",this.orderForm);
    this.payInfo.out_trade_no=res1.oid;
          const{data:res}=await this.$http.post("/order/alipay",this.payInfo);
          
   const div = document.createElement("div");
          div.innerHTML = res; // data就是接口返回的form 表单字符串

          document.body.appendChild(div);
          document.forms[0].setAttribute("target", "_target"); // 新开窗口跳转
          document.forms[0].submit();
 
      }
       }
      

  }
};
</script>

<style scoped>
.submit{
  border-radius: 35%;
  width: 70px;
  background: red;
height:40px;float:right;margin-top:-64px;margin-left:170px; position: absolute;
}
.love{
  color:red;
font-size: 45px;
    float: right;
    margin-top: 20px;
    margin-right: 50px;
}
.avator{
  margin-left: 5px;
  margin-right: 20px;
  width: 60px;
  height: 60px;
  border: 1px solid black;
  border-radius: 20px;
}
.desc{
  position: flex;
  margin-left: 340px;
}
.main{
width: 1299px;
    margin-top: 82px;
    padding-top: -20px;
    margin-left: 21px;
    padding-left: 350px;
    background: grey;
}
.cover {
  width: 115px;
  height: 172px;
  margin-bottom: 7px;

  overflow: hidden;
  cursor: pointer;
}

img {
  border: 2px solid black;
    margin-left: -20px;
  width: 300px;
  height: 400px;
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
