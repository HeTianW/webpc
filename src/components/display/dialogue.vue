<template>
    <div class="page">
        <div class="nav">
            <span @click="back"><i class="el-icon-arrow-left"></i>返回问问管理</span>
            <div class="name">进入问答</div>
        </div>
        <div class="dialog">
            <!-- <div class="item">
                <div class="answer"><i class="el-icon-arrow-right"></i>
                <span class="name">盛磊</span><span class="time">2018-04-05</span><span>长沙移动的招聘会什么时候开？</span></div>
                <div class="key">
                    <el-input type="textarea" class="option"></el-input>
                    <el-button>回答</el-button>
                </div>
            </div> -->
            <div class="item" v-for="item in detail" :key="item.index">
                <div class="answer">
                        <i class="el-icon-arrow-right"></i>
                        <span class="name">{{item.nn}}</span>
                        <span class="time">{{item.gmtCreate}}</span>
                        <span><span style="color:orange">问题：</span>{{item.title}}</span>
                  <span class="del" >
                    <el-button size="mini" type="primary" @click="getAnswer(item)">回答</el-button>
                    <el-button size="mini" type="danger" @click="delOne(item)">删除</el-button>
                  </span>
                </div>
                <div class="key" v-if="item.commentVos != undefined" v-for="(items, index) in item.commentVos" :key="index">
                    <div class="warp">
                        <div class="reply">
                            <div>{{items.nn}}回答：</div>
                            <i class="el-icon-delete" @click="delTwo(items)" style="cursor:pointer"></i>
                        </div>
                        <div class="result">{{items.content}}</div>
                    </div>
                </div>
                <!-- <div class="key" v-if="item.commentVos == undefined" >
                    <el-input v-model="item.ans" type="textarea" class="option"></el-input>
                    <el-button @click="answer(item)">回答</el-button>
                </div> -->
            </div>
        </div>
      <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
    </Pagination>

      <el-dialog  :visible.sync="dialogVisible" width="50%" center>
        <el-input v-model="answer" type="textarea" class="option" rows="5"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel()">取 消</el-button>
            <el-button type="primary" @click="sure()">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>
<script>
import Pagination from "@/components/element/Pagination";
import API from "@/components/common/Api";
export default {
  components: { Pagination },
  data() {
    return {
      pn:1,
      ps:10,
      count:0,
      id:'',
      sid:'',//			专题ID
      askid:'',//		当前问题的ID
      type:'',//		1:一级评论，2:二级评论(后台管理type传2)
      content:'',//
      detail:'',
      dialogVisible:false,
      answer:''
    };
  },
  methods: {
    getAnswer(item){
      this.answer = '';
      this.sid = item.id;
      this.dialogVisible = true;
    },
    cancel(){
      this.answer = '';
      this.dialogVisible = false;
    },
    sure(item){//专题回答
      if(this.answer == ''){
        this.$message({
          message: '回复内容不能为空',
          type: 'warning'
        });
        return;
      }
      let data = {
        id:this.id,
        askid:this.sid,
        content:this.answer,
        type:2
      };
      API.HotReviewComment(data).then(result => {
        this.dialogVisible = false;
        this.getList();
      });
    },
    delOne(item){
       this.$confirm("此操作将永久删除, 是否继续？", "提示", {
        type: "warning",
        center: true
      }).then(_ => {
        let data = {
          id:item.id
        };
        API.commentDelete(data).then(result => {
          this.getList();
        });
      }).catch(_ => {});
    },
    delTwo(item){
       this.$confirm("此操作将永久删除, 是否继续？", "提示", {
        type: "warning",
        center: true
      }).then(_ => {
        let data = {
          id:item.id
        };
        API.deleteTwoComment(data).then(result => {
          this.content = '';
          this.getList();
        });
      }).catch(_ => {});
    },
    back() {
      this.$router.push({ name: "special" });
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
    
    getList() {
      let data = {
        pn: this.pn,
        ps: this.ps,
        id:this.id
      };
      API.commentSpecial(data).then(result => {
        this.detail = result.data.data.list;
        this.count = result.data.data.count;
      });
  },

  },
  
  created() {
    this.id = parseInt(this.$route.query.id);
    this.getList();
  }
};
</script>
<style scoped>
.item {
  padding: 15px 0;
}
.item .answer {
  border-bottom: 1px dashed #e6e6e6;
  padding-bottom: 10px;
}
.item .answer i {
  font-size: 20px;
  color: #000;
}
.item .answer .name {
  color: #999;
  padding: 0 10px;
}
.item .answer .time {
  padding: 0 20px;
}
.item .key {
  display: flex;
  padding-top: 10px;
  justify-content: flex-end;
  clear: both;
}

.item .key .option {
  margin-right: 15px;
  width: 70%;
}
.del {
  float: right;
  color: #e51c23;
  cursor: pointer;
}
.warp {
  border: 1px dashed #e6e6e6;
  width: 75%;
  padding: 10px;
}
.warp .reply {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #999;
}
.warp .result {
  padding-top: 10px;
  padding-left: 30px;
  font-size: 14px;
  color: #000;
}
</style>
