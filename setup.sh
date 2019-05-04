#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd /home/pi
mkdir Autonomous
cd Autonomous
touch autonomous_data.json autonomous_motor-paths.json
printf "{\n  \"selected\": \"last\",\n  \"paths\": []\n}" > autonomous_motor-paths.json
printf "[]" > autonomous_data.json

cd ..
rclocal='#!/bin/sh -e\n#\n# rc.local\n#\n# This script is executed at the end of each multiuser runlevel.\n# Make sure that the script will "exit 0" on success or any other\n# value on error.\n#\n# In order to enable or disable this script just change the execution\n# bits.\n#\n# By default this script does nothing.\n\n# Print the IP address\n\nsudo pigpiod\nnode '
end='/start.js\n\n_IP=$(hostname -I) || true\nif [ "$_IP" ]; then\n  printf "My IP address is %s\\n" "$_IP"\nfi\nexit 0'
rclocal="$rclocal$DIR$end"
printf "$rclocal" > /etc/rc.local
sudo apt install python-pip
sudo apt install pigpiod
pip install pigpio
if which node > /dev/null
  then
      echo "node is installed, skipping..."
  else
      echo "Installing Node ..."
      curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
      sudo apt-get install nodejs -y
      echo "Node has been installed."
  fi
cd $DIR
npm install
