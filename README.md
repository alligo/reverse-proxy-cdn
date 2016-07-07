# reverse-proxy-cdn

This is a simple ...



    docker build -t alligo/reverse-proxy-cdn .
    docker run --rm -p 8080:8080 --name mycdn alligo/reverse-proxy-cdn

    # test to proxy http://cdn.fititnt.org/img/emerson-rocha-luiz.jpg
    curl http://127.0.0.1:8080/img/emerson-rocha-luiz.jpg