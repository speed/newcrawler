#upgrade

cd ~/newcrawler

#bak
\cp -R war/WEB-INF/classes war/WEB-INF/classes_bak

rm -f -v start.sh
rm -f -v stop.sh

git checkout war/WEB-INF/classes
git pull

rm -f -v install_*.sh
rm -f -v Dockerfile

\cp -R war/WEB-INF/classes_bak/* war/WEB-INF/classes
rm -R -f -v war/WEB-INF/classes_bak

sh stop.sh

sh start.sh &
