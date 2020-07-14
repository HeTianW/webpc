<template>
<div class="page">
    <div class="nav">
        <span @click="back"><i class="el-icon-arrow-left"></i>返回团队管理</span>
        <div class="name">活动管理</div>
    </div>
    <div class="m_title">{{title}}</div>
    <div class="search">
        <!-- <el-select  placeholder="请选择" style="width:200px;margin-right:20px;">
            <el-option label="全部"></el-option>
            <el-option label="未禁言"></el-option>
            <el-option label="已禁言"></el-option>
        </el-select> -->
        <el-input v-model="name" clearable  placeholder="标题名称/发布者" style="width:200px;margin-right:20px;"></el-input>
        <el-date-picker clearable value-format="yyyy-MM-dd HH:mm:ss"
          v-model="startTime"
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
        <span style="display: inline-block;padding: 10px;">至</span>
        <el-date-picker clearable value-format="yyyy-MM-dd HH:mm:ss"
          v-model="endTime"
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" plain icon="el-icon-search" @click="search" style="margin-left:20px;"></el-button>
    </div>
    
    <el-table :data="tableData" style="width: 100%;" :default-sort = "{prop: 'publicer', order: 'descending'}">
        <!-- <el-table-column prop="no" label="序号" ></el-table-column> -->
        <el-table-column prop="title" label="活动标题" ></el-table-column>
        <el-table-column prop="nickname" label="发布者" sortable></el-table-column>
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

    <!-- <el-dialog :visible.sync="dialogVisible" width="30%" center>
         <el-select  placeholder="请选择" style="width:100%;">
          <el-option label="含有违禁词语"></el-option>
          <el-option label="含有铭感词汇"></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog> -->
    <el-dialog :visible.sync="dialogDetailVisible" width="50%" center>
         <div class="detail">
             <div class="up">
                 <img :src="detail.header" class="up-l" />
                 <div class="up-r">
                     <div class="name">{{detail.presentorName}}</div>
                     <div class="time">{{detail.time}}</div>
                     <div>截止日期：{{detail.applyDeadline}}</div>
                 </div>
             </div>
             <div class="desc">{{detail.title}}</div>
             <div>
                 {{detail.content}}
             </div>
             <div class="groupImg" >
                 <img :src="item.photoId" class="img" v-for="(item, index) in detail.photos" :key="index"/>
             </div>
             
             <div class="split"></div>
             <div class="comment" v-if="comments.length > 0">
                <div class="title">评论</div>
                <div class="item" v-for="item in comments" :key="item.index">
                    <div class="head">
                        <div>{{item.presentorName}} <span>{{item.time}}</span></div>
                        <div class="del" @click="del(item)">删除</div>
                    </div>
                    <div class="text">
                        {{item.content}}
                    </div>
                </div>
             </div>
             <div class="block" v-if="comments.length > 0">
                <el-pagination @current-change="handleCurrentChange"  @size-change="handleSizeChange" 
                :page-sizes="[5,10,15,20,25]"
                :current-page.sync="pn1" :page-size="ps1" layout="total, sizes, prev, pager, next"
                :total="ct">
                </el-pagination>
            </div>
            
         </div>
    </el-dialog>
</div>
    
    
  </template>
<script>
import Pagination from '@/components/element/Pagination'
import API from '@/components/common/Api'
    export default {
        components: { Pagination },
      data() {
        return {
            comments:5,
            

            pn1:1,
            ps1:10,	
            ct:0,
            
            pn:1,
            ps:10,	
            count:0,
            clubId:'',
            name:'',
            startTime:'',
            endTime:'',	
            title:'',	
            dialogVisible:false,
            dialogDetailVisible:false,
            tableData: [],
            id:'',
            detail:''
        }        
      },
      methods: {
        refreshCurrentChange(val){
          this.pn = val;
          this.getList();
        },
        refreshSizeChange(val){             
          this.pn = 1;
          this.ps = val;
          this.getList();
        },
        handleCurrentChange(val){
          this.pn1 = val;
          this.getComment();
        },
        handleSizeChange(val){
            this.pn1 = 1;
          this.ps1 = val;
          this.getComment();
        },
        search(){
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
        handleDetail(index,row){
            this.dialogDetailVisible = true;
            let data = {
                id:row.id
            };
            this.id = row.id;
             API.detailActive(data).then(result=> {
              this.detail = result.data.data;
            });
            this.getComment();
        },
        getComment(){
            let data = {
                pn:this.pn1,
                ps:this.ps1,
                id:this.id,
            };
            API.commentActive(data).then(result=> {
              this.comments = result.data.data.list;
              this.ct = result.data.data.count;
            });
        },
        handleProhibit(index,row){
          this.dialogVisible = true;
        },
        getList(){
            let data = {
                pn:this.pn,
                ps:this.ps,
                clubId:this.clubId,
                name:this.name,
                startTime:this.startTime,
                endTime:this.endTime    
            };
            API.getActive(data).then(result=> {
              this.tableData = result.data.data.list;
              this.count = result.data.data.count;
            });
        },
        handleDel(row){
            this.$confirm("此操作将永久删除, 是否继续？", "提示", {
                type: "warning",
                center: true
            }).then(_ => {
                let data = {
                    id: row.id
                };
                API.delActivity(data).then(result => {
                    this.getList();
                });
            }).catch(_ => {});
        },
        del(item) {
            this.$confirm('此操作将永久删除, 是否继续？','提示',{
                type: 'warning',
                center: true
            }).then(_ => {
                let data = {
                    id:item.id
                };
                API.delCommentActive(data).then(result=> {
                    this.getComment();
                });
            }).catch(_ => {

            });
        },
      },
        created(){
            this.title = this.$route.query.name;
            this.clubId = Number(this.$route.query.clubId);
            this.getList();
        }
      
    }
  </script>
<style scoped>
.block{
    text-align: right;
}
  .detail{
    position: relative;
  }
  .bottom{
    position: absolute !important;
    width: 100%  !important;
    padding: 0  !important;
    left:0 !important;
  }



.detail .up{
    padding: 10px;
    display: flex;
}
.up .up-l{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 10px;
}
.up .up-r{
    width: calc(100% - 80px);
}

.pagination{
  position: fixed;
  bottom: 30px;
  text-align: right;
  right:50px;
  width: 100%;
}
.search .label{
  display: inline-block;
  width: 100px;
  padding: 10px 10px 0 0;
}
  .search_select{
    display: flex;
    align-items: center;
  }
  .detail {}
  .detail .name{
    font-size:16px;
    color:#000;
  }
 .desc{
      font-size:15px;
      color:#000;
      margin: 10px 0;
  }
  .detail .img{
      width: 100%;
      height: 100px;
      margin:10px 0;
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
  .detail .split{
      background: #f2f2f2;
      height: 5px;
  }
.comment{
    padding: 10px;
    padding-bottom: 65px;
    max-height: 300px;
    overflow: auto;
}
.comment .title{
    font-size: 16px;
    color: #000;
    
}
.comment .item{
    border-bottom: 1px solid #e6e6e6;
    padding: 10px 0;
}
.comment .item .head{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.comment .item .head div:first-child span{
    padding-left: 10px;
}
.comment .item .del{
    color: #e51c23;
    cursor: pointer;
}
  </style>
  