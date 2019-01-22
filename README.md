

<!-- http://shields.io/-->

NewCrawler
=========================

    Free Web Scraping Tool
    
    
NewCrawler Quick Start
==============

>www.newcrawler.com

Linux
----

Installing software packages on Centos / Fedora servers:

>x86

>curl -fsSL https://raw.githubusercontent.com/speed/newcrawler/master/install_i586.sh | sh

>x64

>curl -fsSL https://raw.githubusercontent.com/speed/newcrawler/master/install_x86_64.sh | sh


Installing software packages on Ubuntu / Debian servers:

>x86

>curl -fsSL https://raw.githubusercontent.com/speed/newcrawler/master/install_Debian_i586.sh | sh

>x64

>curl -fsSL https://raw.githubusercontent.com/speed/newcrawler/master/install_Debian_x86_64.sh | sh


Installing NewCrawler and Chrome software packages on Centos / Fedora servers:

>x86

>curl -fsSL https://raw.githubusercontent.com/speed/newcrawler/master/install_NewCrawler_Chrome_x86_64.sh | sh





		# OS Version 、 NewCrawler Directory
		
		[root@localhost ~]# rpm -q centos-release
		centos-release-7-0.1406.el7.centos.2.5.x86_64

		[root@localhost ~]# ls
		install.sh  newcrawler

		[root@localhost ~]# ls newcrawler
		db  jetty  jre  phantomjs  start.sh  stop.sh  war

Modify the database to MySQL or use the default file database

	#edit 'war/WEB-INF/classes/datanucleus.properties'
	
	javax.jdo.option.ConnectionURL=jdbc:mysql://127.0.0.1:3306/newcrawler?characterEncoding=UTF-8
	javax.jdo.option.ConnectionUserName=root
	javax.jdo.option.ConnectionPassword=123456
	
Windows
----

>x86

>https://github.com/speed/windows-32bit-jetty-jre

>x64

>https://github.com/speed/windows-64bit-jetty-jre



Google App Engine
----

>https://github.com/speed/newcrawler-gae-shell


Docker
----

>docker pull newcrawler/spider

>docker run -itd -p --net=host 8500:8500 --name=newcrawler newcrawler/spider

>docker logs -f newcrawler

Docker aliyun
----

>docker run -itd -p --net=host 8500:8500 --name=newcrawler registry.cn-shenzhen.aliyuncs.com/speed/spider

	
Startup NewCrawler
----

>sh newcrawler/start.sh &

http://127.0.0.1:8500 


Shutdown NewCrawler
----

>sh newcrawler/stop.sh

Upgrade NewCrawler
----

>sh newcrawler/upgrade.sh

Install Chrome
----
https://github.com/speed/selenium

[![ScreenShot](https://raw.githubusercontent.com/speed/resources/master/images/NewCrawler_Video.jpg)](http://www.newcrawler.com/demo.html)



NewCrawler Cluster
=========================

![ScreenShot](https://raw.githubusercontent.com/speed/resources/master/images/NewCrawler%20Cluster2.png)



[![ScreenShot](https://bwh1.net/templates/organicbandwagon/images/logo.png)](https://bandwagonhost.com/aff.php?aff=42346)
