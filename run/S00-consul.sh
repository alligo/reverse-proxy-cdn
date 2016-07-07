CONSULCFG=/opt/consul/consulcfg
CONSULDATA=/opt/consul/data

setcap 'cap_net_bind_service=+ep' /bin/consul

#Save Docker DNS address, and replace it by the Consul DNS Server
dns=`cat /etc/resolv.conf | grep nameserver | grep -oE '\s*\S*\s*$' | grep -oE '\S*'`
printf '%s\n' "$(sed -e '/nameserver/d' /etc/resolv.conf)" > /etc/resolv.conf
echo "nameserver 127.0.0.1" >> /etc/resolv.conf

consul agent -retry-join=consul1 -retry-join=consul2 -retry-join=consul3 \
  -recursor="${dns}" -config-dir="${CONSULCFG}" -data-dir="${CONSULDATA}" &

sleep 3 #Wait a bit so consul can sync

