FROM cypress/included:15.8.0

WORKDIR /app

# Copia apenas os manifests primeiro (cache)
COPY package*.json ./

# Instala dependências do projeto (Cypress já vem instalado)
RUN npm ci

# Copia o restante do código
COPY . .

# Rodar Cypress em modo headless
CMD ["npm", "run", "cyDevRun:e2e"]
