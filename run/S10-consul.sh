#!/bin/bash


CONSULCFG=/opt/consul/consulcfg
CONSULDATA=/opt/consul/data

setcap 'cap_net_bind_service=+ep' /bin/consul

#Save Docker DNS address, and replace it by the Consul DNS Server
if [ ! -e /etc/resolv.conf.consulorig ]; then
  dns=`cat /etc/resolv.conf | grep nameserver | grep -oE '\s*\S*\s*$' | grep -oE '\S*'`
  echo "${dns}" > /etc/resolv.conf.consulorig

  #Delete all lines in /etc/resolv.conf that contains "nameserver"
  printf '%s\n' "$(sed -e '/nameserver/d' /etc/resolv.conf)" > /etc/resolv.conf
  echo "nameserver 127.0.0.1" >> /etc/resolv.conf
else
  #Should the container be restarted, we need not to redo the work
  dns=`cat /etc/resolv.conf.consulorig`
fi

consul agent -retry-join=consul{1,2,3} -recursor="${dns}" -config-dir="${CONSULCFG}" \
  -data-dir="${CONSULDATA}" &

#Wait a bit so consul can sync
sleep 3

