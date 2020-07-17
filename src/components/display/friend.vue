<<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="page">
    <div class="nav">
      <span @click="back" style="font-size: 20px"><i class="el-icon-arrow-left"></i>返回App用户管理</span>
    </div>
    <div class="search">
      <el-input clearable v-model="name" placeholder="昵称" style="width:200px;margin-right:20px;"></el-input>
      <el-button type="primary" plain icon="el-icon-search" @click="search" style="margin-left:20px;"></el-button>
    </div>
      <el-table :data="tableData"style="width: 100%" header-cell-class-name="header-cell-color" v-loading="listLoading">
      <el-table-column prop="no" label="序号" type="index" ></el-table-column>
      <el-table-column prop="college" label="学校" ></el-table-column>
      <el-table-column prop="nickname" label="昵称" ></el-table-column>
      <el-table-column prop="descroption" label="描述" ></el-table-column>
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button size="mini"  type="primary"   plain @click="handleDetails(scope.row)" >详情</el-button>
        </template>

      </el-table-column>

    </el-table>


    <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" count="count" >
    </Pagination>
  </div>


</template>
<script>

  import Pagination from "@/components/element/Pagination";
  import API from "@/components/common/Api";


  export default {


    components: { Pagination },



    data() {
      return {
        header:'',

        pn: 1,
        ps: 5,

        college: '', //	学校查询（非必填，查询时传入）

        nickname:'',
        user_id:"",
        descroption:'',
        age:'',
        sex:'',
        dialogDetailVisible: false,
        dialogVisible: false,
        tableData: [],
        detail: "",
        infob:"",
        userId: "", //编辑时候保存
        loading: false,




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

        this.$root.$router.push({name:'friendDetail',query:{user_id:row.user_id}});

        let data = {
           userId: row.id
         };
        
         API.getUserInfo(data).then(result => {           
         });

      },

      back() {
              this.$router.push({name: 'member', query: {userId: this.userId,}});
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
      search(){
        this.pn = 1;
        this.getList();
      },
       getList() {

         let data = {
           pn: this.pn,
           ps: this.ps,
           content:this.name,
         };
         API.getMember(data).then(result => {
           this.tableData = result.data.data;

         });
       }
    },



    created() {
      this.getList();
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
