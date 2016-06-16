#docker pull newcrawler/cluster
#docker pull registry.aliyuncs.com/speed/newcrawler-cluster

FROM centos:centos7  
MAINTAINER Speed <https://github.com/speed/newcrawler>

#install.sh
#jetty http://download.eclipse.org/jetty/
#jre http://www.oracle.com/technetwork/java/javase/downloads/index.html
#PhantomJs http://phantomjs.org/download.html
ENV jetty="http://download.eclipse.org/jetty/9.3.7.v20160115/dist/jetty-distribution-9.3.7.v20160115.tar.gz"
ENV jre="http://download.oracle.com/otn-pub/java/jdk/8u74-b02/server-jre-8u74-linux-x64.tar.gz"
ENV phantomjs="https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2"

RUN mkdir ~/newcrawler

RUN yum -y install wget tar

#jetty
RUN cd ~/newcrawler; wget --no-check-certificate $jetty -O jetty.tar.gz
RUN cd ~/newcrawler; mkdir ./jetty && tar -xzvf jetty.tar.gz -C ./jetty --strip-components 1


#jre
RUN cd ~/newcrawler; wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" $jre -O server-jre-linux.tar.gz
RUN cd ~/newcrawler; mkdir ./jre && tar -xzvf server-jre-linux.tar.gz -C ./jre --strip-components 1

#war
RUN yum -y install unzip
RUN cd ~/newcrawler; wget --no-check-certificate https://github.com/speed/newcrawler/archive/cluster.zip -O cluster.zip
RUN cd ~/newcrawler; unzip -n cluster.zip
RUN cd ~/newcrawler; mv newcrawler-cluster/war war
RUN cd ~/newcrawler; rm -R -f -v newcrawler-cluster

#PhantomJs
RUN yum -y install bzip2
RUN yum -y install fontconfig freetype libfreetype.so.6 libfontconfig.so.1
RUN cd ~/newcrawler; wget --no-check-certificate $phantomjs -O phantomjs-linux.tar.bz2
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
RUN cd ~/newcrawler; rm -f -v cluster.zip

RUN echo 'Congratulations, the installation is successful.'

CMD cd ~/newcrawler; /bin/bash start.sh
