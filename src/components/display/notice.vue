<template>
<div class="page">
    <div class="nav">
        <span @click="back"><i class="el-icon-arrow-left"></i>返回团队管理</span>
        <div class="name">公告管理</div>
    </div>
    <div class="m_title">{{title}}</div>
    <div class="search">
        <!-- <el-select  placeholder="请选择" style="width:200px;margin-right:20px;">
            <el-option label="全部"></el-option>
            <el-option label="未禁言"></el-option>
            <el-option label="已禁言"></el-option>
        </el-select> -->
        <el-input v-model="name"  placeholder="标题名称/发布者" style="width:200px;margin-right:20px;"></el-input>
        <el-date-picker clearable value-format="yyyy-MM-dd HH:mm:ss"
          v-model="startTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <span style="display: inline-block;padding: 10px;">至</span>
        <el-date-picker clearable value-format="yyyy-MM-dd HH:mm:ss"
          v-model="endTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" plain icon="el-icon-search" @click="search" style="margin-left:20px;"></el-button>
    </div>
    
    <el-table :data="tableData" style="width: 100%;" :default-sort = "{prop: 'publicer', order: 'descending'}">
        <!-- <el-table-column prop="no" label="序号" ></el-table-column> -->
        <el-table-column prop="title" label="公告标题" ></el-table-column>
        <el-table-column prop="presentorName" label="发布者" sortable></el-table-column>
        <el-table-column prop="gmtCreate" label="发布时间" sortable></el-table-column>
        <el-table-column prop="content" label="内容" sortable></el-table-column>
        <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
            <el-button size="mini"  type="primary" plain @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            <el-button size="mini"  type="danger"  @click="handleDel(scope.row)">删除</el-button>
            <!-- <el-button size="mini"  type="primary" v-if="scope.row.state == 0 " @click="handleProhibit(scope.$index, scope.row)" >禁言</el-button>
            <el-button size="mini"  type="info" v-if="scope.row.state == 1 " @click="handleProhibit(scope.$index, scope.row)" >已禁言</el-button> -->
            </template>
        </el-table-column>
    </el-table>
     

    <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
    </Pagination>

    <el-dialog :visible.sync="dialogVisible" width="30%" center>
         <el-select  placeholder="请选择" style="width:100%;">
          <el-option label="含有违禁词语"></el-option>
          <el-option label="含有铭感词汇"></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogDetailVisible" width="50%" center>
         <div class="detail">
             <div class="up">
                 <div class="up-r">
                     <div class="name">{{detail.title}}</div>
                     <div class="time">发起人：{{detail.presentorName}}</div>
                     <div class="desc">发布时间：{{detail.gmtCreate}}</div>
                 </div>
             </div>
            <p>
                {{detail.content}}
            </p>
         </div>
    </el-dialog>
</div>
    
    
  </template>
  <script>
import API from "@/components/common/Api";
import Pagination from "@/components/element/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      comments: 5,
      pn: 1,
      ps: 10,
      count: 0,
      clubId: "",
      name: "",
      startTime: "",
      endTime: "",
      dialogVisible: false,
      dialogDetailVisible: false,
      tableData: [],
      detail: ""
    };
  },
  methods: {
    refreshCurrentChange(val) {
      this.pn = val;
      this.getList();
    },
    refreshSizeChange(val) {
      this.pn = 1;
      this.ps = val;
      this.getList();
    },
    search() {
      this.pn = 1;
      this.getList();
    },
    back() {
      this.$router.push({ name: "team" ,query:{
        name:this.$route.query.names,
        college:this.$route.query.college,
        startTime:this.$route.query.startTime,
        endTime:this.$route.query.endTime,
        status:this.$route.query.status,
        type:0
      }});
    },
    handleDetail(index, row) {
      this.dialogDetailVisible = true;
      this.detail = row;
    },
    handleProhibit(index, row) {
      this.dialogVisible = true;
    },

     handleDel(row){
      this.$confirm("此操作将永久删除, 是否继续？", "提示", {
        type: "warning",
        center: true
      }).then(_ => {
          let data = {
            id: row.id
          };
          API.delNotice(data).then(result => {
            this.getList();
          });
      }).catch(_ => {});
    },
    getList() {
      let data = {
        pn: this.pn,
        ps: this.ps,
        clubId: this.clubId,
        name: this.name,
        startTime: this.startTime,
        endTime: this.endTime
      };
      API.getNotice(data).then(result => {
        this.tableData = result.data.data.list;
        this.count = result.data.data.count;
      });
    }
  },
  created() {
    this.title = this.$route.query.name;
    this.clubId = Number(this.$route.query.clubId);
    this.getList();
  }
};
</script>
<style scoped>
.detail {
}
.detail .up {
  padding: 10px;
  display: flex;
  border-bottom: 1px solid #e6e6e6;
}
.up .up-l {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
}
.up .up-r {
  width: calc(100% - 80px);
}

.pagination {
  position: fixed;
  bottom: 30px;
  text-align: right;
  right: 50px;
  width: 100%;
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
.detail {
}
.detail .name {
  font-size: 16px;
  color: #000;
}
.detail .desc {
  font-size: 15px;
  color: #000;
}
.detail .groupImg {
  display: flex;
  flex-wrap: wrap;
  /* margin-top: 5px; */
}
.detail .groupImg img {
  margin-right: 15px;
  margin-top: 15px;
  width: 30%;
  height: 100px;
}
.detail .split {
  background: #f2f2f2;
  height: 8px;
}
.votes {
  margin-top: 20px;
}
.vote .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
}
.vote .item .progress {
  width: 85%;
}
.vote .item .name {
  margin-right: 10px;
  width: 60px;
  text-align: left;
  font-size: 14px;
  color: #333;
}
.vote .item .number {
  color: #409eff;
}
.total {
  text-align: left;
}
</style>
  