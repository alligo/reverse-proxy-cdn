# @summary     reverse-proxy-cdn
#
# @description 
#
# @author      Bernardo Donadio <bcdonadio@alligo.com.br>
# @author      Emerson Rocha Luiz <emerson@alligo.com.br>
# @copyright   Alligo Tecnologia Ltda 2016. All rights reserved

FROM debian:jessie
MAINTAINER Alligo Tecnologia Ltda "alligo@alligo.com.br"

ENV NODE_VERSION v6.3.0
ENV DOCKER_BASE_VERSION 0.0.4
#ENV NGINX_VERSION 1.11.1-1~jessie  #bug?
ENV NGINX_VERSION 1.10.1-1~jessie

ENV VARNISH_BACKEND_PORT 8888
ENV VARNISH_BACKEND_IP 127.0.0.1
ENV VARNISH_PORT 8080

CMD [ "/bin/dumb-init", "-v", "/bin/sh", "/docker-entrypoint.sh" ]

RUN rm /bin/sh \
    && ln -s /bin/bash /bin/sh \
    && echo Etc/UTC > /etc/timezone \
    && dpkg-reconfigure --frontend noninteractive tzdata \
    && apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y g++ gcc make python git curl ca-certificates sed gnupg openssl wget unzip varnish --no-install-recommends \
    && rm -rf /tmp/* \
    && mkdir /opt/nvm \
    && apt-get clean

# NGinx
RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 \
	&& echo "deb http://nginx.org/packages/debian/ jessie nginx" >> /etc/apt/sources.list \
	&& apt-get update \
	&& apt-get install --no-install-recommends --no-install-suggests -y \
						ca-certificates \
						nginx=${NGINX_VERSION} \
						nginx-module-xslt \
						nginx-module-geoip \
						nginx-module-image-filter \
						nginx-module-perl \
						nginx-module-njs \
						gettext-base \
	&& rm -rf /var/lib/apt/lists/*

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

# Dump-init
WORKDIR /tmp
RUN gpg --keyserver pgp.mit.edu --recv-keys 91A6E7F85D05C65630BEF18951852D87348FFC4C \
    && wget https://releases.hashicorp.com/docker-base/${DOCKER_BASE_VERSION}/docker-base_${DOCKER_BASE_VERSION}_linux_amd64.zip \
    && wget https://releases.hashicorp.com/docker-base/${DOCKER_BASE_VERSION}/docker-base_${DOCKER_BASE_VERSION}_SHA256SUMS \
    && wget https://releases.hashicorp.com/docker-base/${DOCKER_BASE_VERSION}/docker-base_${DOCKER_BASE_VERSION}_SHA256SUMS.sig \
    && gpg --batch --verify docker-base_${DOCKER_BASE_VERSION}_SHA256SUMS.sig docker-base_${DOCKER_BASE_VERSION}_SHA256SUMS \
    && grep ${DOCKER_BASE_VERSION}_linux_amd64.zip docker-base_${DOCKER_BASE_VERSION}_SHA256SUMS | sha256sum -c \
    && unzip docker-base_${DOCKER_BASE_VERSION}_linux_amd64.zip \
    && cp -R bin/gosu bin/dumb-init /bin

# NVM, NodeJs, PM2
RUN git clone https://github.com/creationix/nvm.git /opt/nvm \
    && source /opt/nvm/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm use $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && npm install -g pm2 \
    && ln -s /opt/nvm/versions/node/$NODE_VERSION/bin/node /usr/bin/node \
    && ln -s /opt/nvm/versions/node/$NODE_VERSION/bin/npm /usr/bin/npm \
    && ln -s /opt/nvm/versions/node/$NODE_VERSION/bin/pm2 /usr/bin/pm2

# Bugfix. Maybe is not need. Should test. See https://github.com/npm/npm/issues/9863
RUN cd $(npm root -g)/npm \
    && npm install fs-extra \
    && sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js

WORKDIR /opt/src
ADD configuration/ /opt/src/configuration/
COPY prepare-configurations.sh /opt/src/prepare-configurations.sh
RUN /opt/src/prepare-configurations.sh
COPY crawler/package.json /opt/src/package.json
#RUN npm install -g node-gyp nan

#COPY crawler/ /opt/src/
#RUN mv config/config-example.json config/config.json
RUN npm install

COPY run/ /opt/run
COPY docker-entrypoint.sh /docker-entrypoint.sh

### @todo move up any after this line. For now are just for speed up building
