import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


// Import Bootstrap and BootstrapVue CSS files
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

// Import BootstrapVue and use it
import BootstrapVue3 from 'bootstrap-vue-3';





const app = createApp(App);
app.use(BootstrapVue3);
app.use(router);

app.mount('#app');
