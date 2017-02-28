#every 5 minutes
(crontab -l ; echo "*/5 * * * * ~/newcrawler/check.sh") | crontab -
