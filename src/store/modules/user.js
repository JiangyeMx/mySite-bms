import { loginApi, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    user: null, //储存用户信息
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  SET_USER: (state, payload) => {
    state.user = payload;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginApi(userInfo)
        .then((resp) => {
          const { data } = resp;
          if (data) {
            commit("SET_USER", data);
            resolve();
          } else {
            reject(resp);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    // const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  //getInfo()会返回如下格式：
  //验证通过：
  // {
  //   "code": 0,
  //   "msg": "",
  //   "data": {
  //     "loginId": "yjisme",
  //     "name": "管理员",
  //     "id": "608530d2dfce8783ab52a45d"
  //   }
  // }
  //验证失败：
  // {"code":401,"msg":"未登录，或登录已过期","data":null}这是一个JSON格式的字符串
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then((resp) => {
        if (typeof resp === "string") {
          //说明未登录，或者登录已过期
          resp = JSON.parse(resp);//将字符串转换为JSON格式
          if (resp.code === 401) {
            reject(resp.msg);
          }
        } else {
          //说明token有效
          commit("SET_USER", resp.data);
          resolve();
        }
      });

      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     return reject('Verification failed, please Login again.')
      //   }

      //   const { name, avatar } = data

      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      localStorage.removeItem("adminToken");//删除localStorage中的token
      resetRouter();//重置路由
      commit("RESET_STATE");//清空state
      resolve();

      // logout(state.token)
      //   .then(() => {
      //     removeToken(); // must remove  token  first
      //     resetRouter();
      //     commit("RESET_STATE");
      //     resolve();
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
