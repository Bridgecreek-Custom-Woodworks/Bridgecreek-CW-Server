Setup steps to deploy to AWS

Resources for this documentation => https://www.youtube.com/watch?v=NjYsXuSBZ5U&list=PLzwXI90aoBignHWA8IH4HjoZzzmIXZGGS&index=1&t=4800s

1 # Login to AWS 
2 # Navigate to ec2 section
3 # Navigate to key pairs on the left side of the screen.
4 # Create a key pair and name it the same as the app (This is to make it easy to indentify)

OPTIONS FOR STEP 4

# Select ED25519
# Select .pem
A certificate will be downloaded onto your local machine

5 Launch EC2 instance 
# Navigate back to ec2 and launch a new instance (upper left corner)

OPTIONS FOR STEP 5 
# Add Name and Tag (make sure to use Name as the key and the name of the app as value)

# Select ubuntu

# Select ubuntu server type (example 20.04)

# Select instance type (example t2.micro) Note: This size may not work for production as you may need a bigger type

# Select key pair that you just created under Key pair (login) This will download pem file to your local machine

# Select (Under Netword Settings) Allow SSH, HTTPS, HTTP

Note: If going to production you may need to a LARGER **confifured storage**

# Select LAUNCH INSTANCE to start your instance

6 Connect to your instance server
# In your termainal type ssh -i <the path to the downloaded pem certificate> ubuntu@<ip address>

example ssh -i Downloads/bridgecreek_cw_server.pem ubuntu@18.208.107.21

Note: The ip address will be on the right side of the instance screen under public IPv4

Important: If you get  WARNING: UNPROTECTED PRIVATE KEY FILE! you need to change the  permission in the command line for that file. 

example (chmod 700  Downloads/bridgecreek_cw_server.pem)

7 Update the packages for the ubuntu server

# In terminal run => sudo apt update && sudo apt upgrade -y

8 Install database

# In terminal run => sudo apt install postgresql postgresql-contrib -y

9 Create ubuntu role in postgres
Note: Once postgresql is installed it creates a user in ubuntu named ubuntu. 

# In the termainal run => cat /etc/passwd (You shuold get a long print out with one of the users named ubuntu which should look something like ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash)

Log into postgres (postgres@<ip address>)
# sudo -i -u postgres

Creating role
# createuser --interactive

Add name to role
# ubuntu (best to use the name of the server type) 
Note: It is best practice to limit the role for security reasons and not grant superuser to this role
Resources for creating and altering roles:  
CREATING ROLE => https://ubiq.co/database-blog/how-to-limit-access-to-database-in-postgresql/
ALTERING LOGIN => https://stackoverflow.com/questions/35254786/postgresql-role-is-not-permitted-to-log-in

Note: To check psql connection info (from postgres prompt postgres=) type => /conninfo 

Log into postgres database to verify ubuntu was created
# In terminal run => psql (To log into postgres in order to make the changes)
# In terminal run => \du (You should see the ubuntu role in the list or roles)

Note: Now you can log into postgres form the ubuntu user by typing psql -d postgres from the ubuntu prompt example <ubuntu@<ip address>

Note: To change peer authintication see resource at minute 29:30 => https://www.youtube.com/watch?v=NjYsXuSBZ5U&list=PLzwXI90aoBignHWA8IH4HjoZzzmIXZGGS&index=1

Add password to ubuntu user
# In terminal from the prompt (postgres=#) run => alter user <name of user> password 'admin1234'

10 Move database shcema to file on local machine
# Open another terminal and run => cd
# In terminal run => pg_dump -U <name of postgres user asoc with database you want to dump> -f <name of the file you're about to create> -C <name of the database you want to dump>

example: pg_dump -U postgres -f bridgecreek.pgsql -C bridgecreek_dev

11 Copy file from local machine to remote server
# In local terminal run => scp -i <path of pem file> <path to pg_dump file you just created> <remote username@ip address to remote server:/home/ubuntu>

