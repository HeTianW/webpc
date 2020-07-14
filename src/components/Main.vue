<template>
  <el-container>
    <el-header>
      <Header/>
    </el-header>
    <el-container>
      <el-aside width="210px">
        <Menu/>
      </el-aside>
      <el-main >
        <router-view ></router-view>
      </el-main>
      
  </el-container>
</el-container>
</template>
<script>

import Bodier from '@/components/layout/Bodier'
import Header from '@/components/layout/Header'
import Menu from '@/components/element/NavMenu'

export default {
  name: 'Main',
  components: { Header,Bodier,Menu },
  data() {
    return{
        flag:'',
        active: ''
    }
  },
  methods:{
    ievent(data){
      this.flag = data;
    },
    routerGo(){
     //  this.$router.push({path:'main'});
    },
  },
  created(){
   // this.routerGo();
  }
}
</script>

<style scoped>
.el-container{
  height: 100%;
}
.el-main{
  padding: 0 !important;
   margin-bottom: 70px;
}
.el-header{
  padding: 0 !important;
}
.el-aside{
  background: #2a384a;
  overflow-x: hidden;
}
 /*滚动条样式*/
.el-aside::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;

}

.el-aside::-webkit-scrollbar
{
	width: 5px;
	background-color: #F5F5F5;

}

.el-aside::-webkit-scrollbar-thumb
{
	background-color: #409eff;
	
	background-image: -webkit-gradient(linear, 0 0, 0 100%,
	                   color-stop(.5, rgba(255, 255, 255, .2)),
					   color-stop(.5, transparent), to(transparent));

}

.el-menu{
  width: 100% !important;
}
li.is-active{
    background: #3a8ee6 !important;
}
  /* .main-ctr{
    width:100%;height:100%;
    display:-webkit-flex;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    overflow:hidden;
  } */
</style>
