<template>
    <div class="page">
        <div class="search">
            <el-button type="primary" @click="add">新增用户</el-button>
            <el-button type="danger" @click="batch(1)">禁用</el-button>
            <el-button type="success" @click="batch(0)">启用</el-button>
        </div>
        
        <el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="telephone" label="账号" ></el-table-column>
            <el-table-column prop="nickname" label="用户昵称" ></el-table-column>
            <el-table-column prop="roleName" label="角色" ></el-table-column>
            <el-table-column prop="enable" label="用户状态" :formatter="status"></el-table-column>
            <el-table-column prop="gmtCreate" label="发布时间" ></el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="mini"  type="primary"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button size="mini"  type="success"  @click="handlePwd(scope.$index, scope.row)">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>
       

        <el-dialog :title="flag==1?'新增用户':'修改用户'" :visible.sync="dialogVisible" width="50%" center>
         <el-form status-icon label-width="100px" :model="form" :rules="rules" ref="form"  >
            <el-form-item label="用户账号" prop="telephone" v-if="flag == 2" >
                <el-input v-model="form.telephone" disabled></el-input>
            </el-form-item>
             <el-form-item label="用户账号" prop="telephone" v-if="flag == 1" >
                <el-input v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-form-item label="初始密码" prop="password" v-if="flag == 1">
                <el-input type="password" v-model="form.password "></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
                <el-select placeholder="请选择" style="width:100%;" v-model="form.roleId">
                    <el-option v-for="item in rolelist" :key="item.roleId" :value="item.roleId" :label="item.roleName">
                    </el-option>
                </el-select>
            </el-form-item>
           <el-form-item label="学校" prop="schoolId">
           <el-select placeholder="请选择学校" style="width:200px;margin-right:20px;" v-model="form.value">
             <el-option v-for="item in school" :key="item.Id" :label="item.value" :value="item.value"></el-option>
           </el-select>
           </el-form-item>
         </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel('form')">取 消</el-button>
            <el-button type="primary" @click="save('form')" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog  title="重置密码" :visible.sync="dialogPwdVisible" width="40%" center>
         <el-form  status-icon :model="form2" :rules="rules2" ref="form2" label-width="100px">
            <el-form-item label="新密码" prop="pwd">
                <el-input type="password" v-model="form2.pwd"></el-input>
            </el-form-item>
         </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="remove('form2')">取 消</el-button>
            <el-button type="primary" @click="ok('form2')">确 定</el-button>
        </span>
    </el-dialog>
    <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
    </Pagination>
</div>
</template>
<script>
import API from '@/components/common/Api'
import Pagination from '@/components/element/Pagination'

export default {
    components: { Pagination },
    data(){
        return{
            loading:false,
            dialogVisible:false,
            dialogPwdVisible:false,
            pn:1,
            ps:10,
            count:0,
            userId:'',
            flag:'',
            tableData: [],
            multipleSelection:[],
            rolelist:'',
            school:'',
            form:{
                id:'',	//			用户ID （新增不需要传入用户ID，更新则传入用户ID）
                telephone:'',	//		用户账号
                nickname:'',	//		用户昵称
                password:'',	// 		用户密码
                roleId:'',	//
                value:''
            }, 
          
            rules: {
                telephone: [
                    { required: true, message: '请输入用户账号', trigger: 'blur' },
                    { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' },
                    { pattern:/^[a-zA-Z0-9][a-zA-Z0-9_]+$/, message: '只能输入字母数字和下划线',trigger: 'blur'  },
                ],
                nickname: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' },
                ],
            /*    value: [
                    { required: true, message: '请选择学校', trigger: 'change' }
                ],   */

            },
            form2:{
                userId:'',
                pwd:'',
            },
            rules2: {
                pwd: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                againpwd: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' }
                ],
               
            },   
        }
    },
    methods:{

        clear(){
            this.form.id = '';	
            this.form.telephone = '';
            this.form.nickname = '';	
            this.form.password = '';
            this.form.roleId = '';
            this.form.value='';
        },
        status(row){
            return row.enable == 0 ?'启用':'禁用';
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
        add(){
            this.clear();
            this.dialogVisible = true;
            this.flag = 1;
        },
        handlePwd(index,row){
            this.dialogPwdVisible = true;
            this.form2.userId = row.id;
        },
        batch(flag){
            if(this.multipleSelection.length <= 0 ){
                this.$message({
                message: '请先选择用户',
                type: 'warning'
                });
                return;
            }

            this.$confirm("是否执行此操作？", "提示", {
                type: "warning",
                center: true
            }).then(_ => {
                var userId = [];
                for(var i in this.multipleSelection){
                    userId.push(this.multipleSelection[i].id);
                }
                API.batchUser(userId,flag).then(result=> {
                    this.getList();
                });
            }).catch(_ => {});
          
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleEdit(index,row){
            this.flag = 2;
            this.dialogVisible = true;
            this.form.id = row.id;
            this.form.nickname = row.nickname;
            this.form.telephone = row.telephone;
            this.form.roleId = row.roleId;
            this.form.value=row.value;
        },

        save(formName){



            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.flag == 2){
                        var t = {
                            id:this.form.id,
                            nickname:this.form.nickname,
                            roleId:this.form.roleId,
                            telephone:this.form.telephone,
                            collegeManage:this.form.value,
                            experience:1,
                            enable:0,
                            certFlag:0
                        }
                        this.form = t;
                    }else{
                        this.form.password = this.form.password;
                    }
                    this.loading = true;

                    API.User(this.form).then(result=> {
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
                    this.$message({message: '还有验证未通过的信息',type: 'warning'});
                    return false;
                }
            });

        },
        cancel(formName){
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
            
        },
        remove(formName){
            this.dialogPwdVisible = false;
            this.$refs[formName].resetFields();
        },
        ok(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.form2.pwd = this.form2.pwd;
                    API.resetPwd(this.form2).then(result=> {
                        this.dialogPwdVisible = false;
                        this.$refs[formName].resetFields();
                        this.getList();
                    });
                } else {
                    this.$message({message: '还有验证未通过的信息',type: 'warning'});
                    return false;
                }
            });
        },
        getList(){
            let data = {
                pn:this.pn,
                ps:this.ps
            };
            API.getUser(data).then(result=> {
              this.tableData = result.data.data.list;
              this.count = result.data.data.count;
            });
        },
        getRole(){
            API.getRole().then(result=> {
              this.rolelist = result.data.data;
            });
        },
      getSchool(){
        API.constSchool().then(result => {
          this.school = result.data.data;
        });
      }
    },

    created(){
      this.getSchool();
        this.getList();
        this.getRole();


    }
}
</script>
<style scoped>
.add{
    display: flex;
    align-items: center;
    padding: 10px 0;
}
</style>

