import router from '@/router'
import store from '@/store'
import { Notify } from 'vant'
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/login', '/register'] // 白名单列表

router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  const hasToken = sessionStorage.getItem("uid")
  const date = sessionStorage.getItem("date")
  if (!hasToken || !date) {
    if(to.path.indexOf('login') === -1){
      next(`/login`)
        // window.location.href= `${window.location.protocol}//${window.location.host}/#/login`
        // window.location.href= `https://expert.sjtu.edu.cn/jdexpert/admin/index.html#/login`
        // window.location.href= `https://mob.hexntc.com/jdexpert/admin/index.html#/login`
        
        // next()
    }else{
        next()
    }
  }else{
    next()
  }
})
