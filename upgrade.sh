#upgrade
cd ~/newcrawler

git fetch
git checkout origin/master -- update.sh
git checkout origin/master -- upgrade.sh

git checkout check.sh check-docker-chrome.sh
sh update.sh
chmod +x  check.sh check-docker-chrome.sh

