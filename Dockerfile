FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio final
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia arquivos necessários para instalação de dependências e migrações
COPY package*.json ./
COPY .sequelizerc ./
COPY start.sh ./

# Instala todas as dependências (inclusive devDependencies para o sequelize-cli se necessário, 
# mas movemos sequelize-cli para dependencies no package.json então --omit=dev é seguro)
RUN npm install --omit=dev && npm cache clean --force

# Copia o código compilado e os arquivos de banco de dados (migrações/config/seeders)
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/database ./src/database

# Garante permissão de execução para o script
RUN chmod +x start.sh

EXPOSE 3000

# Executa o script de inicialização
CMD ["./start.sh"]

