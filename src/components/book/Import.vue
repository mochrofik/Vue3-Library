<template>
    <div class="modal fade" id="importModal" tabindex="-1" aria-labelledby="importModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">

                <h5 class="modal-title" id="importModalLabel">Import Data Buku</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="addForm">
            <div class="modal-body">
                <div class="btn btn-sm btn-primary" @click="downloadTemplate()">Download Template</div>
                
                <div class="form-group mt-3">
                    <label>File Import</label>
                    <input type="file" id="file" class="form-control" required  @change="changeFile($event)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  >
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" @click.prevent="importBook()" class="btn btn-primary">Simpan</button>
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
        return{
            token: localStorage.getItem("userKey"),
            file: null,
            fileImport:'',
        }
    },
    methods:{
        downloadTemplate() {
            Api.get( 'api/book/download/template', {
                'headers': { 'Authorization': 'Bearer ' + this.token },
            }).then(res => {
                window.open(this.apiUrl + res.data.path, '_blank')
            }).catch((err) => {
            })
        },
        importBook(){

        Api.post("api/book/import/excel",{
            'file_import': this.file
            
        },
        {
            headers:{
                "Content-Type": 'multipart/form-data',
                Authorization: 'Bearer ' + this.token,
            }
        }
        ).then((res)=>{
            if(res.data.status == 200){
                Swal.fire({
                    icon:'success',
                    title:'Berhasil',
                    text: res.data.message,
                    timer: 4000,
                });
                $('#importModal').modal('hide');
                this.file = '';
                var importFile = document.getElementById('file');
                importFile.value = '';
                this.$route.push({path:'/books'});
                
            }else{
                Swal.fire({
                    icon:'error',
                    title:'Oops...',
                    text: res.data.message,
                    timer: 4000,
                });

            }

        }).catch((err)=>{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response.message,
                timer: 3000
            });

        });

        },
        changeFile(e){
            const file = e.target.files[0];
            this.file = file;

      },
    }
}
</script>