ps -ef | grep node | grep -v grep | awk {'print $2'} | xargs kill -9
ps -ef | grep grunt | grep -v grep | awk {'print $2'} | xargs kill -9
