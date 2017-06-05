<%@ page contentType="text/html; charset=utf-8" language="java"
	pageEncoding="utf-8"%>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="net.sf.json.JSONArray" %>
<%
	String hostname=request.getServerName();
	String port="3306";
	String name="newcrawler";
	String username="root";
	String password="";
	
	String appfog=java.lang.System.getenv("VCAP_SERVICES");
	String bae=request.getHeader("BAE_ENV_ADDR_SQL_IP");
	String openShift = java.lang.System.getenv("OPENSHIFT_MYSQL_DB_HOST");
	
	if(appfog!=null && !appfog.isEmpty()){
		//APPFOG
		JSONObject jsonObject = JSONObject.fromObject(appfog);
		String mysql=jsonObject.keys().next().toString();
		if(mysql.startsWith("mysql")){
			JSONArray jsonArray= JSONArray.fromObject(jsonObject.getString(mysql));
			if(!jsonArray.isEmpty()){
				jsonObject = JSONObject.fromObject(jsonArray.get(0));
				//System.out.println("name:"+jsonObject.get("name"));
				jsonObject = JSONObject.fromObject(jsonObject.get("credentials"));
				
				hostname=(String)jsonObject.get("hostname");
				port=jsonObject.get("port").toString();
				name=(String)jsonObject.get("name");
				username=(String)jsonObject.get("username");
				password=(String)jsonObject.get("password");
			}
		}
	}else if(bae!=null && !bae.isEmpty()){
		//BAE
		hostname = request.getHeader("BAE_ENV_ADDR_SQL_IP");
		port = request.getHeader("BAE_ENV_ADDR_SQL_PORT");
		username = request.getHeader("BAE_ENV_AK");
		password = request.getHeader("BAE_ENV_SK");
	}else if(openShift!=null && !openShift.isEmpty()){
		//OpenShift
		hostname = java.lang.System.getenv("OPENSHIFT_MYSQL_DB_HOST");
		port = java.lang.System.getenv("OPENSHIFT_MYSQL_DB_PORT");
	}
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>系统参数设置--鸟巢采集器安装向导</title>
<link href="img/style.css" type="text/css" rel="stylesheet"/>
<script type="text/javascript">
	function formSubmit() {
		if (document.getElementById('type').value == 'db' && document.getElementById('dbPassword').value == '') {
			if (!confirm("您没有填写数据库密码，您确定数据库密码为空吗？")) {
				return false;
			}
		}
		document.getElementById('beforeSubmit').style.display = "none";
		document.getElementById('afterSubmit').style.display = "";
	}
	
	function changeType(type){
		if(type=="db"){
			document.getElementById('db-div').style.display = "";
			
			document.getElementById('tr_dbHost').style.display = "";
			document.getElementById('tr_dbPort').style.display = "";
			document.getElementById('tr_dbName').style.display = "";
			document.getElementById('tr_dbUser').style.display = "";
			document.getElementById('tr_dbPassword').style.display = "";
			document.getElementById('tr_isCreateDb').style.display = "";
			
			document.getElementById('tr_fileDir').style.display = "none";
			document.getElementById('tr_fileName').style.display = "none";
		}else if(type=="file"){
			document.getElementById('db-div').style.display = "none";
			
			document.getElementById('tr_dbHost').style.display = "none";
			document.getElementById('tr_dbPort').style.display = "none";
			document.getElementById('tr_dbName').style.display = "none";
			document.getElementById('tr_dbUser').style.display = "none";
			document.getElementById('tr_dbPassword').style.display = "none";
			document.getElementById('tr_isCreateDb').style.display = "none";
			
			document.getElementById('tr_fileDir').style.display = "";
			document.getElementById('tr_fileName').style.display = "";
			
		}else if(type=="mem"){
			document.getElementById('db-div').style.display = "none";
			
			document.getElementById('tr_dbHost').style.display = "none";
			document.getElementById('tr_dbPort').style.display = "none";
			document.getElementById('tr_dbName').style.display = "none";
			document.getElementById('tr_dbUser').style.display = "none";
			document.getElementById('tr_dbPassword').style.display = "none";
			document.getElementById('tr_isCreateDb').style.display = "none";
			
			document.getElementById('tr_fileDir').style.display = "none";
			document.getElementById('tr_fileName').style.display = "none";
		}
	}
	function changeDBType(dbType){
		if(type=="mysql"){
			
		}else {
			
		}
	}
</script>
</head>

