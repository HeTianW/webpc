<template>
  <el-menu class="nav-mnu" v-show="open" 
      unique-opened
      :default-active="$route.path"  
      @select="handleSelect" 
      @open="handleOpen" 
      @close="handleClose"
      background-color="#2a384a"
      text-color="silver"
      active-text-color="#fff" router>
    <NavItem v-if="showRoot" :model="menus"></NavItem>
    <NavItem v-else v-for="(item,index) in menus" :key="index" :model="item"></NavItem>
  </el-menu>
</template>

<script>
import NavItem from '@/components/element/NavItem'
import API from '@/components/common/Api'
export default {
  name: 'NavMenu',
  components: { NavItem },
  data () {
    return {
      open: true,
      showRoot: false,
      activeIndex: '',
      menus: '',
    }
  }, 
  methods:{
    handleSelect(key, indexPath){
      console.info(indexPath);
    },
    
  },
  mounted(){
    API.getMenus().then(result=> {
      this.menus = result.data.data.resource;
    //  console.log(result.data.data.resource);
    });
  }
}
</script>

<style scoped>
/* .nav-mnu{
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    background: #112a44;
    background: #057cf3;
} */
</style>


