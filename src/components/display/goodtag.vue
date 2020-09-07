<template>
  <div class="page">
    <div class="nav">
      <span @click="back" style="font-size: 20px"><i class="el-icon-arrow-left"></i>返回商品管理</span>
    </div>
  <div class="search">
    <div>
      <el-input  placeholder="关键字" v-model="name" clearable="" style="width:200px;margin-right:20px;"></el-input>
      <el-button type="primary" plain icon="el-icon-search" @click="search" style="margin:0 20px ;"></el-button>
    </div>
     <div>
        <el-input  placeholder="标签名称" clearable v-model="value" style="width:200px;margin-right:20px;"></el-input>
        <el-button type="primary" style="margin-left:20px;" @click="add">添加</el-button>
    </div>
  </div>
  <div class="tags">
    <el-tag :key="tag" type="warning" v-for="tag in dynamicTags"  :disable-transitions="false" >
      {{tag.value}}
    </el-tag>
    <el-tag :key="tag" type="warning" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
        {{tag.value}}
    </el-tag>
  </div>
   <div class="block" >
 <el-pagination @current-change="handleCurrentChange"  @size-change="handleSizeChange"
  :page-sizes="[300,500,1000,1500,2000]"
  :current-page.sync="pageCurrent" :page-size="pageSize" layout="total, sizes, prev, pager, next"
  :total="count">
  </el-pagination>
  </div>
  </div>
</template>

<script>
  import API from "@/components/common/Api";
  import Pagination from "@/components/element/Pagination";
    export default {
      components: { Pagination },
      data() {
        return {
          pn: 1,
          ps: 300,
          count: 0,
          name: "",
          dynamicTags: [],
          value: "",
          flag:true
        };
      },
      methods: {
        checkSame(){
          for(var i in this.dynamicTags){
            if(this.dynamicTags[i].value == this.value){
              this.$alert('标签已存在', "提示信息", {
                confirmButtonText: "确定",
                type: "warning",
                center: true
              });
              this.flag = false;
            }else{
              this.flag = true;
            }
          }
        },
        add() {
          if(this.value == ''){
            this.$message({
              message: '标签名称不能为空',
              type: 'warning'
            });
            return;
          }
          this.checkSame();
          if(this.flag){
            let data = {
              value: this.value
            };
            API.goodTag(data).then(result => {
              this.getList();
              this.value = "";
            });
          }

        },
        handleClose(tag) {
          // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
          let data = {
            id: tag.id
          };
          API.delgoodDisabled(data).then(result => {
            this.getList();
          });
        },

        batchdeletion(tag){
          let data ={
            ids:this.ids
          };
          API.batchdelDisabled(data).then(result => {
            this.getList();
          });
        },
        handleCurrentChange(val) {
          this.pn = val;
          this.getList();
        },
        handleSizeChange(val) {
          this.pn = 1;
          this.ps = val;
          this.getList();
        },
        back() {
              this.$router.push({name: 'goods'});
      },
        search() {
          this.pn = 1;
          this.getList();
        },
        getList() {
          let data = {
            pn: this.pn,
            ps: this.ps,
            name: this.name
          };
          console.log(data);

          API.getgoodTag(data).then(result => {
            this.dynamicTags = result.data.data.list;
            console.log("1111111");
            console.log(this.dynamicTags);
            console.log("1111111");
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
  .block{
    position: fixed;
    bottom: 0;
    width: calc(100% - 210px);
    background: #fff;
    z-index: 999;
    text-align: right;
    right: 0;
    padding: 15px 0;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .search {
    display: flex;
    justify-content: space-between;
  }
  .search .item {
    margin-bottom: 10px;
  }
  .tags {
    border: 1px solid #e6e6e6;
    padding: 20px;
  }

</style>
