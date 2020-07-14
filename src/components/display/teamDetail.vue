<template>
    <div class="page">
        <div class="nav">
            <span @click="back"><i class="el-icon-arrow-left"></i>返回团队管理</span>
            <div class="name">团队详情查看</div>
        </div>
        <div class="m_title">{{detail.name}}</div>
        <div class="detail">
            <div class="left">
                <div class="infos">
                    <img :src="serverSrc+detail.logoImage"/>
                    <div class="info">
                        <!-- <div class="name">2017水墨丹青团</div> -->
                        <div class="member">
                            <div>成员<span>{{detail.memberNumber}}</span></div>|
                            <div>昨日来访<span>{{detail.yesterdayTraffic}}</span></div>
                        </div>
                        <div class="public">发布者：<span>{{detail.nickname}}</span></div>
                        <div class="time">{{detail.gmtCreate}}</div>
                    </div>
                </div>
                <div class="total">
                    <div>团言：{{detail.speakCount}}条</div>
                    <div>活动：{{detail.activityCount}}条</div>
                    <div>公告：{{detail.noticeCount}}条</div>
                    <div>投票：{{detail.voteCount}}条</div>
                    <div>团建：{{detail.bulidingCount}}条</div>
                </div>
                <div class="introduce">
                    <img :src="detail.coverImage" class="img_1"/>
                    <div class="text">
                        <div class="name">团队介绍</div>
                        <div>{{detail.introduction}}</div>
                        <div class="code" v-if="detail.qrcodeImage != null"><img :src="detail.qrcodeImage"/></div>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="leaguer">
                    <div class="name">成员</div>
                    <div class="list">
                        <div class="tip">团长、副团长（{{info.length}}人）</div>
                        <div class="search">
                            <el-input class="input" v-model="nickname"></el-input>
                            <el-button type="primary" mini @click="search">搜索</el-button>
                        </div>
                        <div class="item" v-for="(item, index) in info" :key="index" @click="detailUser(item.memberId)">
                            <img :src="item.header"/>
                            <div class="rank">LV{{item.grade}}</div>
                            <div class="job" v-if="item.role == 1">团长</div>
                            <div class="job_s" v-if="item.role == 2">副团长</div>
                            <div class="who" >{{item.nickname}}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    <el-dialog :close-on-click-modal="false"  title="详细信息" :visible.sync="dialogVisible" width="50%" center>
        <img :src="infos.header" class="personImg"/>
        <div class="col">
            <div>昵称：{{infos.nickname}}</div>
        </div>
        <div class="col">
            <div v-if="infos.sex == 1">性别：男</div>
            <div v-if="infos.sex == 2">性别：女</div>
        </div>
        <div>
            <div>学校：{{infos.college}}</div>
        </div>
        <div style="color: orange;">加入团队({{team.length}})</div>
        <div class="joinTeam">
            <div class="team" v-for="(item, index) in team" :key="index">
                <img :src="item.logoImage"/>
                <div>{{item.name}}</div>
            </div>
        </div>
    </el-dialog>
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
.left{
    margin-right: 20px;
}
.right{
    margin-left: 20px;
}
.detail .left,.right{
    width: 50%;
}

.left .infos{
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
    margin-top: 30px;
    padding-left: 10px;
}
.total div{
    margin-bottom: 10px;
    width: 30%;
}
.introduce{
    padding-left: 10px;
}
.introduce .img_1{
    max-width: 80%;
}
.introduce .text{}
.introduce .text .name{
    font-size: 16px;
    color: #000;
    margin: 10px 0;
}
.introduce .code{
    text-align: center;
    margin-top: 20px;
}

.right{}
.right .leaguer{
    border:1px solid #e6e6e6;
   
}
.right .leaguer .name{
    border-bottom: 1px solid #e6e6e6;
     padding: 10px;
}
.leaguer .list{
    padding: 20px;
}
.leaguer .tip{}
.leaguer .search{
    display: flex;
}
.search .input{
    margin-right: 10px;
}
.item{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;
}
.item img{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}
.item .rank,.job{
    color: #ffffff;
    background-color: #ff9800;
    font-size: 12px;
    border-radius: 3px;
    padding: 0 7px;
    height: 20px;
    line-height: 20px;
    margin-right: 10px;
}
.item .job{
    color: #ffffff;
    background-color: #ff9800;
    font-size: 12px;
    border-radius: 3px;
    padding: 0 5px;
    height: 20px;
    line-height: 20px;
    margin-right: 10px;
}
.item .job_s{
    background: #259b24;
    color: #ffffff;
    font-size: 12px;
    border-radius: 3px;
    padding: 0 5px;
    height: 20px;
    line-height: 20px;
    margin-right: 10px;
}
</style>
<script>
import API from '@/components/common/Api'

export default {
    data(){
        return{
            list:10,
            clubId:'',
            detail:'',
            info:'',
            nickname:'',
            dialogVisible:false,
            infos:'',
            team:'',
            name:'',
            college:'',
            startTime:'',
            endTime:'',
            serverSrc:this.GLOBAL.serverSrc,
        }
    },
    filters:{
        roleName:function(val){
            //0-待审核；1-团长；2.副团长；3-普通队员,

            if(val == 0){
                return '待审核';
            }else if(val == 1){
                return '团长';
            }else if(val == 2){
                return '副团长';
            }else if(val == 4){
                return '普通队员';
            }
        }
    },
    methods:{
       
        detailUser(id){
            this.dialogVisible = true;
            let data = {
                uid:id
            };

            API.detailUser(data).then(result=> {
              this.infos = result.data.data;
            });
            API.teamJoin(data).then(result=> {
              this.team = result.data.data.list;
            });


        },
        search(){
            this.userInfo();
        },
        back(){
            this.$router.push({name:'team',query:{name:this.name,college:this.college,startTime:this.startTime,endTime:this.endTime,type:0,status:this.$route.query.status}});
        },
        getDetail(){
            let data = {
                clubId:this.clubId
            };
            API.detailTeam(data).then(result=> {
              this.detail = result.data.data;
              this.detail.logoImage = this.detail.logoImage;
              console.log(3333333);
              console.log(this.detail);

            });
        },
        userInfo(){
            let data = {
                clubId:this.clubId,
                nickname:this.nickname
            };
            API.clubInfoByUser(data).then(result=> {
                this.info = result.data.data;
            });
        }
    },
    created(){
        this.clubId = Number(this.$route.query.clubId);
        this.college = this.$route.query.college;
        this.name  = this.$route.query.name;
        this.startTime = this.$route.query.startTime;
        this.endTime = this.$route.query.endTime;
        this.getDetail();
        this.userInfo();
    }
}
</script>
