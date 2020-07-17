<template>

    <div class="page">
        <div class="search">
        
        <el-button type="primary"  @click="add" >添加</el-button>
    </div>
        <el-table :data="tableData" style="width: 100%;">
        <el-table-column type="index" label="序号" ></el-table-column>
        <el-table-column prop="name" label="广告名称" ></el-table-column>
        <el-table-column prop="category" label="广告类别" :formatter="formatterCategory"></el-table-column>
        <el-table-column prop="linkUrl" label="广告url地址" ></el-table-column>
        <el-table-column prop="description" label="规格说明" ></el-table-column>
        <el-table-column label="操作" >
            <template slot-scope="scope">
                <el-button size="mini"  type="primary" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog :show-close="false" :close-on-click-modal="false" :title="flag == 1 ?'添加广告':'编辑广告'" :visible.sync="dialogVisible" width="50%" center>
         <el-form  label-width="100px"  :model="form"  ref="form" :rules="rules">
            <el-form-item label="广告名称" prop="name" >
                <el-input v-model="form.name" ></el-input>
            </el-form-item>
            <el-form-item label="广告类别" prop="category">
                <el-select v-model="form.category" placeholder="请选择" >
                    <el-option v-for="item in categoryList" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="广告链接" prop="linkUrl">
                <el-input v-model="form.linkUrl"></el-input>
            </el-form-item>
            <el-form-item label="广告内容" prop="content">
                <el-input v-model="form.content" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="规格说明" prop="description">
                <el-input v-model="form.description" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="广告图片" >
                <el-upload 
                class="avatar-uploader"
                action="/api/admin/ask/uploadFile.do" 
                :show-file-list="false"
                :headers="myHeaders" 
                :on-success="handleAvatarSuccess" 
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="flag == 1 ?imageUrl:serverSrc+imageUrl" class="avatar">


                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
         </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel('form')">取 消</el-button>
            <el-button type="primary" @click="save('form')" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>
    <Pagination :pageCurrent="pn" v-on:refreshCurrentChange="refreshCurrentChange" v-on:refreshSizeChange="refreshSizeChange" :count="count">
    </Pagination>
    </div>
</template>
<script>
import Pagination from '@/components/element/Pagination'
import API from '@/components/common/Api'

export default {
    components: { Pagination },
    data(){
        return{
            serverSrc:this.GLOBAL.serverSrc,
            myHeaders: {
                "XIANGYU-ACCESS-TOKEN": sessionStorage.token
            },
            pn:1,
            ps:10,
            count:0,
            dialogVisible:false,
            dialogImageUrl: '',
            dialogImageVisible: false,
            tableData: [],
            imageUrl:'',
            isUpload:false,
            loading:false,
            form:{
                id:'',//				广告ID（非必填，编辑时传入）
                name:'',//			广告名称
                linkUrl:'',//		广告链接
                category:'',//		广告类别(1-首页banner；2-首页中间 ;3-问问首页)传指定数字
                content:'',//		广告内容
                description:'',//	规格说明
                coverImage:'',//	
            },
            rules: {
            name: [
              { required: true, message: '请输入广告名称', trigger: 'blur' },
            //   { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '只能输入中英文和数字' },
              { min:1,max:30,message:'长度在 1 ~ 30 个字符' ,trigger: 'blur'},
            ],
            linkUrl: [
              { required: true, message: '请输入广告链接', trigger: 'blur' },
            ],
            category:[
              { required: true, message: '请选择广告类别', trigger: 'change' },
            ],
            content:[
              { required: true, message: '请输入广告内容', trigger: 'blur' },
            ],
            description:[
              { required: true, message: '请输入规格说明', trigger: 'blur' },
            ],
            
          },
            categoryList:[
                {
                    key:1,
                    name:'首页顶部'
                },
                {
                    key:2,
                    name:'首页中间'
                },
                {
                    key:3,
                    name:'问问首页'
                },
                {
                    key:4,
                    name:'问问中间'
                },
            ],
                 
        }
    },
    methods:{
        clear(){
            this.form.id = '';
            this.form.name = '';
            this.form.linkUrl = '';
            this.form.category = '';
            this.form.description = '';
            this.form.coverImage = '';
            this.form.content = '';
            this.imageUrl = '';
        },
        getUrl(path){
            var list = path.split('=');
            return list[1];
        },
        save(formName){
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this.form.coverImage == ''){
                    this.$message({
                        message: '请上传图片',
                        type: 'warning'
                    });
                    return;
                }
                if(this.isUpload == false){
                    this.form.coverImage = this.getUrl(this.form.coverImage);
                }
                this.loading = true;
                API.Ad(this.form).then(result=> {
                    this.loading = false;
                    if(result.data.code != 0){
                        this.dialogVisible = true;
                    }else{
                        this.dialogVisible = false;
                        this.$refs[formName].resetFields();
                        this.getList();
                    }
                });
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        add(){
            this.flag = 1;
            this.dialogVisible = true;
            this.clear();
        },
        cancel(formName){
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
            // this.clear();
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.form.coverImage = res.data;
            if(res.code == 0){
                this.$message({
                    message: res.msg,
                    type: 'success'
                });
                this.isUpload = true;
            }else{
                this.$message({
                    message: res.msg,
                    type: 'warning'
                });
            }
      },
      beforeAvatarUpload(file) {
        var  type = true;
          if(file.type != 'image/jpeg' && file.type != 'image/png'){
            type = false;
          }else{
            type = true;
          }
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!type) {
            this.$message.error('上传图片只能是 JPG或者PNG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
          }
          return type && isLt2M;
      },
        
        formatterCategory(row){
            if(row.category == 1){
                return '首页顶部';
            }else if(row.category == 2){
                return '首页中间';
            }else if(row.category == 3){
                return '问问首页';
            }else{
                return '问问中间';
            }
        },
        refreshCurrentChange(val){
            this.pn = val;
            this.getList();
        },
        refreshSizeChange(val){             
            this.pn = 1;
            this.ps = val;
            this.getList();
        },
        handleEdit(index,row){
            this.flag = 2;
            this.dialogVisible = true;
            this.form.id = row.id;
            this.form.name = row.name;
            this.form.linkUrl = row.linkUrl;
            this.form.category = row.category;
            this.form.description = row.description;
            this.form.coverImage = row.coverImage;
            this.form.content = row.content;
            this.imageUrl = row.coverImage;
        },
        getList(){
            let data = {
                pn:this.pn,
                ps:this.ps,
            };
            API.getAd(data).then(result=> {
              this.tableData = result.data.data.list;
              this.count = result.data.data.count;
              this.isUpload = false;
            });
        },
    },
    created(){
        this.getList();
    }
}
</script>
<style scoped>

</style>

