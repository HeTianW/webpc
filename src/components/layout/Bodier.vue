<template>
  <el-container class="bdr">
    <el-aside class="bdr-lft" style="height:100%;width:auto;min-width:222px;overflow:hidden;">
      <el-scrollbar style="height:100%;margin-top:17px;">
        <NavMenu/><br/>
      </el-scrollbar>
    </el-aside>
    <el-main class="bdr-rht" style="height:100%;">
      <TabView/>
    </el-main>
  </el-container>
</template>

<script>
import NavMenu from '@/components/element/NavMenu'
import TabView from '@/components/element/TabView'
export default {
  name:'Bodier',
  components: { NavMenu,TabView },
  data(){
    return{
      msg:''
    }
  }
}
</script>

<style scoped>
  .bdr{
    width:100%;height:100%;
  }
  .bdr-lft{
    /* background-color:#545c64; */
    background-color:#2a384a;
  }
  .bdr-rht{
    border:0px red solid;padding:0 20px;
  }
</style>