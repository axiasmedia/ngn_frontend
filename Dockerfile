# --- Etapa 1: Construir el proyecto ---
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Copia archivos de dependencias y configuración
    COPY package.json package-lock.json* ./
    COPY next.config.mjs ./
    
    # Instala dependencias
    RUN npm ci
    
    # Copia todo el proyecto
    COPY . .
    
    # Genera el build estático
    RUN npm run build
    
    # --- Etapa 2: Servir el build estático con Node.js ---
    FROM node:20-alpine
    
    WORKDIR /app
    
    # Copia SOLO lo necesario desde la etapa de builder
    COPY --from=builder /app/out ./out
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./
    
    # Instala un servidor estático ligero (opcional, pero recomendado)
    RUN npm install -g serve
    
    EXPOSE 3000
    
    # Comando para servir el build estático
    CMD ["serve", "-s", "out", "-l", "3000"]
