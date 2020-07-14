<template>
<div class="page">

    <div class="search">
       <el-select clearable v-model="college" filterable placeholder="请选择学校" style="width:200px;margin-right:20px;">
            <el-option v-for="item in school" :key="item.id" :label="item.value" :value="item.value"></el-option>
        </el-select>
        <el-input  placeholder="团队名称" v-model="name" clearable style="width:200px;margin-right:20px;"></el-input>
         <el-select clearable v-model="status" placeholder="请选择社团状态" style="width:200px;margin-right:20px;">
            <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-date-picker v-model="startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" clearable placeholder="选择日期"  >
        </el-date-picker>
        <span style="display: inline-block;padding: 10px;">至</span>
        <el-date-picker v-model="endTime" type="datetime" clearable placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" >
        </el-date-picker>
        <el-button type="primary" plain icon="el-icon-search" @click="search" style="margin-left:20px;"></el-button>
    </div>

  <el-select clearable v-model="sorts" filterable placeholder="请选择排序方式"  style="width:700px;margin-right:20px;align-content: center">
    <el-option v-for="(item, index) in sortList" :key="index" :label="item.label" :value="item.value"></el-option>
  </el-select>
  <el-button type="primary" plain icon="el-icon-sort" @click="sort" style="margin-left:20px;"></el-button>
    
        <el-table :data="tableData" style="width: 100%;">
            <el-table-column type="index" label="序号" ></el-table-column>
            <el-table-column prop="name" label="团队名称" ></el-table-column>
            <el-table-column prop="nn" label="创建者"></el-table-column>
            <el-table-column prop="college" label="创建者学校"></el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="630px">
              <template slot-scope="scope">
                <el-button size="mini"  type="primary" plain @click="handleDetail(scope.row)">详情</el-button>
                <el-button size="mini" type="success" plain  @click="handleBuild(scope.row)">团建</el-button>
                <el-button size="mini" type="primary"  @click="handleSpeech(scope.row)">团言管理</el-button>
                <el-button size="mini" type="primary"  @click="handleActivity(scope.row)">活动管理</el-button>
                <el-button size="mini" type="primary"  @click="handleVote(scope.row)">投票管理</el-button>
                <el-button size="mini" type="primary"  @click="handleNotice(scope.row)">公告管理</el-button>
                <el-button size="mini" type="success" v-if="scope.row.status == 1"  @click="haneleStop(scope.row,0)">解封</el-button>
                <el-button size="mini" type="warning" v-if="scope.row.status == 0"  @click="haneleStop(scope.row,1)">封禁</el-button>
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
    <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
    </Pagination>
</div>
    
    
</template>
<style>

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

</style>

<script>
    import API from '@/components/common/Api'
    import Pagination from '@/components/element/Pagination'
    var a=1;
    export default {
      components: { Pagination },
      data() {
        return {
          pn:1,
          ps:10,
          count:0,
          name:'',//		社团名称(非必填，查询时传入)
          startTime:'',//  	开始时间(非必填，查询时传入)
          endTime:'',//    	结束时间 (非必填，查询时传入)
          status:'',
          dialogVisible:false,
          tableData: [],
          school:[],
          college:'',
          sorts:'',
          sortList: [
            {
              label: '按时间排序',
              value: '0'
            },
            {
              label: '按热度排序',
              value: '1'
            },
          ],
          statusList:[
            {
              label:'解封',
              value:'0'
            },
            {
              label:'封禁',
              value:'1'
            },
          ]
        }        
      },
      methods: {
        getSchool(){
          API.constSchool().then(result => {
            this.school = result.data.data;
          });
        },
        refreshCurrentChange(val){
          this.pn = val;
          //this.getList();

            this.sort();

        },
        refreshSizeChange(val){             
          this.pn = 1;
          this.ps = val;
          this.getList();
        },
        search(){
          this.pn = 1;
          this.sort();
        },
        handleDetail(row){

          this.$root.$router.push({name:'teamDetail',query:{clubId:row.id,name:this.name,college:this.college,startTime:this.startTime,endTime:this.endTime,status:this.status}});
        },
        handleBuild(row){
          this.$router.push({path:'/build',query:{clubId:row.id,name:row.name,names:this.name,college:this.college,startTime:this.startTime,endTime:this.endTime,status:this.status}});
        },
        handleSpeech(row){
          this.$router.push({path:'/speech',query:{clubId:row.id,name:row.name,names:this.name,college:this.college,startTime:this.startTime,endTime:this.endTime,status:this.status}});
        },
        handleActivity(row){
          this.$router.push({path:'/activity',query:{clubId:row.id,name:row.name,names:this.name,college:this.college,startTime:this.startTime,endTime:this.endTime,status:this.status}});
        },
        handleVote(row){
          this.$router.push({path:'/vote',query:{clubId:row.id,name:row.name,names:this.name,college:this.college,startTime:this.startTime,endTime:this.endTime,status:this.status}});
        },
        handleNotice(row){
          this.$router.push({path:'/notice',query:{clubId:row.id,name:row.name,names:this.name,college:this.college,startTime:this.startTime,endTime:this.endTime,status:this.status}});
        },
        haneleStop(row,status) {
          // this.dialogVisible = true;
          this.$confirm('确定要进行此操作吗？','提示',{
                type: 'warning',
                center: true
            }).then(_ => {
                let data = {
                  clubId:row.id,
                  status:status
                }
                API.clubInfoStatus(data).then(result=> {
                  this.getList();
                });

            }).catch(_ => {

            });
        },
        sort(){
          let data={
            Sid: Number(this.sorts),
            pn:this.pn,
            ps:this.ps,
            name:this.name,
            college:this.college,
            startTime:this.startTime,
            endTime:this.endTime,
            status:(this.status)
          };
          API.getTeams(data).then(result=> {
            this.tableData = result.data.data.list;
            this.count = result.data.data.count;
          });
        },

     /*   resort(){
          alert("11111");
          a=1;
          let data={
            Sid: 1,
            pn:this.pn,
            ps:this.ps,
            name:this.name,
            college:this.college,
            startTime:this.startTime,
            endTime:this.endTime,
            status:(this.status)
          }
          API.getTeams(data).then(result => {
            this.tableData = result.data.data.list;
            this.count = result.data.data.count;
          });
        },   */

      /*
        getList(){
            let data = {
                pn:this.pn,
                ps:this.ps,
                name:this.name,
                college:this.college,
                startTime:this.startTime,
                endTime:this.endTime,
                status:(this.status)    
            };
            API.getTeam(data).then(result=> {
              this.tableData = result.data.data.list;
              this.count = result.data.data.count;
            });
        },

          */
        
      },
      created(){


          this.sort();
          this.getSchool();

        if(this.$route.query.type != undefined && this.$route.query.type == 0){
          this.college = this.$route.query.college;
          this.name  = this.$route.query.name;
          this.startTime = this.$route.query.startTime;
          this.endTime = this.$route.query.endTime;
          this.status = this.$route.query.status+'';
        }

      }
    }
  </script>
  <style scoped>
  
  .search_select{
    display: flex;
    align-items: center;
  }
  </style>
