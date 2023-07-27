import axios from "axios";

const Api = axios.create({
        baseURL: 'http://perpus-api.mamorasoft.com',
});

export default Api;