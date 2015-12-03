//V3.01.A - http://www.openjs.com/scripts/jx/
jx = {
	//Create a xmlHttpRequest object - this is the constructor. 
	getHTTPObject : function() {
		var http = false;
		//Use IE's ActiveX items to load the file.
		if(typeof ActiveXObject != 'undefined') {
			try {http = new ActiveXObject("Msxml2.XMLHTTP");}
			catch (e) {
				try {http = new ActiveXObject("Microsoft.XMLHTTP");}
				catch (E) {http = false;}
			}
		//If ActiveX is not available, use the XMLHttpRequest of Firefox/Mozilla etc. to load the document.
		} else if (window.XMLHttpRequest) {
			try {http = new XMLHttpRequest();}
			catch (e) {http = false;}
		}
		return http;
	},
	
	// This function is called from the user's script. 
	//Arguments - 
	//	url	- The url of the serverside script that is to be called. Append all the arguments to 
	//			this url - eg. 'get_data.php?id=5&car=benz'
	//	callback - Function that must be called once the data is ready.
	//	format - The return type for this function. Could be 'xml','json' or 'text'. If it is json, 
	//			the string will be 'eval'ed before returning it. Default:'text'
	//	method - GET or POST. Default 'GET'
	load : function (url,callback,format,method, opt) {
		
		var http = this.init(); //The XMLHttpRequest object is recreated at every call - to defeat Cache problem in IE
		if(!http||!url) return;
		//XML Format need this for some Mozilla Browsers
		if (http.overrideMimeType) http.overrideMimeType('text/xml');

		var ajaxTimeOut = setTimeout(function(){
				http.abort();
				opt.error("网络延迟，请刷新重试.");
			}, 60000);
		
		if(!method) method = "GET";//Default method is GET
		if(!format) format = "text";//Default return type is 'text'
		if(!opt) opt = {};
		format = format.toLowerCase();
		method = method.toUpperCase();
		
		//Kill the Cache problem in IE.
		var now = "uid=" + new Date().getTime();
		url += (url.indexOf("?")+1) ? "&" : "?";
		url += now;

		var parameters = null;

		if(method=="POST") {
			var parts = url.split("\?");
			url = parts[0];
			parameters = parts[1];
		}
		http.open(method, url, true);

		if(method=="POST") {
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.setRequestHeader("Content-length", parameters.length);
			http.setRequestHeader("Connection", "close");
		}

		var ths = this;// Closure
		if(opt.handler) { //If a custom handler is defined, use it
			http.onreadystatechange = function() { opt.handler(http); };
		} else {
			http.onreadystatechange = function () {//Call a function when the state changes.
				if (http.readyState == 4) {//Ready State will be 4 when the document is loaded.
					clearTimeout(ajaxTimeOut);
					if(http.status == 200) {
						var result = "";
						if(http.responseText) result = http.responseText;
						//If the return is in JSON format, eval the result before returning it.
						if(format.charAt(0) == "j") {
							//\n's in JSON string, when evaluated will create errors in IE
							result = result.replace(/[\n\r]/g,"");
							result = eval('('+result+')');

						} else if(format.charAt(0) == "x") { //XML Return
							result = http.responseXML;
						}

						//Give the data to the callback function.
						if(callback) callback(result);
					} else {
						if(opt.loadingIndicator) document.getElementsByTagName("body")[0].removeChild(opt.loadingIndicator); //Remove the loading indicator
						if(opt.loading) document.getElementById(opt.loading).style.display="none"; //Hide the given loading indicator.
						var result = "";
						if(http.responseText) result = http.responseText;
						opt.error(result);
					}
				}
			}
		}
		http.send(parameters);
	},
	bind : function(user_options) {
		var opt = {
			'url':'', 			//URL to be loaded
			'onSuccess':false,	//Function that should be called at success
			'onError':false,	//Function that should be called at error
			'format':"text",	//Return type - could be 'xml','json' or 'text'
			'method':"GET",		//GET or POST
			'update':"",		//The id of the element where the resulting data should be shown. 
			'loading':"",		//The id of the loading indicator. This will be set to display:block when the url is loading and to display:none when the data has finished loading.
			'loadingIndicator':"" //HTML that would be inserted into the document once the url starts loading and removed when the data has finished loading. This will be inserted into a div with class name 'loading-indicator' and will be placed at 'top:0px;left:0px;'
		}
		for(var key in opt) {
			if(user_options[key]) {//If the user given options contain any valid option, ...
				opt[key] = user_options[key];// ..that option will be put in the opt array.
			}
		}
		
		if(!opt.url) return; //Return if a url is not provided

		var div = false;
		if(opt.loadingIndicator) { //Show a loading indicator from the given HTML
			div = document.createElement("div");
			div.setAttribute("style","position:absolute;top:0px;left:0px;");
			div.setAttribute("class","loading-indicator");
			div.innerHTML = opt.loadingIndicator;
			document.getElementsByTagName("body")[0].appendChild(div);
			this.opt.loadingIndicator=div;
		}
		if(opt.loading) document.getElementById(opt.loading).style.display="block"; //Show the given loading indicator.
		
		this.load(opt.url,function(data){
			if(opt.onSuccess) opt.onSuccess(data);
			if(opt.update) document.getElementById(opt.update).innerHTML = data;
			
			if(div) document.getElementsByTagName("body")[0].removeChild(div); //Remove the loading indicator
			if(opt.loading) document.getElementById(opt.loading).style.display="none"; //Hide the given loading indicator.
		},opt.format,opt.method, opt);
	},
	init : function() {return this.getHTTPObject();}
}