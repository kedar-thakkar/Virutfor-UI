FROM node:alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app
COPY package-lock.json /app
RUN npm ci --silent
RUN npm install  -g --silent
COPY . ./
RUN npm run-script build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html/
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]