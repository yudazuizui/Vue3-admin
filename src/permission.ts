import router from '@/router'
import setting from './setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from './store'
import useUserStore from './store/modules/user'
nprogress.configure({ showSpinner: false })
const userStore = useUserStore(pinia)
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title + ` | ${setting.title}`
  nprogress.start()
  const token = userStore.token
  const username = userStore.username
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userInfo()
          next({ ...to })
        } catch (error) {
          //token过期 用户手动修改本地存储token
          //后端验证token，验证不通过就不返回用户信息
          //退出登录 用户相关数据清空
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
// 全局后置守卫

router.afterEach((route) => {
  nprogress.done()
})
