<template>
  <div class="container">
    <div class="comment" v-for="item in comments">
      <div class="info">

  <div class="right">
           
          <div class="name"><img class="avator" :src="require('D://workspace//img//1.jpg')" alt=""/>{{item.uname}}</div>
          <div class="date">{{item.addTime}}</div>
        </div>

      </div>
      <div class="content">{{item.content}}
         <span class="comment-reply" @click="showCommentInput(item,item)">
          <i class="iconfont icon-comment"></i>
          <span class="comment-reply1">回复</span>
        </span>

      </div>
        
 <div class="reply">
  <div class="item" v-for="reply in item.childList">
     <div class="reply-content">

            <span class="from-name">{{reply.uname}}</span><span>: </span>
            <span class="to-name">@{{reply.toUname}}</span>
            <span>{{reply.content}}</span>
          </div>
    <div class="reply-bottom">
            <span>{{reply.addTime}}</span>
            <span class="reply-text" @click="showCommentInput(item, reply)">
              <i class="iconfont icon-comment"></i>
              <span >回复</span>
            </span>
          </div>
            </div>
    <div class="write-reply" v-if="item.childList.length > 0" @click="showCommentInput(item,item)">
    <i class="el-icon-edit"></i>
          <span class="add-comment">添加新评论</span>
    </div>
  <transition name="fade">
          <div class="input-wrapper" v-if="showItemId === item.id">
            <el-input class="gray-bg-input"
                      v-model="inputComment"
                      type="textarea"
                      :rows="3"
                      autofocus
                      placeholder="写下你的评论">
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button class="btn" type="success" round @click="commitComment">确定</el-button>
            </div>
          </div>
        </transition>
 </div>


    </div>
    <div class="write-reply" @click="showComment()">
    <i class="el-icon-edit"></i>
          <span class="add-comment">添加新评论</span>
    </div>
      <transition name="fade1">
          <div class="input-wrapper" v-if="showItem === 1">
            <el-input class="gray-bg-input"
            
                      v-model="inputComment"
                      type="textarea"
                      :rows="3"
                      autofocus
                      placeholder="写下你的评论" clearable>
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button class="btn" type="success" round @click="commitComment">确定</el-button>
            </div>
          </div>
        </transition>
  </div>
</template>
<script>

import Cookies from "js-cookie";
export default {
    created() {
        this.getCommentList();
           this.getCookie();
           
    },
  props:{
      cidp:{
        type:"",
        required:true,
      }
  },
   

 data(){
   return{
      inputComment:"",
        showItemId: '',
        showItem:'',
     comments:[],
     addForm:{
        uid:"",
        uname:"",
        cid:this.cidp,
        content:"",
        parentId:'0',
        toUid:'',
        toUname:'',
     },
     ispurchase:{
        uid:"",
        cid:this.cidp
     },
     uid:"1",
       
   }
 },
  mounted() {
      this.getCommentList();
      this.getCookie();
  },
   methods: {
       getCookie(){
      const uname=Cookies.get("username");
      this.addForm.uname=uname;
      const uid=Cookies.get("uid");
      this.addForm.uid=uid;
      this.ispurchase.uid=uid;
      console.log(uid)
    
    },
     cancel() {
        this.showItemId = '',
        this.showItem=''
         this.addForm.parentId=0
        this.addForm.toUid=""
        this.addForm.toUname=""
      },
 
 async  showComment(){
     const{data:res}=await this.$http.post("/order/ispurchase",this.ispurchase);
        if(res.code==200){
     this.inputComment="",
    this.showItem=1;
    this.showItemId="";
        }else{
           this.$message({
                    message: '未购买该商品，权限不足',
                    type: 'error'
                   
                   }); 
        }

  
    
  },
      /**
       * 点击评论按钮显示输入框
       * item: 当前大评论
       * reply: 当前回复的评论
       */
      async showCommentInput(item, reply) {
        const{data:res}=await this.$http.post("/order/ispurchase",this.ispurchase);
        if(res.code==200){
 if (reply) {
          this.inputComment = ''
        } else {
          this.inputComment = ''
        }
        this.addForm.parentId=reply.id
        this.addForm.toUid=reply.uid
        this.addForm.toUname=reply.uname
       this.showItem=0
  this.showItemId = item.id
        }else{
           this.$message({
                    message: '未购买该商品，权限不足',
                    type: 'error'
                   
                   }); 

                
        }
       
        
      
      },
      async getCommentList(){
      const{data:res} =await this.$http.get("/comment/getByCid?cid="+this.cidp);
      console.log(res+"3333")
      this.comments=res.commentList;
      console.log(this.comments)
    },
    async commitComment() {
      this.addForm.content=this.inputComment;
        const{data:res} = await this.$http.post("/comment/addComment",this.addForm);
        window.location.reload();
      },
    },


   
}
</script>
<style scoped>
.avator{
  margin-left: 5px;
  margin-right: 20px;
  width: 30px;
  height: 30px;
  display: inline-block;
 
  border: 1px solid black;
  border-radius: 20px;
}
 .container {
    padding: 0 10px;
    box-sizing: border-box;
 }
  .comment {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-bottom: 1px solid #F2F6FC;
  }
.info {
display: flex;
align-items: center;
}
 .avatar {
          border-radius: 50%;
        }
         .right {
          display: flex;
          flex-direction: column;
          margin-left: 10px;}
            .name {
            font-size: 16px;
            color: #303133;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .date {
            font-size: 12px;
            color:#909399;  
          }

.content {
        font-size: 16px;
        color: #303133;
        line-height: 20px;
        padding: 10px 0;
      }
         .control {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #909399;}
        .like {
          display: flex;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;
        }
        .iconfont {
            font-size: 14px;
            margin-right: 5px;
          }
          .comment-reply {
          display: flex;
          align-items: center;
          cursor: pointer;}
.reply {
        margin: 10px 0;
        border-left: 2px solid #DCDFE6;
        }
.reply>item {
          margin: 0 10px;
          padding: 10px 0;
          border-bottom: 1px dashed#EBEEF5;}
           .reply-content {
            display: flex;
            align-items: center;
            font-size: 14px;
            color:  #303133;
           }
           .from-name {
              color: #409EFF;
            }
             .to-name {
              color: #409EFF;
              margin-left: 5px;
              margin-right: 5px;
            }
             .reply-bottom {
            display: flex;
            align-items: center;
            margin-top: 6px;
            font-size: 12px;
            color: #909399;
             }
             .reply-text {
              display: flex;
              align-items: center;
              margin-left: 10px;
              cursor: pointer;
             }
             .comment-reply1{
                 display: flex;
              align-items: center;
              margin-left: 10px;
              cursor: pointer;
                  font-size: 13px;
            margin-right: 5px;
            color: #909399;;
             }
             
             .icon-comment {
                margin-right: 5px;
              }
              .write-reply {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #909399; 
          padding: 10px;
          cursor: pointer;
              }
               .btn-control {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 10px;

               }
               .cancel {
              font-size: 16px;
              color: #606266;
              margin-right: 20px;
              cursor: pointer;
             
              }
              .cancel:hover{
                color: #333;
              }
              .comment-reply1:hover{
                color: #333;
              }
              .reply-text:hover{
                  color: #333;
              }
               .comment-reply:hover{
                   color: #333;
               }
.write-reply:hover{
  color: #303133;
}

</style>>


