<template>
     <div class="block" >
        <el-pagination @current-change="handleCurrentChange"  @size-change="handleSizeChange" 
        :page-sizes="[5,10,15,20,25]"
        :current-page.sync="pageCurrent" :page-size="pageSize" layout="total, sizes, prev, pager, next"
        :total="count">
        </el-pagination>
  </div>
</template>
<style scoped>
.block{
    position: fixed;
    bottom: 0;
    width: calc(100% - 210px);
    background: #fff;
    padding: 15px 0;
    text-align: right;
    z-index: 999;
    left: 210px;
}
</style>

<script>
export default {
    data(){
        return{
            pageCurrent:1,
            pageSize:10
        }
    },
    props:['count','pageCurrent'],
    methods:{
        handleCurrentChange(val){
            this.pageCurrent = val;
            this.$emit('refreshCurrentChange',this.pageCurrent);
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.$emit('refreshSizeChange',this.pageSize);
        },
    },
    
}
</script>

