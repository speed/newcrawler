#install.sh
#jetty https://www.eclipse.org/jetty/download.html
#jre http://www.oracle.com/technetwork/java/javase/downloads/index.html
ENV jetty="http://dependency.newcrawler.com/jetty/jetty-distribution-9.4.27.v20200227.tar.gz"
ENV jre="http://dependency.newcrawler.com/jre/jre-8u241-linux-i586.tar.gz"

yum -y install tar git wget

git clone https://github.com/speed/newcrawler.git ~/newcrawler

if [ ! -f "newcrawler/war/index.html" ]; then
	echo "newcrawler is not installed!"
	exit 0
fi

cd newcrawler

#jetty
if [ ! -f "jetty/bin/jetty.sh" ]; then
	rm -Rivf ./jetty
	wget --no-check-certificate $jetty -O jetty.tar.gz
	mkdir ./jetty && tar -xzvf jetty.tar.gz -C ./jetty --strip-components 1
	if [ ! -f "jetty/bin/jetty.sh" ]; then
	  echo "Jetty is not installed!"
	  exit 0
	fi
fi

#jre
if [ ! -f "jre/bin/java" ]; then
	rm -Rivf ./jre
	wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" $jre -O server-jre-linux.tar.gz
	mkdir ./jre && tar -xzvf server-jre-linux.tar.gz -C ./jre --strip-components 1
	chmod +rwx ./jre -R

	if [ ! -f "jre/bin/java" ]; then
	  echo "JAVA is not installed!"
	  exit 0
	fi
fi

#PhantomJs
#yum -y install bzip2
#yum -y install fontconfig freetype libfreetype.so.6 libfontconfig.so.1


#Script and Config
rm -f -v start.sh
wget --no-check-certificate https://github.com/speed/newcrawler/raw/master/config/newcrawler.xml -P jetty/webapps/ -O jetty/webapps/newcrawler.xml
wget --no-check-certificate https://github.com/speed/newcrawler/raw/master/start.sh -O start.sh
wget --no-check-certificate https://github.com/speed/newcrawler/raw/master/stop.sh -O stop.sh



if [ ! -f "start.sh" ]; then
	echo "'start.sh' is not installed!"
	exit 0
fi

if [ ! -f "stop.sh" ]; then
	echo "'stop.sh' is not installed!"
	exit 0
fi

if [ ! -f "jetty/webapps/newcrawler.xml" ]; then
	echo "'newcrawler.xml' is not installed!"
	exit 0
fi

#Remove install package
rm -f -v jetty.tar.gz
rm -f -v server-jre-linux.tar.gz
rm -f -v install_*.sh
rm -f -v Dockerfile

jre/bin/java -version

echo 'Congratulations, the installation is successful.'
