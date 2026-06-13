# Cejas y Uñas - Módulo de Citas

Sistema de gestión de citas para un salón de belleza. Incluye backend en Node.js + Express con conexión a PostgreSQL, y frontend en React Native con Expo.

## Estructura del proyecto
backend/    - API REST con Express y PostgreSQL
frontend/   - Aplicación móvil con Expo
database/   - Script SQL con la estructura de la base de datos

## Configuración para pruebas

### Backend

1. Crear la base de datos `salon_belleza` usando el script en `database/`
2. Dentro de `backend/`, crear un archivo `.env` basado en `.env.example` con tus credenciales de PostgreSQL
3. Instalar dependencias:
cd backend
npm install

4. Ejecutar el servidor:
node index.js

### Frontend

1. En `frontend/CejasYUnas/src/app/index.tsx`, ajustar la variable `BASE_URL` con la IP local de tu equipo (o `localhost` si pruebas en el navegador)

2. Instalar dependencias:
cd frontend/CejasYUnas
npm install

3. Ejecutar:
npx expo start