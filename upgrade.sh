#upgrade

cd newcrawler
rm -f -v master.zip
wget https://github.com/speed/newcrawler/archive/master.zip -O master.zip
unzip -n master.zip
rm -R -f -v newcrawler-master/war/WEB-INF/classes
rm -R -f -v war/WEB-INF/lib
rm -R -f -v war/static
\cp -R newcrawler-master/war/* war
rm -R -f -v newcrawler-master
rm -f -v master.zip
sh stop.sh

sh start.sh &
