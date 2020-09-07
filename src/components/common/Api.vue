<script>
import Vue from "vue";
const token = sessionStorage.getItem("token");
export default new Vue({
  name: "Api",
  data() {
    return {
      axios_config: {
        // //axios可选配置列表：
        // baseURL:'/api',
        // url:'/user/login',
        // method:'get',
        // timeout:3000,
        // proxy:{host:'http://localhost',port:8088,auth:{username:'cdd',password:'123456'}},
        // transformRequest:[function(data){return data;}],
        // transformResponse:[function(data){return data;}],
        // headers:{'X-Requested-with':'XMLHttpRequest'},
        // params:{ID:'12345',},
        // paramsSerializer: function(params){return Qs.stringify(params,{arrayFormat:'brackets'})},
        // data:{firstName:'fred'},
        // withCredentials:false,
        // adapter:function(config){},
        // auth:{username:'janedoe',password:'s00pers3cret'},
        // responsetype:'json',
        // xrsfHeadername:'X-XSRF-TOKEN',
        // onUploadProgress: function(progressEvent){},
        // onDownloadProgress: function(progressEvent){},
        // maxContentLength: 2000,
        // validateStatus: function(status){return status>=200 && stauts<300;},
        // httpAgent: new http.Agent({keepAlive:true}),
        // httpsAgent: new https.Agent({keepAlive:true}),
        // cancelToke: new CancelToken(function(cancel){})
      }
    };
  },
  methods: {
    xhtp(config) {
      return new Promise((resolve, reject) => {
        axios(config)
          .then(response => {
            console.log(response);
            if (response.data.code === 0) {
              this.$alert(comment, "提示信息", {
                  confirmButtonText: "确定",
                  type: "success",
                  center: true
                });
            } else {
              
              if(response.data.code == 1){
                window.location.href="http://"+window.location.host + '/dist/index.html#/Main';
                return;
              }else if(response.data.code == 5){
                window.location.href="http://"+window.location.host + '/dist/index.html#/auth';
                return;
              }else{
                let comment = response.data.msg;
                this.$alert(comment, "提示信息", {
                  confirmButtonText: "确定",
                  type: "warning",
                  center: true
                });
              }             
    　　　　　
              
              // resolve('error');
            }
            resolve(response);
          })
          .catch(err => {
            let comment;
            if (err.response) {
              // 请求已发出，但服务器响应的状态码不在 2xx 范围内
              comment =
                err.response.status +
                ":" +
                err.response.statusText +
                ":" +
                err.response.data;
            } else {
              // Something happened in setting up the request that triggered an Error
              comment = err.message;
            }
            this.$alert(comment, "错误信息", {
              confirmButtonText: "确定",
              type: "error",
              center: true,
              callback: action => {
                this.$message.error({ message: comment, center: true });
              }
            });
            reject(comment);
          });
      });
    },
    
    login(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/login.do",
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    logout() {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/logout.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token }
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    Password(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/modifyPwd.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data:data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
      });
    },
    getSchool(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/pubConstSchoolList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data:data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
      });
    },
    School(data){
       return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/saveConstSchool.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    goodsInfo(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/goods/goodsInfoList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data:data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    constSchool(){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/constSchoolList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
        }).then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },


    
    getMenus() {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/userResource.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token }
        })
          .then(result => {
            resolve(result);
            console.log(result.data.data.resource);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    getUser(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/userList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    User(data) {
      console.log(data.value);
      console.log(data.telephone);
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/insertUser.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    batchUser(data, type) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/batchEnableUser/" + type + ".do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    resetPwd(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/resetPwd.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getRole() {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/roleList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token }

        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    getUserInfo(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/userInformation.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data:data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getUserCertificationInfo(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/userCertificationInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data:data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getfriendInfo(data) {
      console.log(data);
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/social/admin/Agetinfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data:data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    detailgoods(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/goods/goodsDetail.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
          resolve(result);
        })
          .catch(err => {
            reject(err);
          });
      });
    },

    delgoods(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/goods/deleteGoods.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    offselfgoods(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/goods/offSelfGoods.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getAnswerInfo(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/userAskInfoList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data:data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    getdynasticInfo(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/social/admin/Agetdynamic.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data:data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    Role(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/saveRole.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    Auth() {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/resourceList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token }
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    batchDelRole(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/batchDelRole.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    setAuth(roleId, data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/auth/saveRoleResource/" + roleId + ".do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getTeams(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/clubListSort.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    getTeam(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/clubList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    clubInfoStatus(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/clubInfoStatus.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    detailTeam(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/clubInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    detailUser(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/info.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
      });
    },

    getsort(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/userCertificationListSort.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
          resolve(result);
        }).catch(err =>
        {reject(err);
        });
      });
    },

    teamJoin(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/userClublist.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
      });
    },
    clubInfoByUser(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/clubInfoByUser.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    teamBuild(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/teamBuildingList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    buildingInfo(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/buildingInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    buildComment(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/tbComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getMember(data) {

      console.log(data);
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/social/admin/SocialUserInfoList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {

        resolve(result);
        console.log(result.data.data.list);
        }).catch(err => {reject(err);});});
    },

    getSearchfriend(data){
      console.log(data)
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/social/admin/Asearch.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {

          resolve(result);
          console.log(result.data.data);
        }).catch(err => {reject(err);});});
    },
    userEnable(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/userEnable.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
        resolve(result);}).catch(err => {reject(err);});});
    },
    userStatus(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/userStatus.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
        resolve(result);}).catch(err => {reject(err);});});
    },
    getAd(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/advertisementList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    Ad(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/saveAdvertisement.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
      });
    },
    getComment(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/tbComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    delComment(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/deltbComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getSpeech(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/clubSpeakList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    detailSpeech(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/clubSpeakInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    speakComment(data){
       return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/speakCommentList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    delSpeakComment(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/delSpeakComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getActive(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/clubActivityList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    detailActive(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/clubActivityInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    commentActive(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/activityCommentList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    delCommentActive(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/activityComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getVote(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/voteInfoList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    detailVote(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/voteInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getNotice(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/clubNoticeList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
  /*  getMember(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/userCertificationList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },  */
    detailMember(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/userCertificationInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getDisable(data){//禁用项
       return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/pubConstDisableList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    Disable(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/saveConstDisable.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    batchDisabled(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/deleteBatchConstDisable.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    delDisabled(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/deleteConstDisable.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
      });
    },

    delgoodDisabled(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/goods/deleteGoodsLabel.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    },

    batchdelDisabled(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/goods/deleteBatchGoodsLabel.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    },

    getTag(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/pubConstLabelList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
      });
    },
    getgoodTag(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/goods/pubConstGoodsLabelList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    },
    Tag(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/saveConstLabel.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
      });
    },
    goodTag(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/goods/saveConstGoodsLabel.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      });
    },
    // 专题列表
    getSpecial(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/ztSpeakList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getArticle(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/wzSpeakList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    Article(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/saveWzSpecial.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    articleComment(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/pgComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    upSpecialInfo(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/upSpecialInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getReport(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/reportList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    
    detailReport(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/reportAskInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    reportComment(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/reportAskComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    delReport(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/deleteReportAskInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    delReportComment(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/deleteAskComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getAnswer(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/askInfoList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    detailAnswer(data){
        return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/askInfos.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    detailfrienddt(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/social/admin/AgetSingleDynamic.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
          resolve(result);
        })
          .catch(err => {
            reject(err);
          });
      });
    },
    answerComment(data){
        return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/queryAskComent.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    

    // 新建专题和更新
    Special(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/saveSpecial.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 查看
    detailLook(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/specialInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 批量删除
    batchDelete(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/deleteBatchSpecial.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 查看/进入问题里面的评论
    commentSpecial(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/pgHotReview.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 查看里面的评论删除
    commentDelete(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/deleteComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 修改专题信息获取详情
    upSpecialInfo(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/upSpecialInfo.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 删除专题
    deleteProject(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/DeleteSpecial.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 專題回答
    HotReviewComment(data) {
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/HotReviewComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        })
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    deleteTwoComment(data) {//删除专题二级评论
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/deleteTwoComment.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
      });
    },
    delBuild(data){
       return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/delSpeak.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    },
    delBuild(data){
       return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/deltb.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    },
    delSpeak(data){
       return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/delSpeak.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    },
    delActivity(data){
       return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/delActivity.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    },
    delVote(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/delVote.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    },
    delNotice(data){
       return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/club/delNotice.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data: data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    },

    getExpert(){
        return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: "/api/admin/ask/expertList.do",
          headers: { "XIANGYU-ACCESS-TOKEN": token },
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    },
    deleteSecondAskComment(id){
        return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: '/api/admin/ask/deleteSecondAskComment/'+id+'.do',
          headers: { "XIANGYU-ACCESS-TOKEN": token },
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    },
    detailSchool(id){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: '/api/admin/ask/constSchoolInfo/'+id+'.do',
          headers: { "XIANGYU-ACCESS-TOKEN": token },
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    },
    getFeeBack(data){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: '/api/admin/ask/queryFeeback.do',
          headers: { "XIANGYU-ACCESS-TOKEN": token },
          data:data
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    },
    delFeeBack(id){
      return new Promise((resolve, reject) => {
        this.xhtp({
          method: "post",
          url: '/api/admin/ask/deleteFeeback/'+id+'.do',
          headers: { "XIANGYU-ACCESS-TOKEN": token },
        }).then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
          });
      });
    }

  }
});
</script>
