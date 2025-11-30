FROM node:23 AS build
WORKDIR /advent-angular

COPY . .

RUN npm install


RUN npm run build --configuration=production

FROM nginx:alpine

COPY --from=build /advent-angular/dist/advent-angular/browser /usr/share/nginx/html

EXPOSE 80
