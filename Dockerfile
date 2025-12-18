# Use a imagem Node.js 14, por exemplo
FROM node:20

# Defina o diretório de trabalho
WORKDIR /app

# Copie todo o conteúdo do diretório do projeto para o contêiner
COPY . /app

# Instalar pré-requisitos do Cypress
RUN apt-get update && apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb \
    --fix-missing

# Instale as dependências do Cypress
RUN npm install

# Instale o Cypress explicitamente
RUN npx cypress install

# Execute os testes Cypress usando o script cypress:test
CMD ["npm", "run", "cypress:open"]
