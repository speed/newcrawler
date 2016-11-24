var ncxTableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
  return function(table, name) {
    if (!table.nodeType) table = document.getElementById(table)
    var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
    window.location.href = uri + base64(format(template, ctx))
  }
})();

//cache test
var ncx_traceHighlight = {
	ctrlDown :false,//默认多选
	isallowtrace : 1,
	isHighlight : 0,
	isAddSelector:false,
	element : null,
	process : function(h) {
		var g = h.target || h.srcElement;
		if (jQuery(g).get(0).tagName.toLowerCase() != "html"
				&& jQuery(g).attr("class") != "ncx_highlightTool"
				&& ncx_traceHighlight.isallowtrace == 1 && !ncx_et_tool.isAddSelector) {
			if(ncx_traceHighlight.ctrlDown){
				jQuery(g).addClass("ncx-cursor-add");
			}
			ncx_traceHighlight.isHighlight=1;
			ncx_traceHighlight.element = g;
			jQuery('#newcrawler').contents().find("#ncx_curlCover .ncx_highlightTool").remove();
			jQuery('#newcrawler').contents().find("#ncx_curlCover").append("<div id='ncx_traceHighlight_top' class='ncx_highlightTool'></div>");
			jQuery('#newcrawler').contents().find("#ncx_curlCover").append("<div id='ncx_traceHighlight_right' class='ncx_highlightTool'></div>");
			jQuery('#newcrawler').contents().find("#ncx_curlCover").append("<div id='ncx_traceHighlight_bottom' class='ncx_highlightTool'></div>");
			jQuery('#newcrawler').contents().find("#ncx_curlCover").append("<div id='ncx_traceHighlight_left' class='ncx_highlightTool'></div>");
			var a = jQuery('#newcrawler').contents().find("#ncx_traceHighlight_top");
			var f = jQuery('#newcrawler').contents().find("#ncx_traceHighlight_right");
			var d = jQuery('#newcrawler').contents().find("#ncx_traceHighlight_bottom");
			var b = jQuery('#newcrawler').contents().find("#ncx_traceHighlight_left");
			var i = jQuery(g).offset();
			var outerwidth = jQuery(g).outerWidth();
			var c = jQuery('#newcrawler').contents().width();
			if (outerwidth > c) {
				outerwidth = c - 8;
			}
			var color="rgb(147, 247, 250)";
			var borderCss="1px dashed rgb(151, 75, 75)";
			ncx_innerFun.highlight(a, i.left - 2, i.top - 2, outerwidth + 4, 2, "border-bottom",borderCss, color);
			ncx_innerFun.highlight(f, i.left + outerwidth, i.top, 2, jQuery(g).outerHeight(), "border-left",borderCss, color);
			ncx_innerFun.highlight(d, i.left - 2, i.top + jQuery(g).outerHeight(), outerwidth + 4, 2, "border-top",borderCss, color);
			ncx_innerFun.highlight(b, i.left - 2, i.top, 2, jQuery(g).outerHeight(), "border-right",borderCss, color);
		}
	}
};

var ncx_innerFun = {
	highlightIndex:0,
	isNullOrEmpty : function(a) {
		return (null == a || "null" == a || "" == a || undefined == a || "undefined" == a || [] == a || undefined == jQuery(a).get(0).tagName)
	},
	innerAppend : function(a, b) {
		a.append(b);
	},
	highlight : function(f, a, b, c, d, e, borderCss, color) {
		if(!color){
			color="#facd93";
		}
		if(!borderCss){
			borderCss="1px dashed #000";
		}
		f.css({
			left : a,
			top : b,
			width : c,
			height : d
		});
		f.css({
			"z-index" : 2999999999,
			position : "absolute",
			"background-color" : color
		});
		f.css(e, borderCss);
		
	},
	highlightCover : function(e, a, b, c, d) {
		e.css({
			left : a,
			top : b,
			width : c,
			height : d
		});
		e.css({
			"z-index" : 99999,
			position : "absolute",
			"background-color" : "#000",
			opacity : 0.5
		});
	},
	getRandomColor:function (index) {
		  var colors=["#F9AEAE", "#F1C194", "#F3E13B", "#CEF57B", "#9CF994", "#75D8BA", "#55C5F5", "#A7A5E4", "#D291FF", "#FF91D5", "#EBD2D6"];
		  var len=colors.length;
		  if(index>=len){
			  index=len-1;
		  }
		  return colors[index];
	},
	getRandomColor2:function () {
		  // creating a random number between 0 and 255
		  var r = Math.floor(Math.random() * 100+Math.random() * 100)+56;
		  var g = Math.floor(Math.random() * 100+Math.random() * 100)+56;
		  var b = Math.floor(Math.random() * 100+Math.random() * 100)+56;
		  // going from decimal to hex
		  var hexR = r.toString(16);
		  var hexG = g.toString(16);
		  var hexB = b.toString(16);

		  // making sure single character values are prepended with a "0"
		  if (hexR.length == 1) {
		    hexR = "0" + hexR;
		  }

		  if (hexG.length == 1) {
		    hexG = "0" + hexG;
		  }

		  if (hexB.length == 1) {
		    hexB = "0" + hexB;
		  }

		  // creating the hex value by concatenatening the string values
		  var hexColor = "#" + hexR + hexG + hexB;
		  
		  return hexColor.toUpperCase();
	},
	addHighlight : function(seq, g, isAddSelector, i, color, selected){
		ncx_innerFun.highlightIndex=ncx_innerFun.highlightIndex+1;
		var selectorDiv="";
		if(isAddSelector){
			selectorDiv="<div class='ncx_selector' style='background-color:"+color+"; position: absolute; height: 15px; width: 35px;'>" +
					"<a class='ncx-highlight-button ncx-accept-highlight' lang='"+i+"' style='background: url(\""+newcrawler_server_url+"static/xpath/v2/icon-highlight-accept.svg\") no-repeat 50% 50%;background-size: 10px 10px;right: 0px;padding-right: 10px;display: inline-block;cursor: pointer!important;height: 12px;width: 12px;opacity: .4;position: absolute;margin-top: 1px;'></a>" +
							"<a class='ncx-highlight-button ncx-reject-highlight' lang='"+i+"' style='background: url(\""+newcrawler_server_url+"static/xpath/v2/icon-highlight-reject.svg\") no-repeat 50% 50%;background-size: 10px 10px;right: 15px;padding-right: 10px;display: inline-block;cursor: pointer!important;height: 12px;width: 12px;opacity: .4;position: absolute;margin-top: 1px;'></a></div>";
		}
		jQuery('#newcrawler').contents().find("#ncx_cover-container").append("<div id='ncx_traceHighlight_top_"+ncx_innerFun.highlightIndex+"' class='ncx_highlightTool "+selected+" seq"+seq+"'></div>");
		jQuery('#newcrawler').contents().find("#ncx_cover-container").append("<div id='ncx_traceHighlight_right_"+ncx_innerFun.highlightIndex+"' class='ncx_highlightTool "+selected+" seq"+seq+"'></div>");
		jQuery('#newcrawler').contents().find("#ncx_cover-container").append("<div id='ncx_traceHighlight_bottom_"+ncx_innerFun.highlightIndex+"' class='ncx_highlightTool "+selected+" seq"+seq+"'>"+selectorDiv+"</div>");
		jQuery('#newcrawler').contents().find("#ncx_cover-container").append("<div id='ncx_traceHighlight_left_"+ncx_innerFun.highlightIndex+"' class='ncx_highlightTool "+selected+" seq"+seq+"'></div>");
		var a = jQuery('#newcrawler').contents().find("#ncx_traceHighlight_top_"+ncx_innerFun.highlightIndex+"");
		var f = jQuery('#newcrawler').contents().find("#ncx_traceHighlight_right_"+ncx_innerFun.highlightIndex+"");
		var d = jQuery('#newcrawler').contents().find("#ncx_traceHighlight_bottom_"+ncx_innerFun.highlightIndex+"");
		var b = jQuery('#newcrawler').contents().find("#ncx_traceHighlight_left_"+ncx_innerFun.highlightIndex+"");
		var i = jQuery(g).offset();
		var outerwidth = jQuery(g).outerWidth();
		var outerheight = jQuery(g).outerHeight();
		
		var c = jQuery('#newcrawler').contents().width();
		if (outerwidth > c) {
			outerwidth = c - 8;
		}
		ncx_innerFun.highlight(a, i.left - 2, i.top - 2, outerwidth + 4, 2, "border-bottom");
		ncx_innerFun.highlight(f, i.left + outerwidth, i.top, 2, outerheight, "border-left");
		ncx_innerFun.highlight(d, i.left - 2, i.top + outerheight, outerwidth + 4, 2, "border-top");
		ncx_innerFun.highlight(b, i.left - 2, i.top, 2, outerheight, "border-right");
		
		jQuery('#newcrawler').contents().find("#ncx_curlCover").unbind("click").click(function() {
			ncx_innerFun.closeCover();
		});
	},
	innerHighlightRender : function(e) {
		//jQuery('#newcrawler').contents().find("#ncx_cover-container .ncx_highlightTool").remove();
		
		var k = jQuery(e).offset().top;
		var q = jQuery(e).offset().left;
		var a = jQuery(e).outerWidth();
		var p = jQuery(e).outerHeight();
		var m = jQuery('#newcrawler').contents().outerHeight();
		var l = jQuery('#newcrawler').contents().outerWidth();
		if (a > l + 8) {
			a = l;
		}
		ncx_innerFun.innerAppend(jQuery('#newcrawler').contents().find("#ncx_cover-container"), "<div id='ncx_highlightCover_top' class='ncx_highlightTool'></div>");
		ncx_innerFun.innerAppend(jQuery('#newcrawler').contents().find("#ncx_cover-container"), "<div id='ncx_highlightCover_right' class='ncx_highlightTool'></div>");
		ncx_innerFun.innerAppend(jQuery('#newcrawler').contents().find("#ncx_cover-container"), "<div id='ncx_highlightCover_bottom' class='ncx_highlightTool'></div>");
		ncx_innerFun.innerAppend(jQuery('#newcrawler').contents().find("#ncx_cover-container"), "<div id='ncx_highlightCover_left' class='ncx_highlightTool'></div>");
		var b = jQuery('#newcrawler').contents().find("#ncx_highlightCover_top");
		var i = jQuery('#newcrawler').contents().find("#ncx_highlightCover_right");
		var g = jQuery('#newcrawler').contents().find("#ncx_highlightCover_bottom");
		var c = jQuery('#newcrawler').contents().find("#ncx_highlightCover_left");
		ncx_innerFun.highlightCover(b, 0, 0, l + 8, k - 3);
		ncx_innerFun.highlightCover(i, q + 3 + a, k - 3, l - q - 3 - a + 8, p + 6);
		ncx_innerFun.highlightCover(g, 0, k + 3 + p, l + 8, m - k - p + 5 + 150);
		ncx_innerFun.highlightCover(c, 0, k - 3, q - 3, p + 6);
		ncx_traceHighlight.isallowtrace = 0;
		ncx_innerFun.innerAppend(jQuery('#newcrawler').contents().find("#ncx_cover-container"), "<div id='ncx_editHighlight_top' class='ncx_highlightTool'></div>");
		ncx_innerFun.innerAppend(jQuery('#newcrawler').contents().find("#ncx_cover-container"), "<div id='ncx_editHighlight_right' class='ncx_highlightTool'></div>");
		ncx_innerFun.innerAppend(jQuery('#newcrawler').contents().find("#ncx_cover-container"), "<div id='ncx_editHighlight_bottom' class='ncx_highlightTool'></div>");
		ncx_innerFun.innerAppend(jQuery('#newcrawler').contents().find("#ncx_cover-container"), "<div id='ncx_editHighlight_left' class='ncx_highlightTool'></div>");
		var j = jQuery('#newcrawler').contents().find("#ncx_editHighlight_top");
		var n = jQuery('#newcrawler').contents().find("#ncx_editHighlight_right");
		var f = jQuery('#newcrawler').contents().find("#ncx_editHighlight_bottom");
		var d = jQuery('#newcrawler').contents().find("#ncx_editHighlight_left");
		var h = jQuery(e).offset();
		ncx_innerFun.highlight(j, h.left - 2, h.top - 2, a + 4, 2, "border-bottom");
		ncx_innerFun.highlight(n, h.left + a, h.top, 2, jQuery(e).outerHeight(), "border-left");
		ncx_innerFun.highlight(f, h.left - 2, h.top + jQuery(e).outerHeight(), a + 4, 2, "border-top");
		ncx_innerFun.highlight(d, h.left - 2, h.top, 2, jQuery(e).outerHeight(), "border-right");
		
		jQuery('#newcrawler').contents().find("#ncx_cover-container .ncx_highlightTool").unbind("click").click(function() {
			ncx_innerFun.closeCover();
		});
	},
	multiSelect:function(){
		if(ncx_traceHighlight.ctrlDown){
			jQuery('#newcrawler').contents().find("#ncx_curlCover").css({"pointer-events":"none"});
		}else{
			jQuery('#newcrawler').contents().find('body').contents().find('*').removeClass("ncx-cursor-add");
			
			
			var len=jQuery('#newcrawler').contents().find("#ncx_cover-container .ncx_highlightTool.selected").length;
			if(len>0){
				jQuery('#newcrawler').contents().find("#ncx_curlCover .ncx_highlightTool").remove();
				
				jQuery('#newcrawler').contents().find("#ncx_curlCover").css({"pointer-events":"auto"});
				var b=ncx_et_tool.targetNow;
				ncx_innerFun.innerHighlightRender(b);
				ncx_et_tool.add_et(b);
				ncx_innerFun.initValue(b);
			}
		}
	},
	closeCover: function(){
		ncx_et_tool.xpathArray = [];
		ncx_et_tool.xpathArray2 = [];
		ncx_et_tool.multiSelXpathArray=new Array();
		ncx_et_tool.multiSelCount=0;
		ncx_et_tool.isAddSelector=false;
		
		ncx_traceHighlight.isallowtrace = 1;
		jQuery('#newcrawler').contents().find("#ncx_curlCover .ncx_highlightTool").remove();
		jQuery('#newcrawler').contents().find("#ncx_cover-container .ncx_highlightTool").remove();
		jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").remove();
		
		jQuery('#newcrawler').contents().find("#ncx_curlCover").css({"pointer-events":"none"});
		
		if(!newcrawler.ispage){
			jQuery("#ncx_toolbar .ncx-datatypes .active:not(.finished) .ncx-count").text('0');
			jQuery("#ncx_toolbar .ncx-datatypes .active:not(.finished) .ncx-count").attr("lang",'0');
			
			jQuery("#ncx_toolbar .ncx-datatypes .active.finished .ncx-count").text(jQuery("#ncx_toolbar .ncx-datatypes .active.finished .ncx-count").attr("lang"));
		}
	},
	contrlBtn:function(isSelect){
		jQuery("#ncx_toolbar button.ncx.ncx-button.ncx-save").show();
		jQuery("#ncx_toolbar button.ncx.ncx-button.ncx-test").show();
		jQuery("#ncx_toolbar button.ncx.ncx-button.ncx-view").show();
	},
	clickSelect: function(h){
		if(ncx_et_tool.isAddSelector){
			return;
		}
		ncx_innerFun.contrlBtn(true);
		
		ncx_et_tool.targetIndex = 0;
		ncx_et_tool.seqHighlight=(new Date()).getTime();
		
		if(!jQuery("#ncx_toolbar .ncx-datatypes .ncx-label.active.finished.edit").hasClass("zero")){
			jQuery("#ncx_toolbar .ncx-datatypes .ncx-label.active.finished.edit .ncx-count").text(0);
			jQuery("#ncx_toolbar .ncx-datatypes .ncx-label.active.finished.edit").addClass("zero");
		}
		
		var count=parseInt(jQuery("#ncx_toolbar .ncx-datatypes .active .ncx-count").text());
		ncx_et_tool.multiSelCount=count;
		
		
		var g = h.target || h.srcElement;
		if(ncx_traceHighlight.isHighlight==1){
			var b = ncx_traceHighlight.element;
			//xpath
			if(jQuery("#ncx_toolbar .ncx-datatypes .active").hasClass("ncx-cron")){
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-cron").removeClass("active");
				jQuery("#ncx_toolbar .ncx-cron-config").hide();
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot.ncx-yellow").addClass("active");
			}
			if(jQuery("#ncx_toolbar .ncx-datatypes .active").hasClass("ncx-setting")){
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-setting").removeClass("active");
				jQuery("#ncx_toolbar .ncx-setting-config").hide();
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot.ncx-yellow").addClass("active");
			}
			if(jQuery("#ncx_toolbar .ncx-datatypes .active").hasClass("ncx-pagination")){
				newcrawler.ispage=true;
			}else{
				jQuery("#ncx_toolbar .ncx-setting-config").hide();
				jQuery("#ncx_toolbar .ncx-cron-config").hide();
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-cron").removeClass("active");
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-setting").removeClass("active");
				
				//jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot.ncx-yellow").addClass("active");
				newcrawler.ispage=false;
				
			}
			ncx_et_tool.targetNow = b;
			ncx_et_tool.readCssPath(b);
			if(ncx_et_tool.xpathArray!=null && ncx_et_tool.xpathArray.length>0){
				ncx_et_tool.multiSelXpathArray.push(ncx_et_tool.xpathArray);
			}
			
			var isAccept=false;
			if(newcrawler.fieldArray.length>1){
				isAccept=true;
			}
			
			ncx_innerFun.selectHighlight(b, 1, isAccept);
			
		}
	},
	selectHighlight:function(b, type, isAccept){
		if(newcrawler.ispage){
			ncx_et_tool.xpathArray=null;
			for(var len=ncx_et_tool.xpathArray2.length, i=len-1;i>0;i--){
				
				if(ncx_et_tool.xpathArray2[i]=='a' 
					|| ncx_et_tool.xpathArray2[i].indexOf('a:')==0){
					var pageXpathArray=Array();
					for(var len=i, j=0;j<=len;j++){
						pageXpathArray[j]=ncx_et_tool.xpathArray2[j];
					}
					var pagexpath=pageXpathArray.join('');
					pagexpath = pagexpath.replace(":nth-of-type(*)", "");
					
					var pageelements = jQuery('#newcrawler').contents().find(pagexpath);
					var pageelement = pageelements[0];
					b=pageelement;
					
					ncx_et_tool.xpathArray2=pageXpathArray.slice(0);
					ncx_et_tool.xpathArray=pageXpathArray.slice(0);
					break;
				}
			}
			if(ncx_et_tool.xpathArray==null){
				ncx_innerFun.closeCover();
				return;
			}
		}
		
		if(!isAccept){
			var count=0;
        	for(var i=0, iLen=ncx_et_tool.xpathArray.length; i<iLen; i++){
        		if(ncx_et_tool.xpathArray[i].indexOf(":nth-of-type(*)")!=-1){
        			count++;
        		}
        	}
        	if(count<=1){
        		isAccept=true;
        	}
		}
		jQuery('#newcrawler').contents().find("#ncx_cover-container .ncx_highlightTool.seq"+ncx_et_tool.seqHighlight).remove();
		
		var xpathArray=null;
		var xpathArrayLen=0;
		
		if(!newcrawler.ispage){
			if(newcrawler.fieldArray.length>1){
				xpathArray=newcrawler.fieldArray[1].xpathArray;
				for(var i=1, len=newcrawler.fieldArray.length;i<len;i++){
					for(var j=0, jlen=newcrawler.fieldArray[i].xpathArray.length;j<jlen;j++){
						if(newcrawler.fieldArray[i].xpathArray[j].indexOf(':nth-of-type(*)')!=-1){
							xpathArray=newcrawler.fieldArray[i].xpathArray;
						}
					}
				}
				xpathArrayLen=xpathArray.length;
			}
		}
		
		var count=0;
		
		if(!isAccept){
			for(var i=0, len=ncx_et_tool.xpathArray.length;i<len;i++){
				if(ncx_et_tool.xpathArray[i].indexOf(':nth-of-type(*)')!=-1){
					if(xpathArray!=null){
						if(xpathArrayLen>i){
							if(xpathArray[i].indexOf(':nth-of-type(*)')==-1){
								ncx_et_tool.xpathArray[i]=ncx_et_tool.xpathArray2[i];
								continue;
							}
						}else{
							ncx_et_tool.xpathArray[i]=ncx_et_tool.xpathArray2[i];
							continue;
						}
					}
					count++;
				}
			}
		}
		
		ncx_et_tool.isAddSelector=false;
		if(count>0){
			ncx_et_tool.isAddSelector=true;
			jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").remove();
			ncx_traceHighlight.isallowtrace = 1;
			type=1;
		}else{
			if(!ncx_traceHighlight.ctrlDown){
				ncx_innerFun.innerHighlightRender(b);
				if(type===1){
					ncx_et_tool.add_et(b);
				}else{
					ncx_et_tool.change_et(b);
				}
				
				ncx_innerFun.initValue(b);
			}
		}
		
		var tempSubxpath=[];
		var tempArray=[];
		var index=0;
		
		var isExsit=false;
		for(var i=0, len=ncx_et_tool.xpathArray.length;i<len;i++){
			tempArray[i]=ncx_et_tool.xpathArray[i];
			
			if(tempArray[i].indexOf(':nth-of-type(*)')==-1){
				if(!isExsit && i+1==len){
					
				}else{
					continue;
				}
			}
			isExsit=true;
			
			for(var j=i+1;j<len;j++){
				tempArray[j]=ncx_et_tool.xpathArray2[j];
			}
			var subxpath=tempArray.join('');
			subxpath = subxpath.replace(":nth-of-type(*)", "");
			
			var elements = jQuery('#newcrawler').contents().find(subxpath);
			var eleCount=elements.length;
			count=count+eleCount;
			var color=ncx_innerFun.getRandomColor(index);
			index++;
			for (var e = 0; e < eleCount; e++) {
				var element = elements[e];
				
				if(ncx_et_tool.isSame(b, element)){
					ncx_innerFun.addHighlight(ncx_et_tool.seqHighlight, element, ncx_et_tool.isAddSelector, i, color, "selected");
				}else{
					ncx_innerFun.addHighlight(ncx_et_tool.seqHighlight, element, ncx_et_tool.isAddSelector, i, color, "selected");
				}
			}
			tempArray[i]=ncx_et_tool.xpathArray2[i];
		}
		count+=ncx_et_tool.multiSelCount;
		if(!newcrawler.ispage){
			jQuery("#ncx_toolbar .ncx-datatypes .active .ncx-count").text(count);
		}
		//event
		jQuery('#newcrawler').contents().find(".ncx-accept-highlight").unbind('click').click(function(){
			var lang=jQuery(this).attr("lang");
			for(var i=0, len=ncx_et_tool.xpathArray.length;i<len;i++){
				if(ncx_et_tool.xpathArray[i].indexOf(':nth-of-type(*)')!=-1 && lang!=i){
					ncx_et_tool.xpathArray[i]=ncx_et_tool.xpathArray2[i];
				}
			}
			ncx_innerFun.selectHighlight(b, type, true);
		});
		jQuery('#newcrawler').contents().find(".ncx-reject-highlight").unbind('click').click(function(){
			var lang=jQuery(this).attr("lang");
			for(var i=0, len=ncx_et_tool.xpathArray.length;i<len;i++){
				if(ncx_et_tool.xpathArray[i].indexOf(':nth-of-type(*)')!=-1 && lang==i){
					ncx_et_tool.xpathArray[i]=ncx_et_tool.xpathArray2[i];
				}
			}
			ncx_innerFun.selectHighlight(b, type, false);
		});
	},
	initValue:function(b){
		var xpath="";
		var multiSelXpathArray=ncx_et_tool.multiSelXpathArray;
		for(var i in multiSelXpathArray){
			if(xpath!=""){
				xpath+='|';
			}
			xpath+=multiSelXpathArray[i].join('');
		}
		jQuery('#newcrawler-selector').find("#ncx_copy_xpath_text").text(xpath);
		
		//csspath
		//var csspath=ncx_et_tool.readCssPath(jQuery('#newcrawler').contents().find(ncx_et_tool.targetNow).get(0));
		//jQuery('#newcrawler').contents().find("#ncx_copy_csspath_text").text(csspath);
		
		var node=jQuery(b).get(0);
		jQuery('#newcrawler-selector').find("select[name='ncx_attr']").empty();
		jQuery('#newcrawler-selector').find("select[name='ncx_attr']").append('<option value=""></option>');
		
		var hasAttr=false;
		for (var i = 0, atts = node.attributes, n = atts.length; i < n; i++){
			var name=atts[i].nodeName.toLowerCase();
			jQuery('#newcrawler-selector').find("select[name='ncx_attr']").append('<option value="'+name+'">'+name+'</option>');
			hasAttr=true;
		}
		if(hasAttr){
			jQuery('#newcrawler-selector').find("input[name='ncx_selectType'][value='@ATTR']").attr("disabled", false);
			jQuery('#newcrawler-selector').find("select[name='ncx_attr']").attr("disabled", false);
		}else{
			jQuery('#newcrawler-selector').find("input[name='ncx_selectType'][value='@ATTR']").attr("disabled", true);
			jQuery('#newcrawler-selector').find("select[name='ncx_attr']").attr("disabled", true);
		}
		
		var propertyName=jQuery("#ncx_toolbar .ncx-datatypes .active").attr("title");
		if(hasAttr && (node.tagName.toLowerCase()=="img" || (node.tagName.toLowerCase()=="a" && propertyName=="Link") || newcrawler.ispage)){
			if (node.tagName.toLowerCase()=="img"){
				jQuery('#newcrawler-selector').find("input[name='ncx_selectType'][value='@ATTR']").prop('checked', true);
				jQuery('#newcrawler-selector').find("select[name='ncx_attr'] option").each(function(){
					var attr=this.value;
					if(attr!=null && attr!=""){
						var content = ncx_et_tool.getContent('@ATTR', attr);
						if(content!=null && content!="" && content.toString().toLowerCase().startsWith("http")){
							jQuery('#newcrawler-selector').find("select[name='ncx_attr']").val(attr);
							if(attr=="src"){
								return false;
							}
						}
					}
				});
				jQuery('#newcrawler-selector').find("select[name='ncx_attr']").change();
			}else if ((node.tagName.toLowerCase()=="a" && propertyName=="Link")  || newcrawler.ispage){
				jQuery('#newcrawler-selector').find("input[name='ncx_selectType'][value='@ATTR']").prop('checked', true);
				
				jQuery('#newcrawler-selector').find("select[name='ncx_attr'] option").each(function(){
					var attr=this.value;
					if(attr!=null && attr!=""){
						var content = ncx_et_tool.getContent('@ATTR', attr);
						if(content!=null && content!="" && content.toString().toLowerCase().startsWith("http")){
							jQuery('#newcrawler-selector').find("select[name='ncx_attr']").val(attr);
							if(attr=="href"){
								return false;
							}
						}
					}
				});
				jQuery('#newcrawler-selector').find("select[name='ncx_attr']").change();
			}
		}else{
			if(propertyName=="Headline" || propertyName=="Author"){
				jQuery('#newcrawler-selector').find(".ncx_et_content_inner input[name='ncx_selectType'][value='innerTEXT']").prop('checked', true);
				jQuery('#newcrawler-selector').find(".ncx_et_content_inner input[name='ncx_selectType'][value='innerTEXT']").click();
			}else{
				jQuery('#newcrawler-selector').find(".ncx_et_content_inner input[name='ncx_selectType'][value='innerHTML']").prop('checked', true);
				jQuery('#newcrawler-selector').find(".ncx_et_content_inner input[name='ncx_selectType'][value='innerHTML']").click();
			}
			
		}
	},
	removeNcxText:function(html){
		if(html==null || html==""){
			return "";
		}
		html=html.replaceAll("<ncx-text>", "").replaceAll("</ncx-text>", "");
		
		var propertyName=jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot.active").attr("title");
		if(propertyName=="Headline" || propertyName=="Author"){
			html = html.replace(/(?:\r\n|\r|\n)/g, '');
			html = html.replace(/\s+/g, ' ');
			html=html.trim();
		}
		return html;
	}
};

