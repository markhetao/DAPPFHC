 "use strict";

    var dappAddress = "n1i4dQdRtBtAQbuRB8Hmr2CFKatQTo4qo7H"; //主网环境
	var nebulas = require("nebulas"),
	    Account = nebulas.Account,
	    neb = new nebulas.Neb();
	neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));// 
	 
	function isArray(obj){ 
	  return (typeof obj=='object')&&obj.constructor==Array; 
	};
	//获取url中的参数
	function getQueryString(name) {
	  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); // 匹配目标参数
	  var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
	  if (result != null) {
	    return decodeURIComponent(result[2]);
	  } else {
	    return null;
	  }
	}