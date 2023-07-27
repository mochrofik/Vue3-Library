<template>
        <!-- Modal -->
        <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="addModalLabel">Tambah Buku</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form @submit.prevent="simpanData()">
                <div class="modal-body modal-add" >
                    <div class="form-group">
                        <label for="">Judul</label>
                        <input type="text" required class="form-control" v-model="formData.judul"  placeholder="Masukkan judul buku...">
                    </div>
                    <div class="form-group">
                        <label for="">Pengarang</label>
                        <input type="text" required  class="form-control" v-model="formData.pengarang"  placeholder="Masukkan Pengarang buku...">
                    </div>
                    <div class="form-group">
                        <label for="">Penerbit</label>
                        <input type="text" required class="form-control" v-model="formData.penerbit"  placeholder="Masukkan Penerbit buku...">
                    </div>
                    <div class="form-group">
                        <label for="">Kategori</label>
                        <select class="form-control" name="kategori" required v-model="formData.category_id">
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
                        <select class="form-control" required v-model="formData.tahun">
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
                        <input type="number" v-model="formData.stok" required class="form-control" placeholder="Stok buku">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit"  class="btn btn-primary">Simpan</button>
                </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '../../api';

import Swal from 'sweetalert2';
export default{
    data(){
        return {
            categories:[],
            token:localStorage.getItem("userKey"),
            tahun:[],
            formData:{
                judul:'',
                pengarang:'',
                penerbit:'',
                category_id:'',
                stok:'',
                tahun:'',
            },
            item: {
                image: null,
                imageUrl: null
            }

        }
    },
    beforeMount(){

        this.item.image = null;
        this.getTahun();
        this.getCategories();
    },
    methods:{
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
            Api.get('api/category/all/all',{
                headers:{
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + this.token,
                }
            }).then((res)=> {
                let response = res.data.data.categories;
                this.categories = response;
            });
        },
        changeImage(e){
            const file = e.target.files[0];
            this.image = file;
            this.item.imageUrl = URL.createObjectURL(file);
        },
        async simpanData() {
            Api.post(
               "api/book/create",
                {
                    judul: this.formData.judul,
                    pengarang: this.formData.pengarang,
                    penerbit: this.formData.penerbit,
                    tahun: this.formData.tahun,
                    stok: this.formData.stok,
                    category_id: this.formData.category_id,
                    path: this.image,
                },
                {
                    'headers': {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + this.token
                    }
                }
            ).then(res => {
                $('#addModal').modal('hide');
                $(".modal-add").html("");
                if (res.data.status == 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        this.$router.push({ path: '/books' })
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }).catch((err) => {
                Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
            })
        },
      
    }
    
}

</script>