var ncx_et_tool = {
	targetIndex : 0,
	targetArray : Array(),
	targetNow : Object(),
	targetDataNow : Object(),
	stateChange : 0,
	selectAttr : '',
	xpathArray : Array(),
	csspathArray : Array(),
	xpathArray2 : Array(),
	csspathArray2 : Array(),
	multiSelXpathArray : Array(),
	multiSelCount :0,
	getTargetArray : function(b) {
		ncx_et_tool.targetArray.push(b);
		var c = jQuery(b).parent();
		var a = c.get(0);
		if (ncx_innerFun.isNullOrEmpty(a)) {
			return ncx_et_tool.targetArray;
		}
		return ncx_et_tool.getTargetArray(c);
	},
	add_et : function(b) {
		ncx_et_tool.targetDataNow = Object();
		ncx_et_tool.targetNow = b;
		ncx_et_tool.stateChange = 0;
		jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").remove();
		var a = ncx_et_tool.getcode("et_wrap");
		ncx_innerFun.innerAppend(jQuery('#newcrawler-selector'), a);
		
		ncx_et_tool.install("ncx_et_state_10");
		
		ncx_et_tool.alterInstall(b);
		ncx_et_tool.targetArray = Array();
		ncx_et_tool.getTargetArray(b);
		jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").removeData("child");
		jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").data("child", ncx_et_tool.targetArray);
		
		setTimeout(function(){ ncx_et_tool.init(b); }, 1);
		
	},
	change_et : function(a) {
		ncx_et_tool.targetNow = a;
		ncx_et_tool.init(a);
		var node=jQuery(ncx_et_tool.targetNow).get(0);
		var nodeValue=node.innerHTML;
		
		jQuery('#newcrawler-selector').find(".ncx_et_content_inner input[name='ncx_selectType'][value='innerHTML']").prop('checked', true);
		jQuery('#newcrawler-selector').find(".ncx_et_content_inner input[name='ncx_selectType'][value='innerHTML']").click();
		
		jQuery('#newcrawler-selector').find("#ncx_copy_xpath_tips").text("");
		jQuery('#newcrawler-selector').find("#ncx_copy_xpath_text").css({"background-color":"white"});
		
		jQuery('#newcrawler-selector').find("#ncx_copy_csspath_tips").text("");
		jQuery('#newcrawler-selector').find("#ncx_copy_csspath_text").css({"background-color":"white"});
	},
	init : function(f) {

		var offset=jQuery(f).offset().top;
		var height=jQuery('#newcrawler').outerHeight()/2;
		
		var top = jQuery('#newcrawler').offset().top;
		var top2 = jQuery('#newcrawler').contents().scrollTop();
		
		var c = jQuery(f).offset().top;
		c=c-top2+top;
		
		var b = jQuery(f).offset().left;
		var i = jQuery(f).outerWidth();
		var d = jQuery(f).outerHeight();
		var h = jQuery('#newcrawler').outerHeight();
		var g = jQuery('#newcrawler').outerWidth();
		
		
		var divH=jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").outerHeight();
		
		if (h - c - d < divH) {
			var a = b + i - 400;
			a=b-3;
			var e = c - divH-2;
			if (a <= 0) {
				a = 0;
			}
			if ((a+400) > g) {
				a = b + i - 400+3;
				if (a > g) {
					a = g - 400-10;
				}
			}
			jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").css({
				left : a + "px",
				top : e + "px"
			});
		} else {
			var a = b + i - 400;//397-238=159
			a=b-3;
			var e = c + d + 3;
			if (a <= 0) {
				a = 0;
			}
			if ((a+400) > g) {
				a = b + i - 400+3;//397-238=159
				
				if (a > g) {
					a = g - 400-10;
				}
			}
			jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").css({
				left : a + "px",
				top : e + "px"
			});
		}
		
		jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").css({opacity: "1"});
		
		var element = jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool"), oldTop = element.offset().top;
		var topMargin = 47;
		var oldScrollTop=jQuery(jQuery('#newcrawler').contents()).scrollTop();
		
		jQuery(jQuery('#newcrawler').contents()).on('scroll', function(event) {
	        var newScrollTop = jQuery(this).scrollTop();
	        var st=newScrollTop-oldScrollTop;
	        var newTop=oldTop-st;
	        
	        element.stop(false, false).animate({
	            top: newTop<topMargin? topMargin  : (newTop)
	        }, 0);
	    });
		
	},
	getcode : function(b) {
		var a = "";
		switch (b) {
		case "et_wrap":
			a = "<div class='ncx_edit_tpl_tool' style='opacity: 0;position : absolute; z-index : 999990;' id='ncx_edit_tpl_tool'><ul id='ncx_et_bar' class='ncx_et_bar'>";
			a += "<li class='ncx_col1'><div id='ncx_larger' class='ncx_larger'></div><div id='ncx_smaller' class='ncx_smaller'></div></li>";
			/*a += "<li class='ncx_col2' id='ncx_et_state_2'><span class='ncx_bar_button_tilte'>XPath</span></li>";
			a += "<li class='ncx_col3' id='ncx_et_state_3'><span class='ncx_bar_button_tilte'>CssPath</span></li>";*/
			a += "<li class='ncx_col4' id='ncx_et_state_4'><span class='ncx_bar_button_tilte'>Preview</span></li>";
			a += "</ul><div id='ncx_et_content' class='ncx_et_content'></div></div>";
			break;
		case "et_conetent_inner_20":
			//XPATH
			a = "<div class='ncx_et_content_inner' id='ncx_copy_xpath_container' style='position:relative'>";
			a += "<pre id='ncx_copy_xpath_text' class='ncx_xpath'>xpath express test!!!</pre>";
			a += "<div class='ncx_button'><button id='ncx_copy_xpath_button' class='ncx_xpath_copy'>Copy Selector</button><button class='ncx_et_cancel'></button></div>";
			a += "<div id='ncx_copy_xpath_tips' class='ncx_tips'></div>";
			a += "</div>";
			break;
		case "et_conetent_inner_30":
			//CSSPATH
			a = "<div class='ncx_et_content_inner' id='ncx_copy_csspath_container' style='position:relative'>";
			a += "<pre id='ncx_copy_csspath_text' class='ncx_csspath'>csspath express test!!!</pre>";
			a += "<div class='ncx_button'><button id='ncx_copy_csspath_button' class='ncx_csspath_copy'>Copy Selector</button><button class='ncx_et_cancel'></button></div>";
			a += "<div id='ncx_copy_csspath_tips' class='ncx_tips'></div>";
			a += "</div>";
			break;
		case "et_conetent_inner_40":
			//预览
			a = "<div class='ncx_et_content_inner'>";
			
			a += "<div><input name='ncx_property_name' type='text' value='' placeholder='Property Name' style='vertical-align: middle;height: 25px;'></div>";
			
			a += "<div><pre id='ncx_copy_xpath_text' class='ncx_xpath ncx_expression'>xpath express test!!!</pre></div>";
			//a += "<div><div class='nc_label'>CssPath</div><pre id='ncx_copy_csspath_text' class='ncx_csspath ncx_expression'>csspath express test!!!</pre></div>";
			
			a += "<div style='height: 22px;'>";
			a += "<div style='float:left;margin-left:0px;width:80px;'><input name='ncx_selectType' type='radio' value='outerHTML' style='vertical-align: middle;'><span>outerHTML</span></div>";
			a += "<div style='float:left;margin-left:0px;width:80px;'><input name='ncx_selectType' type='radio' value='innerHTML' style='vertical-align: middle;' checked='checked' ><span>innerHTML</span></div>";
			a += "<div style='float:left;margin-left:0px;width:80px;'><input name='ncx_selectType' type='radio' value='innerTEXT' style='vertical-align: middle;'><span>innerTEXT</span></div>";
			a += "<div style='float:left;margin-left:0px;width:80px;'><input name='ncx_selectType' type='radio' value='@ATTR' style='vertical-align: middle;display:none;'><span><select name='ncx_attr' style='width: 130px;'></select></span></div>";
			a += "</div>";
			a += "<div><pre id='ncx_content_preview' class='ncx_content'></pre></div>";
			
			a += "<div class='ncx_button'>";
			a += "<button id='ncx_copy_xpath_button' class='ncx_xpath_copy'>Copy Selector</button>";
			//a += "<button id='ncx_copy_csspath_button' class='ncx_csspath_copy'>Copy CssPath</button>";
			a += "<button class='ncx_et_cancel'>Cancel</button>";
			a += "<button class='ncx_et_create'>OK</button>";
			a += "</div>";
			
			a += "<div class='ncx_tips'></div></div>";
			break;
		}
		return a;
	},
	installCopy :function(){
		//csspath
		var csspathCopy = new ZeroClipboard( document.getElementById("ncx_copy_csspath_button") );
		csspathCopy.on( 'ready', function(event) {
			csspathCopy.on( 'copy', function(event) {
				event.clipboardData.setData('text/plain', jQuery('#newcrawler-selector').find("#ncx_copy_csspath_text").text());
		    });
			csspathCopy.on( 'aftercopy', function(event) {
				jQuery('#newcrawler-selector').find(".ncx_et_content_inner .ncx_tips").text("Copied CssPath.");
				jQuery('#newcrawler-selector').find(".ncx_et_content_inner .ncx_expression").css({"background-color":"white"});
				jQuery('#newcrawler-selector').find("#ncx_copy_csspath_text").css({"background-color":"rgb(236, 248, 233)"});
		    });
		});
		
		//xpath
		var xpathCopy = new ZeroClipboard( document.getElementById("ncx_copy_xpath_button") );
		xpathCopy.on( 'ready', function(event) {
			xpathCopy.on( 'copy', function(event) {
				event.clipboardData.setData('text/plain', jQuery('#newcrawler-selector').find("#ncx_copy_xpath_text").text());
		    });
			xpathCopy.on( 'aftercopy', function(event) {
				jQuery('#newcrawler-selector').find(".ncx_et_content_inner .ncx_tips").text("Copied XPath.");
				jQuery('#newcrawler-selector').find(".ncx_et_content_inner .ncx_expression").css({"background-color":"white"});
				jQuery('#newcrawler-selector').find("#ncx_copy_xpath_text").css({"background-color":"rgb(236, 248, 233)"});
		    });
		});
	},
	getContent:function(selectType, attr){
		if(selectType=="@ATTR" && !attr){
			attr=jQuery('#newcrawler-selector').find(".ncx_et_content_inner select[name='ncx_attr']").val();
		}
		
		var text="";
		var multiSelXpathArray=ncx_et_tool.multiSelXpathArray;
		for(var i in multiSelXpathArray){
			var checkArray=multiSelXpathArray[i].slice();
			
			for(var ic=0, icLen=checkArray.length; ic<icLen; ic++){
	     		if(checkArray[ic].indexOf(":nth-of-type(*)")!=-1 ){
	     			checkArray[ic]=ncx_et_tool.xpathArray2[ic];
	 			}
			}
			var xpath=checkArray.join('');
			var contents = jQuery('#newcrawler').contents().find(xpath);
			if(contents.length>0){
				var data="";
				if(selectType=="@ATTR"){
					if(attr){
						data=contents.prop(attr);
						if (data==null || data==undefined || data==""){
							data=contents.attr(attr);
						}
					}
				}else{
					var node=contents.get(0);
					switch (selectType) {
					case "outerHTML":
						var nodeValue=node.outerHTML;
						data=nodeValue;
						break;
					case "innerHTML":
						var nodeValue=node.innerHTML;
						data=nodeValue;
						break;
					case "innerTEXT":
						var nodeValue=contents.text();
						data=nodeValue;
						break;
					}
				}
				if (data!=null && data!=undefined && data!=""){
					if(text!=""){
						text+='\r\n';
					}
					text+=data;
				}
			}
		}
		text=ncx_innerFun.removeNcxText(text);
		return text;
	},
	install : function(b) {
		jQuery('#newcrawler-selector').find("#ncx_et_bar").removeClass("ncx_shape1");
		jQuery('#newcrawler-selector').find(".ncx_bar_button_tilte").removeClass("ncx_on");
		jQuery('#newcrawler-selector').find("#ncx_et_content").removeClass("ncx_shape1");
		jQuery('#newcrawler-selector').find("#ncx_et_content").empty();
		switch (b) {
		case "ncx_et_state_10":
			jQuery('#newcrawler-selector').find("#ncx_et_bar").addClass("ncx_shape1");
			break;
		case "ncx_et_state_20":
			jQuery('#newcrawler-selector').find("#ncx_et_bar").addClass("ncx_shape1");
			jQuery('#newcrawler-selector').find(".ncx_col2 > .ncx_bar_button_tilte").addClass("ncx_on");
			jQuery('#newcrawler-selector').find("#ncx_et_content").addClass("ncx_shape1");
			var a = ncx_et_tool.getcode("et_conetent_inner_20");
			ncx_innerFun.innerAppend(jQuery('#newcrawler-selector').find("#ncx_et_content"), a);
			
			var xpath=ncx_et_tool.readCssPath(jQuery(ncx_et_tool.targetNow).get(0));
			jQuery('#newcrawler-selector').find("#ncx_copy_xpath_text").text(xpath);
			ncx_et_tool.installCopy();
			break;
		case "ncx_et_state_30":
			jQuery('#newcrawler-selector').find("#ncx_et_bar").addClass("ncx_shape1");
			jQuery('#newcrawler-selector').find(".ncx_col3 > .ncx_bar_button_tilte").addClass("ncx_on");
			jQuery('#newcrawler-selector').find("#ncx_et_content").addClass("ncx_shape1");
			var a = ncx_et_tool.getcode("et_conetent_inner_30");
			ncx_innerFun.innerAppend(jQuery('#newcrawler-selector').find("#ncx_et_content"), a);
			
			var csspath=ncx_et_tool.readCssPath(jQuery(ncx_et_tool.targetNow).get(0));
			jQuery('#newcrawler-selector').find("#ncx_copy_csspath_text").text(csspath);
			ncx_et_tool.installCopy();
			break;
		case "ncx_et_state_40":
			jQuery('#newcrawler-selector').find("#ncx_et_bar").addClass("ncx_shape1");
			jQuery('#newcrawler-selector').find(".ncx_col4 > .ncx_bar_button_tilte").addClass("ncx_on");
			jQuery('#newcrawler-selector').find("#ncx_et_content").addClass("ncx_shape1");
			var a = ncx_et_tool.getcode("et_conetent_inner_40");
			ncx_innerFun.innerAppend(jQuery('#newcrawler-selector').find("#ncx_et_content"), a);
			
			var node=jQuery(ncx_et_tool.targetNow).get(0);
			var nodeValue=node.innerHTML;
			//jQuery('#newcrawler').contents().find("#ncx_content_preview").text(nodeValue);
			
			jQuery('#newcrawler-selector').find(".ncx_et_content_inner select[name='ncx_attr']").unbind('change').change(function() {
				jQuery('#newcrawler-selector').find(".ncx_et_content_inner input[name=ncx_selectType][value='@ATTR']").prop('checked', true);
				if(this.value==""){
					jQuery('#newcrawler-selector').find(".ncx_et_content_inner input[name=ncx_selectType][value='innerHTML']").prop('checked', true);
					jQuery('#newcrawler-selector').find(".ncx_et_content_inner input[name=ncx_selectType][value='innerHTML']").click();
					return;
				}
				var content = ncx_et_tool.getContent('@ATTR');
				jQuery('#newcrawler-selector').find("#ncx_content_preview").text(content);

			});
			
			jQuery('#newcrawler-selector').find(".ncx_et_content_inner input[name=ncx_selectType]").unbind('click').click(function() {
				jQuery('#newcrawler-selector').find(".ncx_et_content_inner select[name='ncx_attr']").val("");
				var selectType=jQuery(this).val();
				var content = ncx_et_tool.getContent(selectType);
				jQuery('#newcrawler-selector').find("#ncx_content_preview").text(content);
			});
			
			
			ncx_et_tool.installCopy();
			break;
		}
		jQuery('#newcrawler-selector').find(".ncx_et_cancel").unbind('click').click(function() {
			ncx_innerFun.closeCover();
		});
		
		jQuery('#newcrawler-selector').find(".ncx_et_create").unbind('click').click(function() {
			ncx_et_tool.saveLabel();
		});
		
	},
	saveLabel:function(){
		var xpath=ncx_et_tool.xpathArray.join('');
		var index=jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot.active").attr("lang");
		var selectType=jQuery('#newcrawler-selector').find("input[name=ncx_selectType]:checked").val();
		var selectAttr=jQuery('#newcrawler-selector').find("select[name='ncx_attr']").val();
		
		var propertyName=jQuery('#newcrawler-selector').find("input[name=ncx_property_name]").val();
		if(propertyName==null || propertyName==""){
			propertyName="property";
			if(newcrawler.ispage){
				index=0;
				propertyName="pagination";
			}else{
				for(var n=index; n<500; n++){
					propertyName="property"+n;
					var isExist=false;
					for(var i=1, len=newcrawler.fieldArray.length; i<len; i++){
						if(propertyName==newcrawler.fieldArray[i].name){
							isExist=true;
							break;
						}
					}
					if(!isExist){
						break;
					}
				}
			}
		}
		
		ncx_et_tool.createLabel(null, index, propertyName, xpath, ncx_et_tool.xpathArray, selectType, newcrawler.ispage, selectAttr, ncx_et_tool.multiSelXpathArray);
		ncx_innerFun.closeCover();
		
		jQuery("#ncx_toolbar .ncx-datatypes .ncx-label").each(function(){
			if(jQuery(this).hasClass("finished") && jQuery(this).hasClass("active")){
				jQuery(this).removeClass("active").removeClass("edit");
				jQuery(this).mouseout();
			}
		});
		jQuery("#ncx_toolbar .ncx-datatypes .ncx-label.ncx-yellow").addClass("active");
		ncx_innerFun.contrlBtn(false);
	},
	createXpathLabel:function(selectExpress){
		var newXpathArray=[];
		var xpathArray=selectExpress.split("/");
		for(var j=1, len=xpathArray.length; j<len; j++){
			if(xpathArray[j]==""){
				continue;
			}
			if(xpathArray[j].indexOf("*") === 0){
				newXpathArray.push("//"+xpathArray[j]);
			}else{
				newXpathArray.push("/");
				newXpathArray.push(xpathArray[j]);
			}
		}
		return newXpathArray;
	},
	createCSSpathLabel:function(selectExpress){
		var multiSelXpathArray=[];
		var multiSelectExpress=selectExpress.split("|");
		var xpath='';
		var newXpathArray=[];
		for(var i in multiSelectExpress){
			xpath=multiSelectExpress[i];
			newXpathArray=[];
			
			var xpathArray=multiSelectExpress[i].split(" > ");
			for(var j=0, len=xpathArray.length; j<len; j++){
				if(xpathArray[j]==""){
					continue;
				}
				newXpathArray.push(" > ");
				newXpathArray.push(xpathArray[j]);
			}
			if(newXpathArray[0]==' > '){
				newXpathArray=newXpathArray.slice(1);
	        }
			
			multiSelXpathArray.push(newXpathArray);
		}
		var labelObj={multiSelXpathArray:multiSelXpathArray, xpathArray:newXpathArray, xpath:xpath};
		return labelObj;
	},
	createLabel:function(id, index, name, xpath, xpathArray, selectType, ispage, selectAttr, multiSelXpathArray){
		if(ispage){
			newcrawler.fieldArray[0]={id:id, index:0, name:name, xpath:xpath, xpathArray:xpathArray, selectType:selectType, selectAttr:selectAttr, multiSelXpathArray:multiSelXpathArray};
		}else{
			var queryXpath=xpath.replace(":nth-of-type(*)", "");
			var elements = jQuery('#newcrawler').contents().find(queryXpath);
			var eleCount=0;
			
			for(var i=0, len=multiSelXpathArray.length; i<len; i++){
				var queryXpath=multiSelXpathArray[i].join('').replace(":nth-of-type(*)", "");
				var elements = jQuery('#newcrawler').contents().find(queryXpath);
				eleCount+=elements.length;
			}
			
			var isFinished=jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot.active").hasClass("finished");
			if(isFinished){
				var lang=jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot.active").attr("lang");
				//update
				for(var i=1, len=newcrawler.fieldArray.length; i<len; i++){
					var index=newcrawler.fieldArray[i].index;
					if(lang!=index){
						continue;
					}
					newcrawler.fieldArray[i].xpath=xpath;
					newcrawler.fieldArray[i].xpathArray=xpathArray;
					newcrawler.fieldArray[i].selectType=selectType;
					newcrawler.fieldArray[i].selectAttr=selectAttr;
					newcrawler.fieldArray[i].multiSelXpathArray=multiSelXpathArray;
					break;
				}
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot.active .ncx-count").attr("lang", eleCount);
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot.active .ncx-count").text(eleCount);
			}else{
				//create
				jQuery('<a lang="'+newcrawler.index+'" class="ncx-label ncx-data-dot ncx-blue finished" title="'+name+'"><span class="ncx-count" lang="'+eleCount+'">'+eleCount+'</span><span class="ncx-delete-datatype" style="display: none;"></span></a>').insertBefore(jQuery("#ncx_toolbar .ncx-datatypes .ncx-label.ncx-yellow.active"));
				newcrawler.fieldArray.push({id:id, index:index, name:name, xpath:xpath, xpathArray:xpathArray, selectType:selectType, selectAttr:selectAttr, multiSelXpathArray:multiSelXpathArray});
				newcrawler.index=newcrawler.index+1;
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot.ncx-yellow.active").attr("lang", newcrawler.index);
			}
			newcrawler.addFieldMap(name);
		}
		jQuery("#ncx_toolbar .save").attr("disabled", false);
		newcrawler.labelEvent();
	},
	larger: function(){
		var b = jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").data("child");
		if (ncx_et_tool.targetIndex < b.length) {
			ncx_et_tool.targetIndex++
		}
		var a = b[ncx_et_tool.targetIndex];
		if (!ncx_innerFun.isNullOrEmpty(a)) {
			ncx_et_tool.readCssPath(jQuery(a).get(0));
			ncx_innerFun.selectHighlight(jQuery(a).get(0), 2, false);
		}
	},
	smaller: function(){
		var b = jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").data("child");
		if (ncx_et_tool.targetIndex > 0) {
			ncx_et_tool.targetIndex--
		}
		var a = b[ncx_et_tool.targetIndex];
		if (!ncx_innerFun.isNullOrEmpty(a)) {
			ncx_et_tool.readCssPath(jQuery(a).get(0));
			ncx_innerFun.selectHighlight(jQuery(a).get(0), 2, false);
		}
	},
	readXPath:function (element) {
		var originElement=element;
		ncx_et_tool.xpathArray = [];
		ncx_et_tool.xpathArray2 = [];
        for (; element && element.tagName !== undefined; element = element.parentNode) {
        	var tagName = element.tagName;
        	if (!tagName) break;
        	tagName = tagName.toLowerCase();
        	
        	if (element.id=="ncx_cover-container" ) {
				continue;
			}
            var parentEle = jQuery(element).parent();
            var sameTagSiblings = parentEle.children(tagName).not("#ncx_cover-container");
            var len=sameTagSiblings.length;
            
            var tagNth="";
        	var tagNth2="";
        	
            if (len > 1) {
            	for(var index=0;index<len;index++){
            		var element2=sameTagSiblings[index];
            		if(ncx_et_tool.isSame(element, element2)){
            			if(tagNth==""){
            				tagNth = '[' + (index+1) + ']';
            			}
            			tagNth2 = '[' + (index+1) + ']';
            			continue;
            		}
            		
            		if(tagNth!='[*]' && ncx_et_tool.xpathArray.length>0){
            			var subXpathExpress=ncx_et_tool.xpathArray2.join('');
            			var subNodesSnapshot = document.evaluate(subXpathExpress, element2, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
                        var subCount=subNodesSnapshot.snapshotLength;
                        if(subCount>0){
                        	if(subCount>0){
                        		tagNth = '[*]';
                            	continue;
                        	}
                        }
            		}
            	}
            }
            
            if(tagNth!='[*]'){
            	var isUseID=false;
            	var attr="id";
            	var attr_value="";
            	if (element.id && !/\s/.test(element.id)) {
            		isUseID=true;
            		attr_value=element.id;
            	}else if (element.className && !/\s/.test(element.className)) {
            		isUseID=true;
            		attr="class";
            		attr_value=element.className;
            	}
            	
            	if (isUseID) {
            		if(newcrawler.ispage){
            			isUseID=false;
            			for(var ii=0, iiLen=ncx_et_tool.xpathArray.length; ii<iiLen; ii++){
            				if(ncx_et_tool.xpathArray[ii]=='a' 
            					|| ncx_et_tool.xpathArray[ii].indexOf('a[')==0){
            					isUseID=true;
            					break;
                			}
            			}
            		}
            		
            		if(isUseID){
                        var checkArray=ncx_et_tool.xpathArray.slice(0);//从已有的数组中返回选定的元素。
                    	for(var ic=0, icLen=checkArray.length; ic<icLen; ic++){
            				if(checkArray[ic].indexOf("[*]")!=-1 ){
            					checkArray[ic]=ncx_et_tool.xpathArray2[ic];
                			}
            			}
                    	
                    	var xpathExpressId='//*[@'+attr+'=\"' + attr_value + '\"]';
                    	checkArray.unshift(xpathExpressId);//向数组的开头添加一个或更多元素，并返回新的长度。
                        var xpathExpress=checkArray.join('');
                        nodesSnapshot = document.evaluate(xpathExpress, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
                        if(nodesSnapshot.snapshotLength<=1){
                        	if(newcrawler.fieldArray.length>1){
                        		var compareXpathExpressId=newcrawler.fieldArray[1].xpathArray[0];
                            	if(xpathExpressId==compareXpathExpressId){
                            		ncx_et_tool.xpathArray.unshift(xpathExpressId);
                                	ncx_et_tool.xpathArray2.unshift(xpathExpressId);
                                	break;
                            	}
                        	}else{
                        		ncx_et_tool.xpathArray.unshift(xpathExpressId);
                            	ncx_et_tool.xpathArray2.unshift(xpathExpressId);
                            	break;
                        	}
                        	
                        }
            		}
                }
            	
            }else if(tagNth==""){
            	tagNth = '[1]';
            	tagNth2 = '[1]';
            }
            if(tagName=="html" || tagName=="body"){
            	tagNth="";
            	tagNth2="";
            }
            tagNth=tagName + tagNth;
        	tagNth2=tagName + tagNth2;
        	
            ncx_et_tool.xpathArray.unshift(tagNth);
            ncx_et_tool.xpathArray.unshift('/');
            
            ncx_et_tool.xpathArray2.unshift(tagNth2);
            ncx_et_tool.xpathArray2.unshift('/');
        }
        return ncx_et_tool.xpathArray.join('');
    },
    isSame:function(el1, el2) {
    	if(el1==undefined || el2==undefined){
    		return false;
    	}
    	var n=el1.compareDocumentPosition(el2);
    	if(n==0){
    		return true;
    	}
        return false;
    },
	readCssPath:function (element) {
		var originElement=element;
		ncx_et_tool.xpathArray = [];
		ncx_et_tool.xpathArray2 = [];
		
        for (; element && element.tagName !== undefined; element = element.parentNode) {
        	var tagName = element.tagName;
        	if (!tagName) break;
        	tagName = tagName.toLowerCase();
        	
        	if (element.id=="ncx_cover-container") {
				continue;
			}
        	
        	var parentEle = jQuery(element).parent();
            var sameTagSiblings = parentEle.children(tagName).not("#ncx_cover-container");
            var len=sameTagSiblings.length;
            
            var tagNth="";
        	var tagNth2="";
        	
            if (len > 1) {
            	for(var index=0;index<len;index++){
            		var element2=sameTagSiblings[index];
            		if(ncx_et_tool.isSame(element, element2)){
            			if(tagNth==""){
            				tagNth = ':nth-of-type(' + (index+1) + ')';
            			}
            			tagNth2 = ':nth-of-type(' + (index+1) + ')';
            			continue;
            		}
            		
            		if(tagNth!=':nth-of-type(*)'){
            			if(ncx_et_tool.xpathArray.length>0){
            				var subXpathExpress=ncx_et_tool.xpathArray2.join('');
                			var subNodesSnapshot = jQuery(element2).find(subXpathExpress);
                            var subCount=subNodesSnapshot.length;
                            if(subCount>0){
                            	if(subCount>0){
                            		tagNth = ':nth-of-type(*)';
                                	continue;
                            	}
                            }
            			}else{
            				tagNth = ':nth-of-type(*)';
                        	continue;
            			}
            		}
            	}
            }
            
            if(tagNth==""){
            	tagNth = '';
            	tagNth2 = '';
            }
            if(tagName=="html" || tagName=="body"){
            	tagNth="";
            	tagNth2="";
            }
            
        	var eleLen=ncx_et_tool.checkLength(tagName);
        	var eleClassName=element.className;
        	var eleId=element.id;
        	
        	if (eleClassName) {
        		var eleClassNames=eleClassName.split(" ");
        		var newClassName=null;
        		for(var i=0, len=eleClassNames.length; i<len; i++){
        			if (eleClassNames[i]!="" && eleClassNames[i]!="ncx-cursor-add" && !/\d+/.test(eleClassNames[i])) {
        				if(newClassName==null){
        					newClassName=eleClassNames[i];
        					break;
        				}
        			}
        		}
        		eleClassName=newClassName;
        	}
        	
            var isUseID=false;
        	var attr="#";
        	var attr_value="";
        	if (eleClassName && !/\s/.test(eleClassName)) {
        		isUseID=true;
        		attr=".";
        		attr_value=eleClassName;
        	}else if (element.id && !/\s/.test(element.id)) {
        		isUseID=true;
        		attr_value=element.id;
        		if(!isNaN(attr_value)){
        			attr_value="\\3"+element.id;
        		}
        	}
        	
        	if (isUseID) {
        		if(newcrawler.ispage){
        			isUseID=false;
        			for(var ii=0, iiLen=ncx_et_tool.xpathArray.length; ii<iiLen; ii++){
        				if(ncx_et_tool.xpathArray[ii]=='a' 
        					|| ncx_et_tool.xpathArray[ii].indexOf('a[')==0){
        					isUseID=true;
        					break;
            			}
        			}
        		}
        		var selector;
        		var selector2;
        		if(isUseID){
        			selector=tagName+attr + attr_value + tagNth;
        			selector2=tagName+attr + attr_value + tagNth2;
        			
        			var selector3=tagName+attr + attr_value;
        			
        			var eleLenWithId=ncx_et_tool.checkLength(selector3);
        			
                    if(eleLenWithId==eleLen || eleLenWithId==1){
                    	var checkArray=ncx_et_tool.xpathArray.slice(0);//从已有的数组中返回选定的元素。
                    	var checkArray2=ncx_et_tool.xpathArray2.slice(0);//从已有的数组中返回选定的元素。
                    	
                    	if(ncx_et_tool.isSamePrefixFun(selector3, checkArray, checkArray2)){
                    		if(!newcrawler.ispage && newcrawler.fieldArray.length>1){
                        		var compareXpathExpressId=newcrawler.fieldArray[1].xpathArray[0];
                            	if(selector==compareXpathExpressId){
                            		ncx_et_tool.xpathArray.unshift(selector);
                                	ncx_et_tool.xpathArray2.unshift(selector2);
                                	break;
                            	}
                        	}else{
                        		ncx_et_tool.xpathArray.unshift(selector);
                            	ncx_et_tool.xpathArray2.unshift(selector2);
                            	break;
                        	}
                    	}
                    }
                    ncx_et_tool.xpathArray.unshift(selector);
                    ncx_et_tool.xpathArray.unshift(' > ');
                    
                	ncx_et_tool.xpathArray2.unshift(selector2);
                	ncx_et_tool.xpathArray2.unshift(' > ');
                	continue;
        		}
            }
            ncx_et_tool.xpathArray.unshift(tagName + tagNth);
            ncx_et_tool.xpathArray.unshift(' > ');
            
            ncx_et_tool.xpathArray2.unshift(tagName + tagNth2);
            ncx_et_tool.xpathArray2.unshift(' > ');
        }
        if(ncx_et_tool.xpathArray[0]==' > '){
        	ncx_et_tool.xpathArray=ncx_et_tool.xpathArray.slice(1);
        	ncx_et_tool.xpathArray2=ncx_et_tool.xpathArray2.slice(1);
        }
       
        var selectorCss=ncx_et_tool.xpathArray.join('');

        if(ncx_et_tool.multiSelXpathArray.length>0 || newcrawler.fieldArray.length>1){
        	for(var i=0, iLen=ncx_et_tool.xpathArray.length; i<iLen; i++){
    			if(ncx_et_tool.xpathArray[i].indexOf(":nth-of-type(*)")!=-1){
    				var xpathArray=ncx_et_tool.xpathArray2.slice(0);
            		var xpathArray2=ncx_et_tool.xpathArray2.slice(0);
            		
            		xpathArray[i]=ncx_et_tool.xpathArray[i];
    				if(!ncx_et_tool.isSamePrefixFun('', xpathArray, xpathArray2)){
    					ncx_et_tool.xpathArray[i]=ncx_et_tool.xpathArray2[i];
    				}
    			}
    		}
        	
        	var tempXpathArray=ncx_et_tool.multiSelXpathArray[0];
        	if(newcrawler.fieldArray.length>1){
        		tempXpathArray=newcrawler.fieldArray[1].xpathArray;
        	}
        	var isSamePrefix=true;
        	for(var i=0, iLen=ncx_et_tool.xpathArray.length; i<iLen; i++){
        		if((i>tempXpathArray.length || tempXpathArray[i]!=ncx_et_tool.xpathArray[i])){
        			isSamePrefix=false;
        		}
        		if(!isSamePrefix && ncx_et_tool.xpathArray[i].indexOf(":nth-of-type(*)")!=-1){
        			ncx_et_tool.xpathArray[i]=ncx_et_tool.xpathArray2[i];
        		}
        	}
        }
        var selectorCss=ncx_et_tool.xpathArray.join('');
        return selectorCss;
    },
    isSamePrefixFun:function(selector, xpathArray, xpathArray2){
    	var tempParentEle=null;
    	var tempXpathArray=null;
    	if(ncx_et_tool.multiSelXpathArray.length>0 || newcrawler.fieldArray.length>1){
        	tempXpathArray=ncx_et_tool.multiSelXpathArray[0];
        	if(newcrawler.fieldArray.length>1){
        		tempXpathArray=newcrawler.fieldArray[1].xpathArray;
        	}
    	}
    	if(tempXpathArray!=null){
    		var selector2=tempXpathArray.join('').replace(":nth-of-type(*)", "");
    		jQuery('#newcrawler').contents().find(selector2).each(function(){
    			tempParentEle=ncx_et_tool.getParentElement(this, tempXpathArray);
    			return false;
            });
    	}
        
    	var hasDifferenceParent=false;
    	if(selector!=null && selector!=""){
    		xpathArray.unshift(selector);//向数组的开头添加一个或更多元素，并返回新的长度。
    	}
    	var hasStar=false;
    	for(var ic=0, icLen=xpathArray.length; ic<icLen; ic++){
     		if(xpathArray[ic].indexOf(":nth-of-type(*)")!=-1){
     			hasStar=true;
     			var checkArray2=xpathArray2.slice(0);
     			if(selector!=null && selector!=""){
     				checkArray2.unshift(selector);//向数组的开头添加一个或更多元素，并返回新的长度。
     			}
     			checkArray2[ic]=xpathArray[ic];
     			
     			var parentEle=null;
     			var selector2=checkArray2.join('').replace(":nth-of-type(*)", "");
        		jQuery('#newcrawler').contents().find(selector2).each(function(){
        			parentEle=ncx_et_tool.getParentElement(this, checkArray2);
        			if(tempParentEle==null){
        				tempParentEle=parentEle;
        				return;
        			}
        			if(parentEle!=null && tempParentEle!=null){
            			if(!ncx_et_tool.isSame(tempParentEle[0], parentEle[0])){
            				hasDifferenceParent=true;
            				return false;
            			}
            		}
                });
     		}
    	}
    	if(!hasStar){
    		var selector2=xpathArray.join('');
    		jQuery('#newcrawler').contents().find(selector2).each(function(){
    			parentEle=ncx_et_tool.getParentElement(this, xpathArray);
    			if(tempParentEle==null){
    				tempParentEle=parentEle;
    				return;
    			}
    			if(parentEle!=null && tempParentEle!=null){
        			if(!ncx_et_tool.isSame(tempParentEle[0], parentEle[0])){
        				hasDifferenceParent=true;
        				return false;
        			}
        		}
            });
    	}
    	return !hasDifferenceParent;
    },
    getParentElement:function(obj, checkArray){
    	var len=checkArray.length;
    	var nodeCount=len/2-1;
    	var parentEle=jQuery(obj).parent();
    	for(var i=0; i<nodeCount; i++){
    		parentEle=jQuery(parentEle).parent();
    	}
    	return parentEle;
    },
    checkLength:function(selector){
    	var checkArray=ncx_et_tool.xpathArray.slice(0);//从已有的数组中返回选定的元素。
     	for(var ic=0, icLen=checkArray.length; ic<icLen; ic++){
     		if(checkArray[ic].indexOf(":nth-of-type(*)")!=-1 ){
     			checkArray[ic]=ncx_et_tool.xpathArray2[ic];
 			}
		}
     	checkArray.unshift(selector);//向数组的开头添加一个或更多元素，并返回新的长度。
     	
     	selector=checkArray.join('');
        var nodesSnapshot = jQuery('#newcrawler').contents().find(selector);
        return nodesSnapshot.length;
    },
	alterInstall : function() {
		jQuery('#newcrawler-selector').find("#ncx_larger").mouseover(function() {
			jQuery(this).addClass("ncx_on");
		});
		jQuery('#newcrawler-selector').find("#ncx_smaller").mouseover(function() {
			jQuery(this).addClass("ncx_on");
		});
		jQuery('#newcrawler-selector').find("#ncx_larger").mouseout(function() {
			jQuery(this).removeClass("ncx_on");
		});
		jQuery('#newcrawler-selector').find("#ncx_smaller").mouseout(function() {
			jQuery(this).removeClass("ncx_on");
		});
		jQuery('#newcrawler-selector').find(".ncx_bar_button_tilte").mouseover(function() {
			jQuery(this).addClass("ncx_onhover");
		});
		jQuery('#newcrawler-selector').find(".ncx_bar_button_tilte").mouseout(function() {
			jQuery(this).removeClass("ncx_onhover");
		});
		jQuery('#newcrawler-selector').find("#ncx_larger").unbind('click').click(function() {
			ncx_et_tool.larger();
		});
		jQuery('#newcrawler-selector').find("#ncx_smaller").unbind('click').click(function() {
			ncx_et_tool.smaller();
		});
		jQuery('#newcrawler-selector').find("#ncx_et_state_2").unbind('click').click(function() {
			ncx_et_tool.install("ncx_et_state_20");
		});
		jQuery('#newcrawler-selector').find("#ncx_et_state_3").unbind('click').click(function() {
			ncx_et_tool.install("ncx_et_state_30");
		});
		jQuery('#newcrawler-selector').find("#ncx_et_state_4").unbind('click').click(function() {
			ncx_et_tool.install("ncx_et_state_40");
		});
		
		jQuery('#newcrawler-selector').find("#ncx_et_state_4").trigger("click");
		
		jQuery('#newcrawler-selector').find("#ncx_edit_tpl_tool").drags({handle:".ncx_et_bar"});
	}
};

String.prototype.replaceAll = function(b, a) {
	return this.replace(new RegExp(b, "gm"), a);
};

var newcrawler = {
		dragging:null,
	index:1,
	ispage:false,
	fieldArray:Array(),
	allowScale : 1,
	webCrawlerId : null,
	siteId : null,
	rulesVerId : null,
	pageNum:0,
	pageSize:20,//GAE limit max 30
	total:0,
	jsonData:null,
	url:null,
	crawlDataLog:null,
	pageX:null,
	pageY:null,
	message:function(action, message, time, style) {
		
		var msgBox = document.getElementById('ncx_message-box');
		if(!msgBox){
			var xpathNode='<div id="ncx_message-box" style="border-radius: 2px;padding: 5px 15px; font-size: 12px; font-color: #333; font-weight: bold; position: fixed!important; top: 50px; left: 50%; z-index: 2147483500; display: none;"></div>';
	    	
			var e = document.createElement('div');
			e.innerHTML = xpathNode;
			document.body.appendChild(e.firstChild);
			
	    	msgBox = document.getElementById('ncx_message-box');
		}else{
			msgBox.innerHTML = '';
			msgBox.style.display = 'none';
		}
		if (action == 'hide') {
			msgBox.innerHTML = '';
			msgBox.style.display = 'none';
			return;
		}
		
		if (action == 'show') {
			msgBox.innerHTML = message;
			msgBox.style.display = 'block';
			msgBox.style.marginLeft = -((msgBox.clientWidth) / 2) + 'px';
		} else if (action == 'fade') {
			msgBox.innerHTML = message;
			msgBox.style.display = 'block';
			msgBox.style.marginLeft = -((msgBox.clientWidth) / 2) + 'px';
			setTimeout(function(){
				newcrawler.message('hide');
			}, time);
		}
		jQuery(document).find("#ncx_message-box").removeClass("message_red");
		jQuery(document).find("#ncx_message-box").removeClass("message_green");
		jQuery(document).find("#ncx_message-box").removeClass("message_yellow");
		
		if(style=="red"){
			jQuery(document).find("#ncx_message-box").addClass("message_red");
		}else if(style=="green"){
			jQuery(document).find("#ncx_message-box").addClass("message_green");
		}else{
			jQuery(document).find("#ncx_message-box").addClass("message_yellow");
		}
		
	},
	cover : '<div id="ncx_cover-container">'
			+ '<div id="ncx_curlCover" class="ncx_curlCover"  style="z-index : 1999999999; filter:Alpha(Opacity=100); -moz-opacity: 1; opacity: 1;  pointer-events:none; text-align: left; background : transparent;top:0;left:0;position:absolute;overflow:hidden;">'
			+ '</div></div>',
	after : function() {
		
		jQuery('#newcrawler').contents().find('body').append(newcrawler.cover);
		jQuery('#newcrawler').contents().find('body').css({"cursor" : "pointer"});
		
		document.title="New Crawler™ "+jQuery('#newcrawler').contents().find("title").text();
		newcrawler.webCrawlerId=newcrawler.getUrlParameter("webCrawlerId");
		newcrawler.siteId=newcrawler.getUrlParameter("siteId");
		newcrawler.rulesVerId=newcrawler.getUrlParameter("rulesVerId");

		
		var b = jQuery('#newcrawler').contents().height();
		var d = jQuery('#newcrawler').contents().width();
		if (d < 600) {
			d = 980;
		}
		var a = d + 8;
		var c = b + 8;
		jQuery('#newcrawler').contents().find("#ncx_curlCover").css({
			width : d,
			height : b + 8
		});
	},
	event : function(){
		jQuery('#newcrawler').contents().find("*").unbind();
		jQuery('#newcrawler').contents().find("a").unbind("click").click(function(){
			return false;
		});
		
		jQuery('#newcrawler').contents().find('body').contents().find('*').each(function(){
			jQuery(this).off();
		});
		
		jQuery('#newcrawler').contents().find('body').contents().find('*').each(function(){
			this.onclick = function(){return false;}
			this.onmouseleave = function(){return false;}
			this.onmousedown = function(){return false;}
			this.onmouseover = function(){return false;}
		});
		
		
		jQuery('#newcrawler').contents().find('body').contents().find('*').not('iframe').contents().filter(function() {
			var isText=(this.nodeType == 3);
			var hasOthers=false;
			var len=jQuery(this).parent().contents().length;
			if(len>1){
				hasOthers=true;
			}
			return (isText && hasOthers);
		}).wrap('<ncx-text></ncx-text>');
		
		jQuery('#newcrawler').contents().find('body').contents().find('*').bind("mouseover", function(f){
			f = f || window.event;
			ncx_traceHighlight.process(f);
			return false;
		})
		
		var ctrlKey = 17,
	        cmdKey = 91,
	        vKey = 86,
	        cKey = 67;
		
		
		$(document).keydown(function(e) {
	        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
	        	 console.log("Ctrl Pressed 1!");
			     ncx_traceHighlight.ctrlDown = !ncx_traceHighlight.ctrlDown;
			     ncx_innerFun.multiSelect();
			     return false;
	        }
	    });
		
		$(document.getElementById('newcrawler').contentWindow.document).keydown(function(){ 
			if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
	        	 console.log("Ctrl Pressed 2!");
			     ncx_traceHighlight.ctrlDown = !ncx_traceHighlight.ctrlDown;
			     ncx_innerFun.multiSelect();
			     return false;
	        }
		});
		
		jQuery('#newcrawler').contents().find("*").each(function(){
			jQuery(this).keydown(function(e) {
		        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
		        	 console.log("Ctrl Pressed 3!");
				     ncx_traceHighlight.ctrlDown = !ncx_traceHighlight.ctrlDown;
				     ncx_innerFun.multiSelect();
				     return false;
		        }
		    });
		});
		
		jQuery('#newcrawler').contents().find('body').contents().find('*').each(function(){
			jQuery(this).unbind('click').click(function(f) {
				f = f || window.event;
				ncx_innerFun.clickSelect(f);
				return false;
			});
		});
	},
	toolbarEvent:function(){
		  var url=decodeURIComponent(newcrawler_fetch_url);
		
		  jQuery("#ncx_toolbar #url").text(url);
		  jQuery("#ncx_toolbar #url").parent().attr("href", url).attr("title", url);
		  
		  jQuery("#ncx_toolbar .ncx-save").unbind('click').click(function(){
			  newcrawler.save(newcrawler_server_url, function(){
				  jQuery("#ncx_toolbar .ncx-cron-config").hide();
				  jQuery("#ncx_toolbar .ncx-setting-config").hide();
			  });
		  });
		  jQuery("#ncx_toolbar .ncx-test").click(function(){
			  jQuery("#ncx_toolview").hide(100);
			  jQuery("#ncx_toolbar .ncx-help-info").hide(100);
			  jQuery("#ncx_tooltest .ncx-content-top-details").hide(100);
			  jQuery("#ncx_toolbar .ncx-test .view-pop").toggle(600);
			  jQuery("#ncx_tooltest").toggle(600, function(){
				  if(jQuery( "#ncx_tooltest" ).is(':visible')){
					  var crawlUrl=jQuery("#ncx_toolbar #url").parent().attr("href");
					  newcrawler.test(crawlUrl);
					  jQuery(window).trigger('resize');
				  }
			  });
		  });
		  jQuery("#ncx_tooltest .ncx-details").click(function(){
			  jQuery("#ncx_tooltest .ncx-content-top-details").toggle(100);
		  });
		  jQuery("#ncx_tooltest .ncx-next").click(function(){
			  var crawlUrl=jQuery("#ncx_tooltest .ncx-details-content .nextUrl").attr("href");
			  if(crawlUrl!=null && crawlUrl!=""){
				  newcrawler.test(crawlUrl);
			  }
		  });
		  
		  jQuery("#ncx_toolbar .ncx-view").click(function(){
			  jQuery("#ncx_tooltest").hide(100);
			  jQuery("#ncx_toolbar .ncx-help-info").hide(100);
			  newcrawler.view();
			  jQuery("#ncx_toolview .ncx-content-top-export").hide(100);
			  
			  jQuery("#ncx_toolbar .ncx-view .view-pop").toggle(600);
			  jQuery("#ncx_toolview").toggle(600, function(){
				  if(jQuery( "#ncx_toolview" ).is(':visible')){
					  document.body.parentNode.style.overflow = "hidden";
					  jQuery("#ncx_toolview #ncx-crawlDataLog").show();
					  
					  newcrawler.crawlDataLog["init"](function(){
						  jQuery(window).trigger('resize');
					  });
					  
					  var items_per_page=jQuery("#ncx_toolview > .ncx-content-top").find("#ncx-pagination-size").val();
					  if(items_per_page==20){
						  newcrawler.refresh();
					  }
					  jQuery(window).trigger('resize');
				  }else{
					  document.body.parentNode.style.overflow = "auto";
					  jQuery("#ncx_toolview #ncx-crawlDataLog").hide();
					  newcrawler.crawlDataLog["destory"]();
				  }
				 
			  });
		  });
		  
		  jQuery(window).resize(function() {
			  var w = window,
			  d = document,
			  e = d.documentElement,
			  g = d.getElementsByTagName('body')[0],
			  x = w.innerWidth || e.clientWidth || g.clientWidth,
			  y = w.innerHeight|| e.clientHeight|| g.clientHeight;
			  
			  var height=y - 46;
			  var width=x-50;
			  jQuery('#ncx_toolview').outerWidth(width);
			  jQuery('#ncx_toolview').outerHeight(height);
			  jQuery('#ncx_tooltest').outerWidth(width);
			  jQuery('#ncx_tooltest').outerHeight(height);
			  
			  jQuery('.ncx-content-bottom').outerHeight(height-jQuery('.ncx-content-top').outerHeight(true));
			  jQuery('.logsViewConsoleWindow').outerHeight( jQuery('.ncx-content-bottom').outerHeight(true)- jQuery('#ncx_toolview #ncx-crawlDataLog').outerHeight(true));
		  });
		  jQuery("#ncx_toolbar .ncx-js .isJavaScript").unbind('click').click(function(){
			  newcrawler.save(newcrawler_server_url, function(){
				  top.window.location.href=newcrawler.url;
			  });
		  });
		  
		  jQuery("#ncx_toolview .ncx-refresh").click(function(){
			  newcrawler.refresh();
		  });
		  
		  jQuery("#ncx_toolview .ncx-export").click(function(){
			  if(jQuery("#ncx_toolview .ncx-export-window").is(':visible')){
				  jQuery("#ncx_toolview .ncx-export-window").hide(100);
			  }else{
				  jQuery("#ncx_toolview .ncx-content-top-export").toggle(100);
			  }
		  });
		  
		  jQuery("#ncx_toolview .ncx-export-plotly").click(function(){
			  var data=newcrawler.plot();
			  
			  var hiddenForm = jQuery('<div id="hiddenform" style="display:none;">'+
				        '<form action="https://plot.ly/datagrid" method="post" target="_blank" accept-charset="utf-8">'+
				        '<input type="text" name="data" /></form></div>').appendTo('body');
			  var graphData = JSON.stringify(data);
			  hiddenForm.find('input').val(graphData);
			  hiddenForm.find('form').submit();
			  hiddenForm.remove();
		  });

		  jQuery("#ncx_toolview .ncx-export-coding").click(function(){
			  if(newcrawler.siteId!=null && newcrawler.siteId!=""){
				  var exportUrl=newcrawler_app_url+"api/data/export?siteId="+newcrawler.siteId+"&pageNum="+(newcrawler.pageNum+1)+"&type=json";
				  
				  jQuery("#ncx_toolview .ncx-export-coding").attr("href", exportUrl);
			  }
		  });
		  jQuery("#ncx_toolview .ncx-export-window .close").click(function(){
			  jQuery("#ncx_toolview .ncx-content-top").show();
			  jQuery("#ncx_toolview .ncx-content-bottom").show();
			  jQuery("#ncx_toolview .ncx-export-window").hide(400);
		  });
		  
		  jQuery("#ncx_toolview .ncx-export-rss.ncx-export-icon").click(function(){
			  
			  jQuery("#ncx_toolview .ncx-content-top-export").hide();
			  jQuery("#ncx_toolview .ncx-content-top").hide();
			  jQuery("#ncx_toolview .ncx-content-bottom").hide();
			  
			  jQuery("#ncx_toolview .ncx-export-window-rss").toggle(600, function(){
				  if(jQuery("#ncx_toolview .ncx-export-window-rss").is(':visible')){
					  
					  
					  var title=jQuery("#ncx_toolview .ncx-export-window-rss .title").text();
					  
					  if(newcrawler.siteId!=null && newcrawler.siteId!=""){
						  
						  newcrawler.jsonrpc["crawlDataExportService"]["query"](
									function(result, exception, profile){
										if(exception){
											  var msg="System errors.";
											  if(exception.msg){
												  msg = exception.msg;
											  }
											  newcrawler.message("fade", msg, 3000, "red");
											  return;
										}
										if(result){
											var data=result;
											data=eval(data);
											newcrawler.parsePublishParamsByRSS(data);
										}
									}, newcrawler.webCrawlerId, newcrawler.siteId, "rss");
						  
						  var exportUrl=newcrawler_app_url+"api/data/export?siteId="+newcrawler.siteId+"&pageNum="+(newcrawler.pageNum+1)+"&type=rss";
						  jQuery("#ncx_toolview .ncx-export-window-rss .ncx-btn-rss").attr("href", exportUrl);
					  }
				  }
			  });
		  });
		  
		  
		  jQuery("#ncx_toolview .ncx-export-wordpress.ncx-export-icon").click(function(){
			  
				  jQuery("#ncx_toolview .ncx-content-top-export").hide();
				  jQuery("#ncx_toolview .ncx-content-top").hide();
				  jQuery("#ncx_toolview .ncx-content-bottom").hide();
				  
				  jQuery("#ncx_toolview .ncx-export-window-wordpress").toggle(600, function(){
					  if(jQuery("#ncx_toolview .ncx-export-window-wordpress").is(':visible')){
						  
						  
						  var title=jQuery("#ncx_toolview .ncx-export-window-wordpress .title").text();
						  
						  if(newcrawler.siteId!=null && newcrawler.siteId!=""){
							  newcrawler.jsonrpc["dataDeployService"]["queryByXpath"](function(result, exception, profile){
								  if(exception){
									  var msg="System errors.";
									  if(exception.msg){
										  msg = exception.msg;
									  }
									  newcrawler.message("fade", msg, 3000, "red");
									  return;
								  }
								  if(result){
									  var data=eval("("+result+")");
									  newcrawler.parsePublishParams(data);
								  }
							  }, newcrawler.webCrawlerId, newcrawler.siteId, title);
						  }
						  
					  }
				  });
			  
		  });
		  
		  jQuery("#ncx_toolview .ncx-export-db.ncx-export-icon").click(function(){
			  
			  jQuery("#ncx_toolview .ncx-content-top-export").hide();
			  jQuery("#ncx_toolview .ncx-content-top").hide();
			  jQuery("#ncx_toolview .ncx-content-bottom").hide();
			  
			  jQuery("#ncx_toolview .ncx-export-window-db").toggle(600, function(){
				  if(jQuery("#ncx_toolview .ncx-export-window-db").is(':visible')){
					  
					  
					  var title=jQuery("#ncx_toolview .ncx-export-window-db .title").text();
					  
					  if(newcrawler.siteId!=null && newcrawler.siteId!=""){
						  
						  newcrawler.jsonrpc["dataDeployService"]["queryByXpath"](function(result, exception, profile){
							  if(exception){
								  var msg="System errors.";
								  if(exception.msg){
									  msg = exception.msg;
								  }
								  newcrawler.message("fade", msg, 3000, "red");
								  return;
							  }
							  if(result){
								  var data=eval("("+result+")");
								  newcrawler.parsePublishParamsByDB(data);
							  }
						  }, newcrawler.webCrawlerId, newcrawler.siteId, title);
					  }
					  
				  }
			  });
		  
	  });
		  
		  jQuery("#ncx_toolview .ncx-run").click(function(){
			  var cronId=jQuery("#ncx_toolbar #ncx-cron-id").val();
			  newcrawler.jsonrpc["scheduleService"]["execute"](function(result, exception, profile){
				  if(exception){
					  var msg="System errors.";
					  if(exception.msg){
						  msg = exception.msg;
					  }
					  newcrawler.message("fade", msg, 3000, "red");
					  return;
				  }
				  if(result){
					  newcrawler.message("fade", "Task running...", 3000);
					  setTimeout(function(){
						  newcrawler.crawlDataLog["init"](function(){
							  jQuery(window).trigger('resize');
						  });
					  },2000); 
				  }
			  }, newcrawler.webCrawlerId, newcrawler.siteId, cronId);
		  });

		  jQuery("#ncx_toolview .ncx-export-csv").click(function(){
			  
			  jQuery("#ncx_data_list")["table2excel"]({
				    name: "NewCrawler Data",
				    fileext:"xls",
				    filename: "NewCrawlerData" //do not include extension
				});
			  
			  /*var startIndex=newcrawler.pageNum*newcrawler.pageSize;
			  var downloadUrl=newcrawler_app_url+"member/api/data/download?startIndex="+startIndex+"&siteId="+newcrawler.siteId;
			  
			  jQuery("#ncx_toolview .downloadCsv").attr("href", downloadUrl);
			  jQuery("#ncx_toolview .downloadCsv span").click();*/
		  });
		  
		  jQuery("#ncx_toolbar #ncx-charset-select").change(function(){
			  var charset=jQuery("#ncx_toolbar #ncx-charset-select").val();
			  if(charset==null || charset==""){
				  jQuery("#ncx_toolbar #ncx-charset").show();
				  jQuery("#ncx_toolbar #ncx-charset").val("");
			  }else{
				  jQuery("#ncx_toolbar #ncx-charset").hide();
				  jQuery("#ncx_toolbar #ncx-charset").val(charset);
			  }
			  
		  });
		  
		  newcrawler.labelEvent();
	},
	labelEvent:function(){
		jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot .ncx-delete-datatype").unbind("click").click(function(){
			if(jQuery(this).parent().hasClass("finished")){
				var title=jQuery(this).parent().attr("title");
				var lang=jQuery(this).parent().attr("lang");
				var newFieldArray=Array();
				newFieldArray.push(newcrawler.fieldArray[0]);
				for(var i=1, len=newcrawler.fieldArray.length; i<len; i++){
					var index=newcrawler.fieldArray[i].index;
					if(lang==index){
						continue;
					}
					newFieldArray.push(newcrawler.fieldArray[i]);
				}
				newcrawler.fieldArray=newFieldArray;
				jQuery(this).parent().remove();
				if(jQuery("#ncx_toolbar .ncx-datatypes .ncx-label.finished")==undefined){
					jQuery("#ncx_toolbar .save").attr("disabled", true);
				}
				
				newcrawler.delFieldMap(title);
				
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-label.ncx-data-dot.ncx-yellow").addClass("active");
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-label.ncx-data-dot.ncx-yellow").click();
			}
			ncx_innerFun.closeCover();
		});
		
		jQuery("#ncx_toolbar .ncx-datatypes .ncx-label.finished").unbind("mouseout").mouseout(function() {
			jQuery(this).find(".ncx-delete-datatype").hide();
			jQuery(this).find(".ncx-delete-datatype").removeClass("visible");
		})
		
		jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot").unbind("click").click(function(){
			
			if(jQuery(this).hasClass("finished")){
				jQuery(this).addClass("edit").removeClass("zero");
			}
			jQuery("#ncx_toolbar .ncx-datatypes .ncx-label").each(function(){
				if(jQuery(this).hasClass("finished") && jQuery(this).hasClass("active")){
					jQuery(this).mouseout();
				}
			});
			
			if(jQuery(this).hasClass("ncx-pagination") || jQuery(this).hasClass("ncx-cron") || jQuery(this).hasClass("ncx-setting")){
				var isActive=jQuery(this).hasClass("active");
				if(!isActive){
					jQuery("#ncx_toolbar .ncx-data-dot").each(function(){
						 jQuery(this).removeClass("active") 
					  }); 
					  jQuery(this).addClass("active");
				}
				if(jQuery(this).hasClass("ncx-cron")){
					if(jQuery( "#ncx_toolbar .ncx-cron-config" ).is(':visible')){
						jQuery("#ncx_toolbar .ncx-cron-config").hide();
						jQuery(this).removeClass("active");
					}else{
						jQuery("#ncx_toolbar .ncx-cron-config").show();
					}
				}else{
					jQuery("#ncx_toolbar .ncx-cron-config").hide();
				}
				
				if(jQuery(this).hasClass("ncx-setting")){
					if(jQuery( "#ncx_toolbar .ncx-setting-config" ).is(':visible')){
						jQuery("#ncx_toolbar .ncx-setting-config").hide();
						jQuery(this).removeClass("active");
					}else{
						jQuery("#ncx_toolbar .ncx-setting-config").show();
					}
				}else{
					jQuery("#ncx_toolbar .ncx-setting-config").hide();
				}
			}else {
				jQuery("#ncx_toolbar .ncx-datatypes .ncx-data-dot").removeClass("active");
				jQuery(this).addClass("active");
				jQuery("#ncx_toolbar .ncx-cron-config").hide();
				jQuery("#ncx_toolbar .ncx-setting-config").hide();
			}
			
			
			
			
			//点击聚焦
			var lang=jQuery(this).attr("lang");
			if(lang!=null && lang!="" && lang!=undefined){
				for(var i in newcrawler.fieldArray){
					var index=newcrawler.fieldArray[i].index;
					if(lang==index){
						var xpath=newcrawler.fieldArray[i].xpath;
						var tempXpathArray = newcrawler.fieldArray[i].xpathArray.slice(0);
						
						xpath=xpath.replace(":nth-of-type(*)", "");
						var elements = jQuery('#newcrawler').contents().find(xpath);
						var eleCount=elements.length;
						for (var e1 = 0; e1 < eleCount; e1++) {
							var element = elements[e1];
							
							if(e1==0){
								var c = jQuery(element).offset().top;
								var d = jQuery(element).outerHeight();
								var h = jQuery('#newcrawler').contents().outerHeight();
								var e=0;
								if (h - c - d < 65) {
									e = c +1;
									if (e < 0) {
										e = 0;
									}
								}else{
									e = c + d + 3;
								}
								jQuery('#newcrawler').contents().scrollTop(e - 300);
							}
						}
					}
				}
			}
		});
		
		jQuery("#ncx_toolbar .ncx-datatypes .ncx-label").unbind("mouseout").mouseout(function() {
			jQuery(this).find(".ncx-delete-datatype").hide();
			jQuery(this).find(".ncx-delete-datatype").removeClass("visible");
			
			if(jQuery(this).hasClass("finished")){
				ncx_innerFun.closeCover();
			}
		})
		
		jQuery("#ncx_toolbar .ncx-datatypes .ncx-label").unbind("mouseover").mouseover(function(){
			jQuery(this).find(".ncx-delete-datatype").show();
			jQuery(this).find(".ncx-delete-datatype").addClass("visible");
			//移入高亮
			if(jQuery(this).hasClass("finished")){
				jQuery(this);
				
				ncx_innerFun.closeCover();
				
				var lang=jQuery(this).attr("lang");
				
				if(lang!=null && lang!="" && lang!=undefined){
					var seq=(new Date()).getTime();
					
					for(var i in newcrawler.fieldArray){
						var index=newcrawler.fieldArray[i].index;
						if(lang==index){
							var multiSelXpathArray=newcrawler.fieldArray[i].multiSelXpathArray;
							for(var i in multiSelXpathArray){
								var xpath=multiSelXpathArray[i].join('').replace(":nth-of-type(*)", "");
								
								var elements = jQuery('#newcrawler').contents().find(xpath);
								var eleCount=elements.length;
								for (var e1 = 0; e1 < eleCount; e1++) {
									var element = elements[e1];
									ncx_innerFun.addHighlight(seq, element, false, 0, null, "");
								}
							}
							
						}
					}
				}
			}
		});
		
		jQuery("#ncx_toolbar .ncx-help-info").hover(function(){
			jQuery(this).css("opacity", 1);
		}, function(){
			jQuery(this).css("opacity", 0.8);
		})
		
		jQuery("#ncx_toolbar .ncx-setting-dot .ncx-data-dot.ncx-help").unbind("click").click(function(){
			jQuery("#ncx_toolbar .ncx-help-info").slideToggle(250);
		});
	},
	getUrlParameter:function(sParam){
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
	},
	loadToolbar:function(callback){
		
		if(newcrawler.webCrawlerId==null || newcrawler.webCrawlerId==undefined || isNaN(newcrawler.webCrawlerId)){
			return;
		}
		
		jQuery("#ncx_toolbar .save").attr("disabled", true);
		  
		  newcrawler.fieldArray[0]={};
		  var data=null;
		  
		  if(newcrawler.siteId!=null && newcrawler.siteId!="" && newcrawler.rulesVerId!=null && newcrawler.rulesVerId!=""){
			  jQuery("#ncx_toolbar #ncx-headers").val("");
			  jQuery("#ncx_toolbar #ncx-charset-select").val("");
			  jQuery("#ncx_toolbar #ncx-charset-select").change();
			  
			  urlString=newcrawler_server_url+"member/rules/query?webCrawlerId="+newcrawler.webCrawlerId+"&siteId="+newcrawler.siteId+"&rulesVerId="+newcrawler.rulesVerId;
			  jQuery.ajax({
				  type: "GET",
				  dataType: "json",
				  url: urlString,
				  async:false,
				  success: function(responseText){
					  data=responseText;
				  },
				  error: function(jqXHR, textStatus, errorThrown){
					  console.log(errorThrown);
					  var msg="<span style='color:red;'>System errors.</span>";
					  jQuery("#ncx_toolbar .ncx-toolbar-section.msg").html("<div>"+msg+"</div>");
					  setTimeout(function(){
						  jQuery("#ncx_toolbar .ncx-toolbar-section.msg").html("");
					  }, 3000);
				  }
			  });
			  if(data!=null && data!=""){
				  var cronId=data["cronId"];
				  var cronDate=data["cronDate"];
				  var cronTime=data["cronTime"];
				  var pluginId=data["pluginId"];
				  var isJs=data["isJs"];
				  var charset=data["charset"];
				  var headers=data["headers"];
				  
				  jQuery("#ncx_toolbar .ncx-js input[type=checkbox][name='ncx-isJs']").prop('checked', isJs);
				  jQuery("#ncx_toolbar .ncx-js #ncx-pluginId").val(pluginId);
				  jQuery("#ncx_toolbar #ncx-cron-id").val(cronId);
				  jQuery("#ncx_toolbar #ncx-cron-date").val(cronDate);
				  jQuery("#ncx_toolbar #ncx-cron-time").val(cronTime);
				 
				  jQuery("#ncx_toolbar #ncx-headers").val(headers);
				  
				  
				  jQuery("#ncx_toolbar #ncx-charset-select").val(charset);
				  jQuery("#ncx_toolbar #ncx-charset-select").change();
				  
				  
				  data=data["rules"];
				  for(var i in data){
						if(isNaN(i)){continue;}
						var searchMode=data[i]["searchMode"];
						if(searchMode!="csspath"){
							continue;
						}
						var id=data[i]["id"];
						var name=data[i]["name"];
						var selectExpress=data[i]["selectExpress"];
						var selectType=data[i]["selectType"];
						var selectAttr=data[i]["selectAttr"];
						var labelType=data[i]["labelType"];
						
						var labelObj=ncx_et_tool.createCSSpathLabel(selectExpress);
						
						if(labelType=="2"){
							ncx_et_tool.createLabel(id, 0, name, labelObj.xpath, labelObj.xpathArray, selectType, true, selectAttr, labelObj.multiSelXpathArray);
						}else{
							ncx_et_tool.createLabel(id, newcrawler.index, name, labelObj.xpath, labelObj.xpathArray, selectType, false, selectAttr, labelObj.multiSelXpathArray);
						}
				  }
			  }
		  }
		  
		  if(callback){
			 callback();
		  }
	},
	plot:function(){
		var result={};
		var columnName=new Array();
		
		var table = document.getElementById('ncx_data_list');
		
		//columnName
		var firstRow = table.rows[0];
		var firstCellLength = firstRow.cells.length;
		for(var f=0; f<firstCellLength; f+=1){
			var cell = firstRow.cells[f];
			columnName.push(cell.innerHTML);
		}
		
		//columnValue
		var rowLength = table.rows.length;
		for(var i=1; i<rowLength; i+=1){
		  var row = table.rows[i];
		  var cellLength = row.cells.length;
		  for(var j=0; j<cellLength; j+=1){
		    var cell = row.cells[j];
		    
		    var name=columnName[j];
		    var value=cell.innerHTML;
		    
		    if(result[name]==null || result[name]==undefined){
				result[name]={"data":new Array()};
			}
			result[name]["data"].push(value);
		  }
		}
		return {"cols":result } ;
	},
	setPublishParams:function(params){
		jQuery("#ncx_toolview .ncx-export-window").each(function(){
			if(jQuery(this).is(':visible')){
				var deployName=jQuery(this).find(".title").text();
				var deployParams="";
				if(jQuery(this).hasClass("ncx-export-window-wordpress")){
					var sign=jQuery(this).find("input[name=__sign]").val();
					var deployUrl=jQuery(this).find("input[name=__url]").val();
					if(deployUrl!=null && deployUrl!=""){
						deployUrl="http://"+deployUrl+"/?__ta=post";
					}
					var postStatus=jQuery(this).find("select[name=post_status]").val();
					var accessPassword=jQuery(this).find("input[name=access_password]").val();
					
					var isUploadImage=jQuery(this).find("input[name=isUploadImage]").is(":checked");
					var imageLabels="";
					if(isUploadImage){
						imageLabels=jQuery(this).find("input[name=isUploadImage]").parent().find("input[name=param]").val();
						isUploadImage="Y";
					}
					if(sign!=null && sign!=""){
						deployParams="__sign="+sign;
					}
					if(postStatus!=null && postStatus!=""){
						if(deployParams!=""){
							deployParams+="&";
						}
						deployParams+="postStatus="+postStatus;
					}
					if(accessPassword!=null && accessPassword!=""){
						if(deployParams!=""){
							deployParams+="&";
						}
						deployParams+="accessword="+accessPassword;
					}
					jQuery(this).find(".fieldMap input[name=param]").each(function(){
						var name=this.value;
						var value=jQuery(this).parent().parent().find("select.allFileds").val();
						if(value!=null && value!=""){
							if(deployParams!=""){
								deployParams+="&";
							}
							deployParams+=name+"="+value;
						}
					});
					params["deployUrl"]=deployUrl;
					params["isUploadImage"]=isUploadImage;
					params["imageLabels"]=imageLabels;
				}else if(jQuery(this).hasClass("ncx-export-window-db")){
					var dbType=jQuery(this).find("select[name=dbType]").val();
					var dbHost=jQuery(this).find("input[name=dbHost]").val();
					var dbPort=jQuery(this).find("input[name=dbPort]").val();
					var dbName=jQuery(this).find("input[name=dbName]").val();
					var dbUser=jQuery(this).find("input[name=dbUser]").val();
					var dbPassword=jQuery(this).find("input[name=dbPassword]").val();
					var dbCharset=jQuery(this).find("select[name=dbCharset]").val();
					
					jQuery(this).find(".fieldMap > div:not(.temp)").find("input[name=param]").each(function(){
						var name=this.value;
						var value=jQuery(this).parent().find("input[name=labelName]").val();
						if(value!=null && value!=""){
							if(deployParams!=""){
								deployParams+="&";
							}
							deployParams+=name+"="+value;
						}
					});
					
					params["dbType"]=dbType;
					params["dbHost"]=dbHost;
					params["dbPort"]=dbPort;
					params["dbName"]=dbName;
					params["dbUser"]=dbUser;
					params["dbPassword"]=dbPassword;
					params["dbCharset"]=dbCharset;
				}else if(jQuery(this).hasClass("ncx-export-window-rss")){
					var configMap={};
					
					jQuery(this).find(".fieldMap input[name=param]").each(function(){
						var name=this.value;
						var value=jQuery(this).parent().parent().find("select.allFileds").val();
						if(value==undefined || value==null ){
							value="";
						}
						configMap[name]=value;
					});
					var jsonConfig=$.toJSON(configMap);
					params["export2RSS"]=jsonConfig;
				}
				params["deployParams"]=deployParams;
				params["deployName"]=deployName;
			}
		});
		return params;
	},
	parsePublishParamsByRSS:function(data){
		var value="";
		for(var j in data){
			if(isNaN(j)){continue;}
			var name=data[j]["name"];
			var value=data[j]["value"];
			
			var obj=jQuery("#ncx_toolview .ncx-export-window-rss").find("input[name='param'][value='"+name+"']");
			jQuery(obj).parent().parent().find("select.allFileds").val(value);
		}
	},
	parsePublishParams:function(data){
		var deployName=data["deployName"];
		var deployUrl=data["deployUrl"];
		
		var isUploadImage=data["isUploadImage"];
		var deployParams=data["deployParams"];
		if(isUploadImage=="Y"){
			jQuery("#ncx_toolview .ncx-export-window-wordpress").find("input[name=isUploadImage]").attr("checked", true);
		}
		if(deployUrl.indexOf("http://")==0){
			deployUrl=deployUrl.substring(7);
		}
		if(deployUrl.indexOf("/?__ta=post")!=-1){
			deployUrl=deployUrl.substring(0, deployUrl.indexOf("/?__ta=post"));
		}
		jQuery("#ncx_toolview .ncx-export-window-wordpress").find("input[name=__url]").val(deployUrl);
		
		if(deployParams!=null && deployParams!=""){
			var params=deployParams.split("&");
			for(var i=0, len=params.length; i<len;i++){
				var param=params[i].split("=");
				var name=param[0];
				var value=param[1];
				if(name=="__sign"){
					jQuery("#ncx_toolview .ncx-export-window-wordpress").find("input[name='__sign']").val(value);
					continue;
				}
				if(name=="postStatus"){
					jQuery("#ncx_toolview .ncx-export-window-wordpress").find("select[name='post_status']").val(value);
					continue;
				}
				if(name=="accessword"){
					jQuery("#ncx_toolview .ncx-export-window-wordpress").find("input[name='access_password']").val(value);
					continue;
				}
				var obj=jQuery("#ncx_toolview .ncx-export-window-wordpress").find("input[name='param'][value='"+name+"']");
				jQuery(obj).parent().parent().find("select.allFileds").val(value);
			}
		}
	},
	parsePublishParamsByDB:function(data){
		var deployName=data["deployName"];
		var deployParams=data["deployParams"];
		
		
		var dbHost=data["dbHost"];
		var dbPort=data["dbPort"];
		var dbName=data["dbName"];
		var dbUser=data["dbUser"];
		var dbPassword=data["dbPassword"];
		var dbCharset=data["dbCharset"];
		var dbTable=data["dbTable"];
		
		jQuery("#ncx_toolview .ncx-export-window-db").find("input[name='dbHost']").val(dbHost);
		jQuery("#ncx_toolview .ncx-export-window-db").find("input[name='dbPort']").val(dbPort);
		jQuery("#ncx_toolview .ncx-export-window-db").find("input[name='dbName']").val(dbName);
		jQuery("#ncx_toolview .ncx-export-window-db").find("input[name='dbUser']").val(dbUser);
		jQuery("#ncx_toolview .ncx-export-window-db").find("input[name='dbPassword']").val(dbPassword);
		jQuery("#ncx_toolview .ncx-export-window-db").find("select[name='dbCharset']").val(dbCharset);
		jQuery("#ncx_toolview .ncx-export-window-db").find("input[name='dbTable']").val(dbTable);
		
		if(deployParams!=null && deployParams!=""){
			var params=deployParams.split("&");
			for(var i=0, len=params.length; i<len;i++){
				var param=params[i].split("=");
				var name=param[0];
				var value=param[1];
				var obj=jQuery("#ncx_toolview .ncx-export-window-db").find("input[name='labelName'][value='"+value+"']");
				jQuery(obj).parent().find("input[name='param']").val(name);
			}
		}
	},
	save:function(url, callback){
		  //save
		  //newcrawler.fieldArray.push({index:index, name:name, xpath:xpath, xpathArray:ncx_et_tool.xpathArray, selectType:selectType});
		  var rulesArray=[];
		  for(var i in newcrawler.fieldArray){
			  var id=newcrawler.fieldArray[i].id;
			  var index=newcrawler.fieldArray[i].index;
			  var propertyName=newcrawler.fieldArray[i].name;
			  
			  var selectType=newcrawler.fieldArray[i].selectType;
			  var selectAttr=newcrawler.fieldArray[i].selectAttr;
			  
			  var selectExpress='';
			  var multiSelXpathArray=newcrawler.fieldArray[i].multiSelXpathArray;
			  for(var i in multiSelXpathArray){
				  var xpath=multiSelXpathArray[i].join('');
				  if(selectExpress!=''){
					  selectExpress+="|";
				  }
				  selectExpress+=xpath;
			  }
			  
			  if(propertyName==null || propertyName==""){
				  continue;
			  }
			  if(selectExpress==null || selectExpress==""){
				  continue;
			  }
			  var labelType="1";
			  if(index==0){
				  labelType="2";
			  }
			  var isCantNull="";
			  var excludeHtmlTags="";
			  var unique=false;
			  var isAbsolute="";
			  
			  if(propertyName=="Headline"){
				  isCantNull="true";
				  
				  var htmlTags=new Array();
				  htmlTags.push("enter");
				  htmlTags.push("space_trim");
				  excludeHtmlTags=JSON.stringify(htmlTags);
				  
				  unique=true;
			  }
			  if(propertyName=="Link"){
				  isCantNull="true";
				  unique=true;
				  isAbsolute="true";
			  }
			  var isTemp="";
			  if(propertyName=="Item"){
				  isTemp="true";
			  }
			  rulesArray.push({"id":id, "name":propertyName, "selectExpress":selectExpress, "selectAttr":selectAttr, "selectType":selectType, "labelType":labelType, "isCantNull":isCantNull, "isAbsolute":isAbsolute, "isTemp":isTemp, "excludeHtmlTags":excludeHtmlTags, "unique":unique});
		  }
		  jQuery("#ncx_toolbar .ncx-toolbar-section.msg").html("<div class='loading'></div>");
		  
		  var rulesJson="";
		  if(rulesArray!=null && rulesArray.length>0){
			  rulesJson = JSON.stringify(rulesArray);
		  }  
		  
		  var cronId=jQuery("#ncx_toolbar #ncx-cron-id").val();
		  var cronDate=jQuery("#ncx_toolbar #ncx-cron-date").val();
		  var cronTime=jQuery("#ncx_toolbar #ncx-cron-time").val();
		  
		  var pluginId="";
		  var isJs=false;
		  if(jQuery("#ncx_toolbar .ncx-js input[type=checkbox][name='ncx-isJs']").is(':checked')){
			  isJs=true;
			  pluginId=jQuery("#ncx_toolbar .ncx-js #ncx-pluginId").val();
		  }
		  var charset=jQuery("#ncx_toolbar #ncx-charset").val();
		  var headers=jQuery("#ncx_toolbar #ncx-headers").val();
		  
		  urlString=url+"member/rules/save";
		  
		  var data={"webCrawlerId":newcrawler.webCrawlerId, "siteId":newcrawler.siteId, "rulesVerId":newcrawler.rulesVerId, 
				  "rulesJson":rulesJson, "url":jQuery("#ncx_toolbar #url").parent().attr("title"), 
				  "cronId":cronId, "cronDate":cronDate, "cronTime":cronTime, 
				  "isJs":isJs, "pluginId":pluginId, "charset":charset, "headers":headers
		  };
		  
		  data = newcrawler.setPublishParams(data);
		  
		  jQuery.ajax({
			  type: "POST",
			  data: data,
			  url: urlString,
			  async:true,
			  dataType :"json", 
			  error: function(jqXHR, textStatus, errorThrown){
				  console.log(errorThrown);
				  var msg="<span style='color:red;'>System errors.</span>";
				  jQuery("#ncx_toolbar .ncx-toolbar-section.msg").html("<div>"+msg+"</div>");
				  setTimeout(function(){
					  jQuery("#ncx_toolbar .ncx-toolbar-section.msg").html("");
				  }, 3000);
			  },
			  success: function(responseText){
				 
				  var msg=responseText["msg"];
				  var code=responseText["code"];
				  if(code=="1"){
					  var cronId=responseText["cronId"];
					  if(cronId!=null && cronId!=undefined && cronId!="undefined"){
						  jQuery("#ncx_toolbar #ncx-cron-id").val(cronId);
					  }
					  var isNew=responseText["isNew"];
					  var pluginId=responseText["pluginId"];
					  if(pluginId!=null && pluginId!=undefined && pluginId!="undefined"){
						  jQuery("#ncx_toolbar .ncx-js #ncx-pluginId").val(pluginId);
					  }
					  
					  if(responseText["siteId"]!=null && responseText["siteId"]!=""){
						  newcrawler.siteId=responseText["siteId"];
						  if(isNew=="true"){
							  newcrawler.url=newcrawler.url+"&siteId="+newcrawler.siteId;
						  }
					  }
					  if(responseText["rulesVerId"]!=null && responseText["rulesVerId"]!=""){
						  newcrawler.rulesVerId=responseText["rulesVerId"];
						  if(isNew=="true"){
							  newcrawler.url=newcrawler.url+"&rulesVerId="+newcrawler.rulesVerId;
						  }
					  }
					  
					  if(newcrawler_refresh){
						  if(newcrawler_refresh!=null && newcrawler_refresh!=undefined 
								  && newcrawler_refresh!="undefined"){
							  try {
								  newcrawler_refresh();
							  } catch (err) {
								  console.log(err.description || err) 
							  }
						  }
					  }
					  msg="<span style='color:green;'>"+msg+"</span>";
					  
					  if(callback){
						  callback();
					  }
					  if(isNew=="true"){
						  top.window.location.href=newcrawler.url;
					  }
				  }else{
					  msg="<span style='color:red;'>"+msg+"</span>";
				  }
				  
				  jQuery("#ncx_toolbar .ncx-toolbar-section.msg").html("<div>"+msg+"</div>");
				  setTimeout(function(){
					  jQuery("#ncx_toolbar .ncx-toolbar-section.msg").html("");
				  }, 3000);
			  }
		  });
	},
	test:function(crawlUrl){
		jQuery("#ncx_tooltest > .ncx-content-top").find(".loading").show();
		
		jQuery("#ncx_tooltest > .ncx-content-top > .ncx-content-top-data table").empty();
		var row="";
		var len=newcrawler.fieldArray.length;
		for(var i=1;i<len;i++){
			var index=newcrawler.fieldArray[i].index;
			var name=newcrawler.fieldArray[i].name;
			row+="<th>";
			row+=name;
			row+="</th>";
		}
		if(row!=""){
			row="<tr><th>index</th>"+row+"</tr>";
			jQuery(row).appendTo(jQuery("#ncx_tooltest > .ncx-content-top > .ncx-content-top-data table"));
		}
		
		newcrawler.jsonrpc["crawlRulesService"]["test"](function(result,exception,profile){
			if(exception){
				  var msg="System errors.";
				  if(exception.msg){
					  msg = exception.msg;
				  }
				  newcrawler.message("fade", msg, 3000, "red");
				  return;
			  }
			
			var data=eval("("+result+")");
			if(data==null || data.list==null || data.list.length<1){
				var row="<tr><td  style='border: none;'>Not Found Data.</td>";
				jQuery(row).appendTo(jQuery("#ncx_tooltest > .ncx-content-top > .ncx-content-top-data table"));
				return;
			}
			
			jQuery("#ncx_tooltest .ncx-details-content .spider").text(data.spider==null?"":data.spider);
			jQuery("#ncx_tooltest .ncx-details-content .cookie").text(data.cookieString==null?"":data.cookieString);
			var nextPageUrl=data.nextPageUrl==null?"":data.nextPageUrl;
			
			jQuery("#ncx_tooltest .ncx-details-content .nextUrl").text(nextPageUrl);
			jQuery("#ncx_tooltest .ncx-details-content .nextUrl").attr("href", nextPageUrl);
			
			jQuery("#ncx_tooltest .ncx-details-content .costTotal").text(data.times);
			jQuery("#ncx_tooltest .ncx-details-content .costFetch").text(data.readHtmlTimes);
			jQuery("#ncx_tooltest .ncx-details-content .costParse").text(data.readDataTimes);
			
			
			index=0;
			data=data.list;
			for(var i in data){
				if(isNaN(i)){continue;}
				var json=data[i];
				index++;
				var row="<tr><td>"+index+"</td>";
				for(var j=1;j<len;j++){
					var name=newcrawler.fieldArray[j].name;
					var isExist=false;
					for(var k in json){
						if(name==json[k]["name"]){
							var value=json[k]["value"];
							row+="<td>";
							row+=value;
							row+="</td>";
							isExist=true;
							break;
						}
					}
					if(!isExist){
						row+="<td></td>";
					}
				}
				row+="</tr>";
				
				var rowObj=jQuery(row);
				rowObj.find("td").click(function(){
					jQuery(this).attr("title", jQuery(this).text());
				})
				rowObj.appendTo(jQuery("#ncx_tooltest > .ncx-content-top > .ncx-content-top-data table"));
			    
			}
			jQuery("#ncx_tooltest .ncx-details-content .total").text(index);
			
		},	newcrawler.webCrawlerId, newcrawler.siteId, newcrawler.rulesVerId, crawlUrl, "");
	},
	view:function(){
		if(newcrawler.webCrawlerId==null || newcrawler.webCrawlerId==undefined || isNaN(newcrawler.webCrawlerId)){
			return;
		}
		newcrawler.logsViewConsole["v"]["webCrawlerId"]=newcrawler.webCrawlerId;
		newcrawler.clickLogs();
	},
	
	refresh:function(){
		jQuery("#ncx_toolview > .ncx-content-top").find(".loading").show();
		
		jQuery("#ncx_toolview > .ncx-content-top > .ncx-content-top-data table").empty();
		var row="";
		var len=newcrawler.fieldArray.length;
		for(var i=1;i<len;i++){
			var index=newcrawler.fieldArray[i].index;
			var name=newcrawler.fieldArray[i].name;
			row+="<th>";
			row+=name;
			row+="</th>";
		}
		if(row!=""){
			row="<tr><th>index</th>"+row+"<th>status</th><th>createDate</th></tr>";
			jQuery(row).appendTo(jQuery("#ncx_toolview > .ncx-content-top > .ncx-content-top-data table"));
		}
		
		newcrawler.pageNum=0;
		newcrawler.queryData(newcrawler.pageNum);
		
		var items_per_page=jQuery("#ncx_toolview > .ncx-content-top").find("#ncx-pagination-size").val();
		
		newcrawler.jsonrpc["crawlDataService"]["count"](function(result,exception,profile){
			newcrawler.total=result;
			var prev=nc["i18n"]("res.page.prev");
			var next=nc["i18n"]("res.page.next");
			jQuery("#ncx_toolview > .ncx-content-top").find("#ncx-pagination")["pagination"](result, {
				"num_edge_entries": 2,//Number of start and end points
				"num_display_entries": 5,//Number of pagination links shown
				"current_page":0,
				"callback": function(index){
					newcrawler.pageNum=index;
					newcrawler.queryData(newcrawler.pageNum);
				},
				"items_per_page":items_per_page,
				"prev_text":prev,
				"next_text":next
			});
		},	newcrawler.webCrawlerId, newcrawler.siteId);
		
	},
	queryData:function(pageNum){
		var len=newcrawler.fieldArray.length;
		var tableObj=jQuery("#ncx_toolview > .ncx-content-top > .ncx-content-top-data table");
		newcrawler.moveAllTrWithObj(tableObj);
		
		var items_per_page=jQuery("#ncx_toolview > .ncx-content-top").find("#ncx-pagination-size").val();
		
		var startIndex=pageNum*items_per_page;
		
		var queryTimes=items_per_page/newcrawler.pageSize;
		
		var queryCount=0;
		var queryFinish=0;
		for(var i=0;i<queryTimes;i++){
			var queryStartIndex=startIndex+(i*newcrawler.pageSize);
			
			if(queryStartIndex>newcrawler.total){
				break;
			}
			var index=1;
			queryCount++;
			
			newcrawler.jsonrpc["crawlDataService"]["query"](function(result,exception,profile){
				queryFinish++;
				var data=eval(result);
				newcrawler.jsonData=data;
				
				if(data!=null && data.length>0){
					newcrawler.pageNum=pageNum;
				}else{
					var row="<tr><td  style='border: none;'>Not Found Data.</td>";
					jQuery(row).appendTo(jQuery("#ncx_toolview > .ncx-content-top > .ncx-content-top-data table"));
					return;
				}
				
				
				for(var i in data){
					if(isNaN(i)){continue;}
					var jsonData=data[i]["data"];
					var json=eval(jsonData);
					var row="<tr><td>"+index+"</td>";
					var createDate=data[i]["createDate"];
					var statusDesc=(data[i]["status"]==1?('<span class="label-info bg-green">'+nc["i18n"]("res.published")+'</span>'):'');
					for(var j=1;j<len;j++){
						var name=newcrawler.fieldArray[j].name;
						var isExist=false;
						for(var k in json){
							if(name==json[k]["name"]){
								var value=json[k]["value"];
								row+="<td>";
								row+=value;
								row+="</td>";
								isExist=true;
								break;
							}
						}
						if(!isExist){
							row+="<td></td>";
						}
					}
					row+="<td>"+statusDesc+"</td><td>"+createDate+"</td></tr>";
					var rowObj=jQuery(row);
					rowObj.find("td").click(function(){
						jQuery(this).attr("title", jQuery(this).text());
					})
					rowObj.appendTo(jQuery("#ncx_toolview > .ncx-content-top > .ncx-content-top-data table"));
				    index++;
				}
				
			},	newcrawler.webCrawlerId, {'javaClass':"com.soso.web.jsonrpc.bo.CrawlDataBo",
				"siteId":newcrawler.siteId,"startIndex":queryStartIndex,"size":newcrawler.pageSize,
				"searchStarttime":null,"searchEndtime":null});
		}
		var finishVar=setInterval(function(){ 
			if(queryCount===queryFinish){
				jQuery("#ncx_toolview > .ncx-content-top").find(".loading").hide();
				clearInterval(finishVar);
			}
		}, 3000);
		
		
	},
	moveAllTrWithObj:function(tableJQueryObj){  
		var tab=tableJQueryObj.get(0);  
		var rowlen = tab.rows.length;  
		for(var rowIndex = rowlen - 1; rowIndex > 0; rowIndex--){                  
			tab.deleteRow(rowIndex);  
		}  
	},
	init : function() {
		newcrawler.event();
		
		newcrawler.after();
		newcrawler.url=top.window.location.href;
		
		jQuery("iframe[name=newcrawler]").height(jQuery(window).height() - 46);
		jQuery(window).resize(function() {
			jQuery("iframe[name=newcrawler]").height(jQuery(window).height() - 46);
		});
		jQuery( window ).css("overflow","hidden");
		try{
			newcrawler.toolbarEvent();
			var userAgent=document.getElementById('newcrawler').contentWindow["getNewCrawlerUserAgent"]();
			var charset=document.getElementById('newcrawler').contentWindow["getNewCrawlerCharset"]();
			
			jQuery("#ncx_toolbar #ncx-headers").val(userAgent);
			jQuery("#ncx_toolbar #ncx-charset-select").val(charset);
			jQuery("#ncx_toolbar #ncx-charset-select").change();
			
			newcrawler.loadToolbar(function(){
				jQuery( document ).on( "mousemove", function( event ) {
					newcrawler.pageX=event.pageX;
					newcrawler.pageY=event.pageY;
				});
				jQuery(".ncx_toolbar_cover").remove();
				
				newcrawler.initFieldMap();
			});
		}catch(e){}
	},
	initFieldMap:function(){
		jQuery("#ncx_toolview .ncx-export-content select.allFileds").each(function(){
			jQuery(this).find("option:gt(0)").remove();
		});
		jQuery("#ncx_toolview .ncx-export-window-db .ncx-export-content .fieldMap > div:not(.temp)").remove();
				
		for(var i in newcrawler.fieldArray){
			var index=newcrawler.fieldArray[i].index;
			if(index==0){
				//page label
				continue;
			}
		    var id=newcrawler.fieldArray[i].id;
		    var name=newcrawler.fieldArray[i].name;
		    var selectExpress=newcrawler.fieldArray[i].xpath;
		    
		    if(name==null || name==""){
			  continue;
		    }
		    if(selectExpress==null || selectExpress==""){
			  continue;
		    }
		    jQuery("#ncx_toolview .ncx-export-window-wordpress .ncx-export-content select.allFileds").append("<option value='${"+name+"}'>"+name+"</option>");
		    jQuery("#ncx_toolview .ncx-export-window-rss .ncx-export-content select.allFileds").append("<option value='"+name+"'>"+name+"</option>");
		    
		    
		    var fieldMapTemp=jQuery("#ncx_toolview .ncx-export-window-db .ncx-export-content .fieldMap .temp").clone();
			fieldMapTemp.removeClass("temp");
			fieldMapTemp.show();
		    fieldMapTemp.find(".labelName").text(name)
		    fieldMapTemp.find("input[name=labelName]").val("${"+name+"}");
		    fieldMapTemp.find("input[name=param]").val(name);
		    jQuery("#ncx_toolview .ncx-export-window-db .ncx-export-content .fieldMap").append(fieldMapTemp);
	    }
	},
	addFieldMap:function(name){
		//wordpress
		jQuery("#ncx_toolview .ncx-export-window-wordpress .ncx-export-content select.allFileds").append("<option value='${"+name+"}'>"+name+"</option>");
		
		//db
		var fieldMapTemp=jQuery("#ncx_toolview .ncx-export-window-db .ncx-export-content .fieldMap .temp").clone();
		fieldMapTemp.removeClass("temp");
	    fieldMapTemp.find(".labelName").text(name)
	    fieldMapTemp.find("input[name=labelName]").val("${"+name+"}");
	    fieldMapTemp.find("input[name=param]").val(name);
	    jQuery("#ncx_toolview .ncx-export-window-db .ncx-export-content .fieldMap").append(fieldMapTemp);
	    
	    //rss
		jQuery("#ncx_toolview .ncx-export-window-rss .ncx-export-content select.allFileds").append("<option value='"+name+"'>"+name+"</option>");
		
	},
	delFieldMap:function(name){
		//wordpress
		jQuery("#ncx_toolview .ncx-export-window-wordpress .ncx-export-content select.allFileds").each(function(){
			var selectObj=jQuery(this);
			
			if(selectObj.find("option[value='${"+name+"}']").is(":checked")){
				selectObj.val("");
			}
			selectObj.find("option[value='${"+name+"}']").remove();
		});
		
		//db
		jQuery("#ncx_toolview .ncx-export-window-db .ncx-export-content .fieldMap input[name=param][value="+name+"]").parent().remove();
		
		//rss
		jQuery("#ncx_toolview .ncx-export-window-rss .ncx-export-content select.allFileds").each(function(){
			var selectObj=jQuery(this);
			
			if(selectObj.find("option[value='"+name+"']").is(":checked")){
				selectObj.val("");
			}
			selectObj.find("option[value='"+name+"']").remove();
		});
	},
	initLoad: function(){
		newcrawler.loadNewCrawler();
	},
	loadNewCrawler:function(){
		newcrawler.message("fade", "Completed.", 3000, "green");
		
		newcrawler.init();
		newcrawler.addStyle();
	},
	addStyle:function(){
		var css = '.ncx-cursor-not-allowed {cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzMxNTk5N0RFREJGMTFFNUI1RDNERkQxQUFDMDRERjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzMxNTk5N0VFREJGMTFFNUI1RDNERkQxQUFDMDRERjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MzE1OTk3QkVEQkYxMUU1QjVEM0RGRDFBQUMwNERGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3MzE1OTk3Q0VEQkYxMUU1QjVEM0RGRDFBQUMwNERGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqJDRkIAAAL2SURBVHjavJZPaNJhGMdf/8w8bEJTUEg0sEMTNrzoLHYYUQe3IHbYwDp0Egq6OmKVVods7qDt1CEYBF1slzrIDuLBwxoiO0iDajCGIjEZSCApoj49z4vvcPn7rXTb74Hvz9/v8X2fz+993+d5lAHAa6aQIYtfQCkoB1arVdja2lIEyoGVSgUMBoMi0CMg3SsBPQZUAtoDFNBcLkfQZ4oASSaTCfL5PEEfKwI8L+iJwPOAElDb7dDpdKzRaDCfz8c8Hg/3ZTIZNj4+HqHBKpXq9MkkVuhwOGB5eZnfj42NQbvd/oWQF6jnXbp0JltKsGKxCLVa7bfRaOTQdDpNW3nnzJOmXq9zGNpDVGxxcZED5+bmyLdxHs27hXrQcVzZ29tr41mBRqOhF2mjz3FCDMoB2oV3qDTqC+oj6hHKLAe895dzY3Z2lq8yGo3SKldkYLdQ3+UyHFVFPUVpjgEl3uJ2NpuFZDIJrVaric9vJWD3US0aPjExAaurq7C5uck7VCKRgIWFBVCr1QL8SUDlgGpUFvUKZZWAXUM1aNsjkQhlM0gZvYDFYhHQFVngP0yFytHccDjMAxNwbW0NZmZmYGpqCpaWluDw8JB/t729DXq9nihN1NVBgNdFzWKD4EH9fn/P+dlsNpH5EAwGhf/NIMCXNDkUCvFg6+vrsm1xfn6ej9nZ2RG+Hz2t7T/sMl0wUfiD1Wpl+/v70nuvUvFPp9MpWqZd1FE/phM9l2xkZITZ7XbZwZjlDOuZS2Rqv8ASXXZ3d/kDlg/DmpUc6Ha7GZYIK5VKDFsmuX4O0p0oOni9Xn4+GAhcLlfP+eEOiL8qEI/Hhf/9IElzAVWkAFTgZNT8A4EAjI6OwtDQEExPTx/BDg4OumvxxiBAsrsUYHh4GFKpFMhZuVyGyclJAfs8aOELi9N8rVbLV0ctrdlsclChUIBYLAZms1nAvqEunhZIOf8EVRPnRr2z01W6lUSZTmzefZoNFUV9RdU7DZ0y+QPqptTP0x8BBgCoKq8fjjt0ZAAAAABJRU5ErkJggg==) 0 0, auto;}'
			+'.ncx-cursor-add {cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzMxNTk5NzlFREJGMTFFNUI1RDNERkQxQUFDMDRERjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzMxNTk5N0FFREJGMTFFNUI1RDNERkQxQUFDMDRERjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MzE1OTk3N0VEQkYxMUU1QjVEM0RGRDFBQUMwNERGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3MzE1OTk3OEVEQkYxMUU1QjVEM0RGRDFBQUMwNERGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlbAVHoAAALUSURBVHjavJVPaBNBFIffbtMUKwY0OVQMtjH1EDSnQrHoxYO0ibZS8eTBHnpp/Ytii0IVe1ELgrSCeBD1ojnoQdqDRUrUoBBIvAQEFWsCaa3G2KCmaUzZrL+ZJmWz3dYkTXfg25l5M7tf5u3shGRZvkE6Fbj4RdZLyoXJZFL2+/26SLkwkUjIJpNJF+mSkLX1kBYI9ZAuE+alwWCQSS/rImRYLBY5FAox6UVdhOslXVW4HlImNCgDRqORMpkMuVwuam5u5jGfz0dOp/M6mywIwto3U36FdrtdHhoa4m2HwyFns9lfkAyCqwq2VSSlTBaNRuX5+fmU2WzmUq/Xy1J5uOKbJp1OcxlKL7jV39/PhZ2dnSw2XmmhgIuE9km8n7toN4bD4U9YsSCKIkUiEdlqte7E2KTWA/aONLE9cBC0gx1gA5gCr8GTt2fefVcLRdTHmYwFUH+22Wwv3G43SZJEHo9HQLhnBdkBVO/BM9AN9oM94Ci4DSYxZwBUKe8TNJZ9KBAIjMXjcWptbZWw0nv4IT0qWReq+0AsIpOj4AhWK/GUagjZQ/xgAtyBbEola8mlrLqE13cTwj5N4WoFMjY/AJqWPbFjhBq22OjC6FmKzH5RD7N9svvN6eAHscSN1qIlY8Wy0UJ1m7ZSdZVBa5i9x14q8h0oS9savgoXuxhKvKlB2Rlsu0a76pxLK+SpbR+hhewCb5942k2xZCw/vb4coVHZMdcuprEglhPzPIoGdVpLFk4rO1fGL1GNoSa3aYapfrON+sbYpgnzWCxZ8N3PlCP0gvP5zmzq59LAgrSYxvjcD5r5/VXr3pflbJqJ3NFVTnmoedIU8S0eQ/VIHa811pIoVFEqM0dZOaseHsOH35E/S0squPExqmF1PJVJUfLvHy3ZR9CV74hlpuccGADp/8x7DvbhRyZWPLxLTO92VKeAGzTmztdv4BV4ANGE+u/pnwADAJY2rJMWYmDjAAAAAElFTkSuQmCC) 0 0, auto;}'
			+'.ncx-cursor-delete {cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODg4NEM2NzNFREIzMTFFNTkwNjNEMDE4MEY4NDJENjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODg4NEM2NzRFREIzMTFFNTkwNjNEMDE4MEY4NDJENjUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4ODg0QzY3MUVEQjMxMUU1OTA2M0QwMTgwRjg0MkQ2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4ODg0QzY3MkVEQjMxMUU1OTA2M0QwMTgwRjg0MkQ2NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pp/6/tcAAAJvSURBVHjavJVBiBJRGMffjNtEF6F0T0qbuQVCHiKQFrp0CNOKsPbcHrrs0l42yDq4UKcSoogiOkR1ykMF0R6KkKk8CXoSgooWDTd2Y10skDRhfP2/QWV2Uts3686D37w3z/fmN+973zwZ5/wGs6nApV+4XVJdWKvVeDabtUWqC6vVKnc6nbZIu0Jq2yFdJ7RD+o+wI83n8ySdt0VIuN1uXigUSHrFFuFWSQcKt0JKwhFjh6IorNlsskgkwkKhkN6XyWRYMBi8ToMlSdp8MnVW6Pf7eTKZ1NuBQIC3Wq1fkFwDVw14hhJSkpXLZV6v13+7XC5dqqoqhfL00JOm0WjoMpQZcDsej+vCWCxGfW+GLZRw0dC+gP15gPZ4sVj8ghVLsiyzUqnEvV7vPvy22OsBS2NnKQdOgFNgL9hB3eADeOb99uKHWSijPkcy6kD91efzvY1Go0zTNJZKpSR0T/eRHUP1EbwE58FRcBhMgrtgEWMSwGGcJ/VY9slcLrdQqVRYOBzWsNKHeJFpk2wK1SMgbyCSr8AZrFbTQ9pDSA/JgjS4D9mSSTbRDtk2ge27CeGlnsJBBTIanwOHBPOF8uSAp/T8kyw4ccKCjArt4wzb4B4Yy/FNfBURuowITtpjvNl1b44pB/f3Hbw6mWDa8lrndsyKUDHeyKM7mcMzOiCQDnNYhYXf153Ds7cY2670z5SVNePtshWhCi52H7j6U2TuOytJk24fXVbKE2EhPt4/qC5bkC1grmplhSR9iuqOwJTPYKqbaBbDMwcSoPGfca/BEbxkte/hLXjU7UY1C6JgvH2+roD34DFEafPf018BBgCuzILSC+9sGAAAAABJRU5ErkJggg==) 0 0, auto;}',
		    style = document.createElement('style');
		var head=jQuery('#newcrawler').contents().find("head").get(0);
		
		style.type = 'text/css';
		if (style.styleSheet){
		  style.styleSheet.cssText = css;
		} else {
		  style.appendChild(document.createTextNode(css));
		}
		head.appendChild(style);
	}
};

