<style>
.pagination-container {
  display: flex;
  column-gap: 10px;
}

.paginate-buttons {
  height: 40px;
  width: 40px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: black;
}

.paginate-buttons:hover {
  background-color: #d8d8d8;
  border-radius: 10px;
}

.active-page {
  background-color: #d1d1d1;
  border: 1px solid #c6c6c6;
  border-radius: 10px;
  color: black;
  font-weight: bold;
}

.active-page:hover {
  background-color: #d6d6d6;
  border-radius: 10px;
  color: #29328f;
}
</style>
<template>
  <div class="container">
    <CardLoadingVue v-if="isLoading"></CardLoadingVue>
    <div class="input-group d-flex mb-4">
      <div class="mr-2 mt-2">
        <select class="form-control" aria-label=".form-select-sm example" @change="filterCategory" v-model="key_category">
          <option selected value="0">Filter Kategori</option>
          <option v-for="category in categories" :value="category.id">
            {{ category.nama_kategori }}
          </option>
        </select>
      </div>

      <div class="form-outline mr-2 mt-2">
        <input type="search" id="form1" class="form-control" @keyup="SearchC($event.target.value)"
          placeholder="Search..." />
      </div>
      <div class="mr-2 mt-2">
        <button class="btn btn-info" @click="resetFilterCategory">Reset</button>
      </div>
      <div class="d-flex mt-2" @click="showAdd()">
        <div class="btn btn-primary mr-2">
          <i class="fas fa-plus"></i>
          Tambah Data</div>
      </div>
      <div class="d-flex mt-2" @click="showImport()">
        <div class="btn btn-warning mr-2"
        >
        <i class="fas fa-upload"></i>
        Import</div>
      </div>
      <div class="d-flex mt-2" @click="exportPdf()">
        <div class="btn btn-success mr-2">
          <i class="fas fa-file"></i>
          Export PDF</div>
      </div>
      <div class="d-flex mt-2" @click="exportExcel()">
        <div class="btn btn-success">
          <i class="fas fa-file"></i>
          Export Excel</div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-8">
        <div class="card" style="height: 500px">
          <table class="table table-hover table-responsive mt-4 p-3">
            <thead>
              <tr>
                <th>No</th>
                <th>Judul</th>
                <th>Pengarang</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="books.length == 0">
                <td class="text-center" colspan="4">Data tidak ditemukan</td>
              </tr>
              <tr v-for="(book, index) in books.data">
                <td>
                  {{ (books.current_page - 1) * books.per_page + (index + 1) }}
                </td>
                <td width="200px">{{ book.judul }}</td>
                <td width="150px">{{ book.pengarang }}</td>
                <td>{{ book.stok }}</td>
                <td width="150px">
                  <div class="btn btn-sm btn-light" @click.prevent="actionShowBook(book)">
                    <i class="bi bi-eye-fill"></i>
                  </div>
                  <div class="btn btn-sm btn-light" @click="showEdit(book)">
                    <i class="bi bi-pencil-square"></i>
                  </div>
                  <div class="btn btn-sm btn-light" @click="deleteBook(book)">
                    <i class="bi bi-trash-fill"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="example-one text-center mt-2">
            <vue-awesome-paginate :total-items="books.total" :items-per-page="books.per_page" :max-pages-shown="3"
              :on-click="clickCallback" v-model="page" :hide-prev-next-when-ends="true" />
          </div>
        </div>
      </div>
      <div class="col-sm-4">
        <div class="card" style="height: 500px">
          <div class="card-body">
            <h5 class="font-weight-bold">Data Buku</h5>
            <div v-if="isLoading" style="height: 400px;"  class="d-flex justify-content-center align-items-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <div v-if="detail && !isLoading">
              <div class="d-flex justify-content-center mt-3">
                <img class="img-thumbnail rounded text-center shadow" style="
                    background-size: contain;
                    height: fit-content;
                    object-fit: contain;
                    height: 250px;
                    width: 200px;
                  " :src="showBook.image" />
              </div>
              <div class="mt-3 text-muted">{{ showBook.pengarang }}</div>
              <div id="judulBuku" class="mt-2 font-weight-bold">
                {{ showBook.judul }}
              </div>
              <div id="judulBuku" class="mt-2 font-weight-italic" v-if="showBook.nama_kategori">
                Kategori {{ showBook.nama_kategori }}
              </div>
              <div id="judulBuku" class="mt-2 font-weight-italic" v-if="showBook.stok != null">
                Stok : {{ showBook.stok }}
              </div>
            </div>
            <div v-if="!detail"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal Tambah Data Menggunakan Components -->
  <AddModal></AddModal>
  <ImportModal></ImportModal>

  <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">

                <h5 class="modal-title" id="editModalLabel">Edit Buku</h5>
                <button type="button" class="close" @click="closeEdit"  aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="editForm">
            <div class="modal-body">
                <div class="form-group">
                    <label for="">Judul</label>
                    <input type="text" required class="form-control" v-model="formEdit.judul"  placeholder="Masukkan judul buku...">
                </div>
                <div class="form-group">
                    <label for="">Pengarang</label>
                    <input type="text" required  class="form-control" v-model="formEdit.pengarang"  placeholder="Masukkan Pengarang buku...">
                </div>
                <div class="form-group">
                    <label for="">Penerbit</label>
                    <input type="text" required class="form-control" v-model="formEdit.penerbit"  placeholder="Masukkan Penerbit buku...">
                </div>
                <div class="form-group">
                    <label for="">Kategori</label>
                    <select class="form-control" name="kategori" required v-model="formEdit.category_id">
                        <option disabled selected value="">-Pilih Kategori-</option>
                        <option v-for="category in categories" :value="category.id">
                        {{ category.nama_kategori }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        File Gambar
                    </label>
                    <input type="file" accept="image/png, image/gif, image/jpeg"  @change="changeImage" required class="form-control" placeholder="">
                    <img class="img-thumbnail rounded mt-2" v-if="item.imageUrl" :src="item.imageUrl" style="width: 200px;">
                </div>
          
                <div class="form-group">
                    <label>Tahun</label>
                    <select class="form-control" required v-model="formEdit.tahun">
                        <option disabled selected value=""> -Pilih Tahun- </option>
                        <option v-for="datas in tahun" :value="datas">
                        {{ datas }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        Stok
                    </label>
                    <input type="number" v-model="formEdit.stok" required class="form-control" placeholder="Stok buku">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeEdit" >Close</button>
                <button type="submit" @click.prevent="actionEdit()" class="btn btn-primary">Simpan</button>
            </div>
            </form>
        </div>
    </div>
</div>
</template>

<script>
import { ref, onMounted, computed } from "vue";

import api from "../../../api/index";

import CardLoadingVue from "../../../components/CardLoading.vue";
import AddModal from "../../../components/book/AddBook.vue";
import EditBookModal from "../../../components/book/EditBook.vue";
import ImportModal from "../../../components/book/Import.vue";
import Swal from "sweetalert2";

const books = ref([]);

const page = 1;

let token = localStorage.getItem("userKey");

const baseUrl = "http:/perpus-api.mamorasoft.com/storage/";

export default {
  data() {
    return {
      books: [],
      page: 1,
      categories: [],
      key_category: 0,
      search: "",
      token: localStorage.getItem("userKey"),
      isLoading: false,
      role: JSON.parse(localStorage.getItem("userData")),
      tahun:[],
      showBook: {
        judul: "",
        pengarang: "",
        penerbit: "",
        tahun: "",
        image: "",
        stok: "",
        nama_kategori: "",
      },
      detail: false,
      formEdit:{
        id:'',
        judul:'',
        pengarang:'',
        penerbit:'',
        tahun:'',
        stok:'',
        category_id:'',
        path: null,
      },
      item:{
        image:null,
        imageUrl:null
      }
    };
  },
  beforeMount() {
    this.fetchBooks();
    this.loadCategory();
  },
  components: {
    CardLoadingVue,
    AddModal,
    ImportModal,
    EditBookModal,
  },

  methods: {
    async fetchBooks() {
      this.isLoading = true;
      let params;
      if (this.key_category == 0)
        params = {
          page: this.page,
          search: this.search,
          per_page: 5,
        };
      else
        params = {
          page: this.page,
          search: this.search,
          per_page: 5,
          filter: this.key_category,
        };
      await api
        .get("/api/book/all", {
          headers: { Authorization: "Bearer " + token },
          params: params,
        })
        .then((response) => {
          if (response.data.status == 200) {
            this.books = response.data.data.books;
          }
        });

      this.isLoading = false;
    },
    async loadCategory() {
      await api
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
    filterCategory() {
      this.fetchBooks();
    },
    resetFilterCategory() {
      this.search = "";
      this.key_category = 0;
      this.fetchBooks();
    },
    clickCallback(pageNum) {
      this.page = pageNum;
      this.fetchBooks();
    },
    SearchC: function (value) {
      if (value == null || value == "") {
        this.search = "";
        this.page = 1;
        this.fetchBooks();
      } else {
        this.search = value;
        this.page = 1;
        this.fetchBooks();
      }
    },
    setLoadingState(){
      this.isLoading = !this.isLoading;
    },  
    async actionShowBook(data)  {

      this.setLoadingState();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.detail = true;
      
      this.showBook.judul = data.judul;
      this.showBook.pengarang = data.pengarang;
      this.showBook.penerbit = data.penerbit;
      this.showBook.tahun = data.tahun;
      this.showBook.stok = data.stok;
      this.showBook.nama_kategori = data.category.nama_kategori;
      this.showBook.image = this.apiUrl + "storage/" + data.path;
      this.setLoadingState();
      
    },
    showAdd() {
      $("#addModal").modal("show");
    },
    closeEdit(){
      $("#editModal").modal("hide");
     document.getElementById('editForm').reset();
    },
    deleteBook(data) {
      Swal.fire({
        title: "Yakin ingin menghapus data ini?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
        customClass: {
          confirmButton: "btn btn-primary",
          denyButton: "btn btn-danger",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          api
            .delete("api/book/" + data.id + "/delete", {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + this.token,
              },
            })
            .then((response) => {
              let result = response.data;
              if (result.status == 200) {
                Swal.fire({
                  icon: "success",
                  title: "Berhasil",
                  text: result.message,
                  showConfirmButton: false,
                  timer: 1500,
                });

                this.fetchBooks();
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: result.message.message,
                  showConfirmButton: false,
                  // timer: 1500,
                  showCloseButton: true,
                });
              }
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error,
                showConfirmButton: false,
                timer: 1500,
              });
            });
        } else if (result.isDenied) {
        }
      });
    },
    exportPdf() {
      this.isLoading = true;

      api
        .get("api/book/export/pdf", {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((res) => {
          window.open(this.apiUrl + res.data.path, "_blank");
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
      this.isLoading = false;
    },
    exportExcel() {
      this.isLoading = true;
      api
        .get("api/book/export/excel", {
          headers: {
            Authorization: "Bearer " + this.token,
          },
        })
        .then((res) => {
          window.open(this.apiUrl + res.data.path, "_blank");
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
      this.isLoading = false;
    },
    showImport(){
      $('#importModal').modal('show');
      var importFile = document.getElementById('file');
      importFile.value = '';
      
    },
    getTahun(){
            const d = new Date();
            let year = d.getFullYear();
            let nilaiBawah = 1980;
            var nilaiAtas = year + 10;
            for (let index = nilaiBawah; index < nilaiAtas; index++) {
             this.tahun.push(index);
            }
        },
    async getCategories(){
            api.get('api/category/all/all',{
                headers:{
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + this.token,
                }
            }).then((res)=> {
                let response = res.data.data.categories;
                this.categories = response;
            });
        },
    showEdit(data){
      $('#editModal').modal('show');
      this.getTahun();
      this.getCategories();
      this.formEdit.id = data.id;
      this.formEdit.judul = data.judul;
      this.formEdit.pengarang = data.pengarang;
      this.formEdit.penerbit = data.penerbit;
      this.formEdit.tahun = data.tahun;
      this.formEdit.stok = data.stok;
      this.formEdit.category_id = data.category_id;
      this.item.imageUrl = this.apiUrl+ 'storage/'+  data.path;
    },
    changeImage(e){
            const file = e.target.files[0];
            this.image = file;
            this.item.imageUrl = URL.createObjectURL(file);
      },
     async actionEdit(){
        api.post('api/book/'+this.formEdit.id+'/update',
        {
          'judul': this.formEdit.judul,
          'pengarang': this.formEdit.pengarang,
          'penerbit': this.formEdit.penerbit,
          'category_id': this.formEdit.category_id,
          'tahun': this.formEdit.tahun,
          'stok': this.formEdit.stok,
          'path': this.image,
        },{
          headers:{
            "Content-Type":'multipart/form-data',
            Authorization:'Bearer '+this.token,
          }
        }
        ).then((res)=>{
          this.closeEdit();
          this.image = null;
          if(res.data.status == 200){
            Swal.fire({
            icon:'success',
            title:'Berhasil',
            message: res.data.message,
            text: res.data.message,
            timer:3000
          });
          this.fetchBooks();
          }else{
            Swal.fire({
            icon:'error',
            title:'Terjadi kesalahan',
            message: res.data.message,
            timer:3000
          });
          }
        }).catch((error)=>{
          Swal.fire({
            icon:'error',
            title:'Terjadi kesalahan',
            message: error.response.data.message,
            timer:3000
          });
        })
      }

    
  },
};
</script>
