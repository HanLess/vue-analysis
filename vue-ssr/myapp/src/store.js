import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default function createStore() {
      let store =  new Vuex.Store({
            state: {
                  homeInfo: ''
            },
            actions: {
                  getHomeInfo({ commit }) {
                        var p = new Promise(function(resolve){
                            setTimeout(function(){
                                resolve()
                            },3000)
                        }).then(function(){
                            commit("setHomeInfo","this is a test data")
                        })

                        return p
                  }
            },
            mutations: {
                  setHomeInfo(state, res) {
                        state.homeInfo = res
                  }
            }
      })

      return store
}
