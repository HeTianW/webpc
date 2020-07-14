<template>

    <div class="page">
        <div class="search">
        
        <el-button type="primary"  @click="add" >添加</el-button>
    </div>
        <el-table :data="tableData" style="width: 100%;">
        <el-table-column type="index" label="序号" ></el-table-column>
        <el-table-column prop="value" label="学校名称" ></el-table-column>
        <el-table-column label="操作" >
            <template slot-scope="scope">
                <el-button size="mini"  type="success" plain @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button size="mini"  type="danger" plain @click="handleDel(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" v-if="scope.row.roleId != 20 && scope.row.roleId !=  50" type="primary"  @click="handleAuth(scope.$index, scope.row)">设置权限</el-button>

            </template>
        </el-table-column>
    </el-table>
    <el-dialog :show-close="false" :close-on-click-modal="false" :title="flag == 1 ?'添加学校':'修改学校'" :visible.sync="dialogVisible" width="30%" center>
         <el-form  label-width="100px"  :model="form"  ref="form" :rules="rules">
            <el-form-item label="学校名称" prop="value" >
                <el-input v-model="form.value" @blur="checkSame"></el-input>
            </el-form-item>
         </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel('form')">取 消</el-button>
            <el-button type="primary" @click="save('form')" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>

      <el-dialog title="设置权限" :visible.sync="dialogAuthVisible" width="50%" center>
        <span slot="footer" >
            <el-tree ref="tree" :data="authlist" show-checkbox node-key="id" :props="defaultProps"></el-tree>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="remove()">取 消</el-button>
            <el-button type="primary" @click="ok()">确 定</el-button>
        </span>
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
        var checkSame = (rule,value,callback) => {
            for(var i in this.tableData){
                if(this.tableData[i].value == this.form.value){
                    callback(new Error('学校已存在'));
                }else{
                    callback();
                }
            }
        };
        return{
            pn:1,
            ps:10,
            count:0,
            flag:'',
            dialogVisible:false,
            tableData: [],
            imageUrl:'',
            loading:false,
            form:{
                value:'',//				               
            },
            rules: {
             value: [
              { required: true, message: '请输入学校名称', trigger: 'blur' },
              { pattern: /^[\u4e00-\u9fa5]+$/, message: '只能输入中文' },
              { min:1,max:30,message:'长度在 1 ~ 30 个字符' ,trigger: 'blur'},
            ],
            
          },
        }
    },
    methods:{
        handleEdit(index,row){
            this.dialogVisible = true;
            this.flag = 2;
            // this.form = row;
            this.getDetail(row);
        },
      handleAuth(index, row) {
        this.dialogAuthVisible = true;
        this.roleId = row.roleId;
        var id;
        if (row.resourceId != null) {
          id = row.resourceId.split(",");
          var list = [];
          for (var i in id) {
            list.push(Number(id[i]));
          }
          this.$refs.tree.setCheckedKeys(list);
        }
      },
        getDetail(row){
            API.detailSchool(row.id).then(result => {
                this.form = result.data.data;
            });
        },
        save(formName){
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.loading = true;
                API.School(this.form).then(result=> {
                    this.loading = false;
                    if(result.data.code != 0){
                        this.dialogVisible = true;
                    }else{
                        this.dialogVisible = false;
                        this.$refs[formName].resetFields();
                        this.getList();
                    }
                });
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        add(){
            this.form.value = '';
            this.dialogVisible = true;
            this.flag = 1;
        },
        cancel(formName){
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
        },
        handleDel(index,row){
            this.$confirm("此操作将永久删除, 是否继续？", "提示", {
                type: "warning",
                center: true
            }).then(_ => {
                let data = {
                    id: row.id
                };
                API.delDisabled(data).then(result => {
                    this.getList();
                });
            }).catch(_ => {});
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
            API.getSchool(data).then(result=> {
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


