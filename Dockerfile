# untappdReborn — image statique servie par nginx
FROM nginx:1.27-alpine

# Config nginx (sert index.html, gère le type des fichiers .jsx, SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Les fichiers de l'application
COPY app/ /usr/share/nginx/html/

EXPOSE 80

# nginx tourne déjà en foreground via l'image de base
