FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --no-bin-links

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
