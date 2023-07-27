<script>

import Navbar from '../layout/Navbar.vue'
import Sidebar from '../layout/Sidebar.vue'
export default{
  components:{
    Navbar,
    Sidebar
  }
}

</script>

<template>

<div class="wrapper">


  <!-- /.navbar -->
  <navbar/>
  
  <!-- Main Sidebar Container -->
  <sidebar/>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-left">
              
              <li class="breadcrumb-item active">Perpustakaan </li>
              <li class="breadcrumb-item"><a href="#">{{ $route.name }} </a></li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->
    
    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <RouterView></RouterView>
      </div>
    
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
  <footer class="main-footer">
    <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong>
    All rights reserved.
    <div class="float-right d-none d-sm-inline-block">
      <b>Version</b> 3.2.0
    </div>
  </footer>

  
</div>



</template>