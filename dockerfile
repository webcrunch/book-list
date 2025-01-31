# Använd en officiell Node.js-avbildning som bas
FROM node:16-alpine

# Ange arbetskatalogen i containern
WORKDIR /app

# Kopiera package.json och package-lock.json till arbetskatalogen
COPY package*.json ./

# Installera appberoenden
RUN npm install

# Kopiera hela projektet till arbetskatalogen
COPY . .

# Bygg appen (om det behövs)
RUN npm run build

# Installera serve för att tjäna byggda statiska filer
RUN npm install -g serve

# Exponera port 5000
EXPOSE 5000

# Starta applikationen med serve
CMD ["serve", "-s", "build", "-l", "5000"]
