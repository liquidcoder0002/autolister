FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=965014ccad8cfee4be7a6cfb6956c1a4
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install
CMD ["npm", "run", "serve"]