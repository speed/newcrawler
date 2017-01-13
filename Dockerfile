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

USER root

RUN yum -y install wget tar git sed sudo

#========================================
# Add normal user with passwordless sudo
#======================================== 
RUN sudo useradd ncuser --shell /bin/bash --create-home \
  && sudo usermod -a -G wheel ncuser \
  && echo 'ALL ALL = (ALL) NOPASSWD: ALL' >> /etc/sudoers \
  && echo 'ncuser:secret' | chpasswd

RUN git clone https://github.com/speed/newcrawler.git /opt/newcrawler

RUN sed -ie 's/jdbc:hsqldb:file:~\/newcrawler\/db\/spider/jdbc:hsqldb:file:\/opt\/newcrawler\/db\/spider/g' /opt/newcrawler/war/WEB-INF/classes/datanucleus.properties

RUN cd /opt/newcrawler; mkdir ./db

#jetty
RUN cd /opt/newcrawler; wget --no-check-certificate $jetty -O jetty.tar.gz
RUN cd /opt/newcrawler; mkdir ./jetty && tar -xzvf jetty.tar.gz -C ./jetty --strip-components 1


#jre
RUN cd /opt/newcrawler; wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" $jre -O server-jre-linux.tar.gz
RUN cd /opt/newcrawler; mkdir ./jre && tar -xzvf server-jre-linux.tar.gz -C ./jre --strip-components 1

#jre jce email send 
RUN yum -y install unzip
ENV jce="http://download.oracle.com/otn-pub/java/jce/7/UnlimitedJCEPolicyJDK7.zip"
RUN cd /opt/newcrawler; wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" $jce -O UnlimitedJCEPolicyJDK7.zip
RUN cd /opt/newcrawler; mv jre/jre/lib/security/local_policy.jar jre/jre/lib/security/local_policy.jar_bak
RUN cd /opt/newcrawler; mv jre/jre/lib/security/US_export_policy.jar jre/jre/lib/security/US_export_policy.jar_bak
RUN cd /opt/newcrawler; unzip -n UnlimitedJCEPolicyJDK7.zip
RUN cd /opt/newcrawler; mv UnlimitedJCEPolicy/*.jar jre/jre/lib/security
RUN cd /opt/newcrawler; rm -f -v UnlimitedJCEPolicyJDK7.zip
RUN cd /opt/newcrawler; rm -f -v -R UnlimitedJCEPolicy

#PhantomJs
RUN yum -y install bzip2
RUN yum -y install fontconfig freetype libfreetype.so.6 libfontconfig.so.1
RUN cd /opt/newcrawler; wget --no-check-certificate --header "User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36" $phantomjs -O phantomjs-linux.tar.bz2
RUN cd /opt/newcrawler; mkdir ./phantomjs && tar -xjvf phantomjs-linux.tar.bz2 -C ./phantomjs --strip-components 1
RUN cd /opt/newcrawler; phantomjs/bin/phantomjs --version

#Script and Config
RUN cd /opt/newcrawler; wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/jetty/webapps/newcrawler.xml -P jetty/webapps/ -O jetty/webapps/newcrawler.xml
RUN cd /opt/newcrawler; wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/start.sh -O start.sh
RUN cd /opt/newcrawler; wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/stop.sh -O stop.sh

RUN mkdir /opt/selenium; wget --no-verbose -O /opt/selenium/ModHeader.crx https://raw.githubusercontent.com/speed/newcrawler-plugin-urlfetch-chrome/master/crx/ModHeader.crx\
    && chmod 755 /opt/selenium/ModHeader.crx

#Remove install package
RUN cd /opt/newcrawler; rm -f -v jetty.tar.gz
RUN cd /opt/newcrawler; rm -f -v phantomjs-linux.tar.bz2
RUN cd /opt/newcrawler; rm -f -v server-jre-linux.tar.gz
RUN cd /opt/newcrawler; rm -f -v install_*.sh
RUN cd /opt/newcrawler; rm -f -v Dockerfile

RUN echo 'Congratulations, the installation is successful.'

RUN chmod -R a+rwx /opt/newcrawler
RUN chown -R ncuser:ncuser /opt/newcrawler

USER ncuser

#CMD cd /opt/newcrawler; /bin/bash -C 'start.sh';/bin/bash

RUN export PATH=/opt/newcrawler/jre/bin/

RUN java -version

RUN echo ${JAVA_OPTS}

RUN java ${JAVA_OPTS} -DSTOP.PORT=8504 -DSTOP.KEY=stop_jetty -jar /opt/newcrawler/jetty/start.jar jetty.port=8500 &

RUN echo 'Startup is successful.'

EXPOSE 8500


