HOME_DIR='/var/apartment_ui/'
cd $HOME_DIR

mkdir -p logs
nohup node index.js > logs/node.log 2>&1 &
