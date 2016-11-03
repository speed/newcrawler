#upgrade

cd ~/newcrawler

#bak
\cp -R war/WEB-INF/classes war/WEB-INF/classes_bak

git pull

rm -f -v install_*.sh
rm -f -v Dockerfile

\cp -R war/WEB-INF/classes_bak/* war/WEB-INF/classes
rm -R -f -v war/WEB-INF/classes_bak

sh stop.sh

sh start.sh &
