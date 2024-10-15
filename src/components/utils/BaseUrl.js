export default function BaseUrl(){
    const url = {};
    // url.base = "https://assets-api.distriforce.shop/api";
    // url.public = "https://assets-api.distriforce.shop/";
    // url.image = "https://assets-api.distriforce.shop/storage";

    // url.base = "http://192.168.1.73:8000/api";
    // url.public = "http://192.168.1.73:8000/";
    // url.image = "http://192.168.1.73:8000/storage";

    url.base = "http://127.0.0.1:8000/api";
    url.public = "http://127.0.0.1:8000/";
    url.image = "http://127.0.0.1:8000/storage";
    return url;
}