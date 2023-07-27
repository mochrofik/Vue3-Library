<template>
    <body class="hold-transition login-page">
        <div class="login-box">
            <div class="login-logo">
                <a href="../../index2.html"><b>Perpustakaan</b></a>
            </div>
            <div class="container">
                <div class="card">
                    <div class="card-body login-card-body">
                        <p class="login-box-msg">Selamat Datang, Registrasi terlebih dahulu</p>


                        <form @submit.prevent="actionRegister()">
                            <div class="input-group mb-3">
                                <input type="username" v-model="nama" name="nama" required class="form-control"
                                    placeholder="Nama" />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-user"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input type="email" v-model="email" name="email" required class="form-control"
                                    placeholder="Email" />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input type="username" v-model="username" required name="username" class="form-control"
                                    placeholder="Username" />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-tag"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input id="password" type="password" required v-model="password" class="form-control"
                                    name="password" placeholder="Password" />
                                <div class="input-group-append" @click="showPassword()">
                                    <div class="input-group-text">
                                        <span v-if="showPass" class=" fas fa-unlock" id="iconPassword"></span>
                                        <span v-if="!showPass" class=" fas fa-lock" id="iconPassword"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input id="newPassword" type="password" @change="changePassword()" required
                                    v-model="newPassword" class="form-control" name="password"
                                    placeholder="Konfirmasi Password" />
                                <div class="input-group-append" @click="shownewPassword()">
                                    <div class="input-group-text">
                                        <span v-if="showPass2" class=" fas fa-unlock" id="iconnewPassword"></span>
                                        <span v-if="!showPass2" class=" fas fa-lock" id="iconnewPassword"></span>
                                    </div>
                                </div>
                                <div id="validationServer03Feedback" class="invalid-feedback">
                                    {{ message }}
                                </div>
                            </div>
                            <div class="row">
                                <!-- /.col -->
                                <div class="col-4">
                                    <button type="submit" class="btn btn-primary btn-block">
                                        Daftar!
                                    </button>
                                </div>
                                <div class="col">
                                    Sudah memiliki akun? <router-link to="/" class="link"> Masuk disini! </router-link>
                                </div>
                                <!-- /.col -->
                            </div>
                        </form>
                    </div>
                    <!-- /.login-card-body -->
                </div>
            </div>
        </div>
    </body>
</template>
  
<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

import Api from "../../api/index";
import Swal from 'sweetalert2'


export default {
    data() {
        return {
            username: '',
            password: '',
            newPassword: '',
            showPass: false,
            showPass2: false,
            nama: '',
            email: '',
            errors: [],
            message: '',
        }
    },
    methods: {
        showPassword() {
            const passwordField = document.querySelector('#password')
            if (passwordField.getAttribute('type') === 'password') {
                passwordField.setAttribute('type', 'text')
                this.showPass = true;
            } else {
                this.showPass = false;
                passwordField.setAttribute('type', 'password')
            }
        },
        shownewPassword() {
            const passwordField = document.querySelector('#newPassword')
            if (passwordField.getAttribute('type') === 'password') {
                passwordField.setAttribute('type', 'text')
                this.showPass2 = true;
            } else {
                this.showPass2 = false;
                passwordField.setAttribute('type', 'password')
            }
        },
        changePassword() {

            const passwordField = document.querySelector('#newPassword')
            if (this.newPassword != this.password) {
                passwordField.classList.add('is-invalid')
                this.message = 'Password tidak cocok';
            } else {
                passwordField.classList.remove('is-invalid')
                this.message = '';
            }

        },
        actionRegister(){
            Api.post("api/register",
            {
                'username': this.username,
                'name': this.nama,
                'email': this.email,
                'password': this.password,
                'confirm_password': this.newPassword,
            }
            ).then((res)=> {
                if(res.data.status == 200){
                    Swal.fire({
                        icon:'success',
                        title:'Berhasil',
                        text:res.data.message,
                        timer:4000,
                });
                this.$router.push({path:'/'})

                }else{
                    Swal.fire({
                        icon:'error',
                        title:'Oops...',
                        text:res.data.message,
                        timer:4000,
                });
                }
            }).catch((error)=>{
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    text:'Terjadi kesalahan',
                    timer: 2000
                });

            });
        }
    }

}





</script>
  