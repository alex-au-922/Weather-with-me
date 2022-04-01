ARG IMAGE_NAME
ARG IMAGE_VERSION
ARG IMAGE_TAG
FROM ${IMAGE_NAME}:${IMAGE_VERSION}-${IMAGE_TAG}

ARG HOME
ENV HOME=${HOME}
WORKDIR ${HOME}

COPY package.json ./
COPY package-lock.json ./

ARG NPM_VERSION
# following installation is deprecated. Just include as configuration management
## RUN npm i -g npm@${NPM_VERSION}

RUN npm i
