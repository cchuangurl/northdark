import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Qs from 'qs';
var axios_instance = axios.create({
//config裡面有這個transformRquest，這個選項會在傳送引數前進行處理。
//這時候我們通過Qs.stringify轉換為表單查詢引數
    transformRequest: [function (data) {
        data = Qs.stringify(data);
        return data;
    }],
//設定Content-Type
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
})
Vue.use(VueAxios, axios_instance)