#upgrade

cd ~/newcrawler

#bak
\cp -R war/WEB-INF/classes war/WEB-INF/classes_bak

git checkout war/WEB-INF/classes
git pull

rm -f -v install_*.sh
rm -f -v Dockerfile

\cp -R war/WEB-INF/classes_bak/* war/WEB-INF/classes
rm -R -f -v war/WEB-INF/classes_bak

sh stop.sh

#error='Cannot allocate memory'
pkill java

pkill chrome

sh start.sh &
