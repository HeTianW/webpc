<template>
  <el-submenu class="sbmnu" v-if="hasChild" v-show="open" :index="model.id">
    <template slot="title">
      <!-- <i class="el-icon-location"></i> -->
      <i class="el-icon-news"/>
      <span slot="title" style="font-size:15px;">{{model.resource_name}}</span>
    </template>
    <NavItem v-for="(item,index) in model.children" :key="index" :model="item"/>
  </el-submenu>
  <el-menu-item class="item" v-else v-show="open" :index="model.resource_url" >
    <i class="el-icon-edit-outline"></i>
    <!-- <i style="width:3ex"></i> -->
    <span slot="title" :id="model.id">{{model.resource_name}}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'NavItem',
  props: ['model'],
  data () {
    return {
      open:true
    }
  },
  computed: {
    hasChild:function(){return this.model.children && this.model.children.length}
  },
  methods:{
  }
}
</script>

<style scoped>

.el-submenu__icon-arrow,i{
  color: white !important;
}
li.is-active{
  background: #3a8ee6!important;
}
</style>


