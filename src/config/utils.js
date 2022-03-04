export const IsPC = function () {
    var userAgentInfo = navigator.userAgent.toLowerCase();
    var Agents        = ["android", "symbianos", "windows phone",
        "ipad", "ipod", "iphone", "android", "phone", "mobile",
        "wap", "netfront", "java", "opera mobi", "opera mini", "ucweb",
        "windows ce", "symbian", "series", "webos", "sony",
        "blackberry", "dopod", "nokia", "samsung", "palmsource", "xda",
        "pieplus", "meizu", "midp", "cldc", "motorola", "foma",
        "docomo", "up.browser", "up.link", "blazer", "helio", "hosin",
        "huawei", "novarra", "coolpad", "webos", "techfaith",
        "palmsource", "alcatel", "amoi", "ktouch", "nexian",
        "ericsson", "philips", "sagem", "wellcom", "bunjalloo", "maui",
        "smartphone", "iemobile", "spice", "bird", "zte-", "longcos",
        "pantech", "gionee", "portalmmm", "jig browser", "hiptop",
        "benq", "haier", "^lct", "320x320", "240x320", "176x220",
        "w3c ", "acs-", "alav", "alca", "amoi", "audi", "avan", "benq",
        "bird", "blac", "blaz", "brew", "cell", "cldc", "cmd-", "dang",
        "doco", "eric", "hipt", "inno", "ipaq", "java", "jigs", "kddi",
        "keji", "leno", "lg-c", "lg-d", "lg-g", "lge-", "maui", "maxo",
        "midp", "mits", "mmef", "mobi", "mot-", "moto", "mwbp", "nec-",
        "newt", "noki", "oper", "palm", "pana", "pant", "phil", "play",
        "port", "prox", "qwap", "sage", "sams", "sany", "sch-", "sec-",
        "send", "seri", "sgh-", "shar", "sie-", "siem", "smal", "smar",
        "sony", "sph-", "symb", "t-mo", "teli", "tim-", /*"tosh",*/ "tsm-",
        "upg1", "upsi", "vk-v", "voda", "wap-", "wapa", "wapi", "wapp",
        "wapr", "webc", "winw", "winw", "xda", "xda-", "Googlebot-Mobile"];
    var flag          = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

export const hasUsableSWF = function () {
    var flag = false;
    var swf;
    if(typeof window.ActiveXObject != "undefined"){
        swf = new  ActiveXObject("ShockwaveFlash.ShockwaveFlash");
    }else{
        swf = navigator.plugins['Shockwave Flash'];
    }
    if(swf){
        flag = true;
    }else{
        flag = false
    }
    return flag

}

export const mathRand = function () {
    var Num="";
    for(var i=0;i<6;i++){
        Num+=Math.floor(Math.random()*10);
    }
    return Num
}
/**
 * 判断是否是safri
 * @returns {boolean}
 * @constructor
 */
export const IsSafri = function () {
    var flag = false;
    if (bowser.safari) {
        flag = true;
    }
    return flag;
}
export const IsAndroid = function () {
    return  bowser.android
}
export const isIE   = function () {
    return bowser.msie

}
export const IsWx = function () {
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象

    return ua.match(/MicroMessenger/i) == "micromessenger";
}
export const IsFireFox = function(){
    return  bowser.firefox
}

export const IsDD = function () {
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象

    return ua.match(/dingtalk/i) == "dingtalk";
}
export const isStorageSuport = function (storage) {
    if (!!storage) {
        try {
            storage.setItem("key", "value");
            storage.removeItem("key");
            return true;
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

export const getSessionStorage = function (key, expiresTime) {
    if (isStorageSuport(window.sessionStorage)) {
        var returnValue;
        if (expiresTime) {
            if (sessionStorage.getItem(key)) {
                var GetDateTime = new Date().getTime();
                var setDataTime = sessionStorage.getItem(key).split('|')[1];
                if (GetDateTime - setDataTime > expiresTime) {
                    sessionStorage.removeItem(key);
                    returnValue = undefined;
                } else {
                    returnValue = sessionStorage.getItem(key).split('|')[0]
                }
            } else {
                returnValue = undefined;
            }
        } else {
            returnValue = sessionStorage.getItem(key)
        }
        return returnValue;
    } else {
        return getCookie(key);
    }
}

export const setSessionStorage    = function (key, data, expiresTime, stortime) {
    if (isStorageSuport(window.sessionStorage)) {
        if (expiresTime) {
            //存入当前时间，以便在获取的时候超过30天之后又清除缓存
            var SetDateTime = new Date().getTime();
            if (stortime) {
                SetDateTime = stortime;
            }
            data += '|' + SetDateTime + '';
            setLocalStorage(key, SetDateTime)
        }
        sessionStorage.setItem(key, data);
    } else {
        setCookie(key, data);
    }
}
export const deleteSessionStorage = function (key) {
    if (isStorageSuport(window.sessionStorage)) {
        sessionStorage.removeItem(key);
    } else {
        removeCookie(key, '', {expires: -1}); // 删除 cookie
    }
}
export const getLocalStorage      = function (key) {
    if (isStorageSuport(window.localStorage)) {
        return localStorage.getItem(key);
    } else {
        return getCookie(key);
    }
}
export const setLocalStorage      = function (key, data) {
    if (isStorageSuport(window.localStorage)) {
        localStorage.setItem(key, data);
    } else {
        setCookie(key, data);
    }
}

export const deleteLocalStorage = function (key) {
    if (isStorageSuport(window.localStorage)) {
        localStorage.removeItem(key);
    } else {
        removeCookie(key); // 删除 cookie
    }
}

/**
 *
 * @param name
 * @param value
 * @param min
 */
export const setCookie = function (name, value, min) {
    if (min) {
        var date = new Date();
        date.setTime(date.getTime() + (min * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";

}
/**
 *
 * @param name
 */
export const getCookie = function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return "";
    }

}

/**
 *
 * @param name
 */
export const removeCookie = function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 16000);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
    }

}
//清除所有cookie函数
export const clearAllCookie = function (){
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}
