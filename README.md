Aplicación web de gestión de productos
1. Clonar repositorio
   
3. Levantar base de datos con Docker
- cd Backend
- docker compose up -d
   
4. Configurar y ejecutar Backend
- Abre Visual Studio y carga el archivo WebApi.sln
  
  *Instala los paquetes NuGet necesarios:*
- Microsoft.EntityFrameworkCore.Design -Version 8.0.8
- Microsoft.EntityFrameworkCore.SqlServer -Version 8.0.8
- Microsoft.AspNetCore.Authentication.JwtBearer
- QuestPDF
- BCrypt.Net-Next

*Aplicar migraciones y crear la base de datos*
- cd backend\WebApi\WebApi
- dotnet ef database update   # crea la BD con migraciones
- dotnet run
- 
  
6. Configurar y ejecutar Frontend
   
- cd frontend\app-gestion

- npm install   # o pnpm install
- npm install react-hook-form @hookform/resolvers zod
- npm install axios
- npm install lucide-react
- npm run dev

El backend se ejecutará en https://localhost:7224/api

El frontend estará en http://localhost:3000
