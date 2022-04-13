<template>
  <div class="container">
    <h1>上海交通大学专家管理系统</h1>
    <div>
      <div style="margin:25px 0 15px;">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
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
                <van-button v-show="item.status === '未确认'" @click="confirmBut(item, '1', index)" type="info">点击确认</van-button>
                <van-button v-show="item.status === '已确认'" @click="confirmBut(item, '0', index)" type="info">申请取消</van-button>
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
  </div>
</template>

<script>
import { Button, Tabbar, TabbarItem, Swipe, SwipeItem,  Cell, CellGroup, List, Dialog, Field } from 'vant'
import { mapActions, mapMutations, mapState } from 'vuex' // createNamespacedHelpers
import FooterTabbar from 'components/FooterTabbar'
import img from 'assets/webpack.png'

import { getmatchinfolist, expertconfirm } from '@/api/user'
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
      msg: ''
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
    'van-field': Field
  },
  computed: {
    
  },
  methods: {
    examineFun(stste) {
      expertconfirm({
        "ids": [this.dialogData.id],
        "status": stste,
        "fid": this.dialogData.fid,
        "memo": this.msg
      }).then(r => {
          console.log(r)
          if(r.code !== 0) {
            retrun
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
      .catch(() => {});
    },
    onBeforeClose(a, done){
      if(a === 'confirm') {
        return done(false)
      } else {
        return done(false)
      }
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
    // this.getTableData()
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
</style>
