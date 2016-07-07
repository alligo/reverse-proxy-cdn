# reverse-proxy-cdn

Default ports:

- 80, 433: nginx
- 8080: varnish
- 8888: nodeapp (crawler)

Quickstart:

    docker build -t alligo/reverse-proxy-cdn .
    docker run --rm -p 80:80 -p 443:443 -p 8888:8888 -p 8080:8080 --name mycdn alligo/reverse-proxy-cdn
    docker exec -it mycdn bash

Test to proxy http://cdn.fititnt.org/img/emerson-rocha-luiz.jpg

    curl http://127.0.0.1:8888/http://cdn.fititnt.org/img/emerson-rocha-luiz.jpg

## @todo

- Use default configurations for nodeapp, but replace if user place a custom
- Use default configurations for varnish, but replace if user place a custom
- Use default configurations for nginx, but replace if user place a custom