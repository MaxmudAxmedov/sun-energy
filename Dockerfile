# # Use a lightweight Nginx image
# FROM nginx:alpine

# # Copy build files to Nginx HTML directory
# COPY build /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]

FROM node:21.2.0-bullseye as builder 
RUN mkdir app
WORKDIR /app


RUN npm i -g pnpm
COPY package*.json ./


RUN pnpm install
COPY . ./
COPY .env ./app/.env
RUN export NODE_OPTIONS='--max-old-space-size=7192'
RUN pnpm run build --mode ${ENV} 

FROM nginx:alpine
COPY --from=builder /app/dist /build
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
