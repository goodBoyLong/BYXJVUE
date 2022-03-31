<template>
  <div>

    <el-carousel  :interval="2000" type="card" >
      <el-carousel-item v-for="item in images" :key="item.id">
        <img :src="item.idImage" alt="">
   
      </el-carousel-item>
   </el-carousel>
</div>
</template> 

<script>
export default {
data(){
  return{
    images:[
         
      {id:1,idImage:require('D://workspace//img//s1.jpg')},
         {id:2,idImage:require('D://workspace//img//s2.jpg')},
     {id:3,idImage:require('D://workspace//img//s3.jpg')},
      {id:4,idImage:require('D://workspace//img//s4.jpg')},

    ]
  }
}
}
</script>

<style lang="less">
.el-carousel__item h3 {
    //color: #475669;
    font-size: 14px;
    //opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    //background-color: #99a9bf;
    //background-image: url("../assets/img/6.jpg");
  }
  
  .el-carousel__item:nth-child(2n+1) {
    //background-color: #d3dce6;
  }
  
  div>p{
    font-size: 20px;
    text-align: center;
  }
</style>