<body>
<form action="setup" method="post"
	onsubmit="return formSubmit();">
	<br/><br/><br/>
	<div class="main">
  <table width="980" border="0" align="center" cellpadding="0" cellspacing="0" class="rg-tbg">
    <tr>
      <td height="76" align="center">
	  <span style="color:#016dd0;">请设置系统相关参数</span>
	  <br/>
	  </td>
    </tr>
    <tr>
      <td>
	  <table width="650" border="0" align="center" cellpadding="0" cellspacing="0"
	>
	
	<tr>
		<td align="center" valign="top">
		  <table width="100%" border="0" align="center" cellpadding="0"
			cellspacing="0" style="border:1px solid #b5b5b5;">
			<tr>
				<td width="150px" height="30" align="right">存储方式：</td>
				<td width="207px" align="left" nowrap>
					<div style="float:left;">
					<select  id="type" name="type" onchange="changeType(this.value)">
			        	<option value="db" selected>存储到数据库</option>
			        	<option value="file">存储到文件</option>
			        	<option value="mem">存储到内存</option>
					 </select>
					 </div>
					 
					 <div id="db-div" style="float: left; padding-left: 5px; display: block;">
			         <select id="dbType" name="dbType" onchange="changeDBType(this.value)">
			        	<option value="mysql" selected>MYSQL</option>
			         </select>
			         </div>
				</td>
				<td width="291px" align="left"></td>
			</tr>
			
			<tr id="tr_dbHost" >
				<td width="150px" height="30" align="right">数据库主机：</td>
				<td width="207px" align="left"><input name="dbHost" type="text"
					class="input" id="dbHost" value="<%=hostname %>" /></td>
				<td align="left">数据库的ip地址，如果是本机无需改动</td>
			</tr>
			<tr  id="tr_dbPort">
				<td width="150px" height="30" align="right">数据库端口号：</td>
				<td width="207px" align="left"><input name="dbPort" type="text"
					class="input" id="dbPort" value="<%=port %>" /></td>
				<td align="left">数据库的端口号，一般无需改动</td>
			</tr>
			<tr  id="tr_dbName">
				<td width="150px" height="30" align="right">数据库名称：</td>
				<td width="207px" align="left"><input name="dbName" type="text" class="input"
					id="dbName" value="<%=name %>" /></td>
				<td align="left">&nbsp;</td>
			</tr>
			<tr  id="tr_dbUser">
				<td height="30" align="right">数据库用户：</td>
				<td width="207px" align="left"><input name="dbUser" type="text" class="input"
					id="dbUser" value="<%=username %>" /></td>
				<td align="left">&nbsp;</td>
			</tr>
			<tr  id="tr_dbPassword">
				<td width="150px" height="30" align="right">数据库密码：</td>
				<td width="207px" align="left"><input name="dbPassword" id="dbPassword" type="text"
					class="input" value="<%=password %>" /></td>
				<td align="left">安装数据库时输入的密码</td>
			</tr>
			<tr   id="tr_isCreateDb">
				<td width="150px" height="30" align="right">是否创建数据库：</td>
				<td width="207px" align="left"><input type="radio" name="isCreateDb"
					value="true" />是 <input type="radio"
					name="isCreateDb" value="false" checked="checked" />否</td>
				<td align="left">全新安装时，请选择是</td>
			</tr>
			
			<tr  id="tr_fileDir" style="display: none;">
				<td width="150px" height="30" align="right">文件所在目录：</td>
				<td width="207px" align="left"><input name="fileDir" id="fileDir" type="text"
					class="input" value="/home/db" /></td>
				<td width="291px" align="left"></td>
			</tr>
			<tr  id="tr_fileName" style="display: none;">
				<td width="150px" height="30" align="right">文件名：</td>
				<td width="207px" align="left"><input name="fileName" id="fileDir" type="text"
					class="input" value="nc-crawler" /></td>
				<td width="291px" align="left"></td>
			</tr>
			
		</table>	  </td>
	</tr>
	<tr>
		<td height="30" align="center" style="padding-top: 20px;"><span
			id="beforeSubmit">
		  <input type="submit" class="regist-submit"
			value=" 提 交 " />
</span> <span id="afterSubmit"
			style="display: none; color: red;">正在安装，请您耐心等待...</span></td>
	</tr>
</table>
	  </td>
    </tr>
  </table>
</div>

<input type="hidden" name="dbFileName" value="/install/db/db.sql" /> 
<input type="hidden" name="initFileName" value="/install/db/init.sql" />
<input type="hidden" name="keyFileName" value="/install/db/key.sql" />
<input type="hidden" name="updateFileName" value="/install/db/patch/update-init.sql" />

</form>
</body>
</html>
