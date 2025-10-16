FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY Makefile ./

RUN make install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
