#!/bin/bash
cd /opt/src
#node index.js
pm2 start index.js --no-daemon

