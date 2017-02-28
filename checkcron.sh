#every 5 minutes
chmod + ~/newcrawler/check.sh
(crontab -l ; echo "5 * * * * ~/newcrawler/check.sh") | crontab -
