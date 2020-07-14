<template>
    <div class="page">
        <div class="search">
            <el-button type="primary" @click="add">新增角色</el-button>
            <el-button type="danger" @click="batchDel">批量删除</el-button>
        </div>
        
        <el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" ></el-table-column>
            <el-table-column prop="resourceName" label="角色权限" ></el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button size="mini" v-if="scope.row.roleId != 20 && scope.row.roleId !=  50" type="primary"  @click="handleAuth(scope.$index, scope.row)">设置权限</el-button>
                    <el-button size="mini" v-if="scope.row.roleId != 20 && scope.row.roleId !=  50" type="success"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        

    <el-dialog :title="flag == 1 ?'添加角色':'修改角色'"  :show-close="false"  :close-on-click-modal="false" :visible.sync="dialogVisible" width="50%" center>
         <el-form status-icon label-width="100px" :model="form" :rules="rules" ref="form" >
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="form.roleName"></el-input>
            </el-form-item>
         </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel('form')">取 消</el-button>
            <el-button type="primary" @click="save('form')">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog title="设置权限" :visible.sync="dialogAuthVisible" width="50%" center>
        <span slot="footer" >
            <el-tree ref="tree" :data="authlist" show-checkbox node-key="id" :props="defaultProps"></el-tree>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="remove()">取 消</el-button>
            <el-button type="primary" @click="ok()">确 定</el-button>
        </span>
    </el-dialog>
   
    </div>
</template>
<script>
import API from "@/components/common/Api";

export default {
  data() {
    return {
      dialogVisible: false,
      dialogAuthVisible: false,
      title: "",
      tableData: [],
      authlist: [],
      roleId: "",
      defaultProps: {
        children: "children",
        label: "resource_name"
      },
      multipleSelection: [],
      form: {
        roleId: "",
        roleName: ""
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    add() {
      this.form.roleId = '';
      this.form.roleName = '';
      this.dialogVisible = true;
      this.flag = 1;
    },
    // 批量删除
    batchDel(index, row) {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请先选择角色",
          type: "warning"
        });
        return;
      }
      this.$confirm("此操作将永久删除, 是否继续？", "提示", {
        type: "warning",
        center: true
      }).then(_ => {
        
          var list = [];
          for (var i in this.multipleSelection) {
            list.push(this.multipleSelection[i].roleId);
          }
          for(var i in list){
            if(list[i] == 20){
                this.$message({
                  message: "专家角色不能删除",
                  type: "warning"
                });
                  return;
              }
          }
          
          API.batchDelRole(list).then(result => {
            this.getList();
          });
        })
        .catch(_ => {});
    },
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.form.roleId = row.roleId;
      this.form.roleName = row.roleName;
      this.flag = 2;
    },
    handleAuth(index, row) {
      this.dialogAuthVisible = true;
      this.roleId = row.roleId;
      var id;
      if (row.resourceId != null) {
        id = row.resourceId.split(",");
        var list = [];
        for (var i in id) {
          list.push(Number(id[i]));
        }
        this.$refs.tree.setCheckedKeys(list);
      }
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          API.Role(this.form).then(result => {
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
            this.getList();
            this.form.roleId = '';
            this.form.roleName = '';
          });
        } else {
          this.$message({ message: "还有验证未通过的信息", type: "warning" });
          return false;
        }
      });
    },
    ok() {
      API.setAuth(this.roleId, this.$refs.tree.getCheckedKeys()).then(
        result => {
          this.dialogAuthVisible = false;
          this.$refs.tree.setCheckedKeys([]);
          this.getList();
        }
      );
    },
    remove() {
      this.dialogAuthVisible = false;
      this.$refs.tree.setCheckedKeys([]);
    },
    cancel(formName) {
      this.form.roleName = '';
      this.form.roleId = '';
      this.dialogVisible = false;
      // this.$refs[formName].resetFields();
    },
    getAuth() {
      API.Auth().then(result => {
        this.authlist = result.data.data;
      });
    },
    getList() {
      API.getRole().then(result => {
        this.tableData = result.data.data;
      });
    }
  },
  created() {
    this.getList();
    this.getAuth();
  }
};
</script>
<style scoped>
.add {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
</style>

