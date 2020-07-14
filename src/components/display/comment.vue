<template>
<div class="page">
    <div class="nav">
        <span @click="back"><i class="el-icon-arrow-left"></i>返回团队管理</span>
        <div class="name">团建管理</div>
    </div>
    <div class="m_title">{{name}}</div>
    <div class="search">
        <el-select  placeholder="请选择" style="width:200px;margin-right:20px;">
            <el-option label="全部"></el-option>
            <el-option label="未禁言"></el-option>
            <el-option label="已禁言"></el-option>
        </el-select>
        <el-input  placeholder="标题名称/发布者" style="width:200px;margin-right:20px;"></el-input>
        <el-date-picker clearable value-format="yyyy-MM-dd HH:mm:ss"
          v-model="startTime"
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
        <span style="display: inline-block;padding: 10px;">至</span>
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" plain icon="el-icon-search" @click="search" style="margin-left:20px;"></el-button>
    </div>
    
    <el-table :data="tableData" style="width: 100%;" :default-sort = "{prop: 'publicer', order: 'descending'}">
        <!-- <el-table-column prop="no" label="序号" ></el-table-column> -->
        <el-table-column prop="title" label="标题" ></el-table-column>
        <el-table-column prop="presentorName" label="发布者" sortable></el-table-column>
        <el-table-column prop="gmtCreate" label="发布时间" sortable></el-table-column>
        <el-table-column prop="likeAmount" label="点赞数" sortable></el-table-column>
        <el-table-column prop="commentAmount" label="评论数" sortable></el-table-column>
        <el-table-column prop="recommend" label="推荐为大厅标识" :formatter="recommendFormatter"></el-table-column>
        <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
            <el-button size="mini"  type="primary" plain @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini"  type="primary" v-if="scope.row.state == 0 " @click="handleProhibit(scope.$index, scope.row)" >禁言</el-button>
            <el-button size="mini"  type="info" v-if="scope.row.state == 1 " @click="handleProhibit(scope.$index, scope.row)" >已禁言</el-button>
            </template>
        </el-table-column>
    </el-table>
     

  

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
                 <img :src="detail.header" class="up-l" />
                 <div class="up-r">
                     <div class="name">{{detail.presentorName}}</div>
                     <div class="time">{{detail.time}}</div>
                     <div class="desc">{{detail.title}}</div>
                     <div>{{detail.content}}</div>
                     <div class="groupImg" v-for="(item, index) in detail.photos" :key="index">
                         <img :src="item.photoId">
                     </div>
                 </div>
             </div>
             <el-button type="primary" @click="viewComment">查看评论</el-button>
             <!-- <div class="comment">
                <div class="title">评论</div>
                <div class="item" v-for="item in comments" :key="item.index">
                    <div class="head">
                        <div>刘雯雯 <span>10:20</span></div>
                        <div class="del" @click="del">删除</div>
                    </div>
                    <div class="text">
                        如果你无法简洁的表达你的想法，那只说明你还不够了解它。
                    </div>
                </div>
             </div> -->
         </div>
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
      data() {
        return {
            pn:1,
            ps:10,
            count:0,
            clubId:'',
            title:'',
            startTime:'',
            endTime:'',
            comments:5,
            dialogVisible:false,
            dialogDetailVisible:false,
            tableData: [],
            detail:'',
            id:'',
            name:''
        }        
      },
      methods: {
        viewComment(){
            this.$router.push({path:'/comment',query:{id:this.id}});
        },
        recommendFormatter( row){
            return row.recommend == 0 ?'不推荐':'推荐';
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
        search(){
            this.pn = 1;
            this.getList();
        },
        back(){
            this.$router.push({name:'team'});
        },
        handleDetail(row){
            this.id = row.id;
            this.dialogDetailVisible = true;
            let data = {
                id:row.id
            };
            API.buildingInfo(data).then(result=> {
              this.detail = result.data.data;
            });
        },
        handleProhibit(index,row){
          this.dialogVisible = true;
        },

        del() {
            this.$confirm('此操作将永久删除, 是否继续？','提示',{
                type: 'warning',
                center: true
            }).then(_ => {
                
            }).catch(_ => {

            });
        },
        getList(){
            let data = {
                pn:this.pn,
                ps:this.ps,
                clubId:this.clubId,
                title:this.title,
                startTime:this.startTime,
                endTime:this.endTime    
            };
            API.teamBuild(data).then(result=> {
              this.tableData = result.data.data.list;
              this.count = result.data.data.count;
            });
        },
        
    },
    created(){
        this.clubId = Number(this.$route.query.clubId);
        this.name = this.$route.query.name;

        this.getList();
    }
      
    }
  </script>
<style scoped>
    .detail{}
    .detail .up{
        padding: 10px;
        display: flex;
        border-bottom: 1px solid #e6e6e6;
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
  .detail .desc{
      font-size:15px;
      color:#000;
  }
  .detail .groupImg{
      display: flex;
      flex-wrap: wrap;
      /* margin-top: 5px; */

  }
  .detail .groupImg img{
        margin-right: 15px;
        margin-top: 15px;
        width: 30%;
        height: 100px;
  }
  .detail .split{
      background: #f2f2f2;
      height: 8px;
  }
.comment{padding: 10px;}
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
  