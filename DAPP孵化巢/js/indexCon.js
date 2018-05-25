$(function(){
	getData(8);
});
function getData(num){
	//搜索
	var index = layer.load(1, {
	  shade: [0.5,'#000'] //0.1透明度的白色背景
	});
    var from = Account.NewAccount().getAddressString();
    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "getNewRecords";
    var callArgs = "[\""+ num + "\"]";
    var contract = {
      "function":callFunction,
      "args":callArgs
    }
    neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(
        function(resp){
    	layer.close(index);
        dataCallBack(resp);
    }).catch(function(err){
        console.log("error:"+err.message);
    })
}
function dataCallBack(resp){
	var result = resp.result;
    if(result === 'null'){
    }else{
        try{
          result = JSON.parse(result);
          if(isArray(result)) {
          	var box= $("#list");
          	var htmlSrt = "";
          	if(result.length<=0){
          		$("#emptytip").addClass("show");
          		box.html("");
          		return false;
          	}
          	for(var i = 0;i<result.length;i++){
          		var d = result[i];
          		htmlSrt+="<li>"+
							"<h2>";
							if(d.status==1){
								htmlSrt+="<span class=\"fl type yp\" cl=\"yp\" >应聘</span>";
							}else{
								htmlSrt+="<span class=\"fl type zn\" cl=\"zn\">招纳</span>";
							}
								htmlSrt+="<span class=\"fr job\">"+d.job+"</span>"+
							"</h2>"+
							"<p class=\"tel\">"+
								"<span class=\"fl\"><em class=\"uname\">"+d.name+"</em><i class=\"utel\" style=\"margin-left:15px;\">"+d.Connect+"</i></span>"+
								"<span class=\"fr\">￥<i class=\"umoney\">"+d.money+"</i></span>"+
							"</p>"+
							"<p class=\"txt\">"+d.remarks+"</p>"+
							"<p class=\"addr\">"+d.author+"</p>"+
						"</li>";
          }
          	$("#emptytip").removeClass("show");
          	box.html(htmlSrt);
          	addEvent();
      	}else{
            alert(result);
        };
        }catch(err){
        	
        }
    }
}
function addEvent(){
	var showInfo = $("#showInfo");
	$("#list li").bind("click",function(){
		var _that = $(this);
		var htmlbox = $("#layoutInfo");
		htmlbox.html("");
		var htmlStr = "";
		var obj ={
			type:_that.find(".type").html(),
			typeClass:_that.find(".type").attr("cl"), 
			jobName:_that.find(".job").html(),
			uName:_that.find(".uname").html(),
			mobile:_that.find(".utel").html(),
			price:_that.find(".umoney").html(),
			desc:_that.find(".txt").html(),
			addr:_that.find(".addr").html(),
		}
		htmlStr="<h2>"+
				"<span class=\"typeTxt "+obj.typeClass+"\">"+
					"<i></i>"+
					"<em>"+obj.type+"</em>"+
				"</span>"+
				"<span class=\"fr job\">"+obj.jobName+"</span>"+
			"</h2>"+
			"<p class=\"tel\">"+
				"<span class=\"fl\">"+obj.uName+"</i></span>"+
				"<span class=\"fl telnum\">联系方式：<i>"+obj.mobile+"</i></span>"+
				"<span class=\"fr\">￥<i>"+obj.price+"</i></span>"+
			"</p>"+
			"<p class=\"txt\">"+obj.desc+"</p>"+
			"<p class=\"addr\">"+obj.addr+"</p>";
			htmlbox.html(htmlStr);
		showInfo.addClass("show");
	});
	$(".closeInfobtn").bind("click",function(){
		showInfo.removeClass("show");
	});
}