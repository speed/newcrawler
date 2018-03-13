#upgrade
cd ~/newcrawler

git fetch
git checkout origin/master -- update.sh
git checkout origin/master -- upgrade.sh

sh update.sh