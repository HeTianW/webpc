<template>
  <div class="header">
    <div>湘遇后台管理系统</div>
    <div>
      <el-dropdown trigger="click" style="color:white;" @command="handleCommand">
        <span class="el-dropdown-link">
          您好{{userName}}
          ，欢迎使用<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">修改密码</el-dropdown-item>
          <el-dropdown-item command="2">安全退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <span @click="logout">退出</span> -->
      </div>
      <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" center>
        <el-form  label-width="100px"  :model="form"  ref="form" :rules="rules">
            <el-form-item label="原密码" prop="mpwd">
                <el-input v-model="form.mpwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pwd">
                <el-input v-model="form.pwd" type="password"></el-input>
            </el-form-item>
             <el-form-item label="确认密码" prop="surepwd">
                <el-input v-model="form.surepwd" type="password"></el-input>
            </el-form-item>
         </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('form')">取 消</el-button>
          <el-button type="primary" @click="save('form')" :loading="loading">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import API from '@/components/common/Api'
import md5 from 'js-md5'

export default {
  name:'Header',
  data(){
    return{
      userName:'',
      dialogVisible:false,
      loading:false,
      form:{
        mpwd:'',
        pwd:'',
        userId:'',
        surepwd:''
      },
      rules: {
            mpwd: [
              { required: true, message: '请输入原密码', trigger: 'blur' },
              { min:6,max:30,message:'长度在 6 ~ 30 个字符' ,trigger: 'blur'},
            ],
            pwd: [
              { required: true, message: '请输入新密码', trigger: 'blur' },
              { min:6,max:30,message:'长度在 6 ~ 30 个字符' ,trigger: 'blur'},
            ],
            surepwd: [
              { required: true, message: '请输入确认密码', trigger: 'blur' },
              { min:6,max:30,message:'长度在 6 ~ 30 个字符' ,trigger: 'blur'},
            ],
            
          },
    }
  },
  methods:{
    clear(){
      this.form.old = '';
      this.form.new = '';
    },
    handleCommand(command) {
      if(command == 1){
        this.dialogVisible = true;
      }else if(command == 2){
        this.logout();
      }
    },
    save(formName){
      this.$refs[formName].validate((valid) => {
            if (valid) {
              var user = JSON.parse(sessionStorage.getItem('user')); 
              if(this.form.pwd != this.form.surepwd){
                this.$message.error('确认密码与新密码不一致！');
                return;
              }
              this.form.pwd = md5(this.form.pwd);
              this.form.mpwd = md5(this.form.mpwd);

              let data = {
                mpwd:this.form.mpwd,
                pwd:this.form.pwd,
                userId:user.uid,
              };

                this.loading = true;
                API.Password(data).then(result=> {
                    this.loading = false;
                    if(result == 'error'){
                        this.dialogVisible = true;
                    }else{
                        this.dialogVisible = false;
                        this.$refs[formName].resetFields();
                        this.$router.push({path:'/login'});
                    }
                });
            } else {
                console.log('error submit!!');
                return false;
            }
            });
    },
    cancel(formName){
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
      this.clear();
    },
    logout(){
      API.logout().then(result=> {
        sessionStorage.clear();
        this.$router.push({name:'login'});
      });
    }
  },
  created(){
    this.userName = sessionStorage.getItem('userName');
  }
}
</script>

<style scoped>
.el-dropdown-link{
  cursor: pointer;
}
  .header{
    height:100%;
    display:flex;
    justify-content:space-between;
    align-items:center;
    background-color:#112a44;
    color: silver;
    padding: 0 20px;
  }
  .header div:first-child{
    font-size: 25px;
  }
  .header div:first-child{
    font-size:20px;
  }
  .header div:last-child span{
    margin: 10px;
    font-size: 14px;
    color:silver;
  }
</style>
