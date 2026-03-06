#!/bin/sh

# Parar se houver erro
set -e

echo "Rodando migrações e seeds..."
./node_modules/.bin/sequelize-cli db:migrate
./node_modules/.bin/sequelize-cli db:seed:all

echo "Iniciando a aplicação..."
node dist/main
