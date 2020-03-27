shDir=$(cd "$(dirname "$0")"; pwd)

cd ${shDir}/jetty/

export PATH=${shDir}/jre/bin/

java -DSTOP.PORT=8504 -DSTOP.KEY=stop_jetty -jar start.jar --stop