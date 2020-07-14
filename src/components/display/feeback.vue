<template>

    <div class="page">
        <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="nickName" label="反馈人" ></el-table-column>
        <el-table-column prop="feedName" label="反馈分类" ></el-table-column>
        <el-table-column prop="content" label="反馈内容" >
            <template slot-scope="scope">
                <el-button size="mini"  type="success" plain @click="handleView(scope.row)">查看</el-button>
            </template>
        </el-table-column>
        <el-table-column prop="gmtCreate" label="反馈时间" ></el-table-column>
        <el-table-column label="操作" >
            <template slot-scope="scope">
                <el-button size="mini"  type="danger" plain @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

      <el-dialog title="反馈内容" :visible.sync="dialogVisible"  width="50%" center>
          {{content}}
          
      </el-dialog>
    
    <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
    </Pagination>
    </div>
</template>
<script>
import Pagination from '@/components/element/Pagination'
import API from '@/components/common/Api'

export default {
    components: { Pagination },
    data(){
        return{
            tableData:[],
            pn:1,
            ps:10,
            count:0,
            dialogVisible:false,
            content:''
        }
    },
    methods:{
        handleView(row){
            this.content = row.content;
            this.dialogVisible = true;
        },
       handleDelete(index,row){
           this.$confirm('此操作将永久删除, 是否继续？','提示',{
                type: 'warning',
                center: true
            }).then(_ => {
                API.delFeeBack(row.id).then(result=> {
                    this.getList();
                });
            }).catch(_ => {

            });
       },
        refreshCurrentChange(val){
            this.pn = val;
            this.getList();
        },
        refreshSizeChange(val){             
            this.pn = 1;
            this.ps = val;
            this.getList();
        },
       
        getList(){
            let data = {
                pn:this.pn,
                ps:this.ps,
            };
            API.getFeeBack(data).then(result=> {
              this.tableData = result.data.data.list;
              this.count = result.data.data.count;
            });
        },
    },
    created(){
        this.getList();
    }
}
</script>
<style scoped>

</style>

