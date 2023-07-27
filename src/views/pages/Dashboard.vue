<style>
div.scrollmenu {
  /* background-color: #333; */
  overflow: auto;
  white-space: nowrap;
}

div.scrollmenu::-webkit-scrollbar{
  display: none;
}

div.scrollmenu a {
  display: inline-block;
  color: black;
  text-align: center;
  padding: 0px;
  text-decoration: none;
}

div.scrollmenu #card:hover {
  background-color: #e7e7e7;
}

#judul {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:2;
  /* text-overflow: ellipsis; */
  white-space: pre-wrap;
}
#pengarang-header{
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:1;
  /* text-overflow: ellipsis; */
  white-space: pre-wrap;
}

#pengarang {
  margin-top: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

#judulBuku {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
#pinjam i :hover{
  background-color: antiquewhite;
  color: #9e1e1e;
}

.container-filter {
  margin-top: 10px;
  /* overflow: hidden; */
  overflow: auto;
  white-space: nowrap;
}
.container-filter::-webkit-scrollbar{
display: none;
}

.btn-filter {
  border: none;
  outline: none;
  padding: 12px 16px;
  /* background-color: white; */
  cursor: pointer;
  margin-right: 5px;
  margin-top: 5px;
  color: #0097e6;
  border-color: #0097e6;
  border: 1px #0097e6 solid;
}

.btn-filter:hover {
  background-color: #0097e6;
  color: white;
}

.btn-filter.active {
  background-color: #0097e6;
  color: white;
}
</style>
<template>

<div class="jumbotron shadow" v-if="role.roles[0].name == 'member'" style="background-color: white;">
  <h1 class="display-4 font-weight-bold">Hello, {{ role.name }}!</h1>
  <p class="lead font-weight-bold">Membacalah, karena dengan membaca akan membuka jendela dunia!</p>
  <p class="font-italic">
    Cuma perlu satu buku untuk jatuh cinta pada membaca. Cari buku itu. Mari jatuh cinta -Najwa Shihab-
  </p>
