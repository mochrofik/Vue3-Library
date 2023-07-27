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
                    <div class="col-sm-12 rounded" v-for="(result, index) in peminjaman.data">
                        <div class="card rounded ">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-3 text-center" >
                                        <img :src="this.apiUrl + '/storage/'+result.book.path" style="height: 180px; width: 130px;"  class="img-thumbnail shadow rounded" >
                                    </div>
                                    <div class="col-sm-7">
                                        <div class="mb-2">
                                            
                                            <span class="badge badge-danger mr-2" v-if="result.status == 2 && hitungSelisihHari(result.tanggal_peminjaman, result.tanggal_pengembalian) < 1">
                                             Terlambat
                                                </span>
                                            <span class="badge badge-secondary" v-if="result.status == 1">
                                            Menunggu Approval    
                                            </span>
                                            <span class="badge badge-danger" v-if="result.status == 2 && hitungSelisihHari(result.tanggal_peminjaman, result.tanggal_pengembalian).toFixed(0) > 0 ">
                                                {{   hitungSelisihHari(result.tanggal_peminjaman, result.tanggal_pengembalian).toFixed(0)}} Hari Lagi
                                                </span>
                                            <span class="badge badge-danger" v-if="result.status == 2 && hitungSelisihHari(result.tanggal_peminjaman, result.tanggal_pengembalian).toFixed(0) < 0 ">
                                                {{   hitungSelisihHari(result.tanggal_peminjaman, result.tanggal_pengembalian).toFixed(0)}} Hari
                                                </span>
                                            <span class="badge badge-info" v-if="result.status == 3">
                                            Sudah dikembalikan   
                                            </span>
                                        </div>
                                        <div class="font-weight-bold">
                                            {{ result.book.judul }}
                                        </div>
                                        <div class="text-muted font-italic"> {{ result.book.pengarang }} </div>
                                        <div class="text-muted font-italic"> {{ result.book.tahun }} </div>
                                        <div class="font-normal mb"> {{ result.book.penerbit }} </div>
                                        <div class="font-normal mb-2"> <i class="bi bi-calendar-date"></i> {{ result.tanggal_peminjaman }} / <small>Tanggal pinjam</small>  </div>
                                        <div class="font-normal mb-2"> <i class="bi bi-alarm"></i> {{ result.tanggal_pengembalian }} / <small v-if="result.status == 3">Tanggal pengembalian</small> <small v-if="result.status != 3">Kembalikan sebelum tanggal tsb.</small> </div>
                                        
                                        <div v-if="result.status == 1 || result.status == 2" class="btn btn-sm btn-outline-primary" @click.prevent="pengembalianBuku(result)" > <i class="fas fa-book"></i> Kembalikan </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="example-one text-center mt-2">
            <vue-awesome-paginate :total-items="peminjaman.total" :items-per-page="peminjaman.per_page" :max-pages-shown="3"
              :on-click="clickCallback" v-model="page" :hide-prev-next-when-ends="true" />
          </div>
        </div>
    </div>

    <div class="modal fade" id="pengembalianModal" tabindex="-1" aria-labelledby="pengembalianModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">

                <h5 class="modal-title" id="pengembalianModalLabel">Apakah Yakin Mengembalikan Buku ini?</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form>
            <div class="modal-body">
                    <div class="text-center">
                        <img class="img-thumbnail shadow rounded " :src="this.apiUrl+'/storage/'+ detail.path" style="height:200px; width:150px" >

                    </div>
                <div class="row mt-2">
                    <div class="col">
                        Judul : {{ detail.judul }}

                    </div>
                </div>
                <div class="form-group">
                    <Label>Tanggal Pengembalian</Label>
                    <input type="text" class="form-control" disabled name="tanggal_pengembalian" id="tgl_sekarang">
                </div>
              
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" >Close</button>
                <button type="button" class="btn btn-primary" @click="actionPengembalian(detail)" >Kembalikan</button>
            </div>
            </form>
        </div>
    </div>
</div>

</template>

<script>
import Api from '../../../api';
import Swal from 'sweetalert2';

import moment from 'moment';


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
            tgl_sekarang: new Date(),
            detail:[]
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
            var tanggal3 = new Date();

            var tglPertama = Date.parse(tanggal1);
            var tglKedua = Date.parse(tanggal2);
            var tglKetiga = Date.parse(tanggal3);

            var selisih 
            if(tglKedua < tglKetiga){
               selisih =  (tglKedua - tglKetiga ) / miliday;
            }else{

             selisih 
                = (tglKedua - tglPertama) /miliday ;
            }

            return selisih;
        },
        pengembalianBuku(data){
            this.detail = data;
            this.detail.id = data.id;
            this.detail.judul = data.book.judul;
            this.detail.path = data.book.path;
            var tes = document.getElementById('tgl_sekarang').value = ""+moment(this.tgl_sekarang).format('YYYY-MM-DD');

            $('#pengembalianModal').modal('show');

        },
        async actionPengembalian(data){
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

                            $('#pengembalianModal').modal('hide');
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
    }
}
</script>