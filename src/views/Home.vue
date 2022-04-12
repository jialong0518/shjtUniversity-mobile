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
                <span>未确认</span>
                <van-button type="info">点击确认</van-button>
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
  </div>
</template>

<script>
import { Button, Tabbar, TabbarItem, Swipe, SwipeItem,  Cell, CellGroup, List } from 'vant'
import { mapActions, mapMutations, mapState } from 'vuex' // createNamespacedHelpers
import FooterTabbar from 'components/FooterTabbar'
import img from 'assets/webpack.png'

import { getmatchinfolist } from '@/api/user'
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
    'van-list': List
  },
  computed: {
    
  },
  methods: {
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
    this.getTableData()
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
