HOME_DIR='/var/apartment_ui/'
cd $HOME_DIR

mkdir -p logs
mkdir -p build
mkdir -p photos
mkdir -p public/css
mkdir -p public/fonts
./stop.sh > /dev/null 2>&1
grunt
nohup node index.js > logs/node.log 2>&1 &
nohup npm run watch_css > logs/nodemon.log 2>&1 &
nohup grunt standby > logs/standby 2>&1 &
