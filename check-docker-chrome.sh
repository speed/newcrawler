#! /bin/sh  
chromepid=`ps aux|grep  'java -jar /opt/selenium/selenium-server-standalone.jar' | grep -v grep | awk '{print $2}' | wc -l`

#Docker Chrome check
/bin/systemctl status  docker.service | grep 'inactive (dead)' &> /dev/null
if [ $? -ne 0 ]; then
	echo "Docker???"
else
	echo "Start Docker..."
	service docker start
fi

/bin/systemctl status  docker.service | grep 'active (running)' &> /dev/null
if [ $? -ne 0 ]; then
	echo "Docker does not run!"
else
	echo "Docker running!"

	if [ $chromepid -eq 0 ]; then
		echo "Start Chrome process....."
		docker images | grep selenium/standalone-chrome &> /dev/null
		if [ $? -ne 0 ]; then
		    echo "selenium/standalone-chrome is not existed!"
		else
		    echo "selenium/standalone-chrome is existed!"
		    docker ps -a | grep newcrawler-chrome &> /dev/null
			if [ $? -ne 0 ]; then
				echo "newcrawler-chrome is not existed!"
				docker run -d -p 4444:4444 --net=host --name=newcrawler-chrome -e JAVA_OPTS=-Xmx512m --shm-size=1g selenium/standalone-chrome:3.11.0-antimony
			else
				echo "newcrawler-chrome is existed!"
				docker start newcrawler-chrome
			fi
		fi
	else
		echo "Chrome runing ok."
	fi
fi

