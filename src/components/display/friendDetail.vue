<template>
  <div class="page">
    <div class="nav">
      <span @click="back" style="font-size: 20px"><i class="el-icon-arrow-left"></i>返回App用户管理</span>
    </div>
    <div class="m_title">用户基本信息</div>
    <div class="detail">
      <div class="left">
        <div class="infos">
          <img :src="serverSrc+details.header"/>
          <div class="info">
            <!-- <div class="name">2017水墨丹青团</div> -->
            <div class="public">昵称：<span>{{details.nickname}}</span></div>
            <div class="member">
              <div>描述：<span>{{details.descroption}}</span></div>
            </div>
            <div class="colloge">学校：<span>{{details.college}}</span></div>
            <div class="userId">年纪：<span>{{details.schoolgrade}}</span></div>

          </div>
        </div>
        <div class="col">
          <div v-if="details.sex == 2">性别：男</div>
          <div v-if="details.sex == 1">性别：女</div>
        </div>

      </div>
    </div>
    <div class="m_title">加入的团队</div>
    <div>
      <el-table :data="tableData" style="width: 100%;" :default-sort = "{prop: 'publicer', order: 'descending'}">
        <el-table-column type="index" label="序号" ></el-table-column>
        <el-table-column prop="place" label="发表地点" ></el-table-column>
        <el-table-column prop="name" label="发布者" sortable></el-table-column>
        <el-table-column prop="data" label="发布时间" sortable></el-table-column>
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
        <div class="name">{{info.name}}</div>
        <div class="col">
          <div>内容：{{info.content}}</div>
          <div>时间：{{info.date}}</div>
          <div>地点：{{info.place}}</div>
        </div>
        <div class="groupImg">
          <img  :src="serverSrc+info.photos"  :key="index"/>
        </div>


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
    components: {Pagination},
    data() {
      return {
        pn: 1,
        ps: 10,
        count: 0,
        ct: 0,
        details: '',
        detailt: '',
        date:"",
        comments: "",
        team: "",
        name: "",
        place:"",
        info: '',
        userId: '',
        user_id: '',
        photoId:"",
        header: '',
        photos:"",
        dialogDetailVisible: false,
        dialogclubVisible: false,
        dialogVisible: false,
        tableData: [],
        schoolgrade:'',
        dtid:'',
        serverSrc:this.GLOBAL.serverSrc,
        serverSrc2:this.GLOBAL.serverSrc2,


      }
    },
    methods: {


      /*    handleDel(index,row){
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
      },    */

      refreshCurrentChange(val) {
        this.pn = val;
        // this.getDetails();
        this.getDetail();
        this.getDetails();
      },
      refreshSizeChange(val) {
        this.pn = 1;
        this.ps = val;
        //   this.getDetails();
        this.getDetail();
        this.getDetails();
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
        //   this.getDetails();
        this.getDetail();
        this.getDetails();
      },
      back() {
              this.$router.push({name: 'member', query: {userId: this.userId,}});
      },
      handleSizeChange(val) {
        this.ps = val;
        // this.getDetails();
        this.getDetail();
        this.getDetails();
      },

      handleDetail(index, row) {
        this.dialogDetailVisible = true;
        this.dtId = row.dtid;
        this.getDetailz();
      },

      getDetailz() {

        let data = {
          dynamic_id: this.dtId
        };

        API.detailfrienddt(data).then(result => {
          this.info = result.data.data;
          //console.log(this.description);
        });
      },


      getDetail() {
        console.log(isNaN(this.user_id));
        let data = {
          hisid: this.user_id,
        };
        API.getfriendInfo(data).then(result => {

          this.details = result.data.data;0
          console.log(this.details)
          //  this.detail.logoImage = this.detail.logoImage;
        });
      },

      getDetails() {
        let data = {
          uid: this.user_id,
          pn: this.pn,
          ps: this.ps
        };
        API.getdynasticInfo(data).then(result => {
          this.tableData = result.data.data;
          console.log(this.tableData)
          this.count = result.data.data.count;

          //  this.detail.logoImage = this.detail.logoImage;
        });
      },
       /*userInfo(){
        let data = {
          clubId:this.clubId,
          nickname:this.nickname
        };
        API.clubInfoByUser(data).then(result=> {
          this.info = result.data.data;
        });
      }
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
    },    */
    },
      created() {

        this.user_id = Number(this.$route.query.user_id);

        /*  this.clubId = Number(this.$route.query.clubId);
        this.college = this.$route.query.college;
        this.name  = this.$route.query.name;
        this.startTime = this.$route.query.startTime;
        this.endTime = this.$route.query.endTime;  */
        this.getDetail();
        this.getDetails();
        // this.getDetails();

      }

  }
</script>

