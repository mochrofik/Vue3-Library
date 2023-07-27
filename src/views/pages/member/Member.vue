<template>
    <div class="container">
        <div class="card">
            <div class="card-body">
                <h4>Daftar Member</h4>

                <table class="table table-hover">
                    <thead class="thead-light">
                        <tr>
                            <th width="60px">No</th>
                            <th>Profil</th>
                            <th>Nama</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(member, index) in members.data">
                            <td>{{ (members.current_page - 1) * members.per_page + (index + 1) }}</td>
                           
                            <td width="80px">
                                <img src="public/assets/img/user2-160x160.jpg" class="img-circle elevation-2"
                                    alt="User Image" width="40" />

                            </td>
                            <td>{{ member.name }}</td>
                            <td>{{ member.email }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="example-one text-center mt-2">
            <vue-awesome-paginate :total-items="members.total" :items-per-page="members.per_page" :max-pages-shown="3"
              :on-click="clickCallback" v-model="page" :hide-prev-next-when-ends="true" />
          </div>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '../../../api';
import Swal from 'sweetalert2';


export default {
    data() {
        return {
            members: [],
            page: 1,
            perpage: 5,
            token: localStorage.getItem("userKey")
        }
    },
    beforeMount() {
        this.getData();
    },
    methods: {
        async getData() {
            Api.get("api/user/all",
                {
                    headers: {
                        Authorization: 'Bearer ' + this.token
                    },
                    params:{
                        page: this.page 
                    }
                },
                
            ).then((res) => {
                let data = res.data.data;
                if (res.data.status == 200) {
                    this.members = data.users;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message,
                        timer: 2000
                    })
                }


            }).catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response.data.message,
                    timer: 2000
                })
            })
        },
        clickCallback(pageNum) {
        this.page = pageNum;
        this.getData();
        },
    }
}
</script>