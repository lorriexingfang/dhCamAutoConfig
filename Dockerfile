FROM node:4-onbuild

RUN mkdir /src
WORKDIR /src
ADD dahuaSetup /src
RUN node example.js