#! /bin/sh  

pid=`ps aux|grep  'jar start.jar jetty.port=8500' | grep -v grep | awk '{print $2}' | wc -l`
selenium="/opt/selenium/selenium-server-standalone.jar"

if [ $pid -eq 0 ]; then
	echo "Start NewCrawler process....."
	pkill java
	sh ~/newcrawler/start.sh
	if [ -f "$selenium" ]; then
		pkill chrome
		pkill Xvfb
		su - seluser -c "(xvfb-run -n 99 --server-args=\"-screen 0 1024x768x8 -ac +extension RANDR\" java -jar /opt/selenium/selenium-server-standalone.jar > /dev/null &)"
	fi
else
	echo "NewCrawler runing ok."
fi
