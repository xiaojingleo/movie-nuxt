// plugins/global-methods.js
import CryptoJS from 'crypto-js';
import JSEncrypt from './jsencrypt'

// 添加全局方法到 Vue 实例

export const encryptData = (data) => {
    var encrypted;
    const publicKeyPem = '-----BEGIN PUBLIC KEY-----'
        + 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA02F/kPg5A2NX4qZ5JSns+bjhVMCC6JbTiTKpbgNgiXU+Kkorg6Dj76gS68gB8llhbUKCXjIdygnHPrxVHWfzmzisq9P9awmXBkCk74Skglx2LKHa/mNz9ivg6YzQ5pQFUEWS0DfomGBXVtqvBlOXMCRxp69oWaMsnfjnBV+0J7vHbXzUIkqBLdXSNfM9Ag5qdRDrJC3CqB65EJ3ARWVzZTTcXSdMW9i3qzEZPawPNPe5yPYbMZIoXLcrqvEZnRK1oak67/ihf7iwPJqdc+68ZYEmmdqwunOvRdjq89fQMVelmqcRD9RYe08v+xDxG9Co9z7hcXGTsUquMxkh29uNawIDAQAB'
        + "-----END PUBLIC KEY-----";
    var rsaEncrypt = new JSEncrypt();
    rsaEncrypt.setPublicKey(publicKeyPem);

    encrypted = rsaEncrypt.encrypt(data);
    // console.log(encrypted);
    return encrypted;
};
export const AES_CBC_decrypt = (data, key = "e6d5de5fcc51f53d", iv = "2f13eef7dfc6c613") => { //key,iv：16位的字符串
    // CryptoJS.Base64.encodeBase64(data,CryptoJs.Base64.No_WRAP);
    // Base64.encodeBase64String(data,Base64.NO_WRAP);
    var key1 = CryptoJS.enc.Latin1.parse(key);
    var iv1 = CryptoJS.enc.Latin1.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(data, key1, {
        iv: iv1,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    let result = decrypted.toString(CryptoJS.enc.Utf8);
    // console.log(result);
    return result;
};
export const get_pack = (str) => {
    return encryptData(str)
};
export const get_sign = (originalString) => {
    // 假设 key 是你的密钥
    const key = "635a580fcb5dc6e60caa39c31a7bde48";
    return CryptoJS.HmacMD5(originalString, key).toString()
};
export const get_list_params = (type_id, _class = '类型', area = "地区", year = "年份", page = "1", pagesize = "21") => {

    var json_data = {
        "type_id": type_id,
        "sort": "by_default",
        "class": _class,
        "area": area,
        "year": year,
        "page": page,
        "pageSize": "21",
        "timestamp": get_timestamp()
    }
    return JSON.stringify(json_data)
};
export const get_detail_params = (id) => {
    const json_data = {
        "id": id,
        "timestamp": get_timestamp()
    }
    return JSON.stringify(json_data)
};
export const get_search_params = (keyword, page = "1", pageSize = "10", res_type = "by_movie_name") => {
    const json_data = {
        "keyword": keyword,
        "page": page,
        "pageSize": "10",
        "res_type": "by_movie_name",
        "timestamp": get_timestamp()
    }
    return JSON.stringify(json_data)
};

export const get_recommend_params = (id,typeid ,  num = "9", res_type = "by_movie_name") => {
    const json_data =
    {"movie_id":id,"type_id":typeid,"num":num,"timestamp":get_timestamp()}
    return JSON.stringify(json_data)
};

export const get_timestamp = () => {
    var date = new Date(); //获取当前时间
    return Math.ceil(date.getTime() / 1000).toString();
};
export const ajax = (options) => {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = this.formatParams(options.data);

    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
            }
        }
    }

    //连接 和 发送 - 第二步
    if (options.type === "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("accept", "application/prs.55App.v2+json");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("x-client-version", "3096");
        xhr.setRequestHeader("x-app-version", "3096");
        xhr.setRequestHeader("x-app-lang", "zh_CN");
        // xhr.setRequestHeader("user-agent", "Android");
        xhr.setRequestHeader("timestamp", get_timestamp());
        xhr.setRequestHeader("x-client-setting", "{\"pure-mode\":1}");
        xhr.setRequestHeader("x-client-uuid", "{\"device_id\":\"d92aca9bc1e6adfeb80432c5bbbe3952\", \"type\":1,\"brand\":\"realme\", \"model\":\"RMX3783\", \"system_version\":28, \"sdk_version\":\"3.1.0.5\"}");

        xhr.send();
    } else if (options.type === "POST") {
        xhr.open("POST", options.url, true);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("accept", "application/prs.55App.v2+json");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("x-client-version", "3096");
        xhr.setRequestHeader("x-app-version", "3096");
        xhr.setRequestHeader("x-app-lang", "zh_CN");
        // xhr.setRequestHeader("user-agent", "Android");
        xhr.setRequestHeader("timestamp", get_timestamp());
        xhr.setRequestHeader("x-client-setting", "{\"pure-mode\":1}");
        xhr.setRequestHeader("x-client-uuid", "{\"device_id\":\"d92aca9bc1e6adfeb80432c5bbbe3952\", \"type\":1,\"brand\":\"realme\", \"model\":\"RMX3783\", \"system_version\":28, \"sdk_version\":\"3.1.0.5\"}");

        xhr.send(params);
    }
};
//格式化参数
export const formatParams = (data) => {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    return arr.join("&");
};
