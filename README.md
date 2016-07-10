# reverse-proxy-cdn

Default ports:

- 80, 433: nginx
- 8080: varnish
- 8888: nodeapp (crawler)

Quickstart:

```
$ docker build -t alligo/reverse-proxy-cdn .
$ docker run --rm -p 80:80 -p 443:443 -p 8888:8888 -p 8080:8080 --ulimit memlock=9223372036854775807 --name mycdn alligo/reverse-proxy-cdn
```

Debug:    
    docker exec -it mycdn bash

Test to proxy http://cdn.fititnt.org/img/emerson-rocha-luiz.jpg

```
$ # Allow example
$ curl -I http://127.0.0.1:8888/http://cdn.fititnt.org/img/emerson-rocha-luiz.jpg
HTTP/1.1 200 OK
date: Sun, 10 Jul 2016 06:24:14 GMT
server: Apache
last-modified: Tue, 08 Mar 2016 04:44:25 GMT
etag: "1b18-52d823c58bc40"
accept-ranges: bytes
content-length: 6936
cache-control: max-age=2592000
expires: Tue, 09 Aug 2016 06:24:14 GMT
connection: close
content-type: image/jpeg


$ # Deny example
$ curl -I http://127.0.0.1:8888/https://www.bcdonadio.com/images/me.jpg
HTTP/1.1 401 Unauthorized
Content-Type: application/json
Date: Sun, 10 Jul 2016 06:26:32 GMT
Connection: keep-alive
```

## @todo

- Implement SSL
- Implement Crawler via proxies

## Troubleshot

### ulimit: max locked memory

Error:

"Running S20-varnish.sh...
/etc/init.d/varnish: line 36: ulimit: max locked memory: cannot modify limit: Operation not permitted"

Solution: do on machine that runs docker

```
$ sudo su
$ cat >> /etc/security/limits.conf <<-EOF
docker          hard    memlock         82000
docker          soft    memlock         82000
docker          hard    nofile          131072
docker          soft    nofile          131072
EOF
$ service docker restart
```