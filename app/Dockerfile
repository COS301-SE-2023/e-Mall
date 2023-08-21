# Stage 1
FROM node:18.17 AS node
WORKDIR /app
COPY . .
# RUN npm install -g yarn
RUN yarn install --ignore-scripts && yarn ng build --configuration production
# Stage 2
FROM nginx:alpine
COPY --from=node /app/dist/app /usr/share/nginx/html
COPY /default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80