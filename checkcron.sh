#every 5 minutes
chmod +x ~/newcrawler/check.sh
(crontab -l ; echo "*/2 * * * * ~/newcrawler/check.sh") | crontab -
