import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import VueAwesomePaginate from "vue-awesome-paginate";

// import the necessary css file
import "vue-awesome-paginate/dist/style.css";


const app = createApp(App);

app.config.globalProperties.apiUrl = 'http://perpus-api.mamorasoft.com/'

app.use(VueSweetalert2);
app.use(VueAwesomePaginate);
app.use(router);

app.mount('#app')
