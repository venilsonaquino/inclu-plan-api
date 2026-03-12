# Estágio de construção (Builder)
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de configuração de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código fonte
COPY . .

# Compila o projeto (Gera o build de produção na pasta dist)
RUN npm run build

# Estágio de produção
FROM node:20-alpine AS production

# Define que o ambiente é de produção
ENV NODE_ENV=production

# Define o diretório de trabalho no container final
WORKDIR /usr/src/app

# Copia apenas os arquivos necessários para instalar dependências
COPY package*.json ./

# Instala apenas dependências necessárias para rodar o app em produção
RUN npm install --omit=dev

# Copia a pasta `dist` (código compilado) do estágio anterior
COPY --from=builder /usr/src/app/dist ./dist

# Adiciona um usuário e grupo não-root (prática de segurança recomendada)
RUN adduser -D -H -s "/sbin/nologin" -g "NodeUser" nodeuser
USER nodeuser

# Expõe a porta que a aplicação NestJS usa por padrão
EXPOSE 8080

# Comando para iniciar a aplicação em produção
CMD ["node", "dist/main"]
