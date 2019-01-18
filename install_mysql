rpm -qa | grep mysql
yum install mariadb-server mariadb -y

mysqlstatus=`systemctl status mariadb|grep  'Active: active (running)' | grep -v grep | awk '{print $2}' | wc -l`

if [ $mysqlstatus -eq 0 ]; then
	echo "Start MySQL ....."
	systemctl start mariadb
else
	echo "MySQL runing ok."
fi

systemctl enable mariadb


mysql --default-character-set=utf8 newcrawler< ~/newcrawler/newcrawler.sql

sudo sed -i "s/.*javax.jdo.option.ConnectionDriverName.*/javax.jdo.option.ConnectionDriverName = com.mysql.jdbc.Driver/" ~/newcrawler/war/WEB-INF/classes/config.properties
sudo sed -i "s/.*javax.jdo.option.ConnectionURL.*/javax.jdo.option.ConnectionURL=jdbc:mysql://127.0.0.1:3306/newcrawler?characterEncoding=UTF-8/" ~/newcrawler/war/WEB-INF/classes/config.properties
sudo sed -i "s/.*javax.jdo.option.ConnectionUserName.*/javax.jdo.option.ConnectionUserName=root/" ~/newcrawler/war/WEB-INF/classes/config.properties
sudo sed -i "s/.*javax.jdo.option.ConnectionPassword.*/javax.jdo.option.ConnectionPassword=/" ~/newcrawler/war/WEB-INF/classes/config.properties
sudo sed -i "s/.*javax.jdo.option.Mapping.*/javax.jdo.option.Mapping=mysql/" ~/newcrawler/war/WEB-INF/classes/config.properties
