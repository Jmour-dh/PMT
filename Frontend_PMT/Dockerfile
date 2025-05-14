FROM node:lts-alpine

WORKDIR /app

# 1. Installer Angular CLI globalement
RUN npm install -g @angular/cli

# 2. Copier les fichiers de dépendances d'abord
COPY package*.json ./

# 3. Installer les dépendances du projet
RUN npm install

# 4. Copier le reste des fichiers
COPY . .

# Configuration de l'environnement
ENV VITE_API_URL=http://backend:8080/api

# Port exposé
EXPOSE 4200

# 5. Utilisez npm pour lancer le serveur (au lieu de ng directement)
CMD ["npm", "start"]