#!/usr/bin/env bash

# SSH user and host for your EC2 instance
SSH_USER_HOST="ec2-user@your.ec2.instance.ip"

# The directory on the EC2 instance where your application will be installed
REMOTE_DIR="/home/ubuntu/d4ad"

# The command to start your application on the EC2 instance
START_COMMAND="./scripts/prod-start.sh"

# Create an archive of your application files
tar -czf d4ad.tar.gz *

# Copy the application files to the EC2 instance
scp d4ad.tar.gz $SSH_USER_HOST:$REMOTE_DIR

# Connect to the EC2 instance, extract the application files,
# install any necessary dependencies, and start the application
ssh $SSH_USER_HOST << EOF
  cd $REMOTE_DIR
  tar -xzf d4ad.tar.gz
  npm install
  $START_COMMAND
EOF