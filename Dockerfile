FROM node:20.18.3
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build
EXPOSE 8000
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
