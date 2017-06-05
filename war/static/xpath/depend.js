var removeLoading=function(obj){
	
};
var showLoading=function(obj, opacity){
	
};

function showInfo(msg){
	console.log(msg);
}

//一次性全部删除  
function moveAllTr(tableId){  
	var tab=jQuery(parent.document.body).find("#"+tableId).get(0);  
	//该表格的行数  
	var rowlen = tab.rows.length;  
	//deleteRow()方法的参数是行的索引(从0开始)  
	//如: 表格为4行,索引以此为0,1,2,3;  
	//以下是从下往上删除,故删除时 行数-1开始,0行不删除,所以rowIndex > 0  
	for(var rowIndex = rowlen - 1; rowIndex > 0; rowIndex--){                  
		tab.deleteRow(rowIndex);  
	}  
} 
function queryLoading(tableId){  
} 

var crawlQueueHasImplMap=new Map();

function getSiteName(siteId){
	return siteId;
}

function createTab(url, tabName){
	
}

function Map() {
	var get = function(key) {
		return true; 
	}
	this.get = get;  
}

function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
    return "";
}

function handlerException(errorObject){
	var msg = errorObject['msg']+"";
	if(msg==null || msg=="" || msg == undefined || msg == "undefined" ){
		msg="System Exception!";
  	}
	newcrawler.message("show", msg, 0, "red");
	
	throw new JSONRpcClient.Exception (errorObject);
}