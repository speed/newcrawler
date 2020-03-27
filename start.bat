%~d0
cd %~dp0jetty\

set path="%~dp0jre\bin"

java -version
java -DSTOP.PORT=8504 -DSTOP.KEY=stop_jetty -jar start.jar jetty.port=8500

