import Vue from 'vue'
import App from './App.vue'
import VueSSE from 'vue-sse';


Vue.use(VueSSE);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
