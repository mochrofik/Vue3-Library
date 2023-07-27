
//import vue router
import { createRouter, createWebHistory } from 'vue-router'

//define a routes

import LoginPage from '../views/auth/Login.vue';
import RegisterPage from '../views/auth/Register.vue';
import DashboardPage from '../views/pages/Dashboard.vue';
import MainLayout from '../layout/MainLayout.vue';
import BookCategory from '../views/pages/category/BookCategory.vue';
import Books from '../views/pages/book/Book.vue';
import Member from '../views/pages/member/Member.vue';
import Peminjaman from '../views/pages/peminjaman/Peminjaman.vue';
import PeminjamanAdmin from '../views/pages/peminjaman/PeminjamanAdmin.vue';

import NotFound from  '../views/404.vue';


const routes = [
    {
        path: '/',
        component: LoginPage,
    },
    {
        path: '/register',
        component: RegisterPage,
    },
    {
        path: '/home',
        component: MainLayout,
        children:[
            
            {
                path: '/404',
                component: NotFound,
            },
            {
                path: '/dashboard',
                component:DashboardPage,
                name: 'Dashboard'
            },
            {
                path: '/book-category',
                component:BookCategory,
                name: 'Kategori Buku'
            },
            {
                path: '/books',
                component:Books,
                name: 'Buku'
            },
            {
                path: '/member',
                component:Member,
                name:'Member'
            },
            {
                path: '/peminjaman',
                component:Peminjaman,
                name:'Peminjaman'
            },
            {
                path: '/peminjamanadmin',
                component:PeminjamanAdmin,
                name:'Peminjaman Admin'
            },
          

        ]
    }
];

//create router
const router = createRouter({
    history: createWebHistory(),
    routes // <-- routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("userKey");
    const role = JSON.parse(localStorage.getItem("userData"));
    
    

    if(to.path == '/dashboard' && token == null){
        next({path:'/'})
    }
    if(to.path == '/' && token != null){
        next({path:'/dashboard'})
    }

    if(to.path == '/peminjaman' && token != null && role.roles[0].name == 'admin'){
        next({path:'/404'});
    }
    if(to.path == '/peminjamanadmin' && token != null && role.roles[0].name == 'member'){
        next({path:'/404'});
    }

    next()
});

export default router

