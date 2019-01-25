#install NewCrawler and Chrome 

yum -y install wget

#install NewCrawler
wget --no-check-certificate --no-verbose https://raw.githubusercontent.com/speed/newcrawler/master/install_x86_64.sh -O NewCrawler.sh \
  && sh NewCrawler.sh

#install Chrome
wget --no-check-certificate --no-verbose https://raw.githubusercontent.com/speed/selenium/master/Centos.sh -O Selenium-Chrome.sh \
  && sh Selenium-Chrome.sh

#install MySQL
sh newcrawler/db2mysql.sh

#start NewCrawler
sh newcrawler/start.sh

#add killed cron
sh newcrawler/checkcron.sh