example: scp -i Downloads/bridgecreek_cw_server.pem desktop/bridgecreek.pgsql ubuntu@18.208.107.21:/home/ubuntu
Note: This should return something like this => bridgecreek.pgsql            100%   42KB 771.5KB/s   00:00
Make sure to check the file was uploaded in your remote terminal run => cd /home/ubuntu run => ls

12 Create database
# In terminal run => psql -d postgres
# In terminal run => create database bridgecreek_dev
Verify database was created
# In terminal run => \l

13 Import database
# In terminal run => cd (return to home before running next command)
# In terminal run => psql <name of the database in ubuntu> < <path to pg_dump file from step 11>

example: psql bridgecreek_dev < /home/ubuntu/bridgecreek.pgsql

Verify database has all data
# In terminal run => psql -d <name of database you just imported>


14 Create folder for all apps
# In terminal run => mkdir apps

15 Create folder for app inside of app
# In terminal run => cd apps
# In terminal run => mkdir <name of app-app> 

example mkdir bridgecreek-app

16 Add apps code from github repo
From you github repo copy HTTPS link under the green CODE button
# In terminal run => cd <name of path to folder you just created in step 15>

example: cd bridgecreek-app
# In terminal run => git clone <past link you just copied from your github repo> . <=== DON'T FORGET THE DOT TO COPY INTO THE CURRENT DIRECTORY

17 Install Node on Ubuntu
Navigate to => https://github.com/nodesource/distributions/blob/master/README.md
Copy version of node you want to install 

example: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# In terminal run => curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\sudo apt-get install -y nodejs
# In terminal run => npm install (This will get your node modules)

Note: Make sure to setup postgres db configurations correctly. If postgres is installed on the same server then use localhost as the host otherwise use ip address to other server. 

18 Install pm2 
First cd into the route of the app that was installed example(/apps/bridgecreek-app)
# In termianl run => npm install pm2 -g

19 Running pm2
# In terminal run => pm2 start <path to server.js file> --name <name of app>

pm2 commands: 
Starting a process: pm2 start <path to server.js file> --name <name of app>
Stopping a process: pm2 stop <name of process or id>
Check the status of process: pm2 status
To delete a process: pm2 delete <name of process or id>

19 Configuring pm2 to restart 
# In terminal run => pm2 startup
The terminal will print out a command that you need to copy, paste and running
# In terminal run => <paste command from terminal>

Next we want to take a snapshot of the current process so that when it starts it will load the same processes
# In terminal run => pm2 save

20 Build client Note: This step is only if you have a mono repo
# In terminal cd into client root
# In terminal run => npm install
# In terminal run => npm run build

21 Installing NGINX
# In terminal run => sudo apt install nginx -y
# In terminal run => sudo systemctl enable nginx (This command ensures that nginx powers on if the system reboots)

Check NGINX status 
# In terminal run => systemctl status nginx 
Check that the status is active and enabled

# In terminal run => cd /etc/nginx
# In terminal run => ls (sites-available)
# In terminal run => cd sites-available
# In terminal run => ls (default)

Test NGINX:
Copy instance ip address into browser and enter. This should take you to a Welcome to NGINX web page

Setting up NGINX server block
# In terminal run => sudo cp default <domain name that will be used for the app> Here we are coping the default folder and creating another folder.

# In termainl sudo nano <name of the file you just created>

# If you are only hosting one app then you want to remove the default_server from the server block next to where it says listen 80 and listen [..]: 80 

Note: \# If you are hosting more than one app then you want to leave the default since you will have multiple server blocks. \#

Note: \# If this is a mono repo app then you will need to pass in the path to the client html to the root in the server block. The path will be to the build folder in the client dir. \#

example: root /home/ubuntu/apps/bridgecreek-app/client/build

