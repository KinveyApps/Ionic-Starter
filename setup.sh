#!/bin/bash

# ----
# Text Colors and Messaging Functions

textReset=$(tput sgr0)
textRed=$(tput setaf 1)
textGreen=$(tput setaf 2)
textYellow=$(tput setaf 3)

message_info () {
  echo "$textGreen[project]$textReset $1"
}
message_warn () {
  echo "$textYellow[project]$textReset $1"
}
message_error () {
  echo "$textRed[project]$textReset $1"
}

# ----
# Clean

if [[ -d "plugins" ]] ; then
  message_info "Removing 'plugins' directory."
  rm -rf plugins
fi

if [[ -d "platforms" ]] ; then
  message_info "Removing 'platforms' directory."
  rm -rf platforms
fi

# ----
# Make sure necessary directories exist, regardless of options.

if [[ ! -d "plugins" ]] ; then
  message_info "Creating 'plugins' directory."
  mkdir plugins
fi

if [[ ! -d "platforms" ]] ; then
  message_info "Creating 'platforms' directory."
  mkdir platforms
fi

# ----
# Add platforms
# TODO Check if platforms have already been added
# 'phonegap platforms'

message_info "Adding Android platform..."
./node_modules/.bin/ionic platform add android

message_info "Adding iOS platform..."
./node_modules/.bin/ionic platform add ios

# ----
# Install bower components

message_info "Install Bower components..."
./node_modules/.bin/bower install
