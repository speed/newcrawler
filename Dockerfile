#docker pull newcrawler/spider
#docker pull registry.aliyuncs.com/speed/newcrawler

FROM centos:centos7  
MAINTAINER Speed <https://github.com/speed/newcrawler>

#install.sh
#jetty https://www.eclipse.org/jetty/download.html
#jre http://www.oracle.com/technetwork/java/javase/downloads/index.html
#PhantomJs http://phantomjs.org/download.html
ENV jetty="http://repo1.maven.org/maven2/org/eclipse/jetty/jetty-distribution/9.3.13.v20161014/jetty-distribution-9.3.13.v20161014.tar.gz"
ENV jre="http://download.oracle.com/otn-pub/java/jdk/8u74-b02/server-jre-8u74-linux-x64.tar.gz"
ENV phantomjs="https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2"



RUN yum -y install wget tar git

RUN git clone https://github.com/speed/newcrawler.git ~/newcrawler

#jetty
RUN cd ~/newcrawler; wget --no-check-certificate $jetty -O jetty.tar.gz
RUN cd ~/newcrawler; mkdir ./jetty && tar -xzvf jetty.tar.gz -C ./jetty --strip-components 1


#jre
RUN cd ~/newcrawler; wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" $jre -O server-jre-linux.tar.gz
RUN cd ~/newcrawler; mkdir ./jre && tar -xzvf server-jre-linux.tar.gz -C ./jre --strip-components 1

#jre jce email send 
RUN yum -y install unzip
ENV jce="http://download.oracle.com/otn-pub/java/jce/7/UnlimitedJCEPolicyJDK7.zip"
RUN cd ~/newcrawler; wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" $jce -O UnlimitedJCEPolicyJDK7.zip
RUN cd ~/newcrawler; mv jre/jre/lib/security/local_policy.jar jre/jre/lib/security/local_policy.jar_bak
RUN cd ~/newcrawler; mv jre/jre/lib/security/US_export_policy.jar jre/jre/lib/security/US_export_policy.jar_bak
RUN cd ~/newcrawler; unzip -n UnlimitedJCEPolicyJDK7.zip
RUN cd ~/newcrawler; mv UnlimitedJCEPolicy/*.jar jre/jre/lib/security
RUN cd ~/newcrawler; rm -f -v UnlimitedJCEPolicyJDK7.zip
RUN cd ~/newcrawler; rm -f -v -R UnlimitedJCEPolicy

#PhantomJs
RUN yum -y install bzip2
RUN yum -y install fontconfig freetype libfreetype.so.6 libfontconfig.so.1
RUN cd ~/newcrawler; wget --no-check-certificate --header "User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36" $phantomjs -O phantomjs-linux.tar.bz2
RUN cd ~/newcrawler; mkdir ./phantomjs && tar -xjvf phantomjs-linux.tar.bz2 -C ./phantomjs --strip-components 1
RUN cd ~/newcrawler; phantomjs/bin/phantomjs --version

#Script and Config
RUN cd ~/newcrawler; wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/jetty/webapps/newcrawler.xml -P jetty/webapps/ -O jetty/webapps/newcrawler.xml
RUN cd ~/newcrawler; wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/start.sh -O start.sh
RUN cd ~/newcrawler; wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/stop.sh -O stop.sh

#Remove install package
RUN cd ~/newcrawler; rm -f -v jetty.tar.gz
RUN cd ~/newcrawler; rm -f -v phantomjs-linux.tar.bz2
RUN cd ~/newcrawler; rm -f -v server-jre-linux.tar.gz
RUN cd ~/newcrawler; rm -f -v install_*.sh
RUN cd ~/newcrawler; rm -f -v Dockerfile

RUN echo 'Congratulations, the installation is successful.'

CMD cd ~/newcrawler; /bin/bash -C 'start.sh';/bin/bash

RUN echo 'Startup is successful.'
