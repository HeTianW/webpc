<template>
    <div class="page">
        <div class="search">
          <div class="item">
            <el-input  placeholder="关键字" clearable="" v-model="name" style="width:200px;margin-right:20px;"></el-input>
            <el-button type="primary" plain icon="el-icon-search" @click="search" style="margin-left:20px;"></el-button>
            <!-- <el-button type="primary">批量导入</el-button> -->
            <el-button type="danger" @click="batchDel">批量删除</el-button>
          </div>
          <div class="item">
            <el-input placeholder="禁用项" v-model="value" style="width:200px;margin-right:20px;"></el-input><el-button type="primary" @click="add">添加</el-button>
          </div>
        </div>
       
        <el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" ></el-table-column>
            <el-table-column type="index" label="序号" ></el-table-column>
            <el-table-column prop="value" label="禁用项名称" ></el-table-column>
            <!-- <el-table-column prop="name" label="配置人" ></el-table-column> -->
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button size="mini"  type="danger"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
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
      dialogVisible: false,
      tableData: [],
      pn: 1,
      ps: 10,
      count: 0,
      name: "",
      value: "",
      multipleSelection: []
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
    add() {
       if(this.value == ''){
        this.$message({
          message: '禁用项名称不能为空',
          type: 'warning'
        });
          return;
      }
      let data = {
        value: this.value
      };
      API.Disable(data).then(result => {
        this.getList();
        this.value = "";
      });
    },
    batchDel() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: "请至少选择一条禁用项",
          type: "warning"
        });
        return;
      }
      this.$confirm("确定进行此操作？", "提示", {
        type: "warning",
        center: true
      })
        .then(_ => {
          var id = [];
          for (var i in this.multipleSelection) {
            id.push(this.multipleSelection[i].id);
          }
          API.batchDisabled(id).then(result => {
            this.getList();
          });
        })
        .catch(_ => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleDel(index, row) {
      this.$confirm("此操作将永久删除, 是否继续？", "提示", {
        type: "warning",
        center: true
      })
        .then(_ => {
          let data = {
            id: row.id
          };
          API.delDisabled(data).then(result => {
            this.getList();
          });
        })
        .catch(_ => {});
    },
    handleEdit(index, row) {
      this.dialogVisible = true;
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
      API.getDisable(data).then(result => {
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
.search {
  display: flex;
  justify-content: space-between;
}
</style>

