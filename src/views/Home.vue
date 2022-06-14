<template>
  <div class="container">
    <h1>上海交通大学专家管理系统</h1>
    <div>
      <div style="text-align: center;font-size: 20px;color: #07c160;" v-show="!commitmentSHow">（承诺书已确认）</div>
      <div style="margin:25px 0 15px;">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="暂无记录"
          @load="getTableData"
        >
          <div style="margin-top:10px;margin-bottom:10px;" :key="index" v-for="(item, index) in tableData">
            <van-cell-group inset >
              <van-cell title="年份" :value="item.year" />
              <van-cell title="院/系" :value="item.expertCollege" />
              <van-cell title="学科" :value="item.expertSubject"  />
              <van-cell title="名称" :value="item.auditionName"  />
              <van-cell title="场次" :value="item.roundName"  />
              <van-cell title="面试时间段" :label="`${item.auditionBegin}--${item.auditionEnd}`" />
              <div class="operate">
                <span>{{item.status}}</span>
                <van-button style="margin: 10px 0;" v-show="item.status === '未确认'" size="small" @click="confirmBut(item, '1', index)" type="info">点击确认</van-button>
                <van-button style="margin: 10px 0;" v-show="item.status === '已确认'" size="small" @click="confirmBut(item, '0', index)" type="info">申请取消</van-button>
              </div>
              <!-- item.ifSignIn !== 4 -->
              <van-cell v-show="false" title="签到时间段" :label="`${item.signInBegin}--${item.signInEnd}`" />
              <div v-show="false" class="operate">
                <span>签到情况</span>
                <van-button v-show="item.ifSignIn === 0" size="small" style="margin: 10px 0;" @click="showSignBut(item)" type="primary">点击签到</van-button>
                <van-button v-show="item.ifSignIn === 1" size="small" style="margin: 10px 0;" :disabled="true" type="primary">已签到</van-button>
                <van-button v-show="item.ifSignIn === 2" size="small" style="margin: 10px 0;" :disabled="true" type="primary">未开始</van-button>
                <van-button v-show="item.ifSignIn === 3" size="small" style="margin: 10px 0;" :disabled="true" type="primary">已结束</van-button>
              </div>
            </van-cell-group>
          </div>
        </van-list>
     </div>
     <!-- <div style="margin:5px 0 15px;">
       <van-cell-group inset>
          <van-cell title="年份" value="2022" />
          <van-cell title="院/系" value="医学院" />
          <van-cell title="学科" value="医科"  />
          <van-cell title="名称" value="2022招生面试"  />
          <van-cell title="场次" value="2"  />
          <van-cell title="面试时间段" label="2022-02-28 00:00:00-2022-02-28 00:00:00" />
          <div class="operate">
            <span>未确认</span>
            <van-button type="info">点击确认</van-button>
          </div>
        </van-cell-group>
     </div>
     <div style="margin:5px 0 15px;">
       <van-cell-group inset>
          <van-cell title="年份" value="2022" />
          <van-cell title="院/系" value="医学院" />
          <van-cell title="学科" value="医科"  />
          <van-cell title="名称" value="2022招生面试"  />
          <van-cell title="场次" value="2"  />
          <van-cell title="面试时间段" label="2022-02-28 00:00:00-2022-02-28 00:00:00" />
          <div class="operate">
            <span>未确认</span>
            <van-button type="info">点击确认</van-button>
          </div>
        </van-cell-group>
     </div> -->
    </div>
    <van-dialog 
      v-model="confirmShow" 
      :title="state=== '1' ?'面试信息确认':'申请取消'" 
      show-cancel-button
      :confirmButtonText="state=== '1' ? '确定' : '提交'"  
      :cancelButtonText="state=== '1' ? '拒绝' : '关闭'"   
      confirmButtonColor="#000"
      cancelButtonColor="red"
      :before-close="onBeforeClose"
      @confirm="confirmT"
      @cancel="confirmF"
    >
      <van-cell-group style="margin-top: 30px;">
        <van-cell title="年份" :value="dialogData.year" />
        <van-cell title="名称" :value="dialogData.auditionName"  />
        <van-cell title="场次" :value="dialogData.roundName"  />
        <van-cell title="院/系" :value="dialogData.expertCollege" />
        <van-cell title="学科" :value="dialogData.expertSubject"  />
        <van-cell title="姓名" :value="dialogData.expertName"  />
        <van-cell title="限定人数" :value="dialogData.countPlan"  />
        <van-cell title="面试时间段" :label="`${dialogData.auditionBegin}--${dialogData.auditionEnd}`" />
        <van-cell v-show="dialogData.status === '已确认'">
           <!-- value="" label="描述信息" -->
          <template slot="title">
          <van-field
            v-model="msg"
            rows="2"
            autosize
            label="取消原因"
            type="textarea"
            placeholder="请输入原因"
          />
          </template>
        </van-cell>
      </van-cell-group>
    </van-dialog>
    <div>
      <van-overlay :show="commitmentSHow"  :lock-scroll="false">
      <div style="display: flex;align-items: center;justify-content: center;height: 100%;" @click.stop>
        <div style="width: 90%;height: 90%;background-color: #fff;border-radius: 5px;display: flex;flex-direction: column;align-items: center;">
        <h1 style="margin-top: 10px;margin-bottom: 10px;padding: 0 10px;">上海交通大学招生选拔工作面试专家承诺书</h1>
        <div class="noticeDiv" style="flex: 1;width: 90%;font-size: 16px;word-wrap: break-word;overflow: scroll;">
          <p>一、本人将自觉遵守国家、地方相关法律法规及学校规定，参与上海交通大学招生选拔工作。</p>
          <p>二、本人近三年内不存在违纪违法行为，未受到过任何组织处理、处分或处罚；无师德师风问题。</p>
          <p>三、本人承诺与报考上海交通大学当年本科招生专业的考生不存在亲属关系、指导关系及其他利害关系，不存在需要回避的情形。</p>
          <p>四、不私下会见考生及其亲友，不接受现金、有价证券、礼品、宴请等，不向考生及其亲友许愿承诺。</p>
          <p>五、不组织、不参与任何形式的与招生选拔有关的考前辅导、应试培训等活动，不组织、不参与任何形式的与招生选拔有关的复习资料编写、出版等活动。</p>
          <p>六、不在通讯设备中谈论招生选拔工作相关信息，不通过互联网传送招生选拔工作相关资料，不在联接到互联网的计算机等设备中处理招生选拔工作相关材料。</p>
          <p>七、本人将严格掌握测评标准，遵守独立评分原则，不错评、漏评，不相互讨论，按时完成任务。</p>
          <p>八、不私自携带手机等电子通讯工具进入选拔现场（含居家面试）。不在选拔现场及相关工作场所违反规定随意窜岗，工作期间不与外界进行与选拔内容有关的任何联系，自觉维护工作秩序。</p>
          <p>九、不私自留存招生选拔工作发放的各项资料，不将考生、评委专家及工作人员信息、组成情况、工作安排、选拔程序及内容等以任何形式对外透露，并防止泄露。</p>
          <p>十、未经学校授权，不将本人参与选拔的工作身份以任何形式对外透露，并防止泄露。未经学校授权，本人不接受媒体的采访或向媒体提供信息。</p>
          <p>十一、未经学校许可，不将选拔成绩及录取结果以任何形式对外透露，并防止泄露。</p>
          <p>十二、不将招生选拔其他需要保密的内容以任何形式对外透露，并防止泄露。</p>
          <p>十三、坚决维护招生考试安全，并对本人职责范围内的考试安全工作负责。</p>
          <p>十四、本人将按时参加招生选拔相关工作培训，并严格执行相关工作要求。</p>
          <p>十五、本人不存在其他影响招生选拔评判的情形。</p>
          <div><van-radio style='display: inline-block;position: relative;top: 6px;margin-right: 10px;' v-model="radio" :name="true"></van-radio>在学习国家教育考试的有关保密规定和国家有关涉密法律法规后，本人已经阅读并知晓上述内容，愿意承担不遵守以上承诺所引起的一切后果！</div>
        </div>
        <div style="margin-bottom: 20px;margin-top: 10px;">
          <van-button type="info" @click="confirmRead" :disabled="!radio" >确 认</van-button>
        </div>
        </div>
      </div>
    </van-overlay>
    </div>
    <div>
      <van-overlay :show="nbaShow"  :lock-scroll="false">
      <div style="display: flex;align-items: center;justify-content: center;height: 100%;" @click.stop>
        <div style="width: 90%;height: 90%;background-color: #fff;border-radius: 5px;display: flex;flex-direction: column;align-items: center;">
        <h1 style="margin-top: 10px;margin-bottom: 10px;padding: 0 10px;">保密协议内容</h1>
        <div class="noticeDiv" style="flex: 1;width: 90%;font-size: 16px;word-wrap: break-word;overflow: scroll;">
          <div v-html="nba">
          </div>
        </div>
        <div style="margin-bottom: 20px;margin-top: 10px;">
          <van-button type="info" @click="signRead" >确认并签到</van-button>
        </div>
        </div>
      </div>
    </van-overlay>
    </div>
    <van-dialog 
      v-model="pswShow" 
      title="修改密码" 
      show-cancel-button
      confirmButtonText="修改密码"  
      :showCancelButton="false"
      confirmButtonColor="#000"
      cancelButtonColor="red"
      :before-close="onBeforeClose"
      @confirm="pswFun"
    >
      <van-form @submit="onSubmit" ref="formData">
        <van-field
          v-model="oldpassword"
          name="passwordOld"
          label="原密码"
          placeholder="原密码"
          :rules="[{ required: true, message: '请填写原密码' }]"
        />
        <van-field
          v-model="newpassword"
          name="passwordNew"
          label="新密码"
          placeholder="新密码"
          :rules="[{ required: true, message: '请填写新密码' }]"
        />
        <van-field
          v-model="confirmpassword"
          name="confirmpassword"
          label="确认密码"
          placeholder="确认密码"
          :rules="[{ validator, message: '两次输入密码不一致' }]"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import { Button, Tabbar, TabbarItem, Swipe, SwipeItem,  Cell, CellGroup, List, Dialog, Field, Overlay, RadioGroup, Radio, Form } from 'vant'
