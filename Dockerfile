# 1. Escolhemos uma imagem base com Node.js instalado (versão leve 'alpine')
FROM node:18-alpine

# 2. Definimos o diretório de trabalho dentro do container
WORKDIR /app

# 3. Copiamos os arquivos de definição de dependências primeiro
# Isso aproveita o cache do Docker se nada mudar no package.json
COPY package.json package-lock.json ./

# 4. Instalamos as dependências dentro do container
# Usamos --legacy-peer-deps se houver conflitos de versão, comum em projetos antigos/mistos
RUN npm install --legacy-peer-deps

# 5. Copiamos todo o resto do código do projeto para dentro do container
COPY . .

# 6. Expomos a porta que o React usa (padrão 3000)
EXPOSE 3000

# 7. Comando para iniciar a aplicação (igual ao que você roda no terminal)
CMD ["npm", "start"]