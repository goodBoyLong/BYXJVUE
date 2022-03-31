import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
//引入login组件

//引用Home组件，新建的组件要导入这
import Home from '../components/Home.vue'
//引用Welcome组件，新建的组件要导入这
import Welcome from '../components/Welcome.vue'
import Login from '../components/Login.vue'
import Regist from '../components/Regist.vue'
//引用UserList组件，新建的组件要导入这
import UserList from '../components/admin/UserList.vue'
import Rights from '../components/admin/Rights.vue'
import Info from '../components/admin/Info.vue'





import indexUser from '../components/indexUser.vue'



import CommodityList from  '../components/common/CommodityList.vue'
import Commodity from  '../components/common/Commodity.vue'
import indexCar from  '../components/common/IndexCar.vue'
import AboutUs from  '../components/common/AboutUs.vue'
import Notice from  '../components/common/Notice.vue'
import CarMenu from '../components/admin/CarMenu.vue'
import CarInfo from '../components/common/CarInfo.vue'
import Comment from '../components/common/Comment.vue'
import News from '../components/admin/News.vue'
import MyCommidity from '../components/user/MyCommidity.vue'
import MyCommidity1 from '../components/user/MyCommidity1.vue'
import MyOrder from '../components/user/MyOrder.vue'
import MySell from '../components/user/MySell.vue'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(VueRouter)

Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

const routes = [
  {
    path:"*",
    redirect:"/indexCar" //重定向
  },
  {
    path:'/indexUser',
    component:indexUser
  },
  
  {
    path:'/regist',
    component:Regist,
  },
  {
    path:'/login',
    component:Login,
  },
  {
    path:"/commodityList1",
    component:CommodityList
  },
  {
    path:"/commodity",
    component:Commodity
    
  },
  {
    path:"/comment",
    component:Comment
  },
  {
path:"/indexCar",
component:indexCar
  },
  {
    path:"/notice",
    component:Notice
  },
  {
    path:"/aboutUs",
    component:AboutUs
  },
  {
    path:'/carInfo',
    component:CarInfo,
    meta:{
      roles:['student','admin']
    }
  },





  {
    path:"/home",
    component:Home,
    redirect:"/welcome",
    children:[
      {

        path:'/carMenu',
        component:CarMenu,
        meta:{
          roles:['admin']
        }
      },
      {
        path:'/news',
        component:News,
        meta:{
          roles:['student','admin']
        }
      },
      {

        path:'/myCommidity',
        component:MyCommidity
      },
      {

        path:'/myCommidity1',
        component:MyCommidity1
      },
      {

        path:'/myOrder',
        component:MyOrder
      },
      {

        path:'/mySell',
        component:MySell
      },




      {
        path:"/welcome",
        component:Welcome,
      },
      {
        path:"/user",
        component:UserList,
      },
      {
        path:"/rights",
        component:Rights,
      } ,
      {
        path:"/info",
        component:Info,
      },
      
     
    ]
  }
]

const router = new VueRouter({
  mode:'history',
  routes
})

// 出现问题的时候使用
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

//挂在路由导航守卫
router.beforeEach((to,from,next)=>{
  const role=Cookies.get('roles')
 
 
  
  //to 将要访问
  //from 从哪访问
  //next 接着干的事  next(url)如果有写，将重定向到url上；没有写，next()继续访问to路径
  if(to.path=='/login'||to.path=='/indexUser'|| to.path=='/regist'||to.path=='/indexCar'
  ||to.path=='/aboutUs'||to.path=='/commodityList1'||to.path=='/notice')  return next();
  //获取user
  const userFlag=window.sessionStorage.getItem("user"); //取出当前用户
  if(!userFlag) return next('/login'); //无值，返回登录页
  if(to.meta.roles!=null){
    if(to.meta.roles.includes(role)){
      next() //放行
     }else{
      alert("权限不足，将退回首页") //跳到404页面
      return next('/indexCar')
     }
  }
  next(); //符合要求 放行
})

export default router  //暴露出去
 