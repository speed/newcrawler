#! /bin/sh  

newcrawlerpid=`ps aux|grep  'java -DSTOP.PORT=8504 -DSTOP.KEY=stop_jetty -jar start.jar jetty.port=8500' | grep -v grep | awk '{print $2}' | wc -l`
chromepid=`ps aux|grep  'java -jar /opt/selenium/selenium-server-standalone.jar' | grep -v grep | awk '{print $2}' | wc -l`

selenium="/opt/selenium/selenium-server-standalone.jar"

#NewCrawler check
if [ $newcrawlerpid -eq 0 ]; then
	echo "Start NewCrawler process....."
	pkill java
	pkill chrome
	pkill Xvfb
	sh ~/newcrawler/start.sh
else
	echo "NewCrawler runing ok."
fi

#Chrome check
if [ -f "$selenium" ]; then
	if [ $chromepid -eq 0 ]; then
		echo "Start Chrome process....."
		su - seluser -c "(xvfb-run -n 99 --server-args=\"-screen 0 1024x768x8 -ac +extension RANDR\" java -jar /opt/selenium/selenium-server-standalone.jar > /dev/null &)"
	else
		echo "Chrome runing ok."
	fi
fi
