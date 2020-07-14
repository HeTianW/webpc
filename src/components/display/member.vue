<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
<div class="page">
    <div class="search">
        <el-input clearable v-model="name" placeholder="昵称" style="width:200px;margin-right:20px;"></el-input> 
        <el-input clearable v-model="phone" placeholder="手机号码" style="width:200px;margin-right:20px;"></el-input> 
        <el-select clearable v-model="college" filterable placeholder="请选择学校" style="width:200px;margin-right:20px;">
            <el-option v-for="item in school" :key="item.id" :label="item.value" :value="item.value"></el-option>
        </el-select>
        <el-select clearable v-model="status" placeholder="请选择认证状态" style="width:200px;margin-right:20px;">
          <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <el-select clearable v-model="enable" placeholder="请选择会员状态" style="width:200px;margin-right:20px;">
          <el-option v-for="(item, index) in enableList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
       
        
        <el-date-picker clearable 
        v-model="startTime" 
        value-format="yyyy-MM-dd HH:mm:ss"
         type="datetime" placeholder="选择日期">
        </el-date-picker>
        <span style="display: inline-block;padding: 10px;">至</span>
        <el-date-picker clearable value-format="yyyy-MM-dd HH:mm:ss" 
        v-model="endTime" type="datetime" placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" plain icon="el-icon-search" @click="search" style="margin-left:20px;"></el-button>
        <!-- <el-button type="primary" >导入</el-button>
        <el-button type="primary" >导出</el-button> -->
    </div>
  <div class="sort">

  <el-select clearable v-model="sorts" filterable placeholder="请选择排序方式"  style="width:670px;margin-right:20px;align-content: center">
    <el-option v-for="(item, index) in sortList" :key="index" :label="item.label" :value="item.value"></el-option>
  </el-select>
   <el-button type="high" plain icon="el-icon-sort" @click="sort" style="margin-left:30px"></el-button>
    </div>


    <el-table :data="tableData" style="width: 100%" header-cell-class-name="header-cell-color" v-loading="listLoading">
        <el-table-column prop="no" label="序号" type="index" ></el-table-column>
        <el-table-column prop="college" label="学校" ></el-table-column>
        <el-table-column prop="nickname" label="昵称" ></el-table-column>
        <el-table-column prop="telephone" label="手机号码"></el-table-column>
        <el-table-column  prop="gmtCreate"  label="时间"  ></el-table-column>
        <el-table-column  prop="experience" label="经验值"  ></el-table-column>
        <el-table-column prop="certFlag" label="实名认证" :formatter="formatterCertFlag"></el-table-column>
        <el-table-column prop="enable" label="用户状态" :formatter="formatterEnable" ></el-table-column>
        <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
                <el-button size="mini" v-if="scope.row.certFlag != 0 " type="primary" plain  @click="handleDetail(scope.$index, scope.row)" >查看</el-button>
                <el-button size="mini"  type="primary" v-if="scope.row.enable == 0 " @click="handleProhibit(scope.row,1)" >禁用</el-button>
                <el-button size="mini"  type="success" v-if="scope.row.enable == 1 " @click="handleProhibit(scope.row,0)" >启用</el-button>
                <el-button size="mini"  type="primary"   plain @click="handleDetails(scope.row)" >详情</el-button>
            </template>

        </el-table-column>

    </el-table>

    
    <el-dialog :visible.sync="dialogDetailVisible" width="50%" center :close-on-click-modal="false">
        <div class="member">
            <div class="up">
                <img :src="detail.header">
                <div class="info">
                    <div class="name">{{detail.name}} 
                      <span v-if="infob.sex == 1">男</span><span v-if="detail.sex == 2">女</span>
                    <span>{{detail.telephone}}</span></div>
                    <div>LV{{detail.grade}} <span>经验值：{{detail.experience}}</span></div>
                    <div>{{detail.college}} <span>{{detail.gmtCreate}}</span></div>
                </div>
            </div>
            <div class="title">证件照正反面</div>
            <div class="card">
                <div v-if="detail.idcardPositive != null && detail.idcardPositive != ''"><img :src="detail.idcardPositive"></div>
                <div v-if="detail.idcardNegative != null && detail.idcardNegative != '' "><img :src="detail.idcardNegative"></div>
                
                <div v-if="detail.idcardPositive == null || detail.idcardPositive == ''"><img src="static/images/null.png"></div>
                <div v-if="detail.idcardNegative == null || detail.idcardNegative == ''"><img src="static/images/null.png"></div>
            </div>
            <div class="item">
                真实姓名：{{detail.name}}
            </div>
            <div class="item">
                证件类型：学生证
            </div>
            <div class="item">
                证件号码：{{detail.idcardNumber}}
            </div >
            <!-- <div class="item">
                有效期至：{{detail.idcardValidityFrom}} ~ {{detail.idcardValidityTo}}
            </div> -->
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="danger" v-if="detail.status == 2 || detail.status == 0"  @click="userStatus(1,detail.userId)" :loading="loading">驳 回</el-button>
            <el-button type="success"  v-if="detail.status == 1 || detail.status == 0 "  @click="userStatus(2,detail.userId)" :loading="loading">通 过</el-button>
        </span>
    </el-dialog>

   <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
    </Pagination>
</div>
    
    
  </template>

