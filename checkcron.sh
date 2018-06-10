#install crontab
yum install cronie vixie-cron -y

chkconfig crond on
service crond start

#every 2 minutes
chmod +x ~/newcrawler/check.sh
chmod +x ~/newcrawler/check-docker-chrome.sh

(crontab -l ; echo "*/2 * * * * ~/newcrawler/check.sh") | crontab -
(crontab -l ; echo "*/2 * * * * ~/newcrawler/check-docker-chrome.sh") | crontab -
