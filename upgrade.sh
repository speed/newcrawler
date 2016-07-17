#upgrade

cd newcrawler
rm -f -v cluster.zip
wget --no-check-certificate https://github.com/speed/newcrawler/archive/cluster.zip -O cluster.zip
unzip -n cluster.zip
rm -R -f -v newcrawler-cluster/war/WEB-INF/classes
rm -R -f -v war/WEB-INF/lib
rm -R -f -v war/static
\cp -R newcrawler-cluster/war/* war
rm -R -f -v newcrawler-cluster
rm -f -v cluster.zip
sh stop.sh

sh start.sh &
