
function httpRequestFun(option){
	var httpRequest={
			v:{
				PER_PAGE_ITEMS:2,
				ITEMS_COUNT:0,
				cur_page:0
			},
			fn:{
				init:function(){
					$("#"+obj.v.formId).find(".changeUserAgent").change(function(){
						$("#"+obj.v.formId).find("#userAgent").val(this.value);
					});
					$("#"+obj.v.formId).find(".create").click(function(){
						obj.fn.create();
					});
					$("#"+obj.v.formId).find(".remove").click(function(){
						obj.fn.remove();
					});
					$("#"+obj.v.formId).find(".update").click(function(){
						obj.fn.update();
					});
					$("#"+obj.v.formId).find(".statistic").click(function(){
						obj.fn.statistic();
					});
					
					obj.fn.updateCount();
				},
				initSlider:function(v){
					$("#"+obj.v.formId).find("#timeoutSlider").slider({
				          range: "min",
				          min: 1,
				          max: 20,
				          value: v,
				          slide: function( event, ui ) {
				              $( "#"+obj.v.formId).find("#timeout" ).val( ui.value);
				          }
				    });
					$("#"+obj.v.formId).find("#timeout").val( $( "#"+obj.v.formId).find("#timeoutSlider" ).slider( "value" ));
				},
				statistic:function (){
					showLoading($("#"+obj.v.formId));
					jsonrpc.httpRequestService.statistic(function(result, exception, profile){
						removeLoading($("#"+obj.v.formId));
						if(exception){
							return;
						}
						var msg=result;
						if(msg){
							showInfo(nc.i18n("res.background.statistics"));
						}else{
							showInfo(nc.i18n("res.background.statistics.failure"));
						}
					},obj.v.webCrawlerId);
				},
				updateCount:function (){
					showLoading($("#"+obj.v.formId));
					jsonrpc.httpRequestService.count(function(result,exception,profile){
						removeLoading($("#"+obj.v.formId));
						if(exception){
							return;
						}
						obj.v.ITEMS_COUNT=result;
						obj.fn.query();
						obj.fn.initPagination(obj.v.cur_page);
						$("#"+obj.v.formId).find("#HTTPREQUEST_COUNT").html(obj.v.ITEMS_COUNT);
					},obj.v.webCrawlerId);
				},
				query:function (callback){
					var startIndex=obj.v.cur_page*obj.v.PER_PAGE_ITEMS;
					
					moveAllTr(obj.v.tableId);
					queryLoading(obj.v.tableId);
					jsonrpc.httpRequestService.query(function(result,exception,profile){
						if(exception){
							removeLoading($("#"+obj.v.formId));
							return;
						}
						
						moveAllTr(obj.v.tableId);
						var data=result;
						data=eval(data);
						obj.v.jsonData=data;
						var key=""+obj.v.webCrawlerId;
						httpRequestMap.put(key, data);
						for(var i in data){
							if(isNaN(i)){continue;}
							var id=data[i]["id"];
							var name=data[i]["name"];
							var userAgent=data[i]["userAgent"];
							var method=data[i]["method"];
							var encoding=data[i]["encoding"];
							var payload=data[i]["payload"];
							var timeout=data[i]["timeout"];
							var createDate=data[i]["createDate"];
							obj.fn.addRow ( id, name, userAgent, method, encoding, timeout, createDate);
						}
						$("#"+obj.v.tableId).find(".editHttpRequest").click(function(){
							obj.fn.edit($(this).val());
						});
						removeLoading($("#"+obj.v.formId));
						if(callback){
							callback();
						}
					},obj.v.webCrawlerId, startIndex, obj.v.PER_PAGE_ITEMS);
					
				},
				edit:function (id){
					var data=obj.v.jsonData;
					for ( var i in data) {
						if(isNaN(i)){continue;}
						if(id!=data[i]["id"]){
							continue;
						}
						var name=data[i]["name"];
						var userAgent=data[i]["userAgent"];
						var method=data[i]["method"];
						var encoding=data[i]["encoding"];
						var timeout=data[i]["timeout"];
						var headers=data[i]["requestHeaders"];
						var payload=data[i]["payload"];
						
						$("#"+obj.v.formId).find("#id").val(id);
						$("#"+obj.v.formId).find("#name").val(name);
						$("#"+obj.v.formId).find("#userAgent").val(userAgent);
						$("#"+obj.v.formId).find("#encoding").val(encoding);
						$("#"+obj.v.formId).find("#headers").val(headers);
						$("#"+obj.v.formId).find("#payload").val(payload);
						selectRadio(obj.v.formId, "method",method);
						
						obj.fn.initSlider(timeout);
						return ;
					}
				},
				create:function (){
					var name=$("#"+obj.v.formId).find("#name").val();
					var userAgent=$("#"+obj.v.formId).find("#userAgent").val();
					var method=getRadio(obj.v.formId, "method"); 
					var encoding=$("#"+obj.v.formId).find("#encoding").val();
					var timeout=$("#"+obj.v.formId).find("#timeout").val();
					var headers=$("#"+obj.v.formId).find("#headers").val();
					var payload=$("#"+obj.v.formId).find("#payload").val();
					
					showLoading($("#"+obj.v.formId));
					jsonrpc.httpRequestService.create(function(result, exception, profile){
						removeLoading($("#"+obj.v.formId));
						if(exception){
							return;
						}
						
						var id = result;
						if(!isNum(id)) { 					
							showInfo(nc.i18n("res.create.failure"));
							return;
						}
						showInfo(nc.i18n("res.create.success"));
						obj.fn.query();
						updateSelect(id, name, "httpRequestId");
					},obj.v.webCrawlerId, name, userAgent, method, encoding, timeout, headers, payload);
					
				},
				update:function (){
					var id=$("#"+obj.v.formId).find("#id").val();
					if(id==null || id.length == 0){
						showInfo(nc.i18n("res.select"));
						return;
					}
					
					var name=$("#"+obj.v.formId).find("#name").val();
					var userAgent=$("#"+obj.v.formId).find("#userAgent").val();
					var method=getRadio(obj.v.formId, "method"); 
					var encoding=$("#"+obj.v.formId).find("#encoding").val();
					var timeout=$("#"+obj.v.formId).find("#timeout").val();
					var headers=$("#"+obj.v.formId).find("#headers").val();
					var payload=$("#"+obj.v.formId).find("#payload").val();
					
					showLoading($("#"+obj.v.formId));
					jsonrpc.httpRequestService.update(function(result, exception, profile){
						removeLoading($("#"+obj.v.formId));
						if(exception){
							return;
						}
						
						id = result;
						if(!isNum(id)) {
							showInfo(nc.i18n("res.update.failure"));
							return;
						}
						showInfo(nc.i18n("res.update.success"));
						obj.fn.query();
						updateSelect(id, name, "httpRequestId");
					},obj.v.webCrawlerId, id, name, userAgent, method, encoding, timeout, headers, payload);
					
				},
				remove:function (){
					var id=getRadio(obj.v.formId, "httpRequestList"); 
					if(id==null || id.length == 0){
						showInfo(nc.i18n("res.select"));
						return false;
					}
					if(!confirm(nc.i18n("res.remove.confirm"))){
						return;
					}
					showLoading($("#"+obj.v.formId));
					jsonrpc.httpRequestService.remove(function(result, exception, profile){
						removeLoading($("#"+obj.v.formId));
						if(exception){
							return;
						}
						
						var msg=result;
						if(msg) { 					
							showInfo(nc.i18n("res.remove.success"));
							obj.fn.query();
							removeSelect(id, "httpRequestId");
							return;
						}
						showInfo(nc.i18n("res.remove.failure"));
					},obj.v.webCrawlerId, id);
					
				},
				addRow:function ( id, name, userAgent, method, encoding, timeout, createDate) {
					timeout=(timeout==null?"":timeout);
					//添加一行
					var newTr = "<tr class='simplehighlight'>";
					newTr += '<td nowrap>&nbsp;<input type="radio" name="httpRequestList" id="httpRequestList" value="'+id+'" class="editHttpRequest"/></td>';
					newTr += '<td nowrap>&nbsp;&nbsp;&nbsp;' + name + '</td>';
					newTr += '<td nowrap>' + method + '</td>';
					newTr += '<td nowrap>' + encoding + '</td>';
					
					newTr += '<td nowrap>' + timeout + '</td>';
					
					
					newTr += '<td nowrap>' + createDate + '</td>';
					newTr += "</tr>";
					$(newTr).appendTo("#"+obj.v.tableId);
					
					$("#"+obj.v.tableId).find("tr:odd").css('background', '#FFFFFF'); // 奇数行颜色
					$("#"+obj.v.tableId).find("tr:even").css('background', 'rgb(247, 247, 247)'); // 偶数行颜色
				    
				    $("#"+obj.v.tableId).find(".simplehighlight").hover(function(){
						$(this).children().addClass('datahighlight');
					},function(){
						$(this).children().removeClass('datahighlight');
					});
				},
				initPagination:function (cur_page) {
					// Create pagination element
					$("#"+obj.v.formId).find("#Pagination").pagination(obj.v.ITEMS_COUNT, {
						num_edge_entries: 2,//Number of start and end points
						num_display_entries: 8,//Number of pagination links shown
						current_page:cur_page,
						callback: obj.fn.pageselectCallback,
						items_per_page:obj.v.PER_PAGE_ITEMS,//Number of items per page
						prev_text:nc.i18n("res.page.prev"),
						next_text:nc.i18n("res.page.next")
					});
				 },
				pageselectCallback:function (page_index, jq){
					obj.v.cur_page=page_index;
					showLoading($("#"+obj.v.formId));
					obj.fn.query();
					return false;
				}
			}
	};
	var obj=this;
	obj.fn=httpRequest.fn;
	obj.v=httpRequest.v;
	if(option){
		obj.v=$.extend(obj.v, option);
	}
}
var httpRequest=new httpRequestFun();
	
	