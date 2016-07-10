#!/bin/bash
# @summary     reverse-proxy-cdn prepare-configurations.sh file
#
# @description Simple script to replace system file configurations
#              with defaults. Fist check for configuration/app
#              files and, if does not have, will use configuration/default/app
#
# @author      Bernardo Donadio <bcdonadio@alligo.com.br>
# @author      Emerson Rocha Luiz <emerson@alligo.com.br>
# @copyright   Alligo Tecnologia Ltda 2016. All rights reserved

#######################################
# Remove file, folder or links
#
# Arguments:
#   #1 : Target  - Target file to replace
#   #2 : Custom  - Custom file, if exist, replace target
#   #2 : Default - Default file to replace target if Custom does not exist
# Return:
#   None
#######################################
replace_file_with_default() {
  #...
}