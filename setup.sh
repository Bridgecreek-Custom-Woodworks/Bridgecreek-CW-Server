
# SEE ENV FILE FOR SUPER USERNAME
# Note: If you're not logged in as root then you will need to use sudo for some of these commands 

# Youtube video https://www.youtube.com/watch?v=qp3YlqYu-ig


# Login into server ssh -i <name of digital ocean project> <root or other username>@<ip address>
# Make sure you are in the same dir as the ssh file is (Most likely the root)
########################
# Start Setup
########################
# update & upgrade

apt update
apt dist-upgrade

#set your local timezone
timedatectl list-timezones
timedatectl set-timezone $TIMEZONE


echo "creating a sudo user"

#1 enable auto update
dpkg-reconfigure --priority=low unattended-upgrades

#2 create a user
option 1 adduser <username>
option 2 useradd -m -p $(openssl passwd -1 "$PASSWORD") -s /bin/bash -G sudo "$USERNAME"

 # Check if user was created
cd/home
ls # You should see the username you just created after you run this command
ll # This should list all the users
groups # This should show you the sudo userscd

# Make user you just created a super user
usermod -aG sudo <username>

# Change to the new user you just created
sudo su <username> # Username = totallyottojr

#2.1 append sudo group
# usermod -aG sudo "$USERNAME"

#3 create .ssh and cp the pub.key for user you just created

# root@ cd into /home/<username> ** FROM THE ROOT USER **
cd /home/<username> 

# Create dir .ssh (mkdir .ssh). Type ll to verify the dir was created
mkdir .ssh 

# Copy root ssh key to user you just created. cp /root/.ssh/authorized_keys /home/<username>/.ssh
cp /root/.ssh/authorized_keys /home/<username>/.ssh

# cd into .ssh then type ll to verify that the authorized_keys shows up in the .ssh dir
cd .ssh 

# cd back into new users home dir. cd ..
cd ..

# Change (chmod = change modifier  ) the permission of the authorized_keys file to new user from the root user chmod -R 700 /home/<username>/.ssh
chmod -R 700 /home/<username>/.ssh

# Change the the ownership of the .ssh dir (chown = change ownership)
chown <username>:<username> .ssh


# Change the the ownership of the authorized_keys file (chown = change ownership)
# Note: cd into .ssh and then type ll to verify that the owenership has changed to new user... Remember to cd .. back after you're done.
chown <username>:<username> .ssh/authorized_keys

# Remove password login. You will need to use the arrow keys to navigate down to these two settings after exucuting this command. (control x to exit and yes to save)
nano /etc/ssh/sshd_config
# *. permitRootLogin yes -> no
# *. passwordAuthentication yes->no
systemctl restart ssh.service # **This is for Ubuntu or Debian**
systemctl restart sshd.service # **This is for RHEL or CentOS**

########################
# Start Installation
########################
echo "start installing packages"

#4 install node js (Go to https://github.com/nodesource/distributions then scroll down to Debian and Ubuntu based distributions / installation instructions )
curl -fsSL https://deb.nodesource.com/setup_<Your version here>.x | sudo -E bash -
apt-get install -y nodejs

#5 install mysql-server
sudo apt install mysql-server
sudo mysql_secure_installation

# To view Postgres pg_hba (From the postgres=#)
postgres=# select * from pg_hba_file_rules;


#5.1 edit mysql conf file
echo "edit mysql conf file to change (change port to ramdom e.g. 5063+ )"
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
#5.1.1 //change default port to something random (more than 1080)=5033

#5.1.2 //change from where to access the database [127.0.0.1=localhost]
# 	bind-address=0.0.0.0 (from anywhere)
# 	mysqlx-bind-address=0.0.0.0 (from anywhere)

sudo systemctl restart mysql


#6. install pm2 (This will restart your server if it crashes)
npm install pm2@latest -g # run pm2 status to check the status of the pm2 install
pm2 startup ubuntu # This will start up the app when the server starts up or reboots.

#7. install nginx
apt install nginx # run systemctl status nginx to check the status of nginx
# To check nginx settings run **sudo cat /etc/nginx/sites-available/default**
ufw enable # enable firewall
ufw allow ssh # allow ssh
ufw allow http # allow port 80
ufw allow https # allow port 443
# To check status run ufw status

# Configure reverse proxy for nginx
nano /etc/nginx/sites-available/default

# Remove everything in the server block and then paste
server_name yourdomain.com www.yourdomain.com;
location / {
        proxy_pass http://localhost:5000;    # or which other port your app runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
# Restart nginx 
service nginx restart

# Test nginx 
nginx -t

# Vist link for domain name https://www.udemy.com/course/nodejs-api-masterclass/learn/lecture/16582408#overview (BE SURE TO USE .com when setting custom dns regarless how your domain ends. example totallyboard.co should br totallyboard.com)

# Add ssl with LetsEncrypt
add-apt-repository ppa:certbot/certbot # Press [Enter]
snap install certbot --classic
apt-get update
apt-get install python-certbot-nginx
certbot --nginx -d totallyboard.co -d www.totallyboard.co

#7.1 make /var/www/html public to upload using scp. (only needed when root login is disabled)
chmod 777 /var/www/html

#8. install ssl certbot & python3
sudo apt install certbot python3-certbot-nginx

# other things to do.
  # - login with new non root user then do these task.
  # - pm2 startup
  # - to remove pm2 startup :  pm2 unstartup systemd
  # - setup domain .
  # - create sub domain if you want .
  # - install ssl .
  # - setup nginx
 
  # - create mmenv.txt file inside ~/applicaiton/mmenv.txt
  # - ci/cid create action-runner inside ~/applicaiton/
  # - api will run on port 2727, setup nginx to reverse proxy
        # - proxy_pass http://localhost:2727;
  # - turn off port 2727 from digital ocean firewall
  # - - ------------------------------------- - -
  # - - ---Transfer db from another droplet (optional)------ - -
  # - - ------------------------------------- - -

  # - setup react + gzip on nginx
  # - upload react files in the /var/www/html folder
  # - enable gzip in nginx[sudo nano /etc/nginx/nginx.conf] -> sudo systemctl restart nginx

  # - add 3 cron tab. certbot, daily db backup, monthly db delete.[after sestup file.txt]
  
