

NewCrawler Quick Start
==============

>www.newcrawler.com

Install NewCrawler
----

Installing software packages on Centos / Fedora servers:

>x86

>wget --no-check-certificate https://raw.githubusercontent.com/speed/newcrawler/master/install_i586.sh

>sh install_i586.sh

>x64

>wget --no-check-certificate https://raw.githubusercontent.com/speed/newcrawler/master/install_x86_64.sh

>sh install_x86_64.sh


Installing software packages on Ubuntu / Debian servers:

>x86

>wget --no-check-certificate https://raw.githubusercontent.com/speed/newcrawler/master/install_Debian_i586.sh

>sh install_Debian_i586.sh

>x64

>wget --no-check-certificate https://raw.githubusercontent.com/speed/newcrawler/master/install_Debian_x86_64.sh

>sh install_Debian_x86_64.sh




		# OS Version 、 NewCrawler Directory
		
		[root@localhost ~]# rpm -q centos-release
		centos-release-7-0.1406.el7.centos.2.5.x86_64

		[root@localhost ~]# ls
		install.sh  newcrawler

		[root@localhost ~]# ls newcrawler
		db  jetty  jre  phantomjs  start.sh  stop.sh  war

		
Startup NewCrawler
----

>sh newcrawler/start.sh &



http://127.0.0.1:8500 



鸟巢采集器介绍
=========================

    鸟巢采集器是一款`WEB`版的网页数据采集工具，鸟巢采集器拥有强大的内容采集和数据过滤功能，能将您采集的数据发布到远程服务器。
鸟巢采集器基于`JAVA`语言开发，是平台无关的可以在任何系统上运行。鸟巢采集采用分布式架构可以轻易的部署爬虫集群。
鸟巢采集器分`WEB服务端`和`客户端应用`，`WEB服务端`不干预`客户端应用`的逻辑只为`客户端应用`提供可视化的操作界面。
`客户端应用`完全由用户部署管理，通过`WEB服务端`对`客户端应用`的接入，可以对`客户端应用`进行可视化的管理，如：可视化的规则配置、实时采集日志查看...


鸟巢采集器特色功能
-------------------

>1.支持部署在免费的云平台，如[`GAE`](https://appengine.google.com)、[`OPENSHIFT`](https://www.openshift.com/)、[`ACE`](http://ace.console.aliyun.com/)、[`SAE`](http://sae.sina.com.cn/) ......

>2.采集数据推送邮件（Push to `Kindle`）功能。

>3.可配置多种版本的采集规则。

>4.提供采集规则有效性的检测功能(网页变动监控)，支持错误发送邮件通知。

>5.提供同步采集`API`，支持异步采集方式。

>6.提供数据查询`API`，支持`JSON`、`RSS`(快速创建自己的`Feed`)的数据返回格式。

>7.支持并发速率配置。

>8.提供定时、循环多种采集计划任务配置。

>9.提供控制台实时查看采集日志，支持日志文件查看。

>10.提供分布式爬虫部署，支持按`爬虫速率`、`随机选择`，`顺序选择`的负载均衡方式。

>11.提供采集任务的备份与恢复功能。

>12.提供嵌套采集功能，解决数据分布在多个页面的情况。

>13.循环匹配支持数据合并功能，解决一篇文章分成多页的情况。

>14.支持`正则`、`XPath`、`CSSPath`多匹配方式。

>15.提供基于 `XPath` 的可视化配置功能。

>16.提供`网址抓取插件`、`数据过滤插件`、`文件保存插件`、`数据发布插件`四种插件，让采集器适应更多更复杂的需求。

>		如要解析网页中的`JavaScript`时可以编写`网址抓取插件`。
>		如匹配的图片需要文本转换时可以编写`数据过滤插件`。
>		如匹配的图片需要保存到本地、`FTP`时可以编写`文件保存插件`。
>		如要将匹配的数据通过`JDBC`发布时可以编写`数据发布插件`。



修改数据库配置
edit 'src\main\webapp\WEB-INF\classes\datanucleus.properties'


	javax.jdo.option.ConnectionURL=jdbc:mysql://127.0.0.1:3306/newcrawler?characterEncoding=UTF-8
	javax.jdo.option.ConnectionUserName=root
	javax.jdo.option.ConnectionPassword=123456
