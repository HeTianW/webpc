<template>
  <div class="page">
    <div class="nav">
      <span @click="back" style="font-size: 20px"><i class="el-icon-arrow-left"></i>返回App用户管理</span>
      <div class="name">已加入的团队</div>
    </div>
    <div class="m_title">用户基本信息</div>
    <div class="detail">
    <div class="left">
      <div class="infos">
        <img :src="details.header"/>
        <div class="info">
          <!-- <div class="name">2017水墨丹青团</div> -->
          <div class="public">发布者：<span>{{details.nickname}}</span></div>
          <div class="member">
            <div>学号：<span>{{details.studentId}}</span></div>
          </div>
          <div class="colloge">学校：<span>{{details.college}}</span></div>
          <div class="userId">用户ID：<span>{{details.id}}</span></div>
          <span @click="goods" style="color: #3a8ee6;font-size:16px">已发布商品<i class="el-icon-arrow-right"></i></span>
          <span @click="friendmember" style="color: #3a8ee6;font-size:16px">好友列表<i class="el-icon-arrow-right"></i></span>
        </div>
      </div>
      <div class="total">
        <div>等级：{{details.grade}}级</div>
        <div>经验：{{details.experience}}</div>
        <div>公告：{{details.certFlag}}条</div>
      </div>
      <div class="col">
        <div v-if="details.sex == 1">性别：男</div>
        <div v-if="details.sex == 0">性别：女</div>
      </div>

    </div>
    <div class="right">
      <div class="leaguer">
      <div class="club" style="color: orange;">加入团队({{team.length}})</div>
      <div class="joinTeam">
        <div class="team" v-for="(item, index) in team" :key="index" @click="detailteam(item.id)">
          <img :src="item.logoImage"/>
          <div>{{item.name}}</div>
        </div>

      </div>
      </div>

    </div>
    </div>
    <el-dialog  :visible.sync="dialogclubVisible" width="50%" center>
      <div style="color: orange;">团队名称({{detailt.nickname}})</div>
      <img :src="detailt.logoImage" class="personImg"/>
      <div class="coll">
        <div>介绍：{{detailt.introduction}}</div>
      </div>
      <div class="coll">
        <div>人数：{{detailt.memberNumber}}</div>
      </div>
      <div class="public">发布者：<span>{{detailt.nickname}}</span></div>
      <div class="time">{{detailt.gmtCreate}}</div>
      <div class="total">
        <div>团言：{{detailt.speakCount}}条</div>
        <div>活动：{{detailt.activityCount}}条</div>
        <div>公告：{{detailt.noticeCount}}条</div>
        <div>投票：{{detailt.voteCount}}条</div>
        <div>团建：{{detailt.bulidingCount}}条</div>
      </div>
    </el-dialog>
    <div>
      <el-table :data="tableData" style="width: 100%;" :default-sort = "{prop: 'publicer', order: 'descending'}">
        <el-table-column type="index" label="序号" ></el-table-column>
        <el-table-column prop="content" label="问题名称" ></el-table-column>
        <el-table-column prop="nickname" label="发布者" sortable></el-table-column>
        <el-table-column prop="gmtCreate" label="发布时间" sortable></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini"  type="primary" plain @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            <el-button size="mini"  type="danger"  @click="handleDel(scope.$index, scope.row)">删除</el-button>

            <!-- <el-button size="mini"  type="primary" v-if="scope.row.state == 0 " @click="handleProhibit(scope.$index, scope.row)" >禁言</el-button>
            <el-button size="mini"  type="info" v-if="scope.row.state == 1 " @click="handleProhibit(scope.$index, scope.row)" >已禁言</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
      </Pagination>

      <el-dialog :visible.sync="dialogDetailVisible" width="50%" center>
        <div class="name">{{info.title}}</div>
        <div class="col">
          <div>内容：{{info.content}}</div>
        </div>
      <button @click="jump">问问管理</button>

      </el-dialog>

    </div>
  </div>
