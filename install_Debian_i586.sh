#install.sh
#jetty https://www.eclipse.org/jetty/download.html
#jre http://www.oracle.com/technetwork/java/javase/downloads/index.html
#PhantomJs http://phantomjs.org/download.html
jetty="http://repo1.maven.org/maven2/org/eclipse/jetty/jetty-distribution/9.3.13.v20161014/jetty-distribution-9.3.13.v20161014.tar.gz"
jre="http://download.oracle.com/otn-pub/java/jdk/8u74-b02/jre-8u74-linux-i586.tar.gz"
phantomjs="https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-i686.tar.bz2"

apt-get update
apt-get -y install tar git

git clone https://github.com/speed/newcrawler.git

cd newcrawler


#jetty
wget --no-check-certificate  $jetty -O jetty.tar.gz
mkdir ./jetty && tar -xzvf jetty.tar.gz -C ./jetty --strip-components 1

#jre
wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie"  $jre -O server-jre-linux.tar.gz
mkdir ./jre && tar -xzvf server-jre-linux.tar.gz -C ./jre --strip-components 1

#jre jce email send 
apt-get -y install unzip
jce="http://download.oracle.com/otn-pub/java/jce/7/UnlimitedJCEPolicyJDK7.zip"
wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" $jce -O UnlimitedJCEPolicyJDK7.zip
mv jre/jre/lib/security/local_policy.jar jre/jre/lib/security/local_policy.jar_bak
mv jre/jre/lib/security/US_export_policy.jar jre/jre/lib/security/US_export_policy.jar_bak
unzip -n UnlimitedJCEPolicyJDK7.zip
mv UnlimitedJCEPolicy/*.jar jre/jre/lib/security
rm -f -v UnlimitedJCEPolicyJDK7.zip
rm -f -v -R UnlimitedJCEPolicy

#PhantomJs
apt-get -y install bzip2
apt-get -y install fontconfig libfreetype6 libfreetype6-dev libfontconfig
wget --no-check-certificate $phantomjs -O phantomjs-linux.tar.bz2
mkdir ./phantomjs && tar -xjvf phantomjs-linux.tar.bz2 -C ./phantomjs --strip-components 1
phantomjs/bin/phantomjs --version

#Script and Config
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/jetty/webapps/newcrawler.xml -P jetty/webapps/ -O jetty/webapps/newcrawler.xml
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/start.sh -O start.sh
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/stop.sh -O stop.sh

#Remove install package
rm -f -v jetty.tar.gz
rm -f -v phantomjs-linux.tar.bz2
rm -f -v server-jre-linux.tar.gz
rm -f -v install_*.sh
rm -f -v Dockerfile

echo 'Congratulations, the installation is successful.'
