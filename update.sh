#upgrade

cd ~/newcrawler

#bak
mkdir war/WEB-INF/classes_bak
\cp war/WEB-INF/classes/config.properties war/WEB-INF/classes_bak/config.properties

git checkout war/WEB-INF/classes
git pull

rm -ivf install_*.sh
rm -ivf Dockerfile

\cp war/WEB-INF/classes_bak/config.properties war/WEB-INF/classes/config.properties


rm -ivfR war/WEB-INF/classes_bak

sh stop.sh

#error='Cannot allocate memory'
pkill java

pkill chrome

sh start.sh &
