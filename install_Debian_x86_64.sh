#install.sh


#jetty https://www.eclipse.org/jetty/download.html
#jre http://www.oracle.com/technetwork/java/javase/downloads/index.html
#PhantomJs http://phantomjs.org/download.html
jetty="http://repo1.maven.org/maven2/org/eclipse/jetty/jetty-distribution/9.3.13.v20161014/jetty-distribution-9.3.13.v20161014.tar.gz"
jre="http://download.oracle.com/otn-pub/java/jdk/8u152-b16/aa0333dd3019491ca4f6ddbe78cdb6d0/server-jre-8u152-linux-x64.tar.gz"
phantomjs="https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2"

apt-get update
apt-get -y install tar git

git clone https://github.com/speed/newcrawler.git ~/newcrawler

if [ ! -f "~/newcrawler/war/index.html" ]; then
	echo "newcrawler is not installed!"
	exit 0
fi

cd newcrawler

#jetty
if [ ! -f "~/newcrawler/jetty/bin/jetty.sh" ]; then
	rm -Rivf ./jetty
	wget --no-check-certificate  $jetty -O jetty.tar.gz
	mkdir ./jetty && tar -xzvf jetty.tar.gz -C ./jetty --strip-components 1
	if [ ! -f "~/newcrawler/jetty/bin/jetty.sh" ]; then
	  echo "Jetty is not installed!"
	  exit 0
	fi
fi

#jre
if [ ! -f "~/newcrawler/jre/bin/java" ]; then
	rm -Rivf ./jre
	wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie"  $jre -O server-jre-linux.tar.gz
	mkdir ./jre && tar -xzvf server-jre-linux.tar.gz -C ./jre --strip-components 1
	chmod +rwx ./jre -R
	if [ ! -f "~/newcrawler/jre/bin/java" ]; then
	  echo "JAVA is not installed!"
	  exit 0
	fi
fi

#jre jce email send 
apt-get -y install unzip
if [ ! -f "~/newcrawler/UnlimitedJCEPolicy/local_policy.jar" ]; then
	jce="http://download.oracle.com/otn-pub/java/jce/7/UnlimitedJCEPolicyJDK7.zip"
	wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" $jce -O UnlimitedJCEPolicyJDK7.zip
	mv jre/jre/lib/security/local_policy.jar jre/jre/lib/security/local_policy.jar_bak
	mv jre/jre/lib/security/US_export_policy.jar jre/jre/lib/security/US_export_policy.jar_bak
	unzip -n UnlimitedJCEPolicyJDK7.zip
	if [ ! -f "~/newcrawler/UnlimitedJCEPolicy/local_policy.jar" ]; then
	  echo "UnlimitedJCEPolicy is not installed!"
	  exit 0
	fi
	mv UnlimitedJCEPolicy/*.jar jre/jre/lib/security
	rm -f -v UnlimitedJCEPolicyJDK7.zip
	rm -f -v -R UnlimitedJCEPolicy
fi

#PhantomJs
apt-get -y install bzip2
apt-get -y install fontconfig libfreetype6 libfreetype6-dev libfontconfig
if [ ! -f "~/newcrawler/phantomjs/bin/phantomjs" ]; then
	wget --no-check-certificate $phantomjs -O phantomjs-linux.tar.bz2
	mkdir ./phantomjs && tar -xjvf phantomjs-linux.tar.bz2 -C ./phantomjs --strip-components 1

	if [ ! -f "~/newcrawler/phantomjs/bin/phantomjs" ]; then
	  echo "PhantomJS is not installed!"
	  exit 0
	fi
fi

#Script and Config
rm -f -v start.sh
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/jetty/webapps/newcrawler.xml -P jetty/webapps/ -O jetty/webapps/newcrawler.xml
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/start.sh -O start.sh
wget --no-check-certificate https://github.com/speed/linux-64bit-jetty-jre/raw/master/stop.sh -O stop.sh


if [ ! -f "~/newcrawler/start.sh" ]; then
	echo "'start.sh' is not installed!"
	exit 0
fi

if [ ! -f "~/newcrawler/stop.sh" ]; then
	echo "'stop.sh' is not installed!"
	exit 0
fi

if [ ! -f "~/newcrawler/jetty/webapps/newcrawler.xml" ]; then
	echo "'newcrawler.xml' is not installed!"
	exit 0
fi

#Remove install package
rm -f -v jetty.tar.gz
rm -f -v phantomjs-linux.tar.bz2
rm -f -v server-jre-linux.tar.gz
rm -f -v install_*.sh
rm -f -v Dockerfile

phantomjs/bin/phantomjs --version
jre/bin/java -version

echo 'Congratulations, the installation is successful.'
