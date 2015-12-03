#install.sh

mkdir newcrawler
cd newcrawler

apt-get update
apt-get -y install tar

#jetty
wget --no-check-certificate http://download.eclipse.org/jetty/9.3.6.v20151106/dist/jetty-distribution-9.3.6.v20151106.tar.gz
tar zxvf jetty-distribution-9.3.6.v20151106.tar.gz
mv jetty-distribution-9.3.6.v20151106 jetty

#jre
wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u66-b17/server-jre-8u66-linux-x64.tar.gz
tar zxvf server-jre-8u66-linux-x64.tar.gz
mv jdk1.8.0_66/jre jre
rm -R -f -v jdk1.8.0_66

#war
apt-get -y install unzip
wget --no-check-certificate https://github.com/speed/spider/archive/master.zip
unzip -n master.zip
mv spider-master/war war
rm -R -f -v spider-master

#PhantomJs
apt-get -y install bzip2
apt-get -y install fontconfig libfreetype6 libfreetype6-dev libfontconfig
wget --no-check-certificate https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2
tar jxvf phantomjs-1.9.8-linux-x86_64.tar.bz2
mv phantomjs-1.9.8-linux-x86_64 phantomjs
phantomjs/bin/phantomjs --version

#Script and Config
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/jetty/webapps/newcrawler.xml -P jetty/webapps/
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/start.sh
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/stop.sh

#Remove install package
rm -f -v jetty-distribution-9.3.6.v20151106.tar.gz
rm -f -v phantomjs-1.9.8-linux-x86_64.tar.bz2
rm -f -v server-jre-8u66-linux-x64.tar.gz
rm -f -v master.zip

echo 'Congratulations, the installation is successful.'