# Étape 1 : ajoute la version aux liens des assets (cache busting).
# style.css devient style.css?v=sha-xxxxxxx : chaque publication a de nouvelles URL,
# donc ni Cloudflare ni le navigateur ne peuvent resservir un ancien CSS/JS.
FROM alpine:3.20 AS build
ARG VERSION=dev
WORKDIR /site
COPY index.html style.css script.js init.js favicon.svg ./
RUN sed -i -E "s#(href|src)=\"(style\.css|script\.js|init\.js)\"#\1=\"\2?v=${VERSION}\"#g" index.html \
 && grep -q "style.css?v=${VERSION}" index.html

# Étape 2 : nginx sans privilèges, utilisateur non-root (uid 101), écoute sur 8080.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /site/ /usr/share/nginx/html/

EXPOSE 8080
