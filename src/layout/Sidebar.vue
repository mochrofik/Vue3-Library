<template>
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="/dashboard" class="brand-link">
      <img
        src="public/assets/img/AdminLTELogo.png"
        alt="AdminLTE Logo"
        class="brand-image img-circle elevation-3"
        style="opacity: 0.8"
      />
      <span class="brand-text font-weight-light">Perpustakaan</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img
            src="public/assets/img/user2-160x160.jpg"
            class="img-circle elevation-2"
            alt="User Image"
          />
        </div>
        <div class="info">
          <a href="#" class="d-block">{{ name.name }}</a>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul
          class="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
          data-accordion="false"
        >
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active">
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>
                Dashboard
              </p>
            </router-link>
          </li>
          <li class="nav-item" v-if="role == 'admin'">
            <router-link class="nav-link" to="/books" active-class="active">
              <i class="nav-icon fas fa-book"></i>
              <p>Buku</p>
            </router-link>
          </li>
          <li class="nav-item" v-if="role == 'member'">
            <router-link class="nav-link" to="/peminjaman" active-class="active">
              <i class="nav-icon fas fa-folder-open"></i>
              <p>Peminjaman</p>
            </router-link>
          </li>
          <li class="nav-item" v-if="role == 'admin'">
            <router-link class="nav-link" to="/peminjamanadmin" active-class="active">
              <i class="nav-icon fas fa-folder-open"></i>
              <p>Peminjaman</p>
            </router-link>
          </li>
          <li class="nav-item" v-if="role == 'admin'">
            <router-link
              to="/book-category"
              class="nav-link"
              active-class="active"
            >
              <i class="nav-icon fa fa-archive"></i>
              <p>Kategori Buku</p>
            </router-link>
          </li>
        <li class="nav-item" v-if="role == 'admin'">
            <router-link
              to="/member"
              active-class="active"
              class="nav-link"
            >
            <i class="nav-icon fa fa-users"></i>
              <p>Member</p>
            </router-link>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
export default {
  data(){
    return{
      userData: JSON.parse(localStorage.getItem('userData')),
      name: JSON.parse(localStorage.getItem('userData')),
      role: '' 
    }
  },
  beforeMount(){
    this.role = this.userData.roles[0].name;

  }
};
</script>
