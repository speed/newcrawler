#######################################################################
# 
# xhEditor 自述文件
#
#######################################################################

使用方法

1. 下载xhEditor最新版本。
   下载地址：http://xheditor.com/download

2. 解压压缩文件，将其中的xheditor-zh-cn.min.js以及xheditor_emot、xheditor_plugins和xheditor_skin三个文件夹上传到网站相应目录
	注：如果您网站中没有使用jQuery框架，也请一并上传jquery文件夹中的jquery-1.4.4.min.js

3. 在相应html文件的</head>之前添加
<script type="text/javascript" src="http://static.xxx.com/js/jquery.js"></script>
<script type="text/javascript" src="http://static.xxx.com/js/xheditor.js"></script>

注：如果jQuery之前已经在项目页面中使用，请勿重复添加引用代码

4. 
方法1：在textarea上添加属性： class="xheditor"
	例如：<textarea name="content" class="xheditor">test</textarea>

方法2：在您的页面初始JS代码里加上： $('#elm1').xheditor();
$('#elm1').xheditor()；
例如：
$({
$('#elm1').xheditor()；
});
相应的卸载编辑器的代码为
$('#elm1').xheditor(false)；


重要说明：2种初始化方法只能选择其中一种，不能混合使用，优先级分别是：class初始化>JS初始化，如果页面中使用了class初始化模式，JS初始化代码就无效了


更多帮助信息，请查看在线技术手册：http://xheditor.com/manual
或者参考demos文件夹中的演示页面
建议使用wizard.html初始化代码生成向导来生成适合你的代码。