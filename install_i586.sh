#install.sh

#jetty http://download.eclipse.org/jetty/
#jre http://www.oracle.com/technetwork/java/javase/downloads/index.html
#PhantomJs http://phantomjs.org/download.html
jetty="http://download.eclipse.org/jetty/9.3.7.v20160115/dist/jetty-distribution-9.3.7.v20160115.tar.gz"
jre="http://download.oracle.com/otn-pub/java/jdk/8u74-b02/jre-8u74-linux-i586.tar.gz"
phantomjs="https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-i686.tar.bz2"

mkdir newcrawler
cd newcrawler


yum -y install tar

#jetty
wget --no-check-certificate $jetty -O jetty.tar.gz
mkdir ./jetty && tar -xzvf jetty.tar.gz -C ./jetty --strip-components 1


#jre
wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" $jre -O server-jre-linux.tar.gz
mkdir ./jre && tar -xzvf server-jre-linux.tar.gz -C ./jre --strip-components 1

#war
yum -y install unzip
wget --no-check-certificate https://github.com/speed/newcrawler/archive/master.zip -O master.zip
unzip -n master.zip
mv newcrawler-master/war war
rm -R -f -v newcrawler-master

#PhantomJs
yum -y install bzip2
yum -y install fontconfig freetype libfreetype.so.6 libfontconfig.so.1
wget --no-check-certificate $phantomjs -O phantomjs-linux.tar.bz2
mkdir ./phantomjs && tar -xjvf phantomjs-linux.tar.bz2 -C ./phantomjs --strip-components 1
phantomjs/bin/phantomjs --version

#Script and Config
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/jetty/webapps/newcrawler.xml -P jetty/webapps/ -O newcrawler.xml
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/start.sh -O start.sh
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/stop.sh -O stop.sh

#Remove install package
rm -f -v jetty.tar.gz
rm -f -v phantomjs-linux.tar.bz2
rm -f -v server-jre-linux.tar.gz
rm -f -v master.zip

echo 'Congratulations, the installation is successful.'
