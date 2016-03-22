HOME_DIR='/var/apartment_ui/'
cd $HOME_DIR

mkdir -p logs
./stop.sh > /dev/null 2>&1
grunt
nohup node index.js > logs/node.log 2>&1 &