<script>
import Pagination from "@/components/element/Pagination";
import API from "@/components/common/Api";


var a=1;
export default {


  components: { Pagination },
  data() {
    return {
      header:'',
      school:'',
      pn: 1,
      ps: 10,
      count: 0,
      status: '', //		是否封号(非必填，查询时传入)
      college: '', //	学校查询（非必填，查询时传入）
      startTime: '', //  	开始时间(非必填，查询时传入)
      endTime: '', //    	结束时间(非必填，查询时传入)
      phone:'',
      name:'',
      dialogDetailVisible: false,
      dialogVisible: false,
      tableData: [],
      detail: "",
      infob:"",
      userId: "", //编辑时候保存
      loading: false,


      statusList: [
        {
          label: '未认证',
          value: '0'
        },
        {
          label: '认证中',
          value: '1'
        },
        {
          label: '认证未通过',
          value: '2'
        },
        {
          label: '认证通过',
          value: '3'
        },
      ],
      sorts:'',
      sortList: [
        {
          label: '按时间排序',
          value: '0'
        },
        {
          label: '按经验值排序',
          value: '1'
        },
      ],
      enable:'',
      enableList:[
        {
          label: '禁用',
          value: '1'
        },
        {
          label: '不禁用',
          value: '0'
        },
      ],
    };
  },
  methods: {


    formatterCertFlag(row){
      if (row.certFlag == 0) {
        return "未认证";
      } else if (row.certFlag == 1) {
        return "认证中";
      } else if (row.certFlag == 2) {
        return "认证未通过";
      }else{
        return '认证通过';
      }
    },
    formatterEnable(row) {
      if (row.enable == 0) {
        return "启用";
      } else if (row.enable == 1) {
        return "禁用";
      }
    },
    refreshCurrentChange(val) {
      this.pn = val;
     // this.getList();



        this.sort();
        this.getSchool();
    },
    refreshSizeChange(val) {
      this.pn = 1;
      this.ps = val;
      this.getList();
    },

    sort(){

       //alert(Number(this.sorts));
      let data={
        Sid: Number(this.sorts),   //强制类型转化
        pn: this.pn,
        ps: this.ps,
        status: this.status,
        college: this.college,
        startTime: this.startTime,
        endTime: this.endTime,
        phone:this.phone,
        name:this.name,
        enable:(this.enable)
      }
      API.getsort(data).then(result => {
        this.tableData = result.data.data.list;
        this.count = result.data.data.count;
      });
    },

  /*  resort(){
      a=1;
      let data={
        Sid: 1,
        pn: this.pn,
        ps: this.ps,
        status: this.status,
        college: this.college,
        startTime: this.startTime,
        endTime: this.endTime,
        phone:this.phone,
        name:this.name,
        enable:(this.enable)
      }
      API.getsort(data).then(result => {
        this.tableData = result.data.data.list;
        this.count = result.data.data.count;
      });
    },   */

    search() {
      this.pn = 1;
      this.sort();
    },
    handleDetail(index, row) {
      this.dialogDetailVisible = true;
      let data = {
        userId: row.id
      };
      this.userId = row.userId;
      API.detailMember(data).then(result => {
        if(result.data.code == 0){
          this.detail = result.data.data;
        }else{
          this.detail = [];
        }

      });
    },
    handleDetails(row){

      this.$root.$router.push({name:'memberDetail',query:{userId:row.id}});
      console.log(row)
      let data = {
        userId: row.id
      };

      API.getUserInfo(data).then(result => {

        console.log(result)
      });

      },


     // this.$root.$router.push({name:'memberDetail'});
    handleProhibit(row, type) {
      this.userId = row.id;
      this.$confirm("确定进行此操作吗？", "提示", {
        type: "warning",
        center: true
      }).then(_ => {
        let data = {
          userId:row.id,
          type:type
        };
        API.userEnable(data).then(result => {
          this.getList();
        });
      }).catch(_ => {});
    },

    userStatus(type,userId) {
      let data = {
        userId: userId,
        type: type
      };
      this.loading = true;
      API.userStatus(data).then(result => {
        this.loading = false;
        this.dialogDetailVisible = false;
        this.getList();
      });
    },
    getSchool(){
      API.constSchool().then(result => {
        this.school = result.data.data;
      });
    },

  },



  created() {
    this.sort();
    this.getSchool();
   /* if (a == 1) {
      this.resort();
      this.getSchool();
    } else if (a == 0) {
      this.sort();
      this.getSchool();
    }  */
    // this.getList();
  }
}
</script>
<style scoped>

.member .up {
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  padding: 0 0 10px 0;
  text-align: left;
}
.member .up img {
  width: 20%;
  height: 100px;
  margin-right: 20px;
}
.member .up .info {
  width: 80%;
}
.member .title {
  padding: 10px 0;
}
.member .card {
  display: flex;
  align-items: center;
}
.member .card div {
  width: 50%;
  height: 150px;
}
.member .card div img {
  width: 100%;
  height: 100%;
}
.member .item {
  border-bottom: 1px solid #e6e6e6;
  padding: 10px 0;
  text-align: left;
}
.el-col-2 {
  text-align: center;
}

.search .label {
  display: inline-block;
  width: 100px;
  padding: 10px 10px 0 0;
}
.search_select {
  display: flex;
  align-items: center;
}
</style>
