# Simple Reverse Proxy Content Delivery Network v1.0.0-alpha1

This is a very simple, but functional, Reverse Proxy with caching, that can be
used as your own [CDN](https://en.wikipedia.org/wiki/Content_delivery_network), 
with good defaults that almost work out of the box. Uses 
[docker](https://www.docker.com/).

Quickstart:

```bash
$ git clone git@github.com:alligo/reverse-proxy-cdn.git
$ cd reverse-proxy-cdn
$ docker build -t alligo/reverse-proxy-cdn .
$ docker run --rm -p 80:80 -p 443:443 --ulimit memlock=9223372036854775807 --name simplecdn alligo/reverse-proxy-cdn
```

## How to customize and debug

Just to keep it simple, this solution uses just one docker container instead of
make one container for NGinx, Varnish and the Crawler.

Default configurations files are on folder [configuration/_default]. Any custom
change, just copy file from a path without _default, and make your changes.

Debug:

```bash
$ docker exec -it simplecdn bash
$ docker run --rm -p 80:80 -p 443:443 -p 8888:8888 -p 8080:8080 --ulimit memlock=9223372036854775807 --name simplecdn alligo/reverse-proxy-cdn
```

Test to proxy http://cdn.fititnt.org/img/emerson-rocha-luiz.jpg

```bash
$ # Allow example
$ curl -I http://127.0.0.1/http://cdn.fititnt.org/img/emerson-rocha-luiz.jpg
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
$ curl -I http://127.0.0.1/https://www.bcdonadio.com/images/me.jpg
HTTP/1.1 401 Unauthorized
Content-Type: application/json
Date: Sun, 10 Jul 2016 06:26:32 GMT
Connection: keep-alive
```

## @todo

- Implement SSL
- Implement Crawler via proxies (need more test)

## Troubleshot

### ulimit: max locked memory

Error:

"Running S20-varnish.sh...
/etc/init.d/varnish: line 36: ulimit: max locked memory: cannot modify limit: Operation not permitted"

Solution: do on machine that runs docker

```bash
$ sudo su
$ cat >> /etc/security/limits.conf <<-EOF
docker          hard    memlock         82000
docker          soft    memlock         82000
docker          hard    nofile          131072
docker          soft    nofile          131072
EOF
$ service docker restart
```