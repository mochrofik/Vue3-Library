<template>
    <div class="container">
        <div class="">
            <div class="">
                <h4>Peminjaman Buku</h4>

                <div class="row">
                <div class="col-sm-12" v-for="(result, index) in peminjaman.data" >
                    <div class="card"  v-if="index < 0">
                        <div class="card-body">
                            Data tidak ditemukan
                        </div>
                    </div>
                </div>    

                <table class="table table-responsive table-hover">
                    <thead class="thead-light">
                        <tr>
                            <th>No</th>
                            <th>Nama Member</th>
                            <th>Buku</th>
                            <th>Tanggal Peminjaman</th>
                            <th>Tanggal Pengembalian</th>
                            <th>Status</th>
                        </tr>

                    </thead>
                    <tbody>
                        <tr v-for="(result, index) in peminjaman.data">
                            <td>{{ (peminjaman.current_page - 1) * peminjaman.per_page + (index + 1) }}</td>
                            <td>
                                {{ result.member.name }}
                            </td>
                            <td>
                                {{ result.book.judul }}
                            </td>
                            <td>{{ result.tanggal_peminjaman }}</td>
                            <td>{{ result.tanggal_pengembalian }}</td>
                            <td>
                                <span class="badge badge-danger" v-if=" result.status == 2">
                                               Sedang dipinjam
                                                </span>
                                <span class="badge badge-secondary" v-if=" result.status == 1">
                                               Menunggu Approval
                                                </span>
                                            <span class="badge badge-info" v-if="result.status == 3">
                                            Sudah dikembalikan   
                                            </span>
                              
                            </td>
                        </tr>
                    </tbody>
                </table>
                    <!-- <div class="col-sm-12 rounded" v-for="(result, index) in peminjaman.data">
                        <div class="card rounded ">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-3 text-center" >
                                        <img :src="this.apiUrl + '/storage/'+result.book.path" style="height: 180px; width: 130px;"  class="img-thumbnail shadow rounded" >
                                    </div>
                                    <div class="col-sm-7">
                                        <div class="mb-2">
                                            <span class="badge badge-danger" v-if="result.status == 1 || result.status == 2">
                                                {{hitungSelisihHari(result.tanggal_peminjaman, result.tanggal_pengembalian)}} Hari Lagi
                                                </span>
                                            <span class="badge badge-info" v-if="result.status == 3">
                                            Sudah dikembalikan   
                                            </span>
                                        </div>
                                        <div class="font-weight-bold mb-2">
                                            {{ result.book.judul }}
                                        </div>
                                        <div class="text-muted font-italic"> {{ result.book.pengarang }} </div>
                                        <div class="text-muted font-italic mb"> {{ result.book.tahun }} </div>
                                        <div class="font-normal mb-2"> {{ result.book.penerbit }} </div>
                                        <div v-if="result.status == 1" class="btn btn-sm btn-outline-primary" @click.prevent="pengembalianBuku(result)" > <i class="fas fa-book"></i> Kembalikan </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="example-one text-center mt-2">
            <vue-awesome-paginate :total-items="peminjaman.total" :items-per-page="peminjaman.per_page" :max-pages-shown="3"
              :on-click="clickCallback" v-model="page" :hide-prev-next-when-ends="true" />
          </div>
        </div>
    </div>
</template>

<script>
import Api from '../../../api';
import Swal from 'sweetalert2';


export default{
    data(){
        return {
            userData: JSON.parse(localStorage.getItem('userData')),
            role:'',
            token: localStorage.getItem("userKey"),
            peminjaman: [
                {
                    sisa_hari:''
                }
            ],
            page:1,
            perpage: 5,
        }
    },
    beforeMount(){
        this.getPeminjaman();
    },
    methods:{
        getPeminjaman(){
            Api.get('api/peminjaman', {
                headers: {
                    Authorization: 'Bearer ' + this.token
                },
                params:{
                    page:this.page,
                    per_page:this.perpage
                }
            }).then((res)=> {
                if(res.data.status == 200){

                    this.peminjaman = res.data.data.peminjaman;

                }else{
                    Swal.fire({
                        icon:'error',
                        title:'Oops...',
                        text: res.data.nessage,
                        timer: 3000,
                    });
                }
    
            }).catch((err)=> {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.message,
                    timer: 3000,
                });
            })
        },
        clickCallback(num){
            this.page = num;
            this.getPeminjaman();
        },
        hitungSelisihHari(tgl1, tgl2){
            var miliday = 24*60*60*1000;

            var tanggal1 = new Date(tgl1);
            var tanggal2 = new Date(tgl2);

            var tglPertama = Date.parse(tanggal1);
            var tglKedua = Date.parse(tanggal2);

            var selisih = (tglKedua - tglPertama) /miliday ;

            return selisih;
        },
        pengembalianBuku(data){
            Swal.fire({
                title: 'Yakin ingin mengembalikan buku ini ?',
                text: data.book.judul,
                confirmButtonText: 'Ya',
                denyButtonText: "Tidak",
                showDenyButton: true,
            }).then((result) => {
                if(result.isConfirmed){
                    Api.post('api/peminjaman/book/'+data.id+'/return',
                    {
                        
                    },
                    {
                        headers:{
                            Authorization:'Bearer ' + this.token,
                        }
                    }
                    ).then((res) => {

                        if(res.data.status == 200){
                            Swal.fire({
                                icon:'success',
                                title:'Berhasil',
                                text: res.data.message
                            })

                            this.getPeminjaman()
                        }else{
                            Swal.fire({
                                icon:'error',
                                title:'Oops...',
                                text: res.data.message
                            })
                        }
                    }).catch((err)=>{
                        Swal.fire({
                            icon:'error',
                            title:'Oops...',
                            text:err.response.message
                        })
                    })
                }
            })
        }
    }
}
</script>