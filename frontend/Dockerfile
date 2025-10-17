# --- build stage ---
    FROM node:20 AS build

    # proxy beállítás (ha kell)
    ARG HTTP_PROXY
    ARG HTTPS_PROXY
    ENV http_proxy=http://frissit:frissit@172.20.10.6:3128
    ENV https_proxy=http://frissit:frissit@172.20.10.6:3128
    
    WORKDIR /app
    
    # csak a package.json másolása a cache miatt
    COPY package*.json ./
    
    # npm config + telepítés
    RUN npm config set proxy http://frissit:frissit@172.20.10.6:3128 \
    && npm config set https-proxy http://frissit:frissit@172.20.10.6:3128 \
    && npm config set registry https://registry.npmjs.org/ \
    && npm config set strict-ssl false

    RUN npm install --legacy-peer-deps --silent\
    && npm install axios --legacy-peer-deps 
    
    # másoljuk a forráskódot
    COPY . .
    
    # build
    RUN npm run build
    
    # --- producteion stage ---
    FROM nginx:alpine AS producteion
    
    # build eredmény bemásolása
    COPY --from=build /app/dist /usr/share/nginx/html
        
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    