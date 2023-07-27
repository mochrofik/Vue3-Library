<template>
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
            <div class="modal-body">
                    <div class="text-center">
                        <img class="img-tumbhnail rounded " src="" height="180px" width="150px">

                    </div>
                <div class="row">
                    Judul
                </div>
                <div class="row">
                    Pengarang
                </div>
              
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
            </form>
        </div>
    </div>
</div>
</template>