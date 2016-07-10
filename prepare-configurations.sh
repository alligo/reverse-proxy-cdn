#!/bin/bash
# @summary     reverse-proxy-cdn prepare-configurations.sh file
#
# @description Simple script to replace system file configurations
#              with defaults. Fist check for configuration/app
#              files and, if does not have, will use configuration/_default/app
#
# @author      Bernardo Donadio <bcdonadio@alligo.com.br>
# @author      Emerson Rocha Luiz <emerson@alligo.com.br>
# @copyright   Alligo Tecnologia Ltda 2016. All rights reserved

#######################################
# Replace files with a custom or use default one
#
# Arguments:
#   #1 : Target  - Target file to replace
#   #2 : Custom  - Custom file, if exist, replace target
#   #3 : Default - Default file to replace target if Custom does not exist
# Return:
#   None
#######################################
replace_file_with_default() {
  if [ -e "$2" ]; then
    echo "Replace $1 with CUSTOM $2"
    if [ -e "$1" ]; then
      rm -f $1;
    fi
    mv $2 $1
  elif [ -e "$3" ]; then
    echo "Replace $1 with DEFAULT $3"
    if [ -e "$1" ]; then
      rm -f $1;
    fi
    mv $3 $1
  else
    echo "DEBUG error? 1:[$1]  2:[$2] 3:[$3]"
  fi
  #echo "DEBUG replace_file_with_default 1:[$1]  2:[$2] 3:[$3]"
}

BASE=`pwd`

replace_file_with_default \
  "$BASE"/configuration.json \
  "$BASE"/configuration/crawler/configuration.json \
  "$BASE"/configuration/_default/crawler/configuration.json

replace_file_with_default \
  /etc/nginx/nginx.conf \
  "$BASE"/configuration/nginx/nginx.conf \
  "$BASE"/configuration/_default/nginx/nginx.conf

replace_file_with_default \
  /etc/nginx/conf.d/default.conf \
  "$BASE"/configuration/nginx/conf.d/default.conf \
  "$BASE"/configuration/_default/nginx/conf.d/default.conf

replace_file_with_default \
  /etc/varnish/default.vcl \
  "$BASE"/configuration/varnish/default.vcl \
  "$BASE"/configuration/_default/varnish/default.vcl