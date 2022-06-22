import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";


NProgress.configure({ showSpinner: false }); // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

//登录鉴权
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  const hasGetUserInfo = store.getters.user;
  const hasToken = localStorage.getItem("adminToken") || "";

  if (to.meta.auth) {
    //需要权限
    console.log(to,"需要权限");
    if (hasGetUserInfo) {
      next();
    } else {
      if (hasToken) {
        //有token则验证token
        try {
          await store.dispatch("user/getInfo");
          next();
        } catch (error) {
          await store.dispatch("user/resetToken");
          Message.error("Token已过期，请重新登录");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      } else {
        //没有token，跳转到登录页
        next({ path: `/login?redirect=${to.path}` });
        NProgress.done();
      }
    }
  } else {
    //不需要权限
    if (to.path === "/login") {
      //去的是登录页面
      if (hasGetUserInfo) {
        //已经登录了
        next({ path: "/" });
      }
    } else {
      next();
    }
    NProgress.done();
  }

  // determine whether the user has logged in
  // const hasToken = getToken()

  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       next()
  //     } else {
  //       try {
  //         // get user info
  //         await store.dispatch('user/getInfo')

  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
