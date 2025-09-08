Aplicación web de gestión de productos
1. Clonar repositorio
2. Levantar base de datos con Docker
   docker compose up -d
3. Configurar y ejecutar Backend
cd Backend
dotnet restore
dotnet ef database update   # crea la BD con migraciones
dotnet run
4. Configurar y ejecutar Frontend
cd Frontend
npm install   # o pnpm install
npm run dev

El backend se ejecutará en https://localhost:7224/api
El frontend estará en http://localhost:3000
