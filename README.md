

NewCrawler Quick Start
==============

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