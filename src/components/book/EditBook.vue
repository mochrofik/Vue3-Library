<template>
    <!-- Modal -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">

                <h5 class="modal-title" id="editModalLabel">Edit Buku</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form>
            <div class="modal-body">
                <div class="form-group">
                    <label for="">Judul</label>
                    <input type="text" required class="form-control" v-model="form.judul"  placeholder="Masukkan judul buku...">
                </div>
                <div class="form-group">
                    <label for="">Pengarang</label>
                    <input type="text" required  class="form-control" v-model="form.pengarang"  placeholder="Masukkan Pengarang buku...">
                </div>
                <div class="form-group">
                    <label for="">Penerbit</label>
                    <input type="text" required class="form-control" v-model="form.penerbit"  placeholder="Masukkan Penerbit buku...">
                </div>
                <div class="form-group">
                    <label for="">Kategori</label>
                    <select class="form-control" name="kategori" required v-model="form.category_id">
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
                    <img v-if="item.imageUrl" :src="item.imageUrl" style="width: 50px;">
                </div>
          
                <div class="form-group">
                    <label>Tahun</label>
                    <select class="form-control" required v-model="form.tahun">
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
                    <input type="number" v-model="form.stok" required class="form-control" placeholder="Stok buku">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" @click.prevent="simpanData()" class="btn btn-primary">Simpan</button>
            </div>
            </form>
        </div>
    </div>
</div>
</template>

<script>


</script>