jQuery(document).ready(function(){
	jQuery('#ncx_toolbar #ncx-cron-time')["clockpicker"]({
	    "placement": 'bottom',
	    "align": 'top',
	    "autoclose": true
	});
	
	jQuery('#ncx_toolbar #ncx-cron-date')["datetimepicker"]({
		"timepicker":false,
		"validateOnBlur": false,
		"closeOnDateSelect": true,
		"format":'Y-m-d'
	});
	
	JSONRpcClient["profile_async"] = true;
    JSONRpcClient["max_req_active"] = 2;
    JSONRpcClient["requestId"] = 1;
    
    jsonrpc = new JSONRpcClient("../JSON-RPC/MEMBER");
    
    newcrawler.jsonrpc=jsonrpc;
    
	newcrawler.logsViewConsole=logsViewConsole;
	logsViewConsole["fn"]["init"]();
	
	newcrawler.clickLogs=function(){
		jQuery(".logsViewConsole").click();
	}
	
	var webCrawlerId=getUrlParameter("webCrawlerId");
	var siteId=getUrlParameter("siteId");
	var option={
		  	"tableId":"ncx-crawlDataLog",
			"listTableId":"ncx-crawlDataLogList",
			"PER_PAGE_ITEMS":5,
			"ITEMS_COUNT":0,
			"cur_page":0,
			"webCrawlerId":webCrawlerId,
			"siteId":siteId
	}
	newcrawler.crawlDataLog=new crawlDataLog(option);
	

	var iframe=jQuery('#newcrawler')[0];
	if (iframe.attachEvent){
	    iframe.attachEvent("onload", function(){
	        newcrawler.initLoad();
	    });
	} else {
	    iframe.onload = function(){
	        newcrawler.initLoad();
	    };
	}
	newcrawler.message("show", "Loading...");
	iframe.src=newcrawler_url;
});

(function($) {
    $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 2147483488).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        }).on("mouseout", function(e) {
        	if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);