</template>
<style scoped>
  .personImg{
    width: 60px;
    height: 60px;
  }
  .joinTeam{
    display: flex;
    flex-wrap: wrap;
  }
  .joinTeam .team{
    width: 20%;
    text-align: center;
  }
  .joinTeam .team img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .detail{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .description {
    position: relative;
  }

  .left{
    margin-top: 10px;
    margin-right: 20px;
  }
  .right{
    margin-left: 20px;
  }
  .detail .left,.right{
    width: 50%;
  }

  .left .infos{
    margin-top:10px;
    display: flex;
    padding-left: 10px;
  }
  .left .infos img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .left .infos .info .name{
    font-size: 16px;
    color: #000;
  }
  .left .infos .info .member{
    display: flex;
  }
  .member span{
    padding-left: 20px;
  }
  .member div:first-child{
    margin-right: 10px;
  }
  .member div:last-child{
    margin-left: 10px;
  }
  .total{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 10px;
    padding-left: 10px;
  }
  .total div{
    margin-bottom: 10px;
    width: 30%;
  }

  .name {
    text-align:center;
    font-size: 16px;
    color: #000;
    margin-bottom: 10px;
  }

  .right{}
  .right .leaguer{
    border:1px solid #e6e6e6;

  }
  .right .leaguer .club{
    border-bottom: 1px solid #e6e6e6;
    padding: 10px;
  }

  .item img{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }

</style>
<script>
  import API from '@/components/common/Api';
  import Pagination from "@/components/element/Pagination";

  export default {
    components: { Pagination },
    data(){
      return{
        pn: 1,
        ps: 10,
        count: 0,
        pn: 1,
        ps: 10,
        ct: 0,
        details:'',
        detailt:'',
        comments: "",
        team: "",
        name: "",
        askId: "",
        info: '',
        userId:'',
        header:'',
        dialogDetailVisible: false,
        dialogclubVisible:false,
        dialogVisible: false,
        tableData: []


      }
    },
    methods: {

      detailteam(id){
        this.dialogclubVisible= true;
        let data = {
          clubId:id,
        };
        API.detailTeam(data).then(result=> {
          this.detailt = result.data.data;
          this.detailt.logoImage = this.detailt.logoImage;
         console.log(this.detailt);
        });

  },

      jump() {

        this.$router.push({name: 'answer'});

      },

      handleDel(index,row){
        this.$confirm("此操作将永久删除, 是否继续？", "提示", {
          type: "warning",
          center: true
        }).then(_ => {
          let data = {
            askId:row.id
          };
          API.delReport(data).then(result => {
            this.getList();
          });
        }).catch(_ => {});
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
        this.getDetails();
      },
      refreshSizeChange(val) {
        this.pn = 1;
        this.ps = val;
        this.getDetails();
      },
      handleCurrentChange(val) {
        this.pn = val;
        this.getComment();
      },
      handleSizeChange(val) {
        this.ps = val;
        this.getComment();
      },


      handleDetail(index, row) {
        this.dialogDetailVisible = true;
        this.askId = row.id;
        this.getDetailz();
      },

      getDetailz() {
        console.log(this.askId)
        let data = {
          askid: this.askId
        };

        API.detailAnswer(data).then(result => {
          this.info = result.data.data;
          //console.log(this.description);
        });
      },
      getComment() {
        let data = {
          pn: this.pn,
          ps: this.ps,
          askid: this.askId
        };
        API.answerComment(data).then(result => {
          this.comments = result.data.data.list;
          this.ct = result.data.data.count;
        });
      },
      /*   detailUser(id){
        this.dialogVisible = true;
        let data = {
          userId:id
      };
        API.detailUser(data).then(result=> {
          this.infos = result.data.data;
      });
        API.teamJoin(data).then(result=> {
          this.team = result.data.data.list;
        });

      },  */
      /*  search(){
        this.userInfo();
      },  */

      handleCurrentChange(val) {
        this.pn = val;
        this.getDetails();
      },
      handleSizeChange(val) {
        this.ps = val;
        this.getDetails();
      },

      back() {
        this.$router.push({name: 'member', query: {userId: this.userId,}});
      },
      goods() {
        this.$router.push({name: 'commodity', query: {userId: this.userId,}});
      },
      friendmember(){
        this.$router.push({name: 'friend', query: {userId: this.userId,}});
      },

      getDetail() {

        let data = {
          uid: this.userId,
        };
        API.getUserInfo(data).then(result => {

          this.details = result.data.data;
          console.log(this.details)
          //  this.detail.logoImage = this.detail.logoImage;
        });
        API.teamJoin(data).then(result=> {
          this.team = result.data.data.list;
        });
      },

      getDetails() {
        let data = {
          uid: this.userId,
          pn: this.pn,
          ps: this.ps
        };
        API.getAnswerInfo(data).then(result => {
          this.tableData = result.data.data.list;
          this.count = result.data.data.count;

          //  this.detail.logoImage = this.detail.logoImage;
        });
      },
      /* userInfo(){
        let data = {
          clubId:this.clubId,
          nickname:this.nickname
        };
        API.clubInfoByUser(data).then(result=> {
          this.info = result.data.data;
        });
      }  */
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
    created(){
      this.userId = Number(this.$route.query.userId);
      /*  this.clubId = Number(this.$route.query.clubId);
        this.college = this.$route.query.college;
        this.name  = this.$route.query.name;
        this.startTime = this.$route.query.startTime;
        this.endTime = this.$route.query.endTime;  */
      this.getDetail();
      this.getDetails();

    }
  }
</script>

