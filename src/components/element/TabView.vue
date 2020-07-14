<template>
  <el-tabs class="tbv" v-model="activeTab"  @tab-remove="rmTab" @tab-click="handleClick">
    <el-tab-pane :label="firstTab.label" :name="firstTab.name">
      <team/>
    </el-tab-pane>
    <el-tab-pane v-for="item in currTabs" :key="item.name" :label="item.label" :name="item.name" closable>
        <!-- <institution v-if="item.label==='系统参数管理'"/>
        <role v-if="item.label==='角色权限管理'"/> -->
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import team from '@/components/display/team'

export default {
  name: 'TabView',
  components:{ team },
  data() {
    return {
      activeTab: 'home',
      firstTab: {label:'我的首页',name:'home'},
      currTabs: []
    }
  },
  mounted() {
    EventHub.$on('dbcItem',(target) => {
      this.openTabView(target)
    });
  },
  beforeDestroy() {
    EventHub.$off('dbcItem');
  },
  methods:{
    openTabView(mItem) {
      this.addTab(mItem.index,mItem.label);
    },
    addTab(tbIndex,tbLabel) {
      let tabs=this.currTabs;
      if(tabs.filter(tab => tab.name === tbIndex).length===0){
        this.currTabs.push({
          label: tbLabel,
          name: tbIndex
        });
      }
      this.activeTab = tbIndex;
    },
    rmTab(tabName) {
      let tabs=this.currTabs;
      let activeName=this.activeTab;
      if(activeName===tabName){
        activeName=this.firstTab.name;
      }
      this.currTabs = tabs.filter(tab => tab.name !== tabName);
      this.activeTab = activeName;
    },
    handleClick1(tab, event){
      // console.log(tab, event);
      console.log(event.target);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tbv{
  height:100%;
  border:0px red solid;
}
.no-select{
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
}
</style>
