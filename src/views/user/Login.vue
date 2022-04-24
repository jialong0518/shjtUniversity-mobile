<template>
  <div>
    <div class="header">
      <h1>上海交通大学专家管理系统</h1>
    </div>
    <div class="content">
      <van-field placeholder="学工号" v-model="phoneNumber" left-icon="phone-o" :error-message="phoneNumberError" />
      <!-- eye -->
      <van-field v-if="loginWay==='password'" placeholder="登录密码" v-model="password" left-icon="lock" :type="passwordType">
         <van-icon slot="right-icon" @click="switchPasswordType" :name="passwordIcon"/>
      </van-field>
      <van-field v-else placeholder="短信验证码" v-model="password" left-icon="comment-o" type="text">
        <VerifyCodeBtn slot="button" @sendVerifyCode="sendVerifyCode" />
      </van-field>
      <div class="button-wrap">
        <van-button size="large" @click="handleLogin" type="info">登录</van-button>
      </div>
      <div class="button-wrap">
        <van-button size="large" @click="goEmpower">上海交通大学统一身份认证</van-button>
      </div>
      <div class="more-wrap">
        <!-- <router-link class="link" to="/register">没有账号？去注册</router-link> -->
        <!-- <div class="switch-way" @click="switchLoginWay">{{loginWayObj.toggleMsg}}</div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { Field, Icon, Button } from 'vant'
import { mapActions } from 'vuex'
import VerifyCodeBtn from '@/components/VerifyCodeBtn'
import { login, goEmpower } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      phoneNumber: '',
      password: '',
      code: '',
      loginWay: 'password',
      passwordType: 'password',
      phoneNumberError: ''
    }
  },
  methods: {
    goEmpower() {
      // ?code=6118ae9a113d44f892bfd15b877adef8
      window.location.href ='https://jaccount.sjtu.edu.cn/oauth2/authorize?response_type=code&scope=essential&client_id=HTjYQXuT3U1QqTp8h0ug&redirect_uri=https://expert.sjtu.edu.cn/jdexpert/mob/index.html#/login';
    },
    sendVerifyCode () {
      this.phoneNumberError = ''
      if (!this.phoneNumber) { // 根据需求做判断
        this.phoneNumberError = '手机号码必填'
      }
    },
    switchPasswordType () {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    },
    switchLoginWay () {
      this.password = this.code = ''
      this.loginWay = this.loginWay === 'password' ? 'verifyCode' : 'password'
    },
    async handleLogin () {
        console.log('222')

      // const data = {
      //   phoneNumber: this.phoneNumber,
      //   password: this.password,
      //   $router: this.$router,
      //   $route: this.$route
      // }
      // let res = await login({username: this.phoneNumber,
      //   password: this.password})
      //   console.log(res)
      login({username: this.phoneNumber,
        password: this.password}).then(r => {
          if(r.code === 1) {
            return
          }
        sessionStorage.setItem("uid",r.data.uid)
        sessionStorage.setItem("phone",r.data.phone)
        sessionStorage.setItem("name",r.data.name)
        this.$router.push({ path:  '/' })
      })
      .catch(() => {});
      // this.$router.push({ path: '/article1' })
      // this.login(data)
      // sessionStorage.getItem("uid")
    },
    
    // ...mapActions({
    //   login: 'user/login'
    // })
  },
  mounted() {
    let url = window.location.href;
    let urlArr = [];
    // let url_ = 'https://mob.hexntc.com/jdexpert/admin/index.html?code=66a3e83a6bb347c1bc6b11d7a31b7ab5#/login?back=index.html'
    if(url.indexOf('index.html?code=') !== -1){
      urlArr = url.split('index.html?code=');
      urlArr = urlArr[1].split('#/login')[0];
      window.location.href = `https://expert.sjtu.edu.cn/jdexpert/mob/index.html#/login?code=${urlArr}`
    }
    console.log(this.$route.query.code)
    if(this.$route.query.code){
      goEmpower({code: this.$route.query.code})
      .then(r => {
        if(r.code === 1) {
            return
          }
        sessionStorage.setItem("uid",r.data.uid)
        sessionStorage.setItem("phone",r.data.phone)
        sessionStorage.setItem("name",r.data.name)
        this.$router.push({ path:  '/' })
      })
      .catch(() => {});
    }
  },
  computed: {
    loginWayObj: function () {
      if (this.loginWay === 'password') {
        return {
          icon: 'closed-eye',
          toggleMsg: '验证码登录'
        }
      }
      return {
        icon: 'eye',
        toggleMsg: '密码登录'
      }
    },
    passwordIcon: function () {
      return this.passwordType === 'password' ? 'closed-eye' : 'eye'
    }
  },
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [Button.name]: Button,
    VerifyCodeBtn
  }
}
</script>
<style lang="scss" scoped>
  .header{
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    .logo{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      img{
        width: 100%;
      }
    }
  }
  .content{
    width: 100%;
    height: auto;
    padding: 0 15px;
    box-sizing: border-box;
    .button-wrap{
      width: 100%;
      height: auto;
      margin-top: 15px;
    }
  }
  .more-wrap{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    font-size: 14px;
    a.link{
      color: #1989fa;
    }
    .switch-way{
      color: #333;
    }
  }

</style>
