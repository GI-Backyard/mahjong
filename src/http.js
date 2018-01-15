// let cc = window.cc;
cc.VERSION = 20161227;
let URL = "http://127.0.0.1:9000";

let sessionId = 0;
let userId = 0;
let master_url = URL;
let url = URL;
export default {
  sessionId,
  userId,
  master_url,
  url,
  sendRequest: function (path, data, handler, extraUrl) {
    // var xhr = cc.loader.getXMLHttpRequest();
    var xhr = new window.XMLHttpRequest()
    xhr.timeout = 5000;
    var str = "?";
    for (var k in data) {
      if (str != "?") {
        str += "&";
      }
      str += k + "=" + data[k];
    }
    if (extraUrl == null) {
      extraUrl = this.url;
    }
    var requestURL = extraUrl + path + encodeURI(str);
    console.log("RequestURL:" + requestURL);
    xhr.open("GET", requestURL, true);
    // if (cc.sys.isNative) {
    //   xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
    // }

    var timer = setTimeout(function () {
      xhr.abort();
      console.log('http timeout');
      if (handler) {
        handler({ errcode: -10000, errmsg: 'http request timeout' });
      }
      handler = null;
    }, 5000);

    xhr.onreadystatechange = function () {
      clearTimeout(timer);
      if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
        console.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
        var ret = null;
        try {
          ret = JSON.parse(xhr.responseText);
          /* code */
        } catch (e) {
          console.log("err:" + e);
          //handler(null);
          ret = {
            errcode: -10001,
            errmsg: e,
          };
        }
        if (handler) {
          handler(ret);
        }
        handler = null;
      }
      else if (xhr.readyState === 4) {
        if (handler) {
          handler({ errcode: -10404, errmsg: '404 not found.' });
        }
        handler = null;
      }
      else {
        console.log('other readyState:' + xhr.readyState + ",status:" + xhr.status);
      }
    };


    try {
      xhr.send();
    }
    catch (e) {
      if (handler) {
        handler({ errcode: -10002, errmsg: e });
      }
      handler = null;
    }
    return xhr;
  }
};
