FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install
# Expose Vite development server port
EXPOSE 5173
CMD ["npm", "run", "dev"]
