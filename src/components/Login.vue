<template>
  <div class="lgn-bkg">
    <div class="lgn-ctr">
      <p class="lgn-ttl">欢迎登录</p>
      <el-form class="lgn-frm" label-position="left" label-width="1em" ref="loginfrm" :model="loginInfo" status-icon :rules="rules">
        <el-form-item label=" " prop="userNo">
          <el-input name="userNo" v-model="loginInfo.userNo" placeholder="用户账号">
            <i slot="prefix" class="lgn-fa fa fa-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item label=" " prop="userPwd" style="margin-top:25px">
          <el-input name="userPwd" @keyup.enter.native="submit('loginfrm')" v-model="loginInfo.userPwd" placeholder="登录密码" type="password" autocomplete="off">
            <i slot="prefix" class="lgn-fa fa fa-lock"></i>
          </el-input>
        </el-form-item>
        <!-- <div class="lgn-chk">
          <a class="lgn-fgt" href="https://www.baidu.com"><i class="fa fa-question-circle-o"></i>&nbsp;&nbsp;忘记密码</a>
          <el-checkbox v-model="isAutoLogin">自动登录</el-checkbox>
        </div> -->
        <el-button class="lgn-btn" type="primary"  @click="submit('loginfrm')" :loading="loading">登&nbsp;&nbsp;录</el-button>
      </el-form>
    </div>
    <div class="lgn-cpy">@2018 changsha All Rights Reserved</div>
  </div>
</template>

<script>
import API from '@/components/common/Api'
import md5 from 'js-md5'

export default {
  name: 'Login',
  data() {
      var chkUserNo = (rule,value,callback) => {
        var reg=new RegExp('^[A-Za-z0-9@._]+$');
        if(!reg.test(value)){
          callback(new Error('只能输入@ _ . 数字 英文字母'));
        }else{
          callback();
        }
      };
    return {
      loginInfo:{
        userNo:'',
        userPwd:''
      },
      isAutoLogin:false,
      loading:false,
      rules:{
        userNo:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:30,message:'长度在 3 ~ 30 个字符',trigger:'blur'},
          {validator:chkUserNo,trigger:'blur'}
        ],
        userPwd:[
          {required:true,message:'请输入密码',trigger:'blur'},
          // {min:6,max:30,message:'长度在 6 ~ 30 个字符',trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    submit(frm){
      this.$refs[frm].validate((valid,obj) => {
        if(valid) {
          
          this.loading = true;
          let data = {
            phone:this.loginInfo.userNo,
            // pwd:md5(this.loginInfo.userPwd)
            pwd:this.loginInfo.userPwd

          };
          API.login(data).then(result => {
            console.log(result);
            
            this.loading = false;
            if(result.data.code != 0){
              
            }else{
             this.$router.push({name:'main'});
                // this.$router.push({path:'Main'});
              sessionStorage.setItem('userName',this.loginInfo.userNo);
              sessionStorage.setItem('token',result.data.data.token);
              sessionStorage.setItem('user',JSON.stringify(result.data.data));//保存用户信息
            }
            
            
          },err=>{
            this.loading = false;
          })
        }else {
          this.$refs[frm].$el[Object.keys(obj)[0]].focus();
        return false;
      }
      });
    }
  }
}
</script>

<style scoped>
  .lgn-bkg{
    width:100%;height:100%;
    display:-webkit-flex; /* Safari */
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    background-color:#2a384a;
  }
  .lgn-ctr{
      width:280px;
      background:rgb(255,255,255);
      border-radius: 5px;
      padding:10px 30px 35px 20px;
      text-align:center;
  }
  .lgn-ttl,.lgn-fa{
      font-size:16px;
  }
  .lgn-chk{
      display:-webkit-flex; /* Safari */
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:0px 0px 0px 15px;
  }
  .lgn-fgt{
      text-decoration:none;
      outline:none;
      color:rgb(99,99,99);
      font-size:14px;
  }
  .lgn-btn{
      margin:25px 0px 0px 15px;
      width:260px;
      font-size:14px;
  }
  .lgn-cpy{
    margin-top:20px;
    color:rgb(168,168,168);
    font-size:14px;
    font-style:italic;
  }
</style>