import { mapActions, mapMutations, mapState } from 'vuex' // createNamespacedHelpers
import FooterTabbar from 'components/FooterTabbar'
import img from 'assets/webpack.png'

import { getmatchinfolist, expertconfirm, expertcommitment, expertpasswordupd, expertsignin } from '@/api/user'
// const { mapActions } = createNamespacedHelpers('test') // 可使用这种方式直接获得test模板
export default {
  name: 'home',
  data () {
    return {
      img,
      value: 1,
      tableData: [],
      loading: false,
      finished: false,
      page: 0,
      error: false,
      confirmShow: false,
      dialogData: {},
      state:'',
      dialogDataIndex: '',
      msg: '',
      commitment:'',
      commitmentSHow: false,
      countDown: 1,
      radio: false,
      pswShow: false,
      confirmpassword: '',
      newpassword: '',
      oldpassword: '',
      nba: '',
      fid: '',
      nbaShow: false,
    }
  },
  components: {
    [Button.name]: Button,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    FooterTabbar,
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'van-list': List,
    [Dialog.Component.name]: Dialog.Component,
    'van-field': Field,
    'van-overlay': Overlay,
    'van-radio': Radio,
    'van-form': Form
  },
  computed: {
    
  },
  methods: {
    signRead(){
      expertsignin({
        "fid": Number(this.fid),
      }).then(r => {
          console.log(r)
          if(r.code !== 0) {
            return
          }
          this.page = 0;
          this.tableData = [];
          this.getTableData();
          this.nbaShow = false;
      })
      .catch(() => {});
    },
    showSignBut(data) {
      this.nba = data.nda;
      this.fid = data.fid;
      this.nbaShow = true;
      console.log(data);
    },
    validator(val) {
      if(this.newpassword !== val) {
        return false
      } else {
        return true
      }
      // return /1\d{10}/.test(val);
    },
    onSubmit(values) {
      expertpasswordupd({
        "id": Number(sessionStorage.getItem("uid")),
        "passwordOld": values.passwordOld,
        "passwordNew": values.passwordNew,
      }).then(r => {
          console.log(r)
          if(r.code !== 0) {
            console.log(r.msg)
            Dialog.alert({
              title: '提示',
              message: r.msg,
            }).then(() => {
              // on close
            });
            return
          }
          Dialog.alert({
              title: '提示',
              message: '修改成功',
            }).then(() => {
              location.reload()
              // on close
            });
            this.pswShow = false;
      })
      .catch((r) => {
        Dialog.alert({
              title: '提示',
              message: r,
            }).then(() => {
              // on close
            });
      });
    },
    confirmRead(){
      expertcommitment({
        "id": Number(sessionStorage.getItem("uid")),
        "commitment": '1',
      }).then(r => {
          console.log(r)
          if(r.code !== 0) {
            return
          }
          this.commitmentSHow = false;
          if(sessionStorage.getItem('ifupdpassword') === '0'){
            this.pswShow = true;
          }
      })
      .catch(() => {});
    },
    examineFun(stste) {
      expertconfirm({
        "ids": [this.dialogData.id],
        "status": stste,
        "fid": this.dialogData.fid,
        "memo": this.msg
      }).then(r => {
          console.log(r)
          if(r.code !== 0) {
            return
          }
          this.tableData[this.dialogDataIndex].status = stste;
          this.confirmShow = false;
          if(stste === '已确认') {
            Dialog.alert({
              title: '提示',
              message: r.msg,
            }).then(() => {
              // on close
            });
          }
      })
      .catch((r) => {
        let msg = r.toString()
        msg = msg.replace('Error:', '')
              Dialog.alert({
              title: '提示',
              message: msg,
            }).then(() => {
              this.confirmShow = false;
            });
      });
    },
    onBeforeClose(a, done){
      if(a === 'confirm') {
        return done(false)
      } else {
        return done(false)
      }
    },
    pswFun(){
      this.$refs.formData.submit();
    },
    confirmT(){
      if(this.state === '1'){
        this.examineFun('已确认')
      } else {
        this.examineFun('审核中')
      }
    },
    confirmF(){
      if(this.state === '1'){
        this.examineFun('已拒绝')
      } else {
        this.confirmShow = false;
      }
    },
    confirmBut(data, state, index) {
      console.log(data)
      this.msg = '';
      this.dialogData = data;
      this.dialogDataIndex = index;
      this.state = state;
      this.confirmShow = true;
    },
    getTableData () {
      this.page ++
      getmatchinfolist({
        "college": "全部",
        "collegeCode": "全部",
        "name": "",
        "auditionId": 1,
        "auditionRoundId": 1,
        "status": "",
        "page": this.page,
        "pageSize": 10
      }).then(r => {
          console.log(r)
          if(r.code !== 0) {
            this.page --;
            this.loading = false;
            this.error = true;
            return
          }
          if(!r.data.list) {
            this.page --;
            this.loading = false;
            this.error = true;
            return
          }
          this.tableData = [...this.tableData,...r.data.list];
           // 加载状态结束
          this.loading = false;

          // 数据全部加载完成
          if (this.tableData.length >= r.data.datacount) {
            this.finished = true;
          }
        // sessionStorage.setItem("uid",r.data.uid)
        // this.$router.push({ path:  '/' })
      })
      .catch(() => {});
    },
    go(){
      this.$router.push({ path: '/article1' })
    },
  },
  mounted(){
    console.log(sessionStorage.getItem("commitment"))
    this.commitment = sessionStorage.getItem("commitment")
    if(this.commitment === '0') {
      this.commitmentSHow = true;
    } else {
      this.commitmentSHow = false;
      if(sessionStorage.getItem('ifupdpassword') === '0'){
        this.pswShow = true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
h1 {
  font-size: 24px;
  text-align: center;
}
.operate{
  display: flex;
  justify-content: space-around;
  align-items: center;
  span {
    font-size: 18px;
  }
}
.container{
  height: auto;
  width: 100%;
  padding-bottom: 50px;
}
.banner {
  width: 100%;
  height: auto;
  img {
    width: 100%;
    height: auto;
  }
}
.now-value {
  padding: 0 15px;
  box-sizing: border-box;
  font-size: 16px;
  // line-height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-list {
  margin: 15px;
  font-size: 24px;
  .icon {
    margin: 0 10px;
  }
}
.buttons {
  padding: 0 15px;
  font-size: 18px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  a {
    color: #333;
  }
}
.noticeDiv p {
  text-indent: 36px;
  font-size: 18px;
}
</style>
