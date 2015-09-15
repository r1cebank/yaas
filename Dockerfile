############################################################
# Dockerfile to run yaas
# Based on baseos
############################################################

FROM r1cebank/baseos:latest

# File Author / Maintainer
MAINTAINER Siyuan Gao <siyuangao@gmail.com>

# Bundle app source
COPY . /src
COPY run.sh /bin/

RUN chmod +x /bin/run.sh

# copy supervisor config
COPY supervisord.conf /usr/etc/supervisord.conf

# Environment variables
ENV PORT 3939

# Install app dependencies
RUN cd /src; npm install

RUN rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm \
  && yum -y --enablerepo=remi,remi-test install redis \


ENV NODE_ENV production

# start supervisor
CMD ["/usr/bin/supervisord"]
