# //CSCI2720 Group Project 26
# //Au Cheuk Ming 1155125363
# //Chin Wen Jun Cyril 1155104882
# //Lee Yat 1155126257
# //Ho Tsz Hin 1155126757
# //Lee Sheung Chit 1155125027

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
