var page = 1;
var pageCount =1;
var intervalQuery=null;
var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
var nebPay = new NebPay();
var serialNumber

function getPage(){
	//搜索
    var from = Account.NewAccount().getAddressString();
    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "getTotalPage";
    var callArgs = "[]";
    var contract = {
      "function":callFunction,
      "args":callArgs
    }
    neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(
        function(resp){
        	pageCount = resp.result?resp.result:1;
    }).catch(function(err){
        console.log("error:"+err.message);
    })
}
function getData(page){
	var index = layer.load(1, {
	  shade: [0.5,'#000'] //0.1透明度的白色背景
	});
	//搜索
    var from = Account.NewAccount().getAddressString();
    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "getRecords";
    var callArgs = "[\""+ page + "\"]";
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
function saveFun(obj){
	clearInterval(intervalQuery);
	console.log(obj);
 	if(obj){
 	   var to = dappAddress;
       var value = "0";
       var callFunction = "save";
       var timestamp = Date.parse(new Date());
       var callArgs = "[\""+ obj.type + "\",\""+ obj.uName + "\",\""+ obj.jobName + "\",\""+ obj.mobile + "\",\""+ obj.price + "\",\""+ obj.desc + "\"]";

       serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
        listener: cbPush        //设置listener, 处理交易返回信息
           });
     	}
   }
	function funcIntervalQuery(hash, type){
//	      nebPay.queryPayInfo(serialNumber)
//	          .then(function(resp){
//	            console.log("支付结果:"+resp);
//	            var respObject = JSON.parse(resp);
//	            if(respObject.data.status ===1){
//	              var author = $("#pathAddr").val().trim();
//	              getData(author);
//	            }
//	          }).catch(function(err){
//	            console.log(err);
//	          });
      
    $.ajax({
        type: "POST",
        url: "https://mainnet.nebulas.io/v1/user/getTransactionReceipt",
        data: JSON.stringify({
            hash: hash
        }),
        success: function (result) {
            if (result.result.status == 1) {
                clearInterval(intervalQuery);
                layer.msg('发布成功');
                page=1;
                getData(page);
                getPage();
                $("#maskPut").removeClass("show");
            }else{
            	console.log(result);
            	return ;
            }
        },
        error: function (jqXHR) {
        	clearInterval(intervalQuery);
            console.log(JSON.stringify(jqXHR));
        }
    });
}
function cbPush(resp){
    intervalQuery = setInterval(function () {
    funcIntervalQuery(resp.txhash);
    }, 5000);
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
$(function(){
	getPage();
	getData(page);
	page = $("#pageVal").html()?parseInt($("#pageVal").html()):1;
	var pagebox = $("#pageVal");
	$("#prev").click(function(){
		var page = parseInt(pagebox.html());
		if(page<=1){
			alert("已经是第一页了！");
			return false;
		}else{
			page-=1;
			pagebox.html(page);
		}
	});
	$("#next").click(function(){
		console.log(pageCount);
		var page = parseInt(pagebox.html());
		if(page>=pageCount){
			alert("已经是最后一页了！");
			return false;
		}else{
			page+=1;
			pagebox.html(page);
		}
	});
	var maskput = $("#maskPut");
	var putBtn = $("#putBtn");
	$(".putInfo").bind("click",function(){
		maskput.addClass("show");
	});
	$(".closebtn").bind("click",function(){
		maskput.removeClass("show");
	});
	$(".typeck").bind("click",function(){
		$(this).addClass("active").parent().siblings().children(".typeck").removeClass("active");
	});
	putBtn.bind("click",function(){
		var type = $(".ltop .active").attr("type");
		var jobName = $("#jobName").val();
		var mobile = $("#mobile").val();
		var uName = $("#uName").val();
		var price = $("#price").val();
		var desc = $("#desc").val();
		if(!jobName){
			alert("请填写职名称！");
			return false;
		}
		if(!uName){
			alert("请填写称呼称！");
			return false;
		}
		if(!mobile){
			alert("请填写手机号！");
			return false;
		}
		if(!price){
			alert("请填写薪酬！");
			return false;
		}
		if(!desc){
			alert("请填写职位简介，5-100字之间！");
			return false;
		}
		if(desc.length>500||desc.length<5){
			alert("职位简介应在5-500字之间！");
			return false;
		}
		var obj ={
			type:type,
			jobName:jobName,
			uName:uName,
			mobile:mobile,
			price:price,
			desc:desc
		}
		saveFun(obj);
	});
});