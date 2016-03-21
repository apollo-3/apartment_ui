HOME_DIR='/var/ui/'
cd $HOME_DIR

mkdir -p logs
nohup node index.js > logs/node.log 2>&1 &
