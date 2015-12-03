/*!
 * xhEditor - WYSIWYG XHTML Editor
 * @requires jQuery v1.4.4
 *
 * @author Yanis.Wang<yanis.wang@gmail.com>
 * @site http://xheditor.com/
 * @licence LGPL(http://xheditor.com/license/lgpl.txt)
 *
 * @Version: 1.1.14 (build 120701)
 */
(function($,undefined){
if(window.xheditor)return false;//防止JS重复加载
var agent=navigator.userAgent.toLowerCase();
var bMobile=agent.indexOf('mobile')!==-1,browser=$.browser,browerVer=parseFloat(browser.version),isIE=browser.msie,isMozilla=browser.mozilla,isSafari=browser.safari,isOpera=browser.opera;
var bAir=agent.indexOf(' adobeair/')>-1;
var bIOS5=/OS 5(_\d)+ like Mac OS X/i.test(agent);
$.fn.xheditor=function(options)
{
	if(bMobile&&!bIOS5)return false;//手机浏览器不初始化编辑器(IOS5除外)
	var arrSuccess=[];
	this.each(function(){
		if(!$.nodeName(this,'TEXTAREA'))return;
		if(options===false)//卸载
		{
			if(this.xheditor)
			{
				this.xheditor.remove();
				this.xheditor=null;
			}
		}
		else//初始化
		{
			if(!this.xheditor)
			{
				var tOptions=/({.*})/.exec($(this).attr('class'));
				if(tOptions)
				{
					try{tOptions=eval('('+tOptions[1]+')');}catch(ex){};
					options=$.extend({},tOptions,options );
				}
				var editor=new xheditor(this,options);
				if(editor.init())
				{
					this.xheditor=editor;
					arrSuccess.push(editor);
				}
				else editor=null;
			}
			else arrSuccess.push(this.xheditor);
		}
	});
	if(arrSuccess.length===0)arrSuccess=false;
	if(arrSuccess.length===1)arrSuccess=arrSuccess[0];
	return arrSuccess;
}
var xCount=0,bShowPanel=false,bClickCancel=true,bShowModal=false,bCheckEscInit=false;
var _jPanel,_jShadow,_jCntLine,_jPanelButton;
var jModal,jModalShadow,layerShadow,jOverlay,jHideSelect,onModalRemove;
var editorRoot;
$('script[src*=xheditor]').each(function(){
	var s=this.src;
	if(s.match(/xheditor[^\/]*\.js/i)){editorRoot=s.replace(/[\?#].*$/, '').replace(/(^|[\/\\])[^\/]*$/, '$1');return false;}
});
if(isIE){
	//ie6 缓存背景图片
	try{document.execCommand('BackgroundImageCache', false, true );}
	catch(e){}
	//修正 jquery 1.6,1.7系列在IE6浏览器下造成width="auto"问题的修正
	var jqueryVer=$.fn.jquery;
	if(jqueryVer&&jqueryVer.match(/^1\.[67]/))$.attrHooks['width']=$.attrHooks['height']=null;
}

var specialKeys={ 27: 'esc', 9: 'tab', 32:'space', 13: 'enter', 8:'backspace', 145: 'scroll',
          20: 'capslock', 144: 'numlock', 19:'pause', 45:'insert', 36:'home', 46:'del',
          35:'end', 33: 'pageup', 34:'pagedown', 37:'left', 38:'up', 39:'right',40:'down',
          112:'f1',113:'f2', 114:'f3', 115:'f4', 116:'f5', 117:'f6', 118:'f7', 119:'f8', 120:'f9', 121:'f10', 122:'f11', 123:'f12' };
var itemColors=['#FFFFFF','#CCCCCC','#C0C0C0','#999999','#666666','#333333','#000000','#FFCCCC','#FF6666','#FF0000','#CC0000','#990000','#660000','#330000','#FFCC99','#FF9966','#FF9900','#FF6600','#CC6600','#993300','#663300','#FFFF99','#FFFF66','#FFCC66','#FFCC33','#CC9933','#996633','#663333','#FFFFCC','#FFFF33','#FFFF00','#FFCC00','#999900','#666600','#333300','#99FF99','#66FF99','#33FF33','#33CC00','#009900','#006600','#003300','#99FFFF','#33FFFF','#66CCCC','#00CCCC','#339999','#336666','#003333','#CCFFFF','#66FFFF','#33CCFF','#3366FF','#3333FF','#000099','#000066','#CCCCFF','#9999FF','#6666CC','#6633FF','#6600CC','#333399','#330099','#FFCCFF','#FF99FF','#CC66CC','#CC33CC','#993399','#663366','#330033'];
var arrBlocktag=[{n:'p',t:'普通段落'},{n:'h1',t:'标题1'},{n:'h2',t:'标题2'},{n:'h3',t:'标题3'},{n:'h4',t:'标题4'},{n:'h5',t:'标题5'},{n:'h6',t:'标题6'},{n:'pre',t:'已编排格式'},{n:'address',t:'地址'}];
var arrFontname=[{n:'宋体',c:'SimSun'},{n:'仿宋体',c:'FangSong_GB2312'},{n:'黑体',c:'SimHei'},{n:'楷体',c:'KaiTi_GB2312'},{n:'微软雅黑',c:'Microsoft YaHei'},{n:'Arial'},{n:'Arial Black'},{n:'Comic Sans MS'},{n:'Courier New'},{n:'System'},{n:'Times New Roman'},{n:'Tahoma'},{n:'Verdana'}];
var arrFontsize=[{n:'x-small',s:'10px',t:'极小'},{n:'small',s:'12px',t:'特小'},{n:'medium',s:'16px',t:'小'},{n:'large',s:'18px',t:'中'},{n:'x-large',s:'24px',t:'大'},{n:'xx-large',s:'32px',t:'特大'},{n:'-webkit-xxx-large',s:'48px',t:'极大'}];
var menuAlign=[{s:'左对齐',v:'justifyleft'},{s:'居中',v:'justifycenter'},{s:'右对齐',v:'justifyright'},{s:'两端对齐',v:'justifyfull'}],menuList=[{s:'数字列表',v:'insertOrderedList'},{s:'符号列表',v:'insertUnorderedList'}];
var htmlPastetext='<div><label for="xhePastetextValue">使用键盘快捷键(Ctrl+V)把内容粘贴到方框里，按 确定</label></div><div><textarea id="xhePastetextValue" wrap="soft" spellcheck="false" style="width:300px;height:100px;" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="确定" /></div>';
var htmlLink='<div><label for="xheLinkUrl">链接地址: </label><input type="text" id="xheLinkUrl" value="http://" class="xheText" /></div><div><label for="xheLinkTarget">打开方式: </label><select id="xheLinkTarget"><option selected="selected" value="">默认</option><option value="_blank">新窗口</option><option value="_self">当前窗口</option><option value="_parent">父窗口</option></select></div><div style="display:none"><label for="xheLinkText">链接文字: </label><input type="text" id="xheLinkText" value="" class="xheText" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="确定" /></div>';
var htmlAnchor='<div><label for="xheAnchorName">锚点名称: </label><input type="text" id="xheAnchorName" value="" class="xheText" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="确定" /></div>';
var htmlImg='<div><label for="xheImgUrl">图片文件: </label><input type="text" id="xheImgUrl" value="http://" class="xheText" /></div><div><div><label for="xheImgAlt">替换文本: </label><input type="text" id="xheImgAlt" /></div><div><label for="xheImgAlign">对齐方式: </label><select id="xheImgAlign"><option selected="selected" value="">默认</option><option value="left">左对齐</option><option value="right">右对齐</option><option value="top">顶端</option><option value="middle">居中</option><option value="baseline">基线</option><option value="bottom">底边</option></select></div><div><label for="xheImgWidth">宽　　度: </label><input type="text" id="xheImgWidth" style="width:40px;" /> <label for="xheImgHeight">高　　度: </label><input type="text" id="xheImgHeight" style="width:40px;" /></div><div><label for="xheImgBorder">边框大小: </label><input type="text" id="xheImgBorder" style="width:40px;" /></div><div><label for="xheImgHspace">水平间距: </label><input type="text" id="xheImgHspace" style="width:40px;" /> <label for="xheImgVspace">垂直间距: </label><input type="text" id="xheImgVspace" style="width:40px;" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="确定" /></div>';
var htmlFlash='<div><label for="xheFlashUrl">动画文件: </label><input type="text" id="xheFlashUrl" value="http://" class="xheText" /></div><div><label for="xheFlashWidth">宽　　度: </label><input type="text" id="xheFlashWidth" style="width:40px;" value="480" /> <label for="xheFlashHeight">高　　度: </label><input type="text" id="xheFlashHeight" style="width:40px;" value="400" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="确定" /></div>';
var htmlMedia='<div><label for="xheMediaUrl">媒体文件: </label><input type="text" id="xheMediaUrl" value="http://" class="xheText" /></div><div><label for="xheMediaWidth">宽　　度: </label><input type="text" id="xheMediaWidth" style="width:40px;" value="480" /> <label for="xheMediaHeight">高　　度: </label><input type="text" id="xheMediaHeight" style="width:40px;" value="400" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="确定" /></div>';
var htmlTable='<div><label for="xheTableRows">行　　数: </label><input type="text" id="xheTableRows" style="width:40px;" value="3" /> <label for="xheTableColumns">列　　数: </label><input type="text" id="xheTableColumns" style="width:40px;" value="2" /></div><div><label for="xheTableHeaders">标题单元: </label><select id="xheTableHeaders"><option selected="selected" value="">无</option><option value="row">第一行</option><option value="col">第一列</option><option value="both">第一行和第一列</option></select></div><div><label for="xheTableWidth">宽　　度: </label><input type="text" id="xheTableWidth" style="width:40px;" value="200" /> <label for="xheTableHeight">高　　度: </label><input type="text" id="xheTableHeight" style="width:40px;" value="" /></div><div><label for="xheTableBorder">边框大小: </label><input type="text" id="xheTableBorder" style="width:40px;" value="1" /></div><div><label for="xheTableCellSpacing">表格间距: </label><input type="text" id="xheTableCellSpacing" style="width:40px;" value="1" /> <label for="xheTableCellPadding">表格填充: </label><input type="text" id="xheTableCellPadding" style="width:40px;" value="1" /></div><div><label for="xheTableAlign">对齐方式: </label><select id="xheTableAlign"><option selected="selected" value="">默认</option><option value="left">左对齐</option><option value="center">居中</option><option value="right">右对齐</option></select></div><div><label for="xheTableCaption">表格标题: </label><input type="text" id="xheTableCaption" /></div><div style="text-align:right;"><input type="button" id="xheSave" value="确定" /></div>';
var htmlAbout='<div style="font:12px Arial;width:245px;word-wrap:break-word;word-break:break-all;outline:none;" role="dialog" tabindex="-1"><p><span style="font-size:20px;color:#1997DF;">xhEditor</span><br />v1.1.14 (build 120701)</p><p>xhEditor是基于jQuery开发的跨平台轻量可视化XHTML编辑器，基于<a href="http://www.gnu.org/licenses/lgpl.html" target="_blank">LGPL</a>开源协议发布。</p><p>Copyright &copy; <a href="http://xheditor.com/" target="_blank">xhEditor.com</a>. All rights reserved.</p></div>';
var itemEmots={'default':{name:'默认',width:24,height:24,line:7,list:{'smile':'微笑','tongue':'吐舌头','titter':'偷笑','laugh':'大笑','sad':'难过','wronged':'委屈','fastcry':'快哭了','cry':'哭','wail':'大哭','mad':'生气','knock':'敲打','curse':'骂人','crazy':'抓狂','angry':'发火','ohmy':'惊讶','awkward':'尴尬','panic':'惊恐','shy':'害羞','cute':'可怜','envy':'羡慕','proud':'得意','struggle':'奋斗','quiet':'安静','shutup':'闭嘴','doubt':'疑问','despise':'鄙视','sleep':'睡觉','bye':'再见'}}};
var arrTools={Cut:{t:'剪切 (Ctrl+X)'},Copy:{t:'复制 (Ctrl+C)'},Paste:{t:'粘贴 (Ctrl+V)'},Pastetext:{t:'粘贴文本',h:isIE?0:1},Blocktag:{t:'段落标签',h:1},Fontface:{t:'字体',h:1},FontSize:{t:'字体大小',h:1},Bold:{t:'加粗 (Ctrl+B)',s:'Ctrl+B'},Italic:{t:'斜体 (Ctrl+I)',s:'Ctrl+I'},Underline:{t:'下划线 (Ctrl+U)',s:'Ctrl+U'},Strikethrough:{t:'删除线'},FontColor:{t:'字体颜色',h:1},BackColor:{t:'背景颜色',h:1},SelectAll:{t:'全选 (Ctrl+A)'},Removeformat:{t:'删除文字格式'},Align:{t:'对齐',h:1},List:{t:'列表',h:1},Outdent:{t:'减少缩进'},Indent:{t:'增加缩进'},Link:{t:'超链接 (Ctrl+L)',s:'Ctrl+L',h:1},Unlink:{t:'取消超链接'},Anchor:{t:'锚点',h:1},Img:{t:'图片',h:1},Flash:{t:'Flash动画',h:1},Media:{t:'多媒体文件',h:1},Hr:{t:'插入水平线'},Emot:{t:'表情',s:'ctrl+e',h:1},Table:{t:'表格',h:1},Source:{t:'源代码'},Preview:{t:'预览'},Print:{t:'打印 (Ctrl+P)',s:'Ctrl+P'},Fullscreen:{t:'全屏编辑 (Esc)',s:'Esc'},About:{t:'关于 xhEditor'}};
var toolsThemes={
	mini:'Bold,Italic,Underline,Strikethrough,|,Align,List,|,Link,Img',
	simple:'Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,|,Align,List,Outdent,Indent,|,Link,Img,Emot',
	full:'Cut,Copy,Paste,Pastetext,|,Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,SelectAll,Removeformat,|,Align,List,Outdent,Indent,|,Link,Unlink,Anchor,Img,Flash,Media,Hr,Emot,Table,|,Source,Preview,Print,Fullscreen'};
toolsThemes.mfull=toolsThemes.full.replace(/\|(,Align)/i,'/$1');
var arrDbClick={'a':'Link','img':'Img','embed':'Embed'},uploadInputname='filedata';
var arrEntities={'<':'&lt;','>':'&gt;','"':'&quot;','®':'&reg;','©':'&copy;'};//实体
var regEntities=/[<>"®©]/g;

var xheditor=function(textarea,options)
{
	var _this=this,_text=textarea,_jText=$(_text),_jForm=_jText.closest('form'),_jTools,_jArea,_win,_jWin,_doc,_jDoc;
	var bookmark;
	var bInit=false,bSource=false,bFullscreen=false,bCleanPaste=false,outerScroll,bShowBlocktag=false,sLayoutStyle='',ev=null,timer,bDisableHoverExec=false,bQuickHoverExec=false;
	var lastPoint=null,lastAngle=null;//鼠标悬停显示
	var editorHeight=0;
	var settings=_this.settings=$.extend({},xheditor.settings,options );
	
	var plugins=settings.plugins,strPlugins=[];
	if(plugins)
	{
		arrTools=$.extend({},arrTools,plugins);
		$.each(plugins,function(n){strPlugins.push(n);});
		strPlugins=strPlugins.join(',');
	}
	if(settings.tools.match(/^\s*(m?full|simple|mini)\s*$/i))
	{
		var toolsTheme=toolsThemes[$.trim(settings.tools)];
		settings.tools=(settings.tools.match(/m?full/i)&&plugins)?toolsTheme.replace('Table','Table,'+strPlugins):toolsTheme;//插件接在full的Table后面
	}
	//如需删除关于按钮，请往官方网站购买商业授权：http://xheditor.com/service
	//在未购买商业授权的情况下私自去除xhEditor的版权信息，您将得不到官方提供的任何技术支持和BUG反馈服务，并且我们将对您保留法律诉讼的权利
	//请支持开源项目
	if(!settings.tools.match(/(^|,)\s*About\s*(,|$)/i))settings.tools+=',About';
	settings.tools=settings.tools.split(',');
	if(settings.editorRoot)editorRoot=settings.editorRoot;
	if(bAir===false)editorRoot=getLocalUrl(editorRoot,'abs');
	if(settings.urlBase)settings.urlBase=getLocalUrl(settings.urlBase,'abs');

	//基本控件名
	var idCSS='xheCSS_'+settings.skin,idContainer='xhe'+xCount+'_container',idTools='xhe'+xCount+'_Tool',idIframeArea='xhe'+xCount+'_iframearea',idIframe='xhe'+xCount+'_iframe',idFixFFCursor='xhe'+xCount+'_fixffcursor';
	var headHTML='',bodyClass='',skinPath=editorRoot+'xheditor_skin/'+settings.skin+'/',arrEmots=itemEmots,urlType=settings.urlType,urlBase=settings.urlBase,emotPath=settings.emotPath,emotPath=emotPath?emotPath:editorRoot+'xheditor_emot/',selEmotGroup='';
	arrEmots=$.extend({},arrEmots,settings.emots);
	emotPath=getLocalUrl(emotPath,'rel',urlBase?urlBase:null);//返回最短表情路径

	bShowBlocktag=settings.showBlocktag;
	if(bShowBlocktag)bodyClass+=' showBlocktag';

	var arrShortCuts=[];
	this.init=function()
	{
		//加载样式表
		if($('#'+idCSS).length===0)$('head').append('<link id="'+idCSS+'" rel="stylesheet" type="text/css" href="'+skinPath+'ui.css" />');
		//初始化编辑器
		var textareaWidth=_jText.outerWidth(),textareaHeight=_jText.outerHeight();
		var editorWidth = settings.width || _text.style.width || (textareaWidth>10?textareaWidth:0);
		editorHeight = settings.height || _text.style.height || (textareaHeight>10?textareaHeight:150);//默认高度
		if(is(editorWidth,'number'))editorWidth+='px';
		if(is(editorHeight,'string'))editorHeight=editorHeight.replace(/[^\d]+/g,'');
		
		//编辑器CSS背景
		var editorBackground=settings.background || _text.style.background;

		//工具栏内容初始化
		var arrToolsHtml=['<span class="xheGStart"/>'],tool,cn,regSeparator=/\||\//i;
		$.each(settings.tools,function(i,n)
		{
			if(n.match(regSeparator))arrToolsHtml.push('<span class="xheGEnd"/>');
			if(n==='|')arrToolsHtml.push('<span class="xheSeparator"/>');
			else if(n==='/')arrToolsHtml.push('<br />');
			else
			{
				tool=arrTools[n];
				if(!tool)return;
				if(tool.c)cn=tool.c;
				else cn='xheIcon xheBtn'+n;
				arrToolsHtml.push('<span><a href="#" title="'+tool.t+'" cmd="'+n+'" class="xheButton xheEnabled" tabindex="-1" role="button"><span class="'+cn+'" unselectable="on" style="font-size:0;color:transparent;text-indent:-999px;">'+tool.t+'</span></a></span>');
				if(tool.s)_this.addShortcuts(tool.s,n);
			}
			if(n.match(regSeparator))arrToolsHtml.push('<span class="xheGStart"/>');
		});
		arrToolsHtml.push('<span class="xheGEnd"/><br />');

		_jText.after($('<input type="text" id="'+idFixFFCursor+'" style="position:absolute;display:none;" /><span id="'+idContainer+'" class="xhe_'+settings.skin+'" style="display:none"><table cellspacing="0" cellpadding="0" class="xheLayout" style="'+(editorWidth!='0px'?'width:'+editorWidth+';':'')+'height:'+editorHeight+'px;" role="presentation"><tr><td id="'+idTools+'" class="xheTool" unselectable="on" style="height:1px;" role="presentation"></td></tr><tr><td id="'+idIframeArea+'" class="xheIframeArea" role="presentation"><iframe frameborder="0" id="'+idIframe+'" src="javascript:;" style="width:100%;"></iframe></td></tr></table></span>'));
		_jTools=$('#'+idTools);_jArea=$('#'+idIframeArea);
		
		headHTML='<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><link rel="stylesheet" href="'+skinPath+'iframe.css"/>';
		var loadCSS=settings.loadCSS;
		if(loadCSS)
		{
			if(is(loadCSS,'array'))for(var i in loadCSS)headHTML+='<link rel="stylesheet" href="'+loadCSS[i]+'"/>';
			else
			{
				if(loadCSS.match(/\s*<style(\s+[^>]*?)?>[\s\S]+?<\/style>\s*/i))headHTML+=loadCSS;
				else headHTML+='<link rel="stylesheet" href="'+loadCSS+'"/>';
			}
		}
		
		var iframeHTML='<html><head>'+headHTML+'<title>可视化编辑器,alt+1到9键,切换到工具区,tab键,选择按钮,esc键,返回编辑 '+(settings.readTip?settings.readTip:'')+'</title>';
		if(editorBackground)iframeHTML+='<style>html{background:'+editorBackground+';}</style>';
		iframeHTML+='</head><body spellcheck="0" class="editMode'+bodyClass+'"></body></html>';
		_this.win=_win=$('#'+idIframe)[0].contentWindow;
		_jWin=$(_win);
		try{
			this.doc=_doc = _win.document;_jDoc=$(_doc);
			_doc.open();
			_doc.write(iframeHTML);
			_doc.close();
			if(isIE)_doc.body.contentEditable='true';
			else _doc.designMode = 'On';
		}catch(e){}
		setTimeout(setOpts,300);
		_this.setSource();
		_win.setInterval=null;//针对jquery 1.3无法操作iframe window问题的hack

		//添加工具栏
		_jTools.append(arrToolsHtml.join('')).bind('mousedown contextmenu',returnFalse).click(function(event)
		{
			var jButton=$(event.target).closest('a');
			if(jButton.is('.xheEnabled'))
			{
				clearTimeout(timer);//取消悬停执行
				_jTools.find('a').attr('tabindex','-1');//无障碍支持
				ev=event;
				_this.exec(jButton.attr('cmd'));
			}
			return false;
		});
		_jTools.find('.xheButton').hover(function(event){//鼠标悬停执行
			var jButton=$(this),delay=settings.hoverExecDelay;
			var tAngle=lastAngle;lastAngle=null;
			if(delay===-1||bDisableHoverExec||!jButton.is('.xheEnabled'))return false;
			if(tAngle&&tAngle>10)//检测误操作
			{
				bDisableHoverExec=true;
				setTimeout(function(){bDisableHoverExec=false;},100);
				return false;
			}
			var cmd=jButton.attr('cmd'),bHover=arrTools[cmd].h===1;
			if(!bHover)
			{
				_this.hidePanel();//移到非悬停按钮上隐藏面板
				return false;
			}
			if(bQuickHoverExec)delay=0;
			if(delay>=0)timer=setTimeout(function(){
				ev=event;
				lastPoint={x:ev.clientX,y:ev.clientY};
				_this.exec(cmd);
			},delay);
		},function(event){lastPoint=null;if(timer)clearTimeout(timer);}).mousemove(function(event){
			if(lastPoint)
			{
				var diff={x:event.clientX-lastPoint.x,y:event.clientY-lastPoint.y};
				if(Math.abs(diff.x)>1||Math.abs(diff.y)>1)
				{
					if(diff.x>0&&diff.y>0)
					{
						var tAngle=Math.round(Math.atan(diff.y/diff.x)/0.017453293);
						if(lastAngle)lastAngle=(lastAngle+tAngle)/2
						else lastAngle=tAngle;
					}
					else lastAngle=null;
					lastPoint={x:event.clientX,y:event.clientY};
				}
			}
		});
		//初始化面板
		_jPanel=$('#xhePanel');
		_jShadow=$('#xheShadow');
		_jCntLine=$('#xheCntLine');
		if(_jPanel.length===0)
		{
			_jPanel=$('<div id="xhePanel"></div>').mousedown(function(ev){ev.stopPropagation()});
			_jShadow=$('<div id="xheShadow"></div>');
			_jCntLine=$('<div id="xheCntLine"></div>');
			setTimeout(function(){
				$(document.body).append(_jPanel).append(_jShadow).append(_jCntLine);
			},10);
		}

		//切换显示区域
		$('#'+idContainer).show();
		_jText.hide();
		_jArea.css('height',editorHeight-_jTools.outerHeight());
		if(isIE&browerVer<8)setTimeout(function(){_jArea.css('height',editorHeight-_jTools.outerHeight());},1);

		//绑定内核事件
		_jText.focus(_this.focus);
		_jForm.submit(saveResult).bind('reset', loadReset);//绑定表单的提交和重置事件
		if(settings.submitID)$('#'+settings.submitID).mousedown(saveResult);//自定义绑定submit按钮
		$(window).bind('unload beforeunload',saveResult).bind('resize',fixFullHeight);
		$(document).mousedown(clickCancelPanel);
		if(!bCheckEscInit){$(document).keydown(checkEsc);bCheckEscInit=true;}
		_jWin.focus(function(){if(settings.focus)settings.focus();}).blur(function(){if(settings.blur)settings.blur();});
		if(isSafari)_jWin.click(fixAppleSel);
		_jDoc.mousedown(clickCancelPanel).keydown(checkShortcuts).keypress(forcePtag).dblclick(checkDblClick).bind('mousedown click',function(ev){_jText.trigger(ev.type);});
		if(isIE)
		{
			//IE控件上Backspace会导致页面后退
			_jDoc.keydown(function(ev){var rng=_this.getRng();if(ev.which===8&&rng.item){$(rng.item(0)).remove();return false;}});
			//修正IE拖动img大小不更新width和height属性值的问题
			function fixResize(ev)
			{
				var jImg=$(ev.target),v;
				if(v=jImg.css('width'))jImg.css('width','').attr('width',v.replace(/[^0-9%]+/g, ''));
				if(v=jImg.css('height'))jImg.css('height','').attr('height',v.replace(/[^0-9%]+/g, ''));
			}
			_jDoc.bind('controlselect',function(ev){
				ev=ev.target;if(!$.nodeName(ev,'IMG'))return;
				$(ev).unbind('resizeend',fixResize).bind('resizeend',fixResize);
			});	
		}
		//无障碍支持
		_jDoc.keydown(function(e){
			var which=e.which;
			if(e.altKey&&which>=49&&which<=57){
				_jTools.find('a').attr('tabindex','0');
				_jTools.find('.xheGStart').eq(which-49).next().find('a').focus();
				_doc.title='\uFEFF\uFEFF';
				return false;
			}
		}).click(function(){
			_jTools.find('a').attr('tabindex','-1');
		});
		_jTools.keydown(function(e){
			var which=e.which;
			if(which==27){
				_jTools.find('a').attr('tabindex','-1');
				_this.focus();
			}
			else if(e.altKey&&which>=49&&which<=57){
				_jTools.find('.xheGStart').eq(which-49).next().find('a').focus();
				return false;
			}
		});
		
		var jBody=$(_doc.documentElement);
		//自动清理粘贴内容
		if(isOpera)jBody.bind('keydown',function(e){if(e.ctrlKey&&e.which===86)cleanPaste();});
		else jBody.bind(isIE?'beforepaste':'paste',cleanPaste);
		
		//禁用编辑区域的浏览器默认右键菜单
		if(settings.disableContextmenu)jBody.bind('contextmenu',returnFalse);
		//HTML5编辑区域直接拖放上传
		if(settings.html5Upload)jBody.bind('dragenter dragover',function(ev){var types;if((types=ev.originalEvent.dataTransfer.types)&&$.inArray('Files', types)!==-1)return false;}).bind('drop',function(ev){
			var dataTransfer=ev.originalEvent.dataTransfer,fileList;
			if(dataTransfer&&(fileList=dataTransfer.files)&&fileList.length>0){
				var i,cmd,arrCmd=['Link','Img','Flash','Media'],arrExt=[],strExt;
				for(i in arrCmd){
					cmd=arrCmd[i];
					if(settings['up'+cmd+'Url']&&settings['up'+cmd+'Url'].match(/^[^!].*/i))arrExt.push(cmd+':,'+settings['up'+cmd+'Ext']);//允许上传
				}
				if(arrExt.length===0)return false;//禁止上传
				else strExt=arrExt.join(',');
				function getCmd(fileList){
					var match,fileExt,cmd;
					for(i=0;i<fileList.length;i++){
						fileExt=fileList[i].name.replace(/.+\./,'');
						if(match=strExt.match(new RegExp('(\\w+):[^:]*,'+fileExt+'(?:,|$)','i'))){
							if(!cmd)cmd=match[1];
							else if(cmd!==match[1])return 2;
						}
						else return 1;
					}
					return cmd;					
				}
				cmd=getCmd(fileList);
				if(cmd===1)alert('上传文件的扩展名必需为：'+strExt.replace(/\w+:,/g,''));
				else if(cmd===2)alert('每次只能拖放上传同一类型文件');
				else if(cmd){
					_this.startUpload(fileList,settings['up'+cmd+'Url'],'*',function(arrMsg){
						var arrUrl=[],msg,onUpload=settings.onUpload;
						if(onUpload)onUpload(arrMsg);//用户上传回调
						for(var i=0,c=arrMsg.length;i<c;i++){
							msg=arrMsg[i];
							url=is(msg,'string')?msg:msg.url;
							if(url.substr(0,1)==='!')url=url.substr(1);
							arrUrl.push(url);
						}
						_this.exec(cmd);
						$('#xhe'+cmd+'Url').val(arrUrl.join(' '));
						$('#xheSave').click();
					});
				}
				return false;
			}
		});

		//添加用户快捷键
		var shortcuts=settings.shortcuts;
		if(shortcuts)$.each(shortcuts,function(key,func){_this.addShortcuts(key,func);});

		xCount++;
		bInit=true;

		if(settings.fullscreen)_this.toggleFullscreen();
		else if(settings.sourceMode)setTimeout(_this.toggleSource,20);
		return true;
	}
	this.remove=function()
	{
		_this.hidePanel();
		saveResult();//卸载前同步最新内容到textarea
		
		//取消绑定事件
		_jText.unbind('focus',_this.focus);
		_jForm.unbind('submit',saveResult).unbind('reset', loadReset);
		if(settings.submitID)$('#'+settings.submitID).unbind('mousedown',saveResult);
		$(window).unbind('unload beforeunload',saveResult).unbind('resize',fixFullHeight);
		$(document).unbind('mousedown',clickCancelPanel);

		$('#'+idContainer).remove();
		$('#'+idFixFFCursor).remove();
		
		_jText.show();
		bInit=false;
	}
	this.saveBookmark=function(){
		if(!bSource){
			_this.focus();
			var rng=_this.getRng();
			rng=rng.cloneRange?rng.cloneRange():rng;
			bookmark={'top':_jWin.scrollTop(),'rng':rng};
		}
	}
	this.loadBookmark=function()
	{
		if(bSource||!bookmark)return;
		_this.focus();
		var rng=bookmark.rng;
		if(isIE)rng.select();
		else
		{
			var sel=_this.getSel();
			sel.removeAllRanges();
			sel.addRange(rng);
		}
		_jWin.scrollTop(bookmark.top);
		bookmark=null;
	}
	this.focus=function()
	{
		if(!bSource)_win.focus();
		else $('#sourceCode',_doc).focus();
		if(isIE){
			var rng=_this.getRng();
			if(rng.parentElement&&rng.parentElement().ownerDocument!==_doc)_this.setTextCursor();//修正IE初始焦点问题
		}
		return false;
	}
	this.setTextCursor=function(bLast)
	{
		var rng=_this.getRng(true),cursorNode=_doc.body;
		if(isIE)rng.moveToElementText(cursorNode);
		else{
			var chileName=bLast?'lastChild':'firstChild';
			while(cursorNode.nodeType!=3&&cursorNode[chileName]){cursorNode=cursorNode[chileName];}
			rng.selectNode(cursorNode);
		}
		rng.collapse(bLast?false:true);
		if(isIE)rng.select();
		else{var sel=_this.getSel();sel.removeAllRanges();sel.addRange(rng);}
	}
	this.getSel=function()
	{
		return _doc.selection ? _doc.selection : _win.getSelection();
	}
	this.getRng=function(bNew)
	{
		var sel,rng;
		try{
			if(!bNew){
				sel=_this.getSel();
				rng = sel.createRange ? sel.createRange() : sel.rangeCount > 0?sel.getRangeAt(0):null;
			}
			if(!rng)rng = _doc.body.createTextRange?_doc.body.createTextRange():_doc.createRange();
		}catch (ex){}
		return rng;
	}
	this.getParent=function(tag)
	{
		var rng=_this.getRng(),p;
		if(!isIE)
		{
			p = rng.commonAncestorContainer;
			if(!rng.collapsed)if(rng.startContainer === rng.endContainer&&rng.startOffset - rng.endOffset < 2&&rng.startContainer.hasChildNodes())p = rng.startContainer.childNodes[rng.startOffset];
		}
		else p=rng.item?rng.item(0):rng.parentElement();
		tag=tag?tag:'*';p=$(p);
		if(!p.is(tag))p=$(p).closest(tag);
		return p;
	}
	this.getSelect=function(format)
	{
		var sel=_this.getSel(),rng=_this.getRng(),isCollapsed=true;
		if (!rng || rng.item)isCollapsed=false
		else isCollapsed=!sel || rng.boundingWidth === 0 || rng.collapsed;
		if(format==='text')return isCollapsed ? '' : (rng.text || (sel.toString ? sel.toString() : ''));
		var sHtml;
		if(rng.cloneContents)
		{
			var tmp=$('<div></div>'),c;
			c = rng.cloneContents();
			if(c)tmp.append(c);
			sHtml=tmp.html();
		}
		else if(is(rng.item))sHtml=rng.item(0).outerHTML;
		else if(is(rng.htmlText))sHtml=rng.htmlText;
		else sHtml=rng.toString();
		if(isCollapsed)sHtml='';
		sHtml=_this.processHTML(sHtml,'read');
		sHtml=_this.cleanHTML(sHtml);
		sHtml=_this.formatXHTML(sHtml);
		return sHtml;
	}
	this.pasteHTML=function(sHtml,bStart)
	{
		if(bSource)return false;
		_this.focus();
		sHtml=_this.processHTML(sHtml,'write');
		var sel=_this.getSel(),rng=_this.getRng();
		if(bStart!==undefined)//非覆盖式插入
		{
			if(rng.item)
			{
				var item=rng.item(0);
				rng=_this.getRng(true);
				rng.moveToElementText(item);
				rng.select();
			}
			rng.collapse(bStart);
		}
		sHtml+='<'+(isIE?'img':'span')+' id="_xhe_temp" width="0" height="0" />';
		if(rng.insertNode)
		{
			if($(rng.startContainer).closest('style,script').length>0)return false;//防止粘贴在style和script内部
			rng.deleteContents();
			rng.insertNode(rng.createContextualFragment(sHtml));
		}
		else
		{
			if(sel.type.toLowerCase()==='control'){sel.clear();rng=_this.getRng();};
			rng.pasteHTML(sHtml);
		}
		var jTemp=$('#_xhe_temp',_doc),temp=jTemp[0];
		if(isIE)
		{
			rng.moveToElementText(temp);
			rng.select();
		}
		else
		{
			rng.selectNode(temp); 
			sel.removeAllRanges();
			sel.addRange(rng);
		}
		jTemp.remove();
	}
	this.pasteText=function(text,bStart)
	{
		if(!text)text='';
		text=_this.domEncode(text);
		text = text.replace(/\r?\n/g, '<br />');
		_this.pasteHTML(text,bStart);
	}
	this.appendHTML=function(sHtml)
	{
		if(bSource)return false;
		_this.focus();
		sHtml=_this.processHTML(sHtml,'write');
		$(_doc.body).append(sHtml);
		_this.setTextCursor(true);
	}
	this.domEncode=function(text)
	{
		return text.replace(regEntities,function(c){return arrEntities[c];});
	}
	this.setSource=function(sHtml)
	{
		bookmark=null;
		if(typeof sHtml!=='string'&&sHtml!=='')sHtml=_text.value;
		if(bSource)$('#sourceCode',_doc).val(sHtml);
		else
		{
			if(settings.beforeSetSource)sHtml=settings.beforeSetSource(sHtml);
			sHtml=_this.cleanHTML(sHtml);
			sHtml=_this.formatXHTML(sHtml);
			sHtml=_this.processHTML(sHtml,'write');
			if(isIE){//修正IE会删除可视内容前的script,style,<!--
				_doc.body.innerHTML='<img id="_xhe_temp" width="0" height="0" />'+sHtml;//修正IE会删除&符号后面代码的问题
				$('#_xhe_temp',_doc).remove();
			}
			else _doc.body.innerHTML=sHtml;
		}
	}
	this.processHTML=function(sHtml,mode)
	{
		var appleClass=' class="Apple-style-span"';
		if(mode==='write')
		{//write
			sHtml=sHtml.replace(/(<(\/?)(\w+))((?:\s+[\w\-:]+\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))*)\s*((\/?)>)/g,function(all,left,end1,tag,attr,right,end2){
				tag=tag.toLowerCase();
				if(isMozilla){
					if(tag==='strong')tag='b';
					else if(tag==='em')tag='i';
				}
				else if(isSafari){
					if(tag==='strong'){tag='span';if(!end1)attr+=appleClass+' style="font-weight: bold;"';}
					else if(tag==='em'){tag='span';if(!end1)attr+=appleClass+' style="font-style: italic;"';}
					else if(tag==='u'){tag='span';if(!end1)attr+=appleClass+' style="text-decoration: underline;"';}
					else if(tag==='strike'){tag='span';if(!end1)attr+=appleClass+' style="text-decoration: line-through;"';}
				}
				var emot,addClass='';
				if(tag==='del')tag='strike';//编辑状态统一转为strike
				else if(tag==='img'){
					//恢复emot
					attr=attr.replace(/\s+emot\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i,function(all,v){
						emot=v.match(/^(["']?)(.*)\1/)[2];
						emot=emot.split(',');
						if(!emot[1]){emot[1]=emot[0];emot[0]=''}
						if(emot[0]==='default')emot[0]='';
						return settings.emotMark?all:'';
					});
				}
				else if(tag==='a'){
					if(!attr.match(/ href=[^ ]/i)&&attr.match(/ name=[^ ]/i))addClass+=' xhe-anchor';
					if(end2)right='></a>';
				}
				else if(tag==='table'&&!end1){
					var tb=attr.match(/\s+border\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i);
					if(!tb||tb[1].match(/^(["']?)\s*0\s*\1$/))addClass+=' xhe-border';
				}
				
				var bAppleClass;
				//处理属性
				attr=attr.replace(/\s+([\w\-:]+)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/g,function(all,n,v){
					n=n.toLowerCase();
					v=v.match(/^(["']?)(.*)\1/)[2];
					aft='';//尾部增加属性
					if(isIE&&n.match(/^(disabled|checked|readonly|selected)$/)&&v.match(/^(false|0)$/i))return '';
					//恢复emot
					if(tag==='img'&&emot&&n==='src')return '';
					//保存属性值:src,href
					if(n.match(/^(src|href)$/)){
						aft=' _xhe_'+n+'="'+v+'"';
						if(urlBase)v=getLocalUrl(v,'abs',urlBase);
					}
					//添加class
					if(addClass&&n==='class'){
						v+=' '+addClass;
						addClass='';
					}
					//处理Safari style值
					if(isSafari&&n==='style'){
						if(tag==='span'&&v.match(/(^|;)\s*(font-family|font-size|color|background-color)\s*:\s*[^;]+\s*(;|$)/i))bAppleClass=true;
					}
					return ' '+n+'="'+v+'"'+aft;
				});
				
				//恢复emot
				if(emot){
					var url=emotPath+(emot[0]?emot[0]:'default')+'/'+emot[1]+'.gif';
					attr+=' src="'+url+'" _xhe_src="'+url+'"';
				}
				if(bAppleClass)attr+=appleClass;
				if(addClass)attr+=' class="'+addClass+'"';

				return '<'+end1+tag+attr+right;
			});

			if(isIE)sHtml = sHtml.replace(/&apos;/ig, '&#39;');

			if(!isSafari)
			{
				//style转font
				function style2font(all,tag,left,style,right,content)
				{
					var attrs='',f,s1,s2,c;
					f=style.match(/font-family\s*:\s*([^;"]+)/i);
					if(f)attrs+=' face="'+f[1]+'"';
					s1=style.match(/font-size\s*:\s*([^;"]+)/i);
					if(s1)
					{
						s1=s1[1].toLowerCase();
						for(var j=0;j<arrFontsize.length;j++)if(s1===arrFontsize[j].n||s1===arrFontsize[j].s){s2=j+1;break;}
						if(s2)
						{
							attrs+=' size="'+s2+'"';
							style=style.replace(/(^|;)(\s*font-size\s*:\s*[^;"]+;?)+/ig,'$1');
						}
					}
					c=style.match(/(?:^|[\s;])color\s*:\s*([^;"]+)/i);
					if(c)
					{
						var rgb;
						if(rgb=c[1].match(/\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)){
							c[1]='#';
							for(var i=1;i<=3;i++){
								c[1]+=('0'+(rgb[i]-0).toString(16)).slice(-2);
							}
						}
						c[1]=c[1].replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i,'#$1$1$2$2$3$3');
						attrs+=' color="'+c[1]+'"';
					}
					style=style.replace(/(^|;)(\s*(font-family|color)\s*:\s*[^;"]+;?)+/ig,'$1');
					
					if(attrs!=='')
					{
						if(style)attrs+=' style="'+style+'"';
						return '<font'+(left?left:'')+attrs+(right?right:'')+'>'+content+"</font>";
					}
					else return all;
				}
				sHtml = sHtml.replace(/<(span)(\s+[^>]*?)?\s+style\s*=\s*"((?:[^"]*?;)?\s*(?:font-family|font-size|color)\s*:[^"]*)"( [^>]*)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,style2font);//第3层
				sHtml = sHtml.replace(/<(span)(\s+[^>]*?)?\s+style\s*=\s*"((?:[^"]*?;)?\s*(?:font-family|font-size|color)\s*:[^"]*)"( [^>]*)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/ig,style2font);//第2层
				sHtml = sHtml.replace(/<(span)(\s+[^>]*?)?\s+style\s*=\s*"((?:[^"]*?;)?\s*(?:font-family|font-size|color)\s*:[^"]*)"( [^>]*)?>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/ig,style2font);//最里层
			}

			//表格单元格处理
			sHtml = sHtml.replace(/<(td|th)(\s+[^>]*?)?>(\s|&nbsp;)*<\/\1>/ig,'<$1$2>'+(isIE?'':'<br />')+'</$1>');
		}
		else
		{//read
			if(isSafari)
			{
				//转换apple的style为strong,em等
				var arrAppleSpan=[{r:/font-weight\s*:\s*bold;?/ig,t:'strong'},{r:/font-style\s*:\s*italic;?/ig,t:'em'},{r:/text-decoration\s*:\s*underline;?/ig,t:'u'},{r:/text-decoration\s*:\s*line-through;?/ig,t:'strike'}];
				function replaceAppleSpan(all,tag,attr1,attr2,content)
				{
					var attr=(attr1?attr1:'')+(attr2?attr2:'');
					var arrPre=[],arrAft=[];
					var regApple,tagApple;
					for(var i=0;i<arrAppleSpan.length;i++)
					{
						regApple=arrAppleSpan[i].r;
						tagApple=arrAppleSpan[i].t;
						attr=attr.replace(regApple,function(){
							arrPre.push("<"+tagApple+">");
							arrAft.push("</"+tagApple+">");
							return '';
						});
					}
					attr=attr.replace(/\s+style\s*=\s*"\s*"/i,'');
					return (attr?'<span'+attr+'>':'')+arrPre.join('')+content+arrAft.join('')+(attr?'</span>':'');
				}
				for(var i=0;i<2;i++){
					sHtml = sHtml.replace(/<(span)(\s+[^>]*?)?\s+class\s*=\s*"Apple-style-span"(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,replaceAppleSpan);//第3层
					sHtml = sHtml.replace(/<(span)(\s+[^>]*?)?\s+class\s*=\s*"Apple-style-span"(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/ig,replaceAppleSpan);//第2层
					sHtml = sHtml.replace(/<(span)(\s+[^>]*?)?\s+class\s*=\s*"Apple-style-span"(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/ig,replaceAppleSpan);//最里层				
				}
			}
			
			sHtml=sHtml.replace(/(<(\w+))((?:\s+[\w\-:]+\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))*)\s*(\/?>)/g,function(all,left,tag,attr,right){
				tag=tag.toLowerCase();
				//恢复属性值src,href
				var saveValue;
				attr=attr.replace(/\s+_xhe_(?:src|href)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i,function(all,v){saveValue=v.match(/^(["']?)(.*)\1/)[2];return '';});
				if(saveValue&&urlType)saveValue=getLocalUrl(saveValue,urlType,urlBase);
				
				attr=attr.replace(/\s+([\w\-:]+)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/g,function(all,n,v){
					n=n.toLowerCase();
					v=v.match(/^(["']?)(.*)\1/)[2].replace(/"/g,"'");
					if(n==='class'){//清理class属性
						if(v.match(/^["']?(apple|webkit)/i))return '';
						v=v.replace(/\s?xhe-[a-z]+/ig,'');
						if(v==='')return '';
					}
					else if(n.match(/^((_xhe_|_moz_|_webkit_)|jquery\d+)/i))return '';//清理临时属性					
					else if(saveValue&&n.match(/^(src|href)$/i))return ' '+n+'="'+saveValue+'"';//恢复属性值src,href
					else if(n==='style'){//转换font-size的keyword到px单位
						v=v.replace(/(^|;)\s*(font-size)\s*:\s*([a-z-]+)\s*(;|$)/i,function(all,left,n,v,right){
							var t,s;
							for(var i=0;i<arrFontsize.length;i++)
							{
								t=arrFontsize[i];
								if(v===t.n){s=t.s;break;}
							}
							return left+n+':'+s+right;
						});
					}
					return ' '+n+'="'+v+'"';
				});
				
				//img强制加alt
				if(tag==='img'&&!attr.match(/\s+alt\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/i))attr+=' alt=""';
				return left+attr+right;
			});
			//表格单元格处理
			sHtml = sHtml.replace(/(<(td|th)(?:\s+[^>]*?)?>)\s*([\s\S]*?)(<br(\s*\/)?>)?\s*<\/\2>/ig,function(all,left,tag,content){return left+(content?content:'&nbsp;')+'</'+tag+'>';});
			//修正浏览器在空内容情况下多出来的代码
			sHtml=sHtml.replace(/^\s*(?:<(p|div)(?:\s+[^>]*?)?>)?\s*(<span(?:\s+[^>]*?)?>\s*<\/span>|<br(?:\s+[^>]*?)?>|&nbsp;)*\s*(?:<\/\1>)?\s*$/i, '');
		}
		//写和读innerHTML前pre中<br>转\r\n
		sHtml=sHtml.replace(/(<pre(?:\s+[^>]*?)?>)([\s\S]+?)(<\/pre>)/gi,function(all,left,code,right){
			return left+code.replace(/<br\s*\/?>/ig,'\r\n')+right;
		});
		return sHtml;
	}
	this.getSource=function(bFormat)
	{
		var sHtml,beforeGetSource=settings.beforeGetSource;
		if(bSource)
		{
			sHtml=$('#sourceCode',_doc).val();
			if(!beforeGetSource)sHtml=_this.formatXHTML(sHtml,false);
		}
		else
		{
			sHtml=_this.processHTML(_doc.body.innerHTML,'read');
			sHtml=_this.cleanHTML(sHtml);
			sHtml=_this.formatXHTML(sHtml,bFormat);
			if(beforeGetSource)sHtml=beforeGetSource(sHtml);
		}
		_text.value=sHtml;
		return sHtml;
	}
	this.cleanWord=function(sHtml)
	{
		var cleanPaste=settings.cleanPaste;
		if(cleanPaste>0&&cleanPaste<3&&/mso(-|normal)|WordDocument|<table\s+[^>]*?x:str|\s+class\s*=\s*"?xl[67]\d"/i.test(sHtml))
		{
			//区块标签清理
			sHtml = sHtml.replace(/<!--[\s\S]*?-->|<!(--)?\[[\s\S]+?\](--)?>|<style(\s+[^>]*?)?>[\s\S]*?<\/style>/ig, '');
			
			sHtml = sHtml.replace(/\r?\n/ig, '');
			
			//保留Word图片占位
			if(isIE){
				sHtml = sHtml.replace(/<v:shapetype(\s+[^>]*)?>[\s\S]*<\/v:shapetype>/ig,'');
				
				sHtml = sHtml.replace(/<v:shape(\s+[^>]+)?>[\s\S]*?<v:imagedata(\s+[^>]+)?>\s*<\/v:imagedata>[\s\S]*?<\/v:shape>/ig,function(all,attr1,attr2){
					var match;
					match = attr2.match(/\s+src\s*=\s*("[^"]+"|'[^']+'|[^>\s]+)/i);
					if(match){
						match = match[1].match(/^(["']?)(.*)\1/)[2];
						var sImg ='<img src="'+editorRoot+'xheditor_skin/blank.gif'+'" _xhe_temp="true" class="wordImage"';
						match = attr1.match(/\s+style\s*=\s*("[^"]+"|'[^']+'|[^>\s]+)/i);
						if(match){
							match = match[1].match(/^(["']?)(.*)\1/)[2];
							sImg += ' style="' + match + '"';
						}
						sImg += ' />';
						return sImg;
					}
					return '';
				});
			}
			else{
				sHtml = sHtml.replace(/<img( [^<>]*(v:shapes|msohtmlclip)[^<>]*)\/?>/ig,function(all,attr){
					var match,str = '<img src="'+editorRoot+'xheditor_skin/blank.gif'+'" _xhe_temp="true" class="wordImage"';
					match = attr.match(/ width\s*=\s*"([^"]+)"/i);
					if(match)str += ' width="'+match[1]+'"';
					match = attr.match(/ height\s*=\s*"([^"]+)"/i);
					if(match)str += ' height="'+match[1]+'"';
					return str + ' />';
				});
			}
			
			sHtml=sHtml.replace(/(<(\/?)([\w\-:]+))((?:\s+[\w\-:]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))?)*)\s*(\/?>)/g,function(all,left,end,tag,attr,right){
				tag=tag.toLowerCase();
				if((tag.match(/^(link)$/)&&attr.match(/file:\/\//i))||tag.match(/:/)||(tag==='span'&&cleanPaste===2))return '';
				if(!end){
					attr=attr.replace(/\s([\w\-:]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^>\s]+))?/ig,function(all,n,v){
						n=n.toLowerCase();
						if(/:/.test(n))return '';
						v=v.match(/^(["']?)(.*)\1/)[2];
						if(cleanPaste===1){//简单清理
							switch(tag){
								case 'p':
									if(n === 'style'){
										v=v.replace(/"|&quot;/ig,"'").replace(/\s*([^:]+)\s*:\s*(.*?)(;|$)/ig,function(all,n,v){
											return /^(text-align)$/i.test(n)?(n+':'+v+';'):'';
										}).replace(/^\s+|\s+$/g,'');
										return v?(' '+n+'="'+v+'"'):'';
									}
									break;
								case 'span':
									if(n === 'style'){
										v=v.replace(/"|&quot;/ig,"'").replace(/\s*([^:]+)\s*:\s*(.*?)(;|$)/ig,function(all,n,v){
											return /^(color|background|font-size|font-family)$/i.test(n)?(n+':'+v+';'):'';
										}).replace(/^\s+|\s+$/g,'');
										return v?(' '+n+'="'+v+'"'):'';
									}
									break;
								case 'table':
									if(n.match(/^(cellspacing|cellpadding|border|width)$/i))return all;
									break;
								case 'td':
									if(n.match(/^(rowspan|colspan)$/i))return all;
									if(n === 'style'){
										v=v.replace(/"|&quot;/ig,"'").replace(/\s*([^:]+)\s*:\s*(.*?)(;|$)/ig,function(all,n,v){
											return /^(width|height)$/i.test(n)?(n+':'+v+';'):'';
										}).replace(/^\s+|\s+$/g,'');
										return v?(' '+n+'="'+v+'"'):'';
									}
									break;
								case 'a':
									if(n.match(/^(href)$/i))return all;
									break;
								case 'font':
								case 'img':
									return all;
									break;
							}
						}
						else if(cleanPaste===2){
							switch(tag){
								case 'td':
									if(n.match(/^(rowspan|colspan)$/i))return all;
									break;
								case 'img':
									return all;
							}
						}
						return '';
					});
				}
				return left+attr+right;
			});
			//空内容的标签
			for(var i=0;i<3;i++)sHtml = sHtml.replace( /<([^\s>]+)(\s+[^>]*)?>\s*<\/\1>/g,'');
			//无属性的无意义标签
			function cleanEmptyTag(all,tag,content){
				return content;
			}
			for(var i=0;i<3;i++)sHtml = sHtml.replace(/<(span|a)>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,cleanEmptyTag);//第3层
			for(var i=0;i<3;i++)sHtml = sHtml.replace(/<(span|a)>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/ig,cleanEmptyTag);//第2层
			for(var i=0;i<3;i++)sHtml = sHtml.replace(/<(span|a)>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/ig,cleanEmptyTag);//最里层
			//合并多个font
			for(var i=0;i<3;i++)sHtml = sHtml.replace(/<font(\s+[^>]+)><font(\s+[^>]+)>/ig,function(all,attr1,attr2){		
				return '<font'+attr1+attr2+'>';
			});
			//清除表格间隙里的空格等特殊字符
			sHtml=sHtml.replace(/(<(\/?)(tr|td)(?:\s+[^>]+)?>)[^<>]+/ig,function(all,left,end,tag){
				if(!end&&/^td$/i.test(tag))return all;
				else return left;
			});
		}
		return sHtml;
	}
	this.cleanHTML=function(sHtml)
	{
		sHtml = sHtml.replace(/<!?\/?(DOCTYPE|html|body|meta)(\s+[^>]*?)?>/ig, '');
		var arrHeadSave;sHtml = sHtml.replace(/<head(?:\s+[^>]*?)?>([\s\S]*?)<\/head>/i, function(all,content){arrHeadSave=content.match(/<(script|style)(\s+[^>]*?)?>[\s\S]*?<\/\1>/ig);return '';});
		if(arrHeadSave)sHtml=arrHeadSave.join('')+sHtml;
		sHtml = sHtml.replace(/<\??xml(:\w+)?(\s+[^>]*?)?>([\s\S]*?<\/xml>)?/ig, '');

		if(!settings.internalScript)sHtml = sHtml.replace(/<script(\s+[^>]*?)?>[\s\S]*?<\/script>/ig, '');
		if(!settings.internalStyle)sHtml = sHtml.replace(/<style(\s+[^>]*?)?>[\s\S]*?<\/style>/ig, '');
		if(!settings.linkTag||!settings.inlineScript||!settings.inlineStyle)sHtml=sHtml.replace(/(<(\w+))((?:\s+[\w-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))*)\s*(\/?>)/ig,function(all,left,tag,attr,right){
			if(!settings.linkTag&&tag.toLowerCase()==='link')return '';
			if(!settings.inlineScript)attr=attr.replace(/\s+on(?:click|dblclick|mouse(down|up|move|over|out|enter|leave|wheel)|key(down|press|up)|change|select|submit|reset|blur|focus|load|unload)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/ig,'');
			if(!settings.inlineStyle)attr=attr.replace(/\s+(style|class)\s*=\s*("[^"]*"|'[^']*'|[^>\s]+)/ig,'');
			return left+attr+right;
		});
		sHtml=sHtml.replace(/<\/(strong|b|u|strike|em|i)>((?:\s|<br\/?>|&nbsp;)*?)<\1(\s+[^>]*?)?>/ig,'$2');//连续相同标签

		return sHtml;

	}
	this.formatXHTML=function(sHtml,bFormat){

		var emptyTags = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");//HTML 4.01
		var blockTags = makeMap("address,applet,blockquote,button,center,dd,dir,div,dl,dt,fieldset,form,frameset,h1,h2,h3,h4,h5,h6,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,table,tbody,td,tfoot,th,thead,tr,ul,script");//HTML 4.01
		var inlineTags = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");//HTML 4.01
		var closeSelfTags = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
		var fillAttrsTags = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");
		var cdataTags = makeMap("script,style");
		var tagReplac={'b':'strong','i':'em','s':'del','strike':'del'};
		
		var regTag=/<(?:\/([^\s>]+)|!([^>]*?)|([\w\-:]+)((?:"[^"]*"|'[^']*'|[^"'<>])*)\s*(\/?))>/g;
		var regAttr = /\s*([\w\-:]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g;
		var results=[],stack=[];
		stack.last = function(){return this[ this.length - 1 ];};
		var match,tagIndex,nextIndex=0,tagName,tagCDATA,arrCDATA,text;
		var lvl=-1,lastTag='body',lastTagStart,stopFormat=false;

		while(match=regTag.exec(sHtml)){
			tagIndex = match.index;
			if(tagIndex>nextIndex){//保存前面的文本或者CDATA
				text=sHtml.substring(nextIndex,tagIndex);
				if(tagCDATA)arrCDATA.push(text);
				else onText(text);
			}
			nextIndex = regTag.lastIndex;

			if(tagName=match[1]){//结束标签
				tagName=processTag(tagName);
				if(tagCDATA&&tagName===tagCDATA){//结束标签前输出CDATA
					onCDATA(arrCDATA.join(''));
					tagCDATA=null;
					arrCDATA=null;
				}
				if(!tagCDATA){
					onEndTag(tagName);
					continue;
				}
			}
			
			if(tagCDATA)arrCDATA.push(match[0]);
			else{
				if(tagName=match[3]){//开始标签
					tagName=processTag(tagName);
					onStartTag(tagName,match[4],match[5]);
					if(cdataTags[tagName]){
						tagCDATA=tagName;
						arrCDATA=[];
					}
				}
				else if(match[2])onComment(match[0]);//注释标签
			}

		}
		if(sHtml.length>nextIndex)onText(sHtml.substring(nextIndex,sHtml.length ));//结尾文本
		onEndTag();//封闭未结束的标签
		sHtml=results.join('');
		results=null;
		
		function makeMap(str)
		{
			var obj = {}, items = str.split(",");
			for ( var i = 0; i < items.length; i++ )obj[ items[i] ] = true;
			return obj;
		}
		function processTag(tagName)
		{
			tagName=tagName.toLowerCase();
			var tag=tagReplac[tagName];
			return tag?tag:tagName;
		}
		function onStartTag(tagName,rest,unary)
		{
			if(blockTags[tagName])while(stack.last()&&inlineTags[stack.last()])onEndTag(stack.last());//块标签
			if(closeSelfTags[tagName]&&stack.last()===tagName)onEndTag(tagName);//自封闭标签
			unary = emptyTags[ tagName ] || !!unary;
			if (!unary)stack.push(tagName);
			
			var all=Array();
			all.push('<' + tagName);
			rest.replace(regAttr, function(match, name)
			{
				name=name.toLowerCase();
				var value = arguments[2] ? arguments[2] :
						arguments[3] ? arguments[3] :
						arguments[4] ? arguments[4] :
						fillAttrsTags[name] ? name : "";
				all.push(' '+name+'="'+value.replace(/"/g,"'")+'"');
			});
			all.push((unary ? " /" : "") + ">");
			addHtmlFrag(all.join(''),tagName,true);
			if(tagName==='pre')stopFormat=true;
		}
		function onEndTag(tagName)
		{
			if(!tagName)var pos=0;//清空栈
			else for(var pos=stack.length-1;pos>=0;pos--)if(stack[pos]===tagName)break;//向上寻找匹配的开始标签
			if(pos>=0)
			{
				for(var i=stack.length-1;i>=pos;i--)addHtmlFrag("</" + stack[i] + ">",stack[i]);
				stack.length=pos;
			}
			if(tagName==='pre'){
				stopFormat=false;
				lvl--;
			}
		}
		function onText(text){
			addHtmlFrag(_this.domEncode(text));
		}
		function onCDATA(text){
			results.push(text.replace(/^[\s\r\n]+|[\s\r\n]+$/g,''));
		}
		function onComment(text){
			results.push(text);
		}
		function addHtmlFrag(html,tagName,bStart)
		{
			if(!stopFormat)html=html.replace(/(\t*\r?\n\t*)+/g,'');//清理换行符和相邻的制表符
			if(!stopFormat&&bFormat===true)
			{
				if(html.match(/^\s*$/)){//不格式化空内容的标签
					results.push(html);
					return;
				}
				var bBlock=blockTags[tagName],tag=bBlock?tagName:'';
				if(bBlock)
				{
					if(bStart)lvl++;//块开始
					if(lastTag==='')lvl--;//补文本结束
				}
				else if(lastTag)lvl++;//文本开始
				if(tag!==lastTag||bBlock)addIndent();
				results.push(html);
				if(tagName==='br')addIndent();//回车强制换行
				if(bBlock&&(emptyTags[tagName]||!bStart))lvl--;//块结束
				lastTag=bBlock?tagName:'';lastTagStart=bStart;
			}
			else results.push(html);
		}
		function addIndent(){results.push('\r\n');if(lvl>0){var tabs=lvl;while(tabs--)results.push("\t");}}
		//font转style
		function font2style(all,tag,attrs,content)
		{
			if(!attrs)return content;
			var styles='',f,s,c,style;
			attrs=attrs.replace(/ face\s*=\s*"\s*([^"]*)\s*"/i,function(all,v){
				if(v)styles+='font-family:'+v+';';
				return '';
			});
			attrs=attrs.replace(/ size\s*=\s*"\s*(\d+)\s*"/i,function(all,v){
				styles+='font-size:'+arrFontsize[(v>7?7:(v<1?1:v))-1].s+';';
				return '';
			});
			attrs=attrs.replace(/ color\s*=\s*"\s*([^"]*)\s*"/i,function(all,v){
				if(v)styles+='color:'+v+';';
				return '';
			});
			attrs=attrs.replace(/ style\s*=\s*"\s*([^"]*)\s*"/i,function(all,v){
				if(v)styles+=v;
				return '';
			});
			attrs+=' style="'+styles+'"';
			return attrs?('<span'+attrs+'>'+content+'</span>'):content;
		}
		sHtml = sHtml.replace(/<(font)(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?<\/\1>)*?)<\/\1>/ig,font2style);//第3层
		sHtml = sHtml.replace(/<(font)(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S]|<\1(\s+[^>]*?)?>((?!<\1(\s+[^>]*?)?>)[\s\S])*?<\/\1>)*?)<\/\1>/ig,font2style);//第2层
		sHtml = sHtml.replace(/<(font)(\s+[^>]*?)?>(((?!<\1(\s+[^>]*?)?>)[\s\S])*?)<\/\1>/ig,font2style);//最里层
		sHtml = sHtml.replace(/^(\s*\r?\n)+|(\s*\r?\n)+$/g,'');//清理首尾换行
		return sHtml;
	}
	this.toggleShowBlocktag=function(state)
	{
		if(bShowBlocktag===state)return;
		bShowBlocktag=!bShowBlocktag;
		var _jBody=$(_doc.body);
		if(bShowBlocktag)
		{
			bodyClass+=' showBlocktag';
			_jBody.addClass('showBlocktag');
		}
		else
		{
			bodyClass=bodyClass.replace(' showBlocktag','');
			_jBody.removeClass('showBlocktag');
		}
	}
	this.toggleSource=function(state)
	{
		if(bSource===state)return;
		_jTools.find('[cmd=Source]').toggleClass('xheEnabled').toggleClass('xheActive');
		var _body=_doc.body,jBody=$(_body),sHtml;
		var sourceCode,cursorMark='<span id="_xhe_cursor"></span>',cursorPos=0;
		var txtSourceTitle='';
		if(!bSource)
		{//转为源代码模式
			_this.pasteHTML(cursorMark,true);//标记当前位置
			sHtml=_this.getSource(true);
			cursorPos=sHtml.indexOf(cursorMark);
			if(!isOpera)cursorPos=sHtml.substring(0,cursorPos).replace(/\r/g,'').length;//修正非opera光标定位点
			sHtml=sHtml.replace(/(\r?\n\s*|)<span id="_xhe_cursor"><\/span>(\s*\r?\n|)/,function(all,left,right){
				return left&&right?'\r\n':left+right;//只有定位符的空行删除当前行
			});
			if(isIE)_body.contentEditable='false';
			else _doc.designMode = 'Off';
			jBody.attr('scroll','no').attr('class','sourceMode').html('<textarea id="sourceCode" wrap="soft" spellcheck="false" style="width:100%;height:100%" />');
			sourceCode=$('#sourceCode',jBody).blur(_this.getSource)[0];
			txtSourceTitle='可视化编辑';
		}
		else
		{//转为编辑模式
			sHtml=_this.getSource();
			jBody.html('').removeAttr('scroll').attr('class','editMode'+bodyClass);
			if(isIE)_body.contentEditable='true';
			else _doc.designMode = 'On';
			if(isMozilla)
			{
				_this._exec("inserthtml","-");//修正firefox源代码切换回来无法删除文字的问题
				$('#'+idFixFFCursor).show().focus().hide();//临时修正Firefox 3.6光标丢失问题
			}
			txtSourceTitle='源代码';
		}
		bSource=!bSource;
		_this.setSource(sHtml);
		_this.focus();
		if(bSource)//光标定位源码
		{
			if(sourceCode.setSelectionRange)sourceCode.setSelectionRange(cursorPos, cursorPos);
			else
			{
				var rng = sourceCode.createTextRange();
				rng.move("character",cursorPos);
				rng.select();
			}
		}
		else _this.setTextCursor();//定位最前面
		_jTools.find('[cmd=Source]').attr('title',txtSourceTitle).find('span').text(txtSourceTitle);
		_jTools.find('[cmd=Source],[cmd=Preview]').toggleClass('xheEnabled');
		_jTools.find('.xheButton').not('[cmd=Source],[cmd=Fullscreen],[cmd=About]').toggleClass('xheEnabled').attr('aria-disabled',bSource?true:false);//无障碍支持
		setTimeout(setOpts,300);
	}
	this.showPreview=function()
	{
		var beforeSetSource=settings.beforeSetSource,sContent=_this.getSource();
		if(beforeSetSource)sContent=beforeSetSource(sContent);
		var sHTML='<html><head>'+headHTML+'<title>预览</title>'+(urlBase?'<base href="'+urlBase+'"/>':'')+'</head><body>' + sContent + '</body></html>';
		var screen=window.screen,oWindow=window.open('', 'xhePreview', 'toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width='+Math.round(screen.width*0.9)+',height='+Math.round(screen.height*0.8)+',left='+Math.round(screen.width*0.05)),oDoc=oWindow.document;
		oDoc.open();
		oDoc.write(sHTML);
		oDoc.close();
		oWindow.focus();
	}
	this.toggleFullscreen=function(state)
	{
		if(bFullscreen===state)return;
		var jLayout=$('#'+idContainer).find('.xheLayout'),jContainer=$('#'+idContainer),browserVer=jQuery.browser.version,isIE67=(isIE&&(browserVer==6||browserVer==7));
		if(bFullscreen)
		{//取消全屏
			if(isIE67)_jText.after(jContainer);
			jLayout.attr('style',sLayoutStyle);
			_jArea.height(editorHeight-_jTools.outerHeight());
			$(window).scrollTop(outerScroll);
			setTimeout(function(){$(window).scrollTop(outerScroll);},10);//Firefox需要延迟设置
		}
		else
		{//显示全屏
			if(isIE67)$('body').append(jContainer);
			outerScroll=$(window).scrollTop();
			sLayoutStyle=jLayout.attr('style');
			jLayout.removeAttr('style');
			_jArea.height('100%');
			setTimeout(fixFullHeight,100);
		}
		if(isMozilla)//临时修正Firefox 3.6源代码光标丢失问题
		{
			$('#'+idFixFFCursor).show().focus().hide();
			setTimeout(_this.focus,1);
		}
		else if(isIE67)_this.setTextCursor();
		bFullscreen=!bFullscreen;
		jContainer.toggleClass('xhe_Fullscreen');
		$('html').toggleClass('xhe_Fullfix');
		_jTools.find('[cmd=Fullscreen]').toggleClass('xheActive');
		setTimeout(setOpts,300);
	}
	this.showMenu=function(menuitems,callback)
	{
		var jMenu=$('<div class="xheMenu"></div>'),menuSize=menuitems.length,arrItem=[];
		$.each(menuitems,function(n,v){
			if(v.s==='-'){
				arrItem.push('<div class="xheMenuSeparator"></div>');
			}else{
				arrItem.push('<a href="javascript:void(\''+v.v+'\')" title="'+(v.t?v.t:v.s)+'" v="'+v.v+'" role="option" aria-setsize="'+menuSize+'" aria-posinset="'+(n+1)+'" tabindex="0">'+v.s+'</a>');
			}
		});
		jMenu.append(arrItem.join(''));
		jMenu.click(function(ev){
			ev=ev.target;
			if($.nodeName(ev,'DIV'))return;
			_this.loadBookmark();
			callback($(ev).closest('a').attr('v'));
			_this.hidePanel();
			return false;
		}).mousedown(returnFalse);
		_this.saveBookmark();
		_this.showPanel(jMenu);
	}
	this.showColor=function(callback)
	{
		var jColor=$('<div class="xheColor"></div>'),arrItem=[],colorSize=itemColors.length,count=0;
		$.each(itemColors,function(n,v)
		{
			if(count%7===0)arrItem.push((count>0?'</div>':'')+'<div>');
			arrItem.push('<a href="javascript:void(\''+v+'\')" xhev="'+v+'" title="'+v+'" style="background:'+v+'" role="option" aria-setsize="'+colorSize+'" aria-posinset="'+(count+1)+'"></a>');
			count++;
		});
		arrItem.push('</div>');
		jColor.append(arrItem.join(''));
		jColor.click(function(ev){
			ev=ev.target;
			if(!$.nodeName(ev,'A'))return;
			_this.loadBookmark();
			callback($(ev).attr('xhev'));
			_this.hidePanel();
			return false;
		}).mousedown(returnFalse);
		_this.saveBookmark();
		_this.showPanel(jColor);
	}
	this.showPastetext=function()
	{
		var jPastetext=$(htmlPastetext),jValue=$('#xhePastetextValue',jPastetext),jSave=$('#xheSave',jPastetext);
		jSave.click(function(){
			_this.loadBookmark();
			var sValue=jValue.val();
			if(sValue)_this.pasteText(sValue);
			_this.hidePanel();
			return false;
		});
		_this.saveBookmark();
		_this.showDialog(jPastetext);
	}
	this.showLink=function()
	{
		var htmlTemp=htmlLink,$arrAnchor=_jDoc.find('a[name]').not('[href]'),haveAnchor=$arrAnchor.length>0;
		if(haveAnchor){//页内有锚点
			var arrAnchorOptions=[];
			$arrAnchor.each(function(){
				var name=$(this).attr('name');
				arrAnchorOptions.push('<option value="#'+name+'">'+name+'</option>');
			});
			htmlTemp=htmlTemp.replace(/(<div><label for="xheLinkTarget)/,'<div><label for="xheLinkAnchor">页内锚点: </label><select id="xheLinkAnchor"><option value="">未选择</option>'+arrAnchorOptions.join('')+'</select></div>$1');
		}
		var jLink=$(htmlTemp),jParent=_this.getParent('a'),jText=$('#xheLinkText',jLink),jUrl=$('#xheLinkUrl',jLink),jTarget=$('#xheLinkTarget',jLink),jSave=$('#xheSave',jLink),selHtml=_this.getSelect();
		if(haveAnchor){
			jLink.find('#xheLinkAnchor').change(function(){
				var anchor=$(this).val();
				if(anchor!='')jUrl.val(anchor);
			});
		}
		if(jParent.length===1)
		{
			if(!jParent.attr('href')){//锚点
				ev=null;
				return _this.exec('Anchor');
			}
			jUrl.val(xheAttr(jParent,'href'));
			jTarget.attr('value',jParent.attr('target'));
		}
		else if(selHtml==='')jText.val(settings.defLinkText).closest('div').show();
		if(settings.upLinkUrl)_this.uploadInit(jUrl,settings.upLinkUrl,settings.upLinkExt);
		jSave.click(function(){
			_this.loadBookmark();
			var url=jUrl.val();
			if(url===''||jParent.length===0)_this._exec('unlink');
			if(url!==''&&url!=='http://')
			{
				var aUrl=url.split(' '),sTarget=jTarget.val(),sText=jText.val();
				if(aUrl.length>1)
				{//批量插入
					_this._exec('unlink');//批量前删除当前链接并重新获取选择内容
					selHtml=_this.getSelect();
					var sTemplate='<a href="xhe_tmpurl"',sLink,arrLink=[];
					if(sTarget!=='')sTemplate+=' target="'+sTarget+'"';
					sTemplate+='>xhe_tmptext</a>';
					sText=(selHtml!==''?selHtml:(sText?sText:url));
					for(var i=0,c=aUrl.length;i<c;i++)
					{
						url=aUrl[i];
						if(url!=='')
						{
							url=url.split('||');
							sLink=sTemplate;
							sLink=sLink.replace('xhe_tmpurl',url[0]);
							sLink=sLink.replace('xhe_tmptext',url[1]?url[1]:sText);
							arrLink.push(sLink);
						}
					}
					_this.pasteHTML(arrLink.join('&nbsp;'));
				}
				else
				{//单url模式
					url=aUrl[0].split('||');
					if(!sText)sText=url[0];
					sText=url[1]?url[1]:(selHtml!=='')?'':sText?sText:url[0];
					if(jParent.length===0)
					{
						if(sText)_this.pasteHTML('<a href="#xhe_tmpurl">'+sText+'</a>');
						else _this._exec('createlink','#xhe_tmpurl');
						jParent=$('a[href$="#xhe_tmpurl"]',_doc);
					}
					else if(sText&&!isSafari)jParent.text(sText);//safari改写文本会导致光标丢失
					xheAttr(jParent,'href',url[0]);
					if(sTarget!=='')jParent.attr('target',sTarget);
					else jParent.removeAttr('target');
				}
			}
			_this.hidePanel();
			return false;
		});
		_this.saveBookmark();
		_this.showDialog(jLink);
	}
	this.showAnchor=function(){
		var jAnchor=$(htmlAnchor),jParent=_this.getParent('a'),jName=$('#xheAnchorName',jAnchor),jSave=$('#xheSave',jAnchor);
		if(jParent.length===1){
			if(jParent.attr('href')){//超链接
				ev=null;
				return _this.exec('Link');
			}
			jName.val(jParent.attr('name'));
		}
		jSave.click(function(){
			_this.loadBookmark();
			var name=jName.val();
			if(name){
				if(jParent.length===0)_this.pasteHTML('<a name="'+name+'"></a>');
				else jParent.attr('name',name);
			}
			else if(jParent.length===1)jParent.remove();
			_this.hidePanel();
			return false;			
		});
		_this.saveBookmark();
		_this.showDialog(jAnchor);
	}
	this.showImg=function()
	{
		var jImg=$(htmlImg),jParent=_this.getParent('img'),jUrl=$('#xheImgUrl',jImg),jAlt=$('#xheImgAlt',jImg),jAlign=$('#xheImgAlign',jImg),jWidth=$('#xheImgWidth',jImg),jHeight=$('#xheImgHeight',jImg),jBorder=$('#xheImgBorder',jImg),jVspace=$('#xheImgVspace',jImg),jHspace=$('#xheImgHspace',jImg),jSave=$('#xheSave',jImg);
		if(jParent.length===1)
		{
			jUrl.val(xheAttr(jParent,'src'));
			jAlt.val(jParent.attr('alt'));
			jAlign.val(jParent.attr('align'));
			jWidth.val(jParent.attr('width'));
			jHeight.val(jParent.attr('height'));
			jBorder.val(jParent.attr('border'));
			var vspace=jParent.attr('vspace'),hspace=jParent.attr('hspace');
			jVspace.val(vspace<=0?'':vspace);
			jHspace.val(hspace<=0?'':hspace);
		}
		if(settings.upImgUrl)_this.uploadInit(jUrl,settings.upImgUrl,settings.upImgExt);
		jSave.click(function(){
			_this.loadBookmark();
			var url=jUrl.val();
			if(url!==''&&url!=='http://')
			{
				var aUrl=url.split(' '),sAlt=jAlt.val(),sAlign=jAlign.val(),sWidth=jWidth.val(),sHeight=jHeight.val(),sBorder=jBorder.val(),sVspace=jVspace.val(),sHspace=jHspace.val();;
				if(aUrl.length>1)
				{//批量插入
					var sTemplate='<img src="xhe_tmpurl"',sImg,arrImg=[];
					if(sAlt!=='')sTemplate+=' alt="'+sAlt+'"';
					if(sAlign!=='')sTemplate+=' align="'+sAlign+'"';
					if(sWidth!=='')sTemplate+=' width="'+sWidth+'"';
					if(sHeight!=='')sTemplate+=' height="'+sHeight+'"';
					if(sBorder!=='')sTemplate+=' border="'+sBorder+'"';
					if(sVspace!=='')sTemplate+=' vspace="'+sVspace+'"';
					if(sHspace!=='')sTemplate+=' hspace="'+sHspace+'"';
					sTemplate+=' />';
					for(var i in aUrl)
					{
						url=aUrl[i];
						if(url!=='')
						{
							url=url.split('||');
							sImg=sTemplate;
							sImg=sImg.replace('xhe_tmpurl',url[0]);
							if(url[1])sImg='<a href="'+url[1]+'" target="_blank">'+sImg+'</a>'
							arrImg.push(sImg);
						}
					}
					_this.pasteHTML(arrImg.join('&nbsp;'));
				}
				else if(aUrl.length===1)
				{//单URL模式
					url=aUrl[0];
					if(url!=='')
					{
						url=url.split('||');
						if(jParent.length===0)
						{
							_this.pasteHTML('<img src="'+url[0]+'#xhe_tmpurl" />');
							jParent=$('img[src$="#xhe_tmpurl"]',_doc);
						}
						xheAttr(jParent,'src',url[0]);
						if(sAlt!=='')jParent.attr('alt',sAlt);
						if(sAlign!=='')jParent.attr('align',sAlign);
						else jParent.removeAttr('align');
						if(sWidth!=='')jParent.attr('width',sWidth);
						else jParent.removeAttr('width');
						if(sHeight!=='')jParent.attr('height',sHeight);
						else jParent.removeAttr('height');
						if(sBorder!=='')jParent.attr('border',sBorder);
						else jParent.removeAttr('border');
						if(sVspace!=='')jParent.attr('vspace',sVspace);
						else jParent.removeAttr('vspace');
						if(sHspace!=='')jParent.attr('hspace',sHspace);
						else jParent.removeAttr('hspace');
						if(url[1])
						{
							var jLink=jParent.parent('a');
							if(jLink.length===0)
							{
								jParent.wrap('<a></a>');
								jLink=jParent.parent('a');
							}
							xheAttr(jLink,'href',url[1]);
							jLink.attr('target','_blank');
						}
					}
				}
			}
			else if(jParent.length===1)jParent.remove();
			_this.hidePanel();
			return false;
		});
		_this.saveBookmark();
		_this.showDialog(jImg);
	}
	this.showEmbed=function(sType,sHtml,sMime,sClsID,sBaseAttrs,sUploadUrl,sUploadExt)
	{
		var jEmbed=$(sHtml),jParent=_this.getParent('embed[type="'+sMime+'"],embed[classid="'+sClsID+'"]'),jUrl=$('#xhe'+sType+'Url',jEmbed),jWidth=$('#xhe'+sType+'Width',jEmbed),jHeight=$('#xhe'+sType+'Height',jEmbed),jSave=$('#xheSave',jEmbed);
		if(sUploadUrl)_this.uploadInit(jUrl,sUploadUrl,sUploadExt);
		if(jParent.length===1)
		{
			jUrl.val(xheAttr(jParent,'src'));
			jWidth.val(jParent.attr('width'));
			jHeight.val(jParent.attr('height'));
		}
		jSave.click(function(){
			_this.loadBookmark();
			var url=jUrl.val();
			if(url!==''&&url!=='http://')
			{
				var w=jWidth.val(),h=jHeight.val(),reg=/^\d+%?$/;
				if(!reg.test(w))w=412;if(!reg.test(h))h=300;
				var sBaseCode='<embed type="'+sMime+'" classid="'+sClsID+'" src="xhe_tmpurl"'+sBaseAttrs;
				var aUrl=url.split(' ');
				if(aUrl.length>1)
				{//批量插入
					var sTemplate=sBaseCode+'',sEmbed,arrEmbed=[];
					sTemplate+=' width="xhe_width" height="xhe_height" />';
					for(var i in aUrl)
					{
						url=aUrl[i].split('||');
						sEmbed=sTemplate;
						sEmbed=sEmbed.replace('xhe_tmpurl',url[0])
						sEmbed=sEmbed.replace('xhe_width',url[1]?url[1]:w)
						sEmbed=sEmbed.replace('xhe_height',url[2]?url[2]:h)
						if(url!=='')arrEmbed.push(sEmbed);
					}
					_this.pasteHTML(arrEmbed.join('&nbsp;'));
				}
				else if(aUrl.length===1)
				{//单URL模式
					url=aUrl[0].split('||');
					if(jParent.length===0)
					{
						_this.pasteHTML(sBaseCode.replace('xhe_tmpurl',url[0]+'#xhe_tmpurl')+' />');
						jParent=$('embed[src$="#xhe_tmpurl"]',_doc);
					}
					xheAttr(jParent,'src',url[0]);
					jParent.attr('width',url[1]?url[1]:w);
					jParent.attr('height',url[2]?url[2]:h);
				}
			}
			else if(jParent.length===1)jParent.remove();
			_this.hidePanel();
			return false;
		});
		_this.saveBookmark();
		_this.showDialog(jEmbed);
	}
	this.showEmot=function(group)
	{
		var jEmot=$('<div class="xheEmot"></div>');

		group=group?group:(selEmotGroup?selEmotGroup:'default');
		var arrEmot=arrEmots[group];

		var sEmotPath=emotPath+group+'/',n=0,arrList=[],jList='';
		var ew=arrEmot.width,eh=arrEmot.height,line=arrEmot.line,count=arrEmot.count,list=arrEmot.list;
		if(count)
		{
			for(var i=1;i<=count;i++)
			{
				n++;
				arrList.push('<a href="javascript:void(\''+i+'\')" style="background-image:url('+sEmotPath+i+'.gif);" emot="'+group+','+i+'" xhev="" title="'+i+'" role="option">&nbsp;</a>');
				if(n%line===0)arrList.push('<br />');
			}
		}
		else
		{
			$.each(list,function(id,title)
			{
				n++;
				arrList.push('<a href="javascript:void(\''+title+'\')" style="background-image:url('+sEmotPath+id+'.gif);" emot="'+group+','+id+'" title="'+title+'" xhev="'+title+'" role="option">&nbsp;</a>');
				if(n%line===0)arrList.push('<br />');
			});
		}
		var w=line*(ew+12),h=Math.ceil(n/line)*(eh+12),mh=w*0.75;
		if(h<=mh)mh='';
		jList=$('<style>'+(mh?'.xheEmot div{width:'+(w+20)+'px;height:'+mh+'px;}':'')+'.xheEmot div a{width:'+ew+'px;height:'+eh+'px;}</style><div>'+arrList.join('')+'</div>').click(function(ev){ev=ev.target;var jA=$(ev);if(!$.nodeName(ev,'A'))return;_this.loadBookmark();_this.pasteHTML('<img emot="'+jA.attr('emot')+'" alt="'+jA.attr('xhev')+'">');_this.hidePanel();return false;}).mousedown(returnFalse);
		jEmot.append(jList);

		var gcount=0,arrGroup=['<ul role="tablist">'],jGroup;//表情分类
		$.each(arrEmots,function(g,v){
			gcount++;
			arrGroup.push('<li'+(group===g?' class="cur"':'')+' role="presentation"><a href="javascript:void(\''+v.name+'\')" group="'+g+'" role="tab" tabindex="0">'+v.name+'</a></li>');
		});
		if(gcount>1)
		{
			arrGroup.push('</ul><br style="clear:both;" />');
			jGroup=$(arrGroup.join('')).click(function(ev){selEmotGroup=$(ev.target).attr('group');_this.exec('Emot');return false;}).mousedown(returnFalse);
			jEmot.append(jGroup);
		}
		_this.saveBookmark();
		_this.showPanel(jEmot);
	}
	this.showTable=function()
	{
		var jTable=$(htmlTable),jRows=$('#xheTableRows',jTable),jColumns=$('#xheTableColumns',jTable),jHeaders=$('#xheTableHeaders',jTable),jWidth=$('#xheTableWidth',jTable),jHeight=$('#xheTableHeight',jTable),jBorder=$('#xheTableBorder',jTable),jCellSpacing=$('#xheTableCellSpacing',jTable),jCellPadding=$('#xheTableCellPadding',jTable),jAlign=$('#xheTableAlign',jTable),jCaption=$('#xheTableCaption',jTable),jSave=$('#xheSave',jTable);
		jSave.click(function(){
			_this.loadBookmark();
			var sCaption=jCaption.val(),sBorder=jBorder.val(),sRows=jRows.val(),sCols=jColumns.val(),sHeaders=jHeaders.val(),sWidth=jWidth.val(),sHeight=jHeight.val(),sCellSpacing=jCellSpacing.val(),sCellPadding=jCellPadding.val(),sAlign=jAlign.val();
			var i,j,htmlTable='<table'+(sBorder!==''?' border="'+sBorder+'"':'')+(sWidth!==''?' width="'+sWidth+'"':'')+(sHeight!==''?' height="'+sHeight+'"':'')+(sCellSpacing!==''?' cellspacing="'+sCellSpacing+'"':'')+(sCellPadding!==''?' cellpadding="'+sCellPadding+'"':'')+(sAlign!==''?' align="'+sAlign+'"':'')+'>';
			if(sCaption!=='')htmlTable+='<caption>'+sCaption+'</caption>';
			if(sHeaders==='row'||sHeaders==='both')
			{
				htmlTable+='<tr>';
				for(i=0;i<sCols;i++)htmlTable+='<th scope="col"></th>';
				htmlTable+='</tr>';
				sRows--;
			}
			htmlTable+='<tbody>';
			for(i=0;i<sRows;i++)
			{
				htmlTable+='<tr>';
				for(j=0;j<sCols;j++)
				{
					if(j===0&&(sHeaders==='col'||sHeaders==='both'))htmlTable+='<th scope="row"></th>';
					else htmlTable+='<td></td>';
				}
				htmlTable+='</tr>';
			}
			htmlTable+='</tbody></table>';
			_this.pasteHTML(htmlTable);
			_this.hidePanel();
			return false;
		});
		_this.saveBookmark();
		_this.showDialog(jTable);
	}
	this.showAbout=function()
	{
		var jAbout=$(htmlAbout);
		jAbout.find('p').attr('role','presentation');//无障碍支持
		_this.showDialog(jAbout,true);
		setTimeout(function(){jAbout.focus();},100);
	}
	this.addShortcuts=function(key,cmd)
	{
		key=key.toLowerCase();
		if(arrShortCuts[key]===undefined)arrShortCuts[key]=Array();
		arrShortCuts[key].push(cmd);
	}
	this.delShortcuts=function(key){delete arrShortCuts[key];}
	this.uploadInit=function(jText,toUrl,upext)
	{
		var jUpload=$('<span class="xheUpload"><input type="text" style="visibility:hidden;" tabindex="-1" /><input type="button" value="'+settings.upBtnText+'" class="xheBtn" tabindex="-1" /></span>'),jUpBtn=$('.xheBtn',jUpload);
		var bHtml5Upload=settings.html5Upload,upMultiple=bHtml5Upload?settings.upMultiple:1;
		jText.after(jUpload);jUpBtn.before(jText);
		toUrl=toUrl.replace(/{editorRoot}/ig,editorRoot);
		if(toUrl.substr(0,1)==='!')//自定义上传管理页
		{
			jUpBtn.click(function(){_this.showIframeModal('上传文件',toUrl.substr(1),setUploadMsg,null,null);});
		}
		else
		{//系统默认ajax上传
			jUpload.append('<input type="file"'+(upMultiple>1?' multiple=""':'')+' class="xheFile" size="13" name="'+uploadInputname+'" tabindex="-1" />');
			var jFile=$('.xheFile',jUpload),arrMsg;
			jFile.change(function(){arrMsg=[];_this.startUpload(jFile[0],toUrl,upext,setUploadMsg);});
			setTimeout(function(){//拖放上传
				jText.closest('.xheDialog').bind('dragenter dragover',returnFalse).bind('drop',function(ev){
					var dataTransfer=ev.originalEvent.dataTransfer,fileList;
					if(bHtml5Upload&&dataTransfer&&(fileList=dataTransfer.files)&&fileList.length>0)_this.startUpload(fileList,toUrl,upext,setUploadMsg);
					return false;
				});
			},10);
		}
		function setUploadMsg(arrMsg)
		{
			if(is(arrMsg,'string'))arrMsg=[arrMsg];//允许单URL传递
			var bImmediate=false,i,count=arrMsg.length,msg,url,arrUrl=[],onUpload=settings.onUpload;
			if(onUpload)onUpload(arrMsg);//用户上传回调
			for(i=0;i<count;i++)
			{
				msg=arrMsg[i];
				url=is(msg,'string')?msg:msg.url;
				if(url.substr(0,1)==='!'){bImmediate=true;url=url.substr(1);}
				arrUrl.push(url);
			}
			jText.val(arrUrl.join(' '));
			if(bImmediate)jText.closest('.xheDialog').find('#xheSave').click();
		}
	}
	this.startUpload=function(fromFiles,toUrl,limitExt,onUploadComplete)
	{
		var arrMsg=[],bHtml5Upload=settings.html5Upload,upMultiple=bHtml5Upload?settings.upMultiple:1;
		var upload,fileList,filename,jUploadTip=$('<div style="padding:22px 0;text-align:center;line-height:30px;">文件上传中，请稍候……<br /></div>'),sLoading='<img src="'+skinPath+'img/loading.gif">';
		if(isOpera||!bHtml5Upload||(fromFiles.nodeType&&!((fileList=fromFiles.files)&&fileList[0].name)))
		{
			if(!checkFileExt(fromFiles.value,limitExt))return;
			jUploadTip.append(sLoading);
			upload=new _this.html4Upload(fromFiles,toUrl,onUploadCallback);
		}
		else
		{
			if(!fileList)fileList=fromFiles;//拖放文件列表
			var i,len=fileList.length;
			if(len>upMultiple){
				alert('请不要一次上传超过'+upMultiple+'个文件');
				return;
			}
			for(i=0;i<len;i++)if(!checkFileExt(fileList[i].name,limitExt))return;
			var jProgress=$('<div class="xheProgress"><div><span>0%</span></div></div>');
			jUploadTip.append(jProgress);
			upload=new _this.html5Upload(uploadInputname,fileList,toUrl,onUploadCallback,function(ev){
				if(ev.loaded>=0)
				{
					var sPercent=Math.round((ev.loaded * 100) / ev.total)+'%';
					$('div',jProgress).css('width',sPercent);
					$('span',jProgress).text(sPercent+' ( '+formatBytes(ev.loaded)+' / '+formatBytes(ev.total)+' )');
				}
				else jProgress.replaceWith(sLoading);//不支持进度
			});
		}
		_this.showModal('文件上传中(Esc取消上传)',jUploadTip,320,150);
		upload.start();
		function onUploadCallback(sText,bFinish)
		{
			var data=Object,bOK=false;
			try{data=eval('('+sText+')');}catch(ex){};
			if(data.err===undefined||data.msg===undefined)alert(toUrl+' 上传接口发生错误！\r\n\r\n返回的错误内容为: \r\n\r\n'+sText);
			else
			{
				if(data.err)alert(data.err);
				else
				{
					arrMsg.push(data.msg);
					bOK=true;//继续下一个文件上传
				}
			}
			if(!bOK||bFinish)_this.removeModal();
			if(bFinish&&bOK)onUploadComplete(arrMsg);//全部上传完成
			return bOK;
		}
	}
	this.html4Upload=function(fromfile,toUrl,callback)
	{
		var uid = new Date().getTime(),idIO='jUploadFrame'+uid,_this=this;
		var jIO=$('<iframe name="'+idIO+'" class="xheHideArea" />').appendTo('body');
		var jForm=$('<form action="'+toUrl+'" target="'+idIO+'" method="post" enctype="multipart/form-data" class="xheHideArea"></form>').appendTo('body');
		var jOldFile = $(fromfile),jNewFile = jOldFile.clone().attr('disabled','true');
		jOldFile.before(jNewFile).appendTo(jForm);
		this.remove=function()
		{
			if(_this!==null)
			{
				jNewFile.before(jOldFile).remove();
				jIO.remove();jForm.remove();
				_this=null;
			}
		}
		this.onLoad=function(){
			var ifmDoc=jIO[0].contentWindow.document,result=$(ifmDoc.body).text();
			ifmDoc.write('');
			_this.remove();
			callback(result,true);
		}
		this.start=function(){jForm.submit();jIO.load(_this.onLoad);}
		return this;
	}
	this.html5Upload=function(inputname,fromFiles,toUrl,callback,onProgress)
	{
		var xhr,i=0,count=fromFiles.length,allLoaded=0,allSize=0,_this=this;
		for(var j=0;j<count;j++)allSize+=fromFiles[j].size;
		this.remove=function(){if(xhr){xhr.abort();xhr=null;}}
		this.uploadNext=function(sText)
		{
			if(sText)//当前文件上传完成
			{
				allLoaded+=fromFiles[i-1].size;
				returnProgress(0);
			}
			if((!sText||(sText&&callback(sText,i===count)===true))&&i<count)postFile(fromFiles[i++],toUrl,_this.uploadNext,function(loaded){returnProgress(loaded);});
		}
		this.start=function(){_this.uploadNext();}
		function postFile(fromfile,toUrl,callback,onProgress)
		{
			xhr = new XMLHttpRequest(),upload=xhr.upload;
			xhr.onreadystatechange=function(){
				if(xhr.readyState===4)callback(xhr.responseText);
			};
			if(upload)upload.onprogress=function(ev){
				onProgress(ev.loaded);
			};
			else onProgress(-1);//不支持进度
			xhr.open("POST", toUrl);
			xhr.setRequestHeader('Content-Type', 'application/octet-stream');
			xhr.setRequestHeader('Content-Disposition', 'attachment; name="'+encodeURIComponent(inputname)+'"; filename="'+encodeURIComponent(fromfile.name)+'"');
			if(xhr.sendAsBinary&&fromfile.getAsBinary)xhr.sendAsBinary(fromfile.getAsBinary());
			else xhr.send(fromfile);
		}
		function returnProgress(loaded){
			if(onProgress)onProgress({'loaded':allLoaded+loaded,'total':allSize});
		}
	}
	this.showIframeModal=function(title,url,callback,w,h,onRemove)
	{
		var jContent=$('<iframe frameborder="0" src="'+url.replace(/{editorRoot}/ig,editorRoot)+(/\?/.test(url)?'&':'?')+'parenthost='+location.host+'" style="width:100%;height:100%;display:none;" /><div class="xheModalIfmWait"></div>'),jIframe=jContent.eq(0),jWait=jContent.eq(1);
		_this.showModal(title,jContent,w,h,onRemove);
		var modalWin=jIframe[0].contentWindow,result;
		initModalWin();
		jIframe.load(function(){
			initModalWin();//初始化接口
			if(result){//跨域，取返回值
				var bResult=true;
				try{
					result=eval('('+unescape(result)+')');
				}
				catch(e){
					bResult=false;
				}
				if(bResult)return callbackModal(result);	
			}
			if(jWait.is(':visible')){//显示内页
				jIframe.show().focus();
				jWait.remove();
			}
		});
		//初始化接口
		function initModalWin(){
			try{
				modalWin.callback=callbackModal;
				modalWin.unloadme=_this.removeModal;
				$(modalWin.document).keydown(checkEsc);
				result=modalWin.name;
			}
			catch(ex){}
		}
		//模式窗口回调
		function callbackModal(v){
			modalWin.document.write('');
			_this.removeModal();
			if(v!=null)callback(v);
		}
	}
	this.showModal=function(title,content,w,h,onRemove)
	{
		if(bShowModal)return false;//只能弹出一个模式窗口
		_this.panelState=bShowPanel;
		bShowPanel=false;//防止按钮面板被关闭
		layerShadow=settings.layerShadow;
		w=w?w:settings.modalWidth;h=h?h:settings.modalHeight;
		jModal=$('<div class="xheModal" style="width:'+(w-1)+'px;height:'+h+'px;margin-left:-'+Math.ceil(w/2)+'px;'+(isIE&&browerVer<7.0?'':'margin-top:-'+Math.ceil(h/2)+'px')+'">'+(settings.modalTitle?'<div class="xheModalTitle"><span class="xheModalClose" title="关闭 (Esc)" tabindex="0" role="button"></span>'+title+'</div>':'')+'<div class="xheModalContent"></div></div>').appendTo('body');
		jOverlay=$('<div class="xheModalOverlay"></div>').appendTo('body');
		if(layerShadow>0)jModalShadow=$('<div class="xheModalShadow" style="width:'+jModal.outerWidth()+'px;height:'+jModal.outerHeight()+'px;margin-left:-'+(Math.ceil(w/2)-layerShadow-2)+'px;'+(isIE&&browerVer<7.0?'':'margin-top:-'+(Math.ceil(h/2)-layerShadow-2)+'px')+'"></div>').appendTo('body');

		$('.xheModalContent',jModal).css('height',h-(settings.modalTitle?$('.xheModalTitle').outerHeight():0)).html(content);

		if(isIE&&browerVer===6.0)jHideSelect=$('select:visible').css('visibility','hidden');//隐藏覆盖的select
		$('.xheModalClose',jModal).click(_this.removeModal);

		jOverlay.show();
		if(layerShadow>0)jModalShadow.show();
		jModal.show();
		setTimeout(function(){jModal.find('a,input[type=text],textarea').filter(':visible').filter(function(){return $(this).css('visibility')!=='hidden';}).eq(0).focus();},10);//定位首个可见输入表单项,延迟解决opera无法设置焦点
		bShowModal=true;
		onModalRemove=onRemove;
	}
	this.removeModal=function(){
		if(jHideSelect)jHideSelect.css('visibility','visible');
		jModal.html('').remove();
		if(layerShadow>0)jModalShadow.remove();
		jOverlay.remove();
		if(onModalRemove)onModalRemove();
		bShowModal=false;
		bShowPanel=_this.panelState;
	};
	this.showDialog=function(content,bNoFocus)
	{
		var jDialog=$('<div class="xheDialog"></div>'),jContent=$(content),jSave=$('#xheSave',jContent);
		if(jSave.length===1)
		{
			jContent.find('input[type=text],select').keypress(function(ev){if(ev.which===13){jSave.click();return false;}});
			jContent.find('textarea').keydown(function(ev){if(ev.ctrlKey&&ev.which===13){jSave.click();return false;}});
			jSave.after(' <input type="button" id="xheCancel" value="取消" />');
			$('#xheCancel',jContent).click(_this.hidePanel);
			if(!settings.clickCancelDialog)
			{
				bClickCancel=false;//关闭点击隐藏
				var jFixCancel=$('<div class="xheFixCancel"></div>').appendTo('body').mousedown(returnFalse);
				var xy=_jArea.offset();
				jFixCancel.css({'left':xy.left,'top':xy.top,width:_jArea.outerWidth(),height:_jArea.outerHeight()})
			}
			jDialog.mousedown(function(){bDisableHoverExec=true;})//点击对话框禁止悬停执行
		}
		jDialog.append(jContent);
		_this.showPanel(jDialog,bNoFocus);
	}
	this.showPanel=function(content,bNoFocus)
	{
		if(!ev.target)return false;
		_jPanel.html('').append(content).css('left',-999).css('top',-999);
		_jPanelButton=$(ev.target).closest('a').addClass('xheActive');
		var xy=_jPanelButton.offset();
		var x=xy.left,y=xy.top;y+=_jPanelButton.outerHeight()-1;
		_jCntLine.css({'left':x+1,'top':y,'width':_jPanelButton.width()}).show();
		var _docElem=document.documentElement,body=document.body;
		if((x+_jPanel.outerWidth())>((window.pageXOffset||_docElem.scrollLeft||body.scrollLeft)+(_docElem.clientWidth||body.clientWidth)))x-=(_jPanel.outerWidth()-_jPanelButton.outerWidth());//向左显示面板
		var layerShadow=settings.layerShadow;
		if(layerShadow>0)_jShadow.css({'left':x+layerShadow,'top':y+layerShadow,'width':_jPanel.outerWidth(),'height':_jPanel.outerHeight()}).show();
		var basezIndex=$('#'+idContainer).offsetParent().css('zIndex');
		if(basezIndex&&!isNaN(basezIndex)){
			_jShadow.css('zIndex',parseInt(basezIndex,10)+1);
			_jPanel.css('zIndex',parseInt(basezIndex,10)+2);
			_jCntLine.css('zIndex',parseInt(basezIndex,10)+3);
		}
		_jPanel.css({'left':x,'top':y}).show();
		if(!bNoFocus)setTimeout(function(){_jPanel.find('a,input[type=text],textarea').filter(':visible').filter(function(){return $(this).css('visibility')!=='hidden';}).eq(0).focus();},10);//定位首个可见输入表单项,延迟解决opera无法设置焦点
		bQuickHoverExec=bShowPanel=true;
	}
	this.hidePanel=function(){
		if(bShowPanel){
			_jPanelButton.removeClass('xheActive');
			_jShadow.hide();
			_jCntLine.hide();
			_jPanel.hide();
			bShowPanel=false;
			if(!bClickCancel){
				$('.xheFixCancel').remove();
				bClickCancel=true;
			};
			bQuickHoverExec=bDisableHoverExec=false;
			lastAngle=null;
			_this.focus();
			_this.loadBookmark();
		}
	}
	this.exec=function(cmd)
	{
		_this.hidePanel();
		var tool=arrTools[cmd];
		if(!tool)return false;//无效命令
		if(ev===null)//非鼠标点击
		{
			ev={};
			var btn=_jTools.find('.xheButton[cmd='+cmd+']');
			if(btn.length===1)ev.target=btn;//设置当前事件焦点
		}
		if(tool.e)tool.e.call(_this)//插件事件
		else//内置工具
		{
			cmd=cmd.toLowerCase();
			switch(cmd)
			{
				case 'cut':
					try{_doc.execCommand(cmd);if(!_doc.queryCommandSupported(cmd))throw 'Error';}
					catch(ex){alert('您的浏览器安全设置不允许使用剪切操作，请使用键盘快捷键(Ctrl + X)来完成');};
					break;
				case 'copy':
					try{_doc.execCommand(cmd);if(!_doc.queryCommandSupported(cmd))throw 'Error';}
					catch(ex){alert('您的浏览器安全设置不允许使用复制操作，请使用键盘快捷键(Ctrl + C)来完成');}
					break;
				case 'paste':
					try{_doc.execCommand(cmd);if(!_doc.queryCommandSupported(cmd))throw 'Error';}
					catch(ex){alert('您的浏览器安全设置不允许使用粘贴操作，请使用键盘快捷键(Ctrl + V)来完成');}
					break;
				case 'pastetext':
					if(window.clipboardData)_this.pasteText(window.clipboardData.getData('Text', true));
					else _this.showPastetext();
					break;
				case 'blocktag':
					var menuBlocktag=[];
					$.each(arrBlocktag,function(n,v){menuBlocktag.push({s:'<'+v.n+'>'+v.t+'</'+v.n+'>',v:'<'+v.n+'>',t:v.t});});
					_this.showMenu(menuBlocktag,function(v){_this._exec('formatblock',v);});
					break;
				case 'fontface':
					var menuFontname=[];
					$.each(arrFontname,function(n,v){v.c=v.c?v.c:v.n;menuFontname.push({s:'<span style="font-family:'+v.c+'">'+v.n+'</span>',v:v.c,t:v.n});});
					_this.showMenu(menuFontname,function(v){_this._exec('fontname',v);});
					break;
				case 'fontsize':
					var menuFontsize=[];
					$.each(arrFontsize,function(n,v){menuFontsize.push({s:'<span style="font-size:'+v.s+';">'+v.t+'('+v.s+')</span>',v:n+1,t:v.t});});
					_this.showMenu(menuFontsize,function(v){_this._exec('fontsize',v);});
					break;
				case 'fontcolor':
					_this.showColor(function(v){_this._exec('forecolor',v);});
					break;
				case 'backcolor':
					_this.showColor(function(v){if(isIE)_this._exec('backcolor',v);else{setCSS(true);_this._exec('hilitecolor',v);setCSS(false);}});
					break;
				case 'align':
					_this.showMenu(menuAlign,function(v){_this._exec(v);});
					break;
				case 'list':
					_this.showMenu(menuList,function(v){_this._exec(v);});
					break;
				case 'link':
					_this.showLink();
					break;
				case 'anchor':
					_this.showAnchor();
					break;
				case 'img':
					_this.showImg();
					break;
				case 'flash':
					_this.showEmbed('Flash',htmlFlash,'application/x-shockwave-flash','clsid:d27cdb6e-ae6d-11cf-96b8-4445535400000',' wmode="opaque" quality="high" menu="false" play="true" loop="true" allowfullscreen="true"',settings.upFlashUrl,settings.upFlashExt);
					break;
				case 'media':
					_this.showEmbed('Media',htmlMedia,'application/x-mplayer2','clsid:6bf52a52-394a-11d3-b153-00c04f79faa6',' enablecontextmenu="false" autostart="false"',settings.upMediaUrl,settings.upMediaExt);
					break;
				case 'hr':
					_this.pasteHTML('<hr />');
					break;
				case 'emot':
					_this.showEmot();
					break;
				case 'table':
					_this.showTable();
					break;
				case 'source':
					_this.toggleSource();
					break;
				case 'preview':
					_this.showPreview();
					break;
				case 'print':
					_win.print();
					break;
				case 'fullscreen':
					_this.toggleFullscreen();
					break;
				case 'about':
					_this.showAbout();
					break;
				default:
					_this._exec(cmd);
					break;
			}
		}
		ev=null;
	}
	this._exec=function(cmd,param,noFocus)
	{
		if(!noFocus)_this.focus();
		var state;
		if(param!==undefined)state=_doc.execCommand(cmd,false,param);
		else state=_doc.execCommand(cmd,false,null);
		return state;
	}
	function checkDblClick(ev)
	{
		var target=ev.target,tool=arrDbClick[target.tagName.toLowerCase()];
		if(tool)
		{
			if(tool==='Embed')//自动识别Flash和多媒体
			{
				var arrEmbed={'application/x-shockwave-flash':'Flash','application/x-mplayer2':'Media'};
				tool=arrEmbed[target.type.toLowerCase()];
			}
			_this.exec(tool);
		}
	}
	function checkEsc(ev)
	{
		if(ev.which===27)
		{
			if(bShowModal)_this.removeModal();
			else if(bShowPanel)_this.hidePanel();
			return false;
		}
	}
	function loadReset(){setTimeout(_this.setSource,10);}
	function saveResult(){_this.getSource();};
	function cleanPaste(ev){
		var clipboardData,items,item;//for chrome
		if(ev&&(clipboardData=ev.originalEvent.clipboardData)&&(items=clipboardData.items)&&(item=items[0])&&item.kind=='file'&&item.type.match(/^image\//i)){
			var blob = item.getAsFile(),reader = new FileReader();
			reader.onload=function(){
				var sHtml='<img src="'+event.target.result+'">';
				sHtml=replaceRemoteImg(sHtml);
				_this.pasteHTML(sHtml);
			}
			reader.readAsDataURL(blob);
			return false;
		}

		var cleanPaste=settings.cleanPaste;
		if(cleanPaste===0||bSource||bCleanPaste)return true;
		bCleanPaste=true;//解决IE右键粘贴重复产生paste的问题
		_this.saveBookmark();
		var tag=isIE?'pre':'div',jDiv=$('<'+tag+' class="xhe-paste">\uFEFF\uFEFF</'+tag+'>',_doc).appendTo(_doc.body),div=jDiv[0],sel=_this.getSel(),rng=_this.getRng(true);
		jDiv.css('top',_jWin.scrollTop());
		if(isIE){
			rng.moveToElementText(div);
			rng.select();
			//注：调用execommand:paste，会导致IE8,IE9目标路径无法转为绝对路径
		}
		else{
			rng.selectNodeContents(div);
			sel.removeAllRanges();
			sel.addRange(rng);
		}

		setTimeout(function(){
			var bText=(cleanPaste===3),sPaste;
			if(bText)sPaste=jDiv.text();
			else{
				var jTDiv=$('.xhe-paste',_doc.body),arrHtml=[];
				jTDiv.each(function(i,n){if($(n).find('.xhe-paste').length==0)arrHtml.push(n.innerHTML);});
				sPaste=arrHtml.join('<br />');
			}
			
			jDiv.remove();
			_this.loadBookmark();
			sPaste=sPaste.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'');
			if(sPaste){
				if(bText)_this.pasteText(sPaste);
				else{
					sPaste=_this.cleanHTML(sPaste);
					sPaste=_this.cleanWord(sPaste);
					sPaste=_this.formatXHTML(sPaste);
					if(!settings.onPaste||settings.onPaste&&(sPaste=settings.onPaste(sPaste))!==false){
						sPaste=replaceRemoteImg(sPaste);
						_this.pasteHTML(sPaste);
					}
				}
			}
			bCleanPaste=false;
		},0);
	}
	//远程图片转本地
	function replaceRemoteImg(sHtml){
		var localUrlTest=settings.localUrlTest,remoteImgSaveUrl=settings.remoteImgSaveUrl;
		if(localUrlTest&&remoteImgSaveUrl){
			var arrRemoteImgs=[],count=0;
			sHtml=sHtml.replace(/(<img)((?:\s+[^>]*?)?(?:\s+src="\s*([^"]+)\s*")(?: [^>]*)?)(\/?>)/ig,function(all,left,attr,url,right){
				if(/^(https?|data:image)/i.test(url) && !/_xhe_temp/.test(attr) && !localUrlTest.test(url)){
					arrRemoteImgs[count]=url;
					attr=attr.replace(/\s+(width|height)="[^"]*"/ig,'').replace(/\s+src="[^"]*"/ig,' src="'+skinPath+'img/waiting.gif" remoteimg="'+(count++)+'"');
				}
				return left+attr+right;
			});
			if(arrRemoteImgs.length>0){
				$.post(remoteImgSaveUrl,{urls:arrRemoteImgs.join('|')},function(data){
					data=data.split('|');
					$('img[remoteimg]',_this.doc).each(function(){
						var $this=$(this);
						xheAttr($this,'src',data[$this.attr('remoteimg')]);
						$this.removeAttr('remoteimg');
					});
				});
			}
		}
		return sHtml;
	}
	function setCSS(css)
	{
		try{_this._exec('styleWithCSS',css,true);}
		catch(e)
		{try{_this._exec('useCSS',!css,true);}catch(e){}}
	}
	function setOpts()
	{
		if(bInit&&!bSource)
		{
			setCSS(false);
			try{_this._exec('enableObjectResizing',true,true);}catch(e){}
			//try{_this._exec('enableInlineTableEditing',false,true);}catch(e){}
			if(isIE)try{_this._exec('BackgroundImageCache',true,true);}catch(e){}
		}
	}
	function forcePtag(ev)
	{
		if(bSource||ev.which!==13||ev.shiftKey||ev.ctrlKey||ev.altKey)return true;
		var pNode=_this.getParent('p,h1,h2,h3,h4,h5,h6,pre,address,div,li');
		if(pNode.is('li'))return true;
		if(settings.forcePtag){if(pNode.length===0)_this._exec('formatblock','<p>');}
		else
		{
			_this.pasteHTML('<br />');
			if(isIE&&pNode.length>0&&_this.getRng().parentElement().childNodes.length===2)_this.pasteHTML('<br />');
			return false;
		}
	}
	function fixFullHeight()
	{
		if(!isMozilla&&!isSafari)
		{
			if(bFullscreen)_jArea.height('100%').css('height',_jArea.outerHeight()-_jTools.outerHeight());
			if(isIE)_jTools.hide().show();
		}
	}
	function fixAppleSel(e)
	{
		e=e.target;
		if(e.tagName.match(/(img|embed)/i))
		{
			var sel=_this.getSel(),rng=_this.getRng(true);
			rng.selectNode(e);
			sel.removeAllRanges();
			sel.addRange(rng);
		}
	}
	function xheAttr(jObj,n,v)
	{
		if(!n)return false;
		var kn='_xhe_'+n;
		if(v)//设置属性
		{
			if(urlType)v=getLocalUrl(v,urlType,urlBase);
			jObj.attr(n,urlBase?getLocalUrl(v,'abs',urlBase):v).removeAttr(kn).attr(kn,v);
		}
		return jObj.attr(kn)||jObj.attr(n);
	}
	function clickCancelPanel(){if(bClickCancel)_this.hidePanel();}
	function checkShortcuts(event)
	{
		if(bSource)return true;
		var code=event.which,special=specialKeys[code],sChar=special?special:String.fromCharCode(code).toLowerCase();
		sKey='';
		sKey+=event.ctrlKey?'ctrl+':'';sKey+=event.altKey?'alt+':'';sKey+=event.shiftKey?'shift+':'';sKey+=sChar;

		var cmd=arrShortCuts[sKey],c;
		for(c in cmd)
		{
			c=cmd[c];
			if($.isFunction(c)){if(c.call(_this)===false)return false;}
			else{_this.exec(c);return false;}//按钮独占快捷键
		}
	}
	function is(o,t)
	{
		var n = typeof(o);
		if (!t)return n != 'undefined';
		if (t === 'array' && (o.hasOwnProperty && o instanceof Array))return true;
		return n === t;
	}
	function getLocalUrl(url,urlType,urlBase)//绝对地址：abs,根地址：root,相对地址：rel
	{
		if( (url.match(/^(\w+):\/\//i) && !url.match(/^https?:/i)) || /^#/i.test(url) || /^data:/i.test(url) )return url;//非http和https协议，或者页面锚点不转换，或者base64编码的图片等
		var baseUrl=urlBase?$('<a href="'+urlBase+'" />')[0]:location,protocol=baseUrl.protocol,host=baseUrl.host,hostname=baseUrl.hostname,port=baseUrl.port,path=baseUrl.pathname.replace(/\\/g,'/').replace(/[^\/]+$/i,'');
		if(port==='')port='80';
		if(path==='')path='/';
		else if(path.charAt(0)!=='/')path='/'+path;//修正IE path
		url=$.trim(url);
		//删除域路径
		if(urlType!=='abs')url=url.replace(new RegExp(protocol+'\\/\\/'+hostname.replace(/\./g,'\\.')+'(?::'+port+')'+(port==='80'?'?':'')+'(\/|$)','i'),'/');
		//删除根路径
		if(urlType==='rel')url=url.replace(new RegExp('^'+path.replace(/([\/\.\+\[\]\(\)])/g,'\\$1'),'i'),'');
		//加上根路径
		if(urlType!=='rel')
		{
			if(!url.match(/^(https?:\/\/|\/)/i))url=path+url;
			if(url.charAt(0)==='/')//处理根路径中的..
			{
				var arrPath=[],arrFolder = url.split('/'),folder,i,l=arrFolder.length;
				for(i=0;i<l;i++)
				{
					folder=arrFolder[i];
					if(folder==='..')arrPath.pop();
					else if(folder!==''&&folder!=='.')arrPath.push(folder);
				}
				if(arrFolder[l-1]==='')arrPath.push('');
				url='/'+arrPath.join('/');
			}
		}
		//加上域路径
		if(urlType==='abs'&&!url.match(/^https?:\/\//i))url=protocol+'//'+host+url;
		url=url.replace(/(https?:\/\/[^:\/?#]+):80(\/|$)/i,'$1$2');//省略80端口
		return url;
	}
	function checkFileExt(filename,limitExt)
	{
		if(limitExt==='*'||filename.match(new RegExp('\.('+limitExt.replace(/,/g,'|')+')$','i')))return true;
		else
		{
			alert('上传文件扩展名必需为: '+limitExt);
			return false;
		}
	}
	function formatBytes(bytes)
	{
		var s = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
		var e = Math.floor(Math.log(bytes)/Math.log(1024));
		return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+s[e];
	}
	function returnFalse(){return false;}
}

xheditor.settings={skin:'default',tools:'full',clickCancelDialog:true,linkTag:false,internalScript:false,inlineScript:false,internalStyle:true,inlineStyle:true,showBlocktag:false,forcePtag:true,upLinkExt:"zip,rar,txt",upImgExt:"jpg,jpeg,gif,png",upFlashExt:"swf",upMediaExt:"wmv,avi,wma,mp3,mid",modalWidth:350,modalHeight:220,modalTitle:true,defLinkText:'点击打开链接',layerShadow:3,emotMark:false,upBtnText:'上传',cleanPaste:1,hoverExecDelay:100,html5Upload:true,upMultiple:99};
window.xheditor=xheditor;

$(function(){
	$.fn.oldVal=$.fn.val;
	$.fn.val=function(value)
	{
		var _this=this,editor;
		if(value===undefined)if(_this[0]&&(editor=_this[0].xheditor))return editor.getSource();else return _this.oldVal();//读
		return _this.each(function(){if(editor=this.xheditor)editor.setSource(value);else _this.oldVal(value);});//写
	}
	$('textarea').each(function(){
		var $this=$(this),xhClass=$this.attr('class');
		if(xhClass&&(xhClass=xhClass.match(/(?:^|\s)xheditor(?:\-(m?full|simple|mini))?(?:\s|$)/i)))$this.xheditor(xhClass[1]?{tools:xhClass[1]}:null);
	});
});

})(jQuery);