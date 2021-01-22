FROM node:14

WORKDIR /app/

ADD OOBE/ ./app 

COPY package*.json ./


RUN npm install 
RUN apt-get update && \
      apt-get -y install sudo
RUN sudo gpasswd --add node dialout
RUN sudo chmod 777 -R app/
RUN apt-get install net-tools
# ENV JAVA_HOME=/jdk1.8.0_152
# ENV PATH=$PATH:/jdk1.8.0_152/bin
USER node:

EXPOSE 3000
EXPOSE 8001

CMD node app/OOBE_Main.js
#CMD ["node /home/gwsapltpv500/test/OOBE/OOBE_Main.js"]