</div>

  <h4 class="mb-2 font-weight-bold" v-if="role.roles[0].name == 'member'"> Daftar Buku</h4>
  <div class="scrollmenu" v-if="role.roles[0].name == 'member'">
    <a href="#" @click="showModalDetail(book)" class="mr-2 card " style="width: 170px; height: 280px;" v-for="(book, index) in books.data">
      <img :src="this.apiUrl + 'storage/' + book.path" style="width: 170px; height: 200px;" class="rounded">
      <div class="d-flex justify-content-left text-left mt-1">
        <div class="ml-2 small text-muted" id="pengarang-header">{{ book.pengarang }}</div>
      </div>
      <div class="d-flex justify-content-left ml-2 text-left">
        <p class="font-weight-normal" id="judul">
          {{ book.judul }}
        </p>
      </div>
    </a>

  </div>
  <h4 class="mt-3 font-weight-bold" v-if="role.roles[0].name == 'member'" > Daftar Semua Buku</h4>
  <div class="row mb" v-if="role.roles[0].name == 'member'">
      <div class="col-sm-11">
        <div class="form-group mr-2">
          <input type="search" v-model="search" id="form1" class="form-control" @keyup="SearchC($event.target.value)"
            placeholder="Pencarian buku..." />
          </div>
      </div>
      <div class="col-sm-1  ">
        <div class="mr-2 ">
          <button class="btn btn-info" @click="resetFilterCategory">Reset</button>
        </div>
      </div>
    </div>  
    <div v-if="role.roles[0].name == 'member'"  id="btnContainer" class="container-filter mb-4">
      <button class="btn btn-sm btn-filter" @click="filterCategoryHorizontal($event, 0)" >
      Show All
      </button>
      <button class="btn btn-sm btn-filter" @click="filterCategoryHorizontal($event, result.id)" v-for="(result, index) in categories">
        {{result.nama_kategori}}
      </button>
    </div>
  <div class="row" style="margin: auto;" v-if="role.roles[0].name == 'member'">
    <div class="col-sm-12" v-if="listBooks.total < 1">
      <div class="card" >
        <div class="card-body">
          Data tidak ditemukan
        </div>
      </div>
    </div>
      <div class="col-3" v-for="(book, index) in listBooks.data">
        <div class="card">
          <div class="card-body" >
            <div class="text-center">
              <img  @click="showModalDetail(book)"   :src="this.apiUrl + 'storage/' + book.path" style="width: 150px; height: 200px; cursor: pointer;" class="img-fluid rounded text-center">
            </div>
            <div class="text-muted font-italic" id="pengarang">
              {{ book.pengarang }}
            </div>
            <div class="font-weight-bold" id="judulBuku">
              {{ book.judul }}
            </div>
            <div class="font-weight-normal" id="judulBuku">
              {{ book.category.nama_kategori }}
            </div>
            
            <div class="btn btn-sm btn-outline-primary"  id="pinjam"  @click="pinjamBuku(book)">
              <i class="fas fa-book"></i> Pinjam Buku
            </div>
          </div>
  
        </div>
      </div>
  
    </div>

    <div class="example-one text-center mt-2" v-if="role.roles[0].name == 'member'" >
            <vue-awesome-paginate :total-items="listBooks.total" :items-per-page="listBooks.per_page" :max-pages-shown="3"
              :on-click="clickCallback" v-model="page" :hide-prev-next-when-ends="true" />
          </div>


  <div class="row mt-3" v-if="role.roles[0].name == 'admin'">
    <div class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-info">
        <div class="inner">
          <h3>{{dashboard.totalBuku}}</h3>

          <p>Total Buku</p>
        </div>
        <div class="icon">
          <i class="ion ion-bag"></i>
        </div>

        <router-link to="/books" class="small-box-footer" >
          More info
          <i class="fas fa-arrow-circle-right"></i>
        </router-link>
      </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-success">
        <div class="inner">
          <h3>{{dashboard.totalDipinjam}}</h3>

          <p>Total dipinjam</p>
        </div>
        <div class="icon">
          <i class="ion ion-stats-bars"></i>
        </div>

        <router-link to="/peminjamanadmin" class="small-box-footer">
          <i class="fas fa-arrow-circle-right"></i> More info
        </router-link>
      </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-warning">
        <div class="inner">
          <h3>{{dashboard.totalMember}}</h3>

          <p>Total Member</p>
        </div>
        <div class="icon">
          <i class="ion ion-person-add"></i>
        </div>
        <router-link to="/member" class="small-box-footer" >
          More info
          <i class="fas fa-arrow-circle-right"></i>
        </router-link>
      </div>
    </div>
    <!-- ./col -->
    <div class="col-lg-3 col-6">
      <!-- small box -->
      <div class="small-box bg-danger">
        <div class="inner">
          <h3>{{dashboard.totalStok}}</h3>

          <p>Total Stok</p>
        </div>
        <div class="icon">
          <i class="ion ion-pie-graph"></i>
        </div>

        <router-link to="/books" class="small-box-footer" >
          More info
          <i class="fas fa-arrow-circle-right"></i>
        </router-link>
      </div>
    </div>
    <!-- ./col -->
  </div>


    <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">

                <h5 class="modal-title" id="detailModalLabel">Detail Data Buku</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form>
            <div class="modal-body pl-5 pr-5">
                    <div class="text-center mb-2">
                      <img class="img-tumbhnail rounded" :src="this.apiUrl+'storage/'+ bookDetail.path" style="width: 150px; height: 200px;">

                    </div>
                <div class="row mb-2 mt-5">
                   Judul :  {{bookDetail.judul}}
                </div>
                <div class="row mb-2">
                    Pengarang : {{ bookDetail.pengarang }}
                </div>
                <div class="row mb-2">
                   Penerbit : {{ bookDetail.penerbit }}
                </div>
                <div class="row mb-2">
                   Tahun : {{ bookDetail.tahun }}
                </div>
                <div class="row">
                   Kategori : {{ bookDetail.kategori }}
                </div>
              
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
            </form>
        </div>
    </div>
</div>

<PinjamModal :id-judul="pinjam.id" :isi-buku="pinjam" :isi-kategori="kategori"></PinjamModal>
</template>

<script>

import Api from "../../api";
import CardLoadingVue from "../../components/CardLoading.vue";

import { onBeforeMount } from 'vue';

import Swal from 'sweetalert2';

import DetailModal from '../../components/book/DetailBook.vue'
import PinjamModal from '../../components/book/PinjamBook.vue'

export default {

  data() {
    return {
      token: localStorage.getItem('userKey'),
      books: [],
      listBooks: [],
      role: JSON.parse(localStorage.getItem("userData")),
      page: 1,
      perpage : 10,
      bookDetail:[],
      pinjam:[],
      kategori: '',
      search:'',
      key_category: '',
      categories:[],
      dashboard:[]
    }
  },
  components:{
    DetailModal,
    PinjamModal
  },
  methods: {
    async getBook() {
      let params;

      params = {
        page: this.page,
        per_page: 6,
      };
      await Api
        .get("/api/book/all", {
          headers: { Authorization: "Bearer " + this.token },
          params: params,
        })
        .then((response) => {
          if (response.data.status == 200) {
            this.books = response.data.data.books;
          }
        });

    },
    async getListBook() {
      let params;
      if (this.key_category == 0)
        params = {
          page: this.page,
          search: this.search,
          per_page: 12,
        };
      else
        params = {
          page: this.page,
          search: this.search,
          per_page: 12,
          filter: this.key_category,
        };
      await Api
        .get("/api/book/all", {
          headers: { Authorization: "Bearer " + this.token },
          params: params,
        })
        .then((response) => {
          if (response.data.status == 200) {
            this.listBooks = response.data.data.books;
          }
        });

    },
    clickCallback(num){
      this.page = num;
      this.getListBook();
    },
    resetFilterCategory() {

      document.querySelectorAll('.btn-filter').forEach((val, key) => {
        val.classList.remove("active");
      })

      this.search = "";
      this.key_category = 0;
      this.getListBook();
    },
    filterCategory() {
      this.getListBook();
    },
    filterCategoryHorizontal(e, id) {

      document.querySelectorAll('.btn-filter').forEach((val, key) => {
        val.classList.remove("active");
      })

      let btn = e.target;
      btn.classList.add("active");

      var btnContainer = document.getElementById('btnContainer'); 
      var btns = btnContainer.getElementsByClassName('btn-filter');
      
      
      this.key_category = id;

      this.getListBook();
    },
    pinjamBuku(data){
      document.getElementById("formPinjam").reset();
      this.pinjam = null;
      this.pinjam = data;
      this.kategori = data.category.nama_kategori;
      $('#pinjamModal').modal('show');
    },
    showModalDetail(data){
      $("#detailModal").modal("show");
      this.bookDetail = data;
      this.bookDetail.kategori = data.category.nama_kategori;
    },
    async loadCategory() {
      await Api
        .get("api/category/all/all", {
          headers: { Authorization: "Bearer " + this.token },
        })
        .then((res) => {

          this.categories = res.data.data.categories;
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "terjadi kesalahaan saat load data buku",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
    getDashboard(){
      Api.get('api/book/dashboard',
      {
        headers:{
          Authorization: 'Bearer ' + this.token,
        }
      }
      ).then((res) => {

        this.dashboard = res.data.data.dashboard;
      })
    },
    SearchC: function (value) {
      if (value == null || value == "") {
        this.search = "";
        this.page = 1;
        this.getListBook();
      } else {
        this.search = value;
        this.page = 1;
        this.getListBook();
      }
    },
  },
  beforeMount() {
    this.getDashboard();
    this.getBook();
    this.getListBook();
    this.loadCategory();
  },
}
</script>