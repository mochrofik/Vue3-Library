<template>
    <div class="container">
        <CardLoadingVue v-if="isLoading"></CardLoadingVue>
        <div class="card">
            <div class="card-body">
                <div class="d-flex content-start align-center">
                    <div>
                        <h2>Kategori Buku</h2>
                    </div>
                    <div class="">
                        <div class="btn btn-sm btn-info ml-3" @click.prevent="addCategories()">
                            <i class="fas fa-plus"></i> Tambah Data
                        </div>

                    </div>

                </div>

                <div class="form-group">
                    <input @keyup="Search($event.target.value)" type="search" class="form-control"
                        placeholder="Pencarian" />
                </div>

                <table class="table table-responsive table-hover">
                    <thead class="thead-light">
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Aksi</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-if="bookCategories == null || (bookCategories.data != null && bookCategories.data.length == 0)">
                            <td colspan="3"> Data tidak ditemukan</td>
                        </tr>
                        <tr v-for="(category, index) in bookCategories.data ">
                            <td>{{ (bookCategories.current_page - 1) * bookCategories.per_page + (index + 1) }}</td>
                            <td>{{ category.nama_kategori }}</td>
                            <td>
                                <div class="btn btn-sm btn-light" @click.prevent="editCategories(category)">
                                    <i class="bi bi-pencil-square"></i>

                                </div>
                                <div class="btn btn-sm btn-light ml-2" @click="showConfirmDelete(category)" >
                                    <i class="bi bi-trash-fill "></i>
                                </div>

                            </td>
                        </tr>
                    </tbody>

                </table>
                <div class="example-one text-center">
                    <vue-awesome-paginate :total-items="bookCategories.total" :items-per-page="bookCategories.per_page"
                        :max-pages-shown="3" :on-click="clickCallback" v-model="page" :hide-prev-next-when-ends="true" />
                </div>
            </div>
        </div>
    </div>



    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 v-if="editing" class="modal-title" id="exampleModalLabel">Edit Kategori Buku</h5>
                    <h5 v-if="!editing" class="modal-title" id="exampleModalLabel">Tambah Kategori Buku</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <!-- <form> -->
                <div class="modal-body">
                    <div class="form-group">
                        <label for="">Nama Kategori</label>
                        <input type="text" :required="form.nama_kategori" class="form-control" v-model="form.nama_kategori" placeholder="Nama Kategori">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button v-if="editing" type="button" @click="actionEdit" class="btn btn-primary">Simpan</button>
                    <button v-if="!editing" type="button" @click="actionAdd" class="btn btn-primary">Simpan</button>
                </div>
                <!-- </form> -->
            </div>
        </div>
    </div>
</template>

<script>

import { ref } from "vue";

import axios from 'axios'

import CardLoadingVue from "../../../components/CardLoading.vue";

import Swal from 'sweetalert2'

export default {
    data() {
        return {
            isLoading: false,
            bookCategories: [],
            token: localStorage.getItem("userKey"),
            search: "",
            page: 1,
            editing: false,
            form: {
                id: '',
                nama_kategori: ''
            }
        }
    },
    components: {
        CardLoadingVue
    },
    beforeMount() {
        this.fetchCategories();
    },
    methods: {
        async fetchCategories() {
            this.isLoading = true;
            axios.get(this.apiUrl + "api/category/all", {
                'headers': {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': "Bearer " + this.token
                },
                'params': {
                    'page': this.page,
                    'search': this.search,
                },
            }).then((response) => {
                let result = response.data;
                if (result.status == 200) {
                    this.bookCategories = result.data.categories;
                } else {

                }

            }).catch((error) => {

            });
            this.isLoading = false;
        },
        clickCallback(pageNum) {
            this.page = pageNum
            this.fetchCategories()
        },

        Search: function (value) {
            if (value == null || value == "") {
                this.search = "";
                this.page = 1;
                this.fetchCategories();
            } else {
                this.search = value;
                this.page = 1;
                this.fetchCategories();
            }
        },
        editCategories(data) {
            this.form.id = data.id;
            this.form.nama_kategori = data.nama_kategori;
            this.editing = true;
            $('#exampleModal').modal({ show: true });
        },
        addCategories() {
            this.form.id = '';
            this.form.nama_kategori = '';
            this.editing = false;
            $('#exampleModal').modal({ show: true });
        },
        async actionAdd() {
            this.isLoading = true;
            if (this.form.nama_kategori != '') {
                axios.post(this.apiUrl + "api/category/create",
                    {
                        "nama_kategori": this.form.nama_kategori
                    },
                    {
                        'headers': {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + this.token
                        }
                    }
                ).then((response) => {
                    let result = response.data;
                    if (result.status == 201) {
                        $('#exampleModal').modal('hide');
                        Swal.fire({
                            icon: "success",
                            title: "Berhasil",
                            text: "Data berhasil ditambahkan",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        this.fetchCategories();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: result.message.name,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }

                }).catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Lengkapi data",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
            this.isLoading = false;
        },
        async actionEdit(data){
            this.isLoading = true;

            if (this.form.nama_kategori != '') {
                axios.post(this.apiUrl + "api/category/update/"+this.form.id,
                    {
                        "nama_kategori": this.form.nama_kategori
                    },
                    {
                        'headers': {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + this.token
                        }
                    }
                ).then((response) => {
                    let result = response.data;
                    if (result.status == 200) {
                        $('#exampleModal').modal('hide');
                        Swal.fire({
                            icon: "success",
                            title: "Berhasil",
                            text: result.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        this.fetchCategories();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: result.message.name,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }

                }).catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Lengkapi data",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
            this.isLoading = false;
        },
        showConfirmDelete(data) {
            Swal.fire({
                title: 'Yakin ingin menghapus data ini?',
                showDenyButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                customClass:{
                    confirmButton: 'btn btn-primary',
                    denyButton: 'btn btn-danger'
                },
              
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(this.apiUrl + "api/category/"+data.id+"/delete",
                    {
                        'headers': {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + this.token
                        }
                    }
                ).then((response) => {
                    let result = response.data;
                    if (result.status == 200) {
                        Swal.fire({
                            icon: "success",
                            title: "Berhasil",
                            text: result.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });

                        this.fetchCategories()
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: result.message.name,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }

                }).catch((error) => {
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
            })

        }
    },

}

</script>