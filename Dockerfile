# nginx sans privilèges : tourne en utilisateur non-root (uid 101) et écoute sur 8080.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html style.css script.js init.js favicon.svg /usr/share/nginx/html/

EXPOSE 8080
