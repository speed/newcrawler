
#!/bin/bash

shDir=$(cd "$(dirname "$0")"; pwd)

cd ${shDir}/jetty/

pwd
 
export PATH=${shDir}/jre/bin/

java -version

echo ${JAVA_OPTS}

java ${JAVA_OPTS} -DSTOP.PORT=8504 -DSTOP.KEY=stop_jetty -jar start.jar jetty.port=8500
