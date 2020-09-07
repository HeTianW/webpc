<template>
  <div class="page">
    <div class="search">
      <el-input clearable v-model="name" placeholder="标签" style="width:200px;margin-right:20px;"></el-input>
        <el-option v-for="item in school" :key="item.id" :label="item.value" :value="item.value"></el-option>

      <el-select clearable v-model="type" placeholder="请选择物品状态" style="width:200px;margin-right:20px;">
        <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
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
      <el-button type="primary" @click="jump">商品标签管理</el-button>

    </div>

    <el-table :data="tableData"style="width: 100%" header-cell-class-name="header-cell-color" v-loading="listLoading">
      <el-table-column prop="no" label="序号" type="index" ></el-table-column>
      <el-table-column prop="id" label="商品号" ></el-table-column>
      <el-table-column prop="nickname" label="发布者昵称" ></el-table-column>
      <el-table-column  prop="gmtCreate"  label="发布时间"  ></el-table-column>
      <el-table-column prop="labels" label="标签" width="120" sortable>
                    <template scope="scope">
                        <div v-for='item in scope.row.labels'>{{item.name}}</div>
                    </template>
                </el-table-column>
      <el-table-column prop="status" label="商品状态" :formatter="formatterCertFlag" ></el-table-column>
      <el-table-column prop="price" label="商品价格" ></el-table-column>
      <el-table-column prop="content" label="商品部分内容" ></el-table-column>
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button size="mini"  type="primary"   plain @click="handleDetails(scope.$index, scope.row)" >详情</el-button>
          <el-button size="mini"  type="danger"  @click="handleDel(scope.$index, scope.row)">下架</el-button>
        </template>

      </el-table-column>

    </el-table>
    <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
    </Pagination>

    <el-dialog :visible.sync="dialogDetailVisible" width="50%" center>
      <div class="detail">
        <div class="up">
          <div class="title" align="center">商品详情</div>
          <div class="nickname">用户昵称：{{detail.nickname}}</div>
          <div class="price">商品价格：{{detail.price}}</div>
          <div class="texts">
            商品描述：{{detail.content}}
          </div>
          <div class="groupImg">
            <img :src="item.photoId"  v-for="(item, index) in detail.photos" :key="index">
          </div>
        </div>
      </div>
    </el-dialog>
    <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
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
  labels:'',
  price:'',
dialogDetailVisible: false,
dialogVisible: false,
tableData: [],
detail: "",
infob:"",
userId: "", //编辑时候保存
  goodId:"",
loading: false,
  type:'',
typeList:[
{
label: '已卖出',
value: '3'
},
{
label: '在卖',
value: '0'
},
  {
    label: '下架',
    value: '2'
  },
  {
    label: '全部商品',
    value: '1'
  }
],
};
},
methods: {

refreshCurrentChange(val) {
this.pn = val;
this.type = this.type;
// this.getList();
  this.getDetails();


},
refreshSizeChange(val) {
this.pn = 1;
this.type = this.type;
this.ps = val;
//this.getList();
  this.getDetails();
},

  formatterCertFlag(row){
    if (row.status == 0) {
      return "在卖中";
    } else if (row.status == 3) {
      return "已售出";
    } else if (row.status == 2) {
      return "下架";
    }
    else if (row.status == 1) {
      return "全部商品";
    }
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

  jump() {

      this.$router.push({name: 'goodtag'});

  },

  search() {
    this.pn = 1;
    this.getDetails();
  },

  handleDel(index,row){
    this.$confirm("此操作将永久删除, 是否继续？", "提示", {
      type: "warning",
      center: true
    }).then(_ => {
      let data = {
        goodsId:row.id
      };
      API.delgoods(data).then(result => {
        this.getDetails();
      });
    }).catch(_ => {});
  },

  handleDetails(index, row) {
    this.dialogDetailVisible = true;
    this.goodId = row.id;
    this.getDetail();
    this.getComment();
  },
  getDetail() {
    let data = {
      goodsId: this.goodId
    };
    API.detailgoods(data).then(result => {
      this.detail = result.data.data;
    });

  },




  getDetails() {
    let data = {
      startTime: this.startTime,
      endTime: this.endTime,
      type:Number(this.type),
      label:this.name,
      uid:this.userId,
      pn: this.pn,
      ps: this.ps
    };
    API.goodsInfo(data).then(result => {

      this.tableData = result.data.data.list;
      this.count = result.data.data.count;

      //  this.detail.logoImage = this.detail.logoImage;
    });
    /* getList() {
    let data = {
    pn: this.pn,
    ps: this.ps,
    status: this.status,
    college: this.college,
    startTime: this.startTime,
    endTime: this.endTime,
    phone:this.phone,
    name:this.name,
    enable:(this.enable)
    };
    API.getMember(data).then(result => {
    this.tableData = result.data.data.list;
    this.count = result.data.data.count;
    });
    }*/
  },
/* let data = {
userId: row.id
};
alert(row.id);
alert(1111);

API.getUserInfo(data).then(result => {

alert(result.data.data.nickname);
alert(result.data.code);

alert(result.data.msg);
*/

},









created() {
  this.type= this.type;
  this.userId = Number(this.$route.query.userId);
this.getDetails();
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

  .detail .up {
    padding: 10px;
    border-bottom: 1px dashed #e6e6e6;
    background: #f2f2f2;
  }

  .up .title {
    font-size: 26px;
    margin-bottom: 10px;
  }
  .up .nickname {
    font-size: 16px;
    color: #000;
    margin-bottom: 10px;
  }
  .up .price{
    font-size: 16px;
    color: #000;
    margin-bottom: 10px;
  }
  .up .texts{
    font-size: 16px;
    color: #8FBE96;
    margin-bottom: 20px;
  }


</style>

