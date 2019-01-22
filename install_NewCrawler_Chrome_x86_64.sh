#install NewCrawler and Chrome 

wget --no-check-certificate --no-verbose https://raw.githubusercontent.com/speed/newcrawler/master/install_x86_64.sh -O NewCrawler.sh \
  && sh NewCrawler.sh
  
wget --no-check-certificate --no-verbose https://raw.githubusercontent.com/speed/selenium/master/Centos.sh -O Selenium-Chrome.sh \
  && sh Selenium-Chrome.sh
  
sh newcrawler/start.sh

