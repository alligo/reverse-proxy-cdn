# reverse-proxy-cdn

Default ports:

- 80, 433: nginx
- 8080: varnish
- 8888: nodeapp (crawler)

Quickstart:

    docker build -t alligo/reverse-proxy-cdn .
    docker run --rm -p 80:80 -p 443:443 -p 8888:8888 -p 8080:8080 --ulimit memlock=9223372036854775807 --name mycdn alligo/reverse-proxy-cdn

Debug:    
    docker exec -it mycdn bash

Test to proxy http://cdn.fititnt.org/img/emerson-rocha-luiz.jpg

    curl http://127.0.0.1:8888/http://cdn.fititnt.org/img/emerson-rocha-luiz.jpg

## @todo

- Use default configurations for nodeapp, but replace if user place a custom
- Use default configurations for varnish, but replace if user place a custom
- Use default configurations for nginx, but replace if user place a custom

## Troubleshot

"Running S20-varnish.sh...
/etc/init.d/varnish: line 36: ulimit: max locked memory: cannot modify limit: Operation not permitted"

Do on machine that runs docker

    sudo su
    echo > /etc/security/limits.conf <<-EOF
docker          hard    memlock         82000
docker          soft    memlock         82000
docker          hard    nofile          131072
docker          soft    nofile          131072
EOF
    reboot
