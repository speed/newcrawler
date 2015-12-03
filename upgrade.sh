#upgrade

cd newcrawler
wget https://github.com/speed/spider/archive/master.zip
unzip -n master.zip
\cp -R spider-master/war/* war
rm -R -f -v spider-master
rm -f -v master.zip
sh stop.sh

sh start.sh &
