using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using WebApi.Models;

namespace WebApi.DataBase
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Productos> Productos { get; set; }
        public DbSet<User> Users { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> option) : base(option)
        {
            try
            {
                var dbCreator = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                if (dbCreator != null)
                {
                    if (!dbCreator.CanConnect())
                    {
                        dbCreator.Create();
                        dbCreator.CreateTables();
                    }
                    else
                    {
                        if (!dbCreator.HasTables())
                        {
                            dbCreator.CreateTables();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo conectar a la base de datos", ex);
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Definir claves primarias
            builder.Entity<Productos>().HasKey(p => p.Id);
            builder.Entity<User>().HasKey(u => u.Id);

            // Seed de usuario administrador
            var adminId = Guid.NewGuid();
            var hashed = BCrypt.Net.BCrypt.HashPassword("Admin123!");

            
        }
    }
}
