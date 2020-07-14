<template>
<div class="page">
    <div class="search">
        <el-input  clearable v-model="name" placeholder="标题名称/发布者" style="width:200px;margin-right:20px;"></el-input>
        <el-date-picker
          v-model="startTime" value-format="yyyy-MM-dd HH:mm:ss" clearable
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
        <span style="display: inline-block;padding: 10px;">至</span>
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" clearable
          v-model="endTime"
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" plain icon="el-icon-search" @click="search" style="margin-left:20px;"></el-button>
    </div>
    
    <el-table :data="tableData" style="width: 100%;" :default-sort = "{prop: 'publicer', order: 'descending'}">
        <el-table-column type="index" label="序号" ></el-table-column>
        <el-table-column prop="content" label="问题名称" ></el-table-column>
        <el-table-column prop="nickname" label="发布者" sortable></el-table-column>
        <el-table-column prop="gmtCreate" label="发布时间" sortable></el-table-column>
        <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
                <el-button size="mini"  type="primary" plain @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                <!-- <el-button size="mini"  type="primary" v-if="scope.row.state == 0 " @click="handleProhibit(scope.$index, scope.row)" >禁言</el-button> -->
                <!-- <el-button size="mini"  type="info" v-if="scope.row.state == 1 " @click="handleProhibit(scope.$index, scope.row)" >已禁言</el-button> -->
                <el-button size="mini"  type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
     

  <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
    </Pagination>

   
    <el-dialog :visible.sync="dialogDetailVisible" width="50%" center>
         <div class="detail">
             <div class="up">
                <div class="tip" v-if="detail.anonymity == 1">{{detail.nickname}}（匿名）</div>
                <div class="tip" v-if="detail.anonymity == 0">{{detail.nickname}}</div>
                <div class="name">{{detail.name}}</div>
                <div class="texts">
                  {{detail.content}}
                </div>
               
             </div>
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
                    <el-collapse v-model="item.nsw" v-if="item.askComentReplyVos != undefined">
                    <el-collapse-item name="1">
                      <template slot="title" >
                        回复（{{item.askComentReplyVos.length}}）
                      </template>
                      <div v-for="(items, index) in item.askComentReplyVos" :key="index">
                        <div class="head">
                          <div>{{items.presentorName}}
                            <span>{{items.time}}</span>
                          </div>
                          <div class="del" ref="del" @click="delTwo(items)">删除</div>
                        </div>
                        <div class="text">
                          {{items.content}}
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
             </div>
             <!-- 评论分页 -->
             <div class="block" v-if="comments.length > 0">
                <el-pagination @current-change="handleCurrentChange"  @size-change="handleSizeChange" 
                :page-sizes="[5,10,15,20,25]"
                :current-page.sync="pn1" :page-size="ps1" layout="total, sizes, prev, pager, next"
                :total="ct">
                </el-pagination>
            </div>
         </div>
    </el-dialog>
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
   
</div>
    
    
  </template>
  <script>
import Pagination from "@/components/element/Pagination";
import API from "@/components/common/Api";
export default {
  components: { Pagination },
  data() {
    return {
      pn: 1,
      ps: 10,
      count: 0,

      pn1: 1,
      ps1: 10,
      ct: 0,
      name: "",
      startTime: "", //  	开始时间(非必填，查询时传入)
      endTime: "", //    	结束时间(非必填，查询时传入)
      comments: "",
      askId: "",
      detail: "",

      dialogDetailVisible: false,
      dialogVisible: false,
      tableData: []
    };
  },

  methods: {
    del(item) {
      this.$confirm("此操作将永久删除, 是否继续？", "提示", {
        type: "warning",
        center: true
      })
        .then(_ => {
          let data = {
            id: item.id
          };
          API.delReportComment(data).then(result => {
            this.getComment();
          });
        })
        .catch(_ => {});
    },
    delTwo(item){
       this.$confirm("此操作将永久删除, 是否继续？", "提示", {
        type: "warning",
        center: true
      }).then(_ => {
        API.deleteSecondAskComment(item.id).then(result => {
          this.getComment();
        });
      }).catch(_ => {});
    },
    refreshCurrentChange(val) {
      this.pn = val;
      this.getList();
    },
    refreshSizeChange(val) {
      this.pn = 1;
      this.ps = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pn1 = val;
      this.getComment();
    },
    handleSizeChange(val) {
      this.ps1 = val;
      this.getComment();
    },
    search() {
      this.pn = 1;
      this.getList();
    },

    handleDetail(index, row) {
      this.dialogDetailVisible = true;
      this.askId = row.id;
      this.getDetail();
      this.getComment();
    },
    getDetail() {
      let data = {
        askId: this.askId
      };
      API.detailReport(data).then(result => {
        this.detail = result.data.data;
      });
    },
    getComment() {
      let data = {
        askid: this.askId,
        pn: this.pn1,
        ps: this.ps1
      };
      API.answerComment(data).then(result => {
        this.comments = result.data.data.list;
        this.ct = result.data.data.count;
      });
    },
    handleProhibit(index, row) {
      this.dialogVisible = true;
    },
    handleDel(index, row) {
      this.$confirm("此操作将永久删除, 是否继续？", "提示", {
        type: "warning",
        center: true
      })
        .then(_ => {
          let data = {
            askId: row.id
          };
          API.delReport(data).then(result => {
            this.getList();
          });
        })
        .catch(_ => {});
    },
    del(item) {
      this.$confirm("此操作将永久删除, 是否继续？", "提示", {
        type: "warning",
        center: true
      })
        .then(_ => {
          let data = {
            id: item.id
          };
          API.delReportComment(data).then(result => {
            this.getComment();
          });
        })
        .catch(_ => {});
    },
    getList() {
      let data = {
        pn: this.pn,
        ps: this.ps,
        name: this.name,
        startTime: this.startTime,
        endTime: this.endTime
      };
      API.getReport(data).then(result => {
        this.tableData = result.data.data.list;
        this.count = result.data.data.count;
      });
    }
  },

  created() {
    this.getList();
  }
};
</script>
  <style scoped>
.block {
  text-align: right;
}
.detail {
  position: relative;
}
.bottom {
  position: absolute !important;
  width: 100% !important;
  padding: 0 !important;
  left: 0 !important;
  bottom: -20px !important;
}
.el-col-2 {
  text-align: center;
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

.detail .up {
  padding: 10px;
  border-bottom: 1px dashed #e6e6e6;
  background: #f2f2f2;
}

.up .tip {
  margin-bottom: 10px;
}
.up .name {
  font-size: 16px;
  color: #000;
  margin-bottom: 10px;
}

.comment {
  padding: 10px;
}
.comment .title {
  font-size: 16px;
  color: #000;
}
.comment .item {
  border-bottom: 1px solid #e6e6e6;
  padding: 10px 0;
}
.comment .item .head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.comment .item .head div:first-child span {
  padding-left: 10px;
}
.comment .item .del {
  color: #e51c23;
  cursor: pointer;
}
</style>
  