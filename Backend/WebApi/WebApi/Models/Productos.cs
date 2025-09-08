using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class Productos
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string ? Nombre { get; set; } 

        public string? Descripcion { get; set; }

        [Required]
        public decimal Precio { get; set; }

        [Required]
        public bool Estado { get; set; }

        public string? UsuarioCreacion { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public string? UsuarioModificacion { get; set; }
        public DateTime? FechaModificacion { get; set; }

    }
}
