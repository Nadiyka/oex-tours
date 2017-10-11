import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
    load: {
        key: '',
        v: '3'
    }
});

new Vue({
  el: '#app',
  render: h => h(App)
});
localStorage.setItem('oex-currency', JSON.stringify([
    {
        name: 'RUB',
        active: true
    },
    {
        name: 'EUR',
        active: false
    },
    {
        name: 'USD',
        active: false
    },
    {
        name: 'GBP',
        active: false
    }
]));