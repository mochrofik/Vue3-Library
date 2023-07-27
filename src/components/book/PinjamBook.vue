<template>
  <div
    class="modal fade"
    id="pinjamModal"
    tabindex="-1"
    aria-labelledby="pinjamModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="pinjamModalLabel">
            Yakin Pinjam Buku ini?
          </h5>
          <button
            type="button"
            class="close"
            @click="closeModal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form @submit.prevent="simpan()" id="formPinjam">
          <div class="modal-body">
            <div class="text-center">
              <img
                class="img-tumbhnail rounded"
                :src="this.apiUrl + 'storage/' + isiBuku.path"
                style="height: 190px; width: 140px"
              />
            </div>
            <div class="row mt-2">
              <div class="col">Judul : {{ isiBuku.judul }}</div>
            </div>
            <div class="row">
              <div class="col">Pengarang : {{ isiBuku.pengarang }}</div>
            </div>
            <div class="row">
              <div class="col">Penerbit : {{ isiBuku.penerbit }}</div>
            </div>
            <div class="row">
              <div class="col">Tahun : {{ isiBuku.tahun }}</div>
            </div>
            <div class="row">
              <div class="col">Kategori : {{ isiKategori }}</div>
            </div>

            <div class="form-group">
              <label>Tanggal Peminjaman</label>
              <input
                type="date"
                class="form-control"
                name="tanggal_peminjaman"
                required
                v-model="tanggal_peminjaman"
              />
            </div>
            <div class="form-group">
              <label>Tanggal Pengembalian</label>
              <input
                type="date"
                class="form-control"
                name="tanggal_pengembalian"
                required
                v-model="tanggal_pengembalian"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Close
            </button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "../../api";

import Swal from "sweetalert2";
import moment from "moment";

export default {
  data() {
    return {
      token: localStorage.getItem("userKey"),
      role: JSON.parse(localStorage.getItem("userData")),
      tanggal_peminjaman: "",
      tanggal_pengembalian: "",
    };
  },
  props: ["idJudul", "isiBuku", "isiKategori"],
  methods: {
    simpan() {
      const tgl2 = new Date();
      var tglPinjam = moment(this.tanggal_peminjaman).format("YYYY-MM-DD");
      var tglPengembalian = moment(this.tanggal_pengembalian).format(
        "YYYY-MM-DD"
      );
      var tglNow = moment(tgl2).format("YYYY-MM-DD");

      if (tglPinjam < tglNow) {
        Swal.fire({
          icon: "error",
          text: "Tanggal Pinjam Kurang dari Tanggal saat ini",
        });
      } else if (tglPinjam === tglPengembalian) {
        Swal.fire({
          icon: "error",
          text: "Tanggal Pengembalian Minimal Lebih dari Tanggal Sekarang",
        });
      } else if (tglPengembalian < tglNow) {
        Swal.fire({
          icon: "error",
          text: "Tanggal Pengembalian kurang dari Tanggal Sekarang",
        });
        
    }else if(tglPinjam > tglPengembalian){
        Swal.fire({
          icon: "error",
          text: "Tanggal Pinjam lebih dari Tanggal Pengembalian",
        });
      }else{
            Api.post('api/peminjaman/book/'+this.isiBuku.id+'/member/'+this.role.id,
            {
              "tanggal_peminjaman": tglPinjam,
              "tanggal_pengembalian": tglPengembalian,
              "bypass": 1
    
            },{
              headers:{
                "Content-Type" : 'multipart/form-data',
                Authorization: 'Bearer ' + this.token,
              }
            }
            ).then((res)=> {
              if(res.data.status == 201){
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil',
                  text: res.data.message,
                });
    
                this.tanggal_peminjaman = '';
                this.tanggal_pengembalian = '';
    
                $('#pinjamModal').modal('hide');
    
              }else{
                Swal.fire({
                  icon:'error',
                  title: 'Oops...',
                  text: res.data.message,
                })
              }
            })

      }
    },
    closeModal() {
      this.tanggal_peminjaman = "";
      this.tanggal_pengembalian = "";

      $("#pinjamModal").modal("hide");
    },
  },
};
</script>
