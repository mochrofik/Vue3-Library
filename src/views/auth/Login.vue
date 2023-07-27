<template>
  <body class="hold-transition login-page">
    <div class="login-box">
      <div class="login-logo">
        <a href="../../index2.html"><b>Perpustakaan</b></a>
      </div>
      <div class="container">
        <div class="card">
          <div class="card-body login-card-body">
            <p class="login-box-msg">Selamat Datang</p>


            <form @submit.prevent="actionLogin()">
              <div class="input-group mb-3">
                <input type="username" v-model="username" required name="username" class="form-control" placeholder="Username" />
                <div class="input-group-append">
                  <div class="input-group-text">
                    <span class="fas fa-envelope"></span>
                  </div>
                </div>
              </div>
              <div class="input-group mb-3">
                <input id="password" type="password" v-model="password" required class="form-control" name="password"
                  placeholder="Password" />
                <div class="input-group-append" @click="showPassword()">
                  <div class="input-group-text">
                    <span v-if="showPass" class=" fas fa-unlock" id="iconPassword"></span>
                    <span v-if="!showPass" class=" fas fa-lock" id="iconPassword"></span>
                  </div>
                </div>
              </div>
              <div class="row">
                <!-- /.col -->
                <div class="col-4">
                  <button type="submit"  class="btn btn-primary btn-block">
                    Masuk
                  </button>
                </div>
                <div class="col">
                  Belum memiliki akun?  <router-link to="/register" class="link" > Daftar disini</router-link> 
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
      showPass: false,
      errors: []
    }
  },
  methods: {
    actionLogin() {

      Api.post("api/login",
        {
          'username': this.username,
          'password': this.password,
        })
        .then((response) => {

            if (response.data.status == 200) {
              localStorage.setItem('userKey', response.data.data.token);
              localStorage.setItem('userData', JSON.stringify(response.data.data.user));

              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message,
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.$router.push({ path: '/dashboard' })
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.data.message,
                showConfirmButton: false,
                timer: 1500
              })

            }
        })
        .catch((error) => {

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Ada kesalahan saat input data",
            showConfirmButton: false,
            timer: 1500
          })
        });
    },

    showPassword() {
      const passwordField = document.querySelector('#password')

      if (passwordField.getAttribute('type') === 'password') {
        passwordField.setAttribute('type', 'text')
        this.showPass = true;
      } else {
        this.showPass = false;
        passwordField.setAttribute('type', 'password')
      }
    }
  }

}





</script>