# Within the server block pass in your two donmain names and instance ip address next to the server_name key => server_name <totallyboard.co> <www.totallyboard.co> <18.208.107.21>

Note: \# If you don\'t have a domain name the just pass in the ip address to the server_name key \#

Resources: Command Docs => https://www.nginx.com/resources/wiki/start/topics/tutorials/commandline/

Setting up the location block within the server block
# Replace the existing location block with these values: 
    location / {
            proxy_pass http://localhost:<the port your server is running on. Example: 5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

Mono Repo Only!!!!: Setting up the location block within the server block
*****************************************************************************************************
# Replace the existing location blocks with these values: 

    example: root /home/ubuntu/apps/bridgecreek-app/client/build

    example: index index.html index.htm index.nginx-debian.html;

    location / {
                try_files $uri /index.html;
        }

    location /<prefix for your server. Example: /api {
            proxy_pass http://localhost:<the port your server is running on. Example: 5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
*****************************************************************************************************

Example of server block for None mono repo:

server {
        # This first listen 80 is Ipv4
        listen 80;
        # This second listen [..]:80 is Ipv6
        listen [::]:80;
        server_name totallyboard.co www.totallyboard.co 18.208.107.21;

            location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }


}

# In terminal run => sudo ln -s /etc/nginx/sites-available/<your domain name goes here> /etc/nginx/sites-enabled/

# In terminal run => sudo systemctl restart nginx

To test your syntax for the NGINX file
# In terminal run => sudo nginx -t

Set up NGINX firewall 
# In terminal run => sudo ufw allow ssh
# In terminal run => sudo ufw allow http
# In terminal run => sudo ufw allow https

Enbale firewall
# In terminal run => sudo ufw enable

To check status of firewall
# In terminal run => sudo ufw status

22a Setting up a single global environment variable on ubuntu **(OPTIONAL!!!)** 
Note: You can set environment variables inside the apps env file, so this is optional.
 
# In terminal run => export <key goes here>="<values goes here in qoutes>"
Note: Key should be in uppercase and no spaces in between the key, = and the value

To persist environment variables
# In terminal run cd
# In terminal run ls -la (.profile)
# In terminal run => nano .profile
# In nano editor paste this command at the bottom of the file => set -o allexports; source </home/ubuntu/.env <== name of file>; set +o allexport

Note: *** For env variables to show you must exit session and log back in to a new session ***

To print out all the global environment variables
# In terminal run => printenv

To print out a spacific global environment variable
# In terminal run => printenv | grep -i <key name>

To remove environment variables
# In terminal run => unset <key name> 

22b Setting up multiple global environment variables on ubuntu **(OPTIONAL!!!)** 
Navigate to home dir
# In terminal run => cd
# In terminal run => touch <.env>
# In terminal run => nano .env
# In nano code editor paste environment variables from local repo or type them in one by one.
# In nano editor press => ctrl + x 

This next command is to place the word export in front of the key and set qoutes around the values.
# In terminal run => set -o allexports; source <.env <== name of file>; set +o allexport


23 Setting up SSL with Certbot 
Resource => https://certbot.eff.org/

# In terminal run => cd

Navigate to certbot site and in enter type of web server <Nginx> on <Ubuntu 20>
Copy install command from cerbot Install Certbot step. example: # sudo snap install --classic certbot
# In terminal run => sudo snap install --classic certbot

Copy Prepare the Certbot command from certbot example: # sudo ln -s /snap/bin/certbot /usr/bin/certbot
# In terminal run => sudo ln -s /snap/bin/certbot /usr/bin/certbot

Copy Choose how you\'d like to run Certbot command from certbot example: # sudo certbot --nginx
# In terminal run => sudo certbot --nginx

Note: This last command looks for all domains we have listed in our nginx server block. The last option is asking if we want to select certain sites from the list you see or you can just hit enter to select them all.

IMPORTANT!!!! This last step will fail if you have not setup your domain name and pointed it to your deployment ip address.