using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.DataBase;
using WebApi.Models;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductosController(ApplicationDbContext context)
        {
            _context = context;
        }


        // GET: api/productos
        [HttpGet]
        public IActionResult Get()
        {
            var productos = _context.Productos.ToList();
            return Ok(productos);
        }



        // GET: api/productos/{id}
        [HttpGet("{id}")]
        public IActionResult Get(Guid id)
        {
            var producto = _context.Productos.Find(id);
            if (producto == null)
                return NotFound();

            return Ok(producto);
        }

        // GET: api/productos/filter
        [HttpGet("filter")]
        public async Task<IActionResult> GetFiltered(
            [FromQuery] string? nombre,
            [FromQuery] string? estado = "all",
            [FromQuery] decimal? precioMin = null,
            [FromQuery] decimal? precioMax = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Productos.AsQueryable();

            if (!string.IsNullOrEmpty(nombre))
                query = query.Where(p => p.Nombre.Contains(nombre));

            if (estado == "active")
                query = query.Where(p => p.Estado == true);
            else if (estado == "inactive")
                query = query.Where(p => p.Estado == false);

            if (precioMin.HasValue)
                query = query.Where(p => p.Precio >= precioMin.Value);

            if (precioMax.HasValue)
                query = query.Where(p => p.Precio <= precioMax.Value);

            var total = await query.CountAsync();
            var productos = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                total,
                page,
                pageSize,
                productos
            });
        }


        // POST: api/productos
        [HttpPost]
        public IActionResult Post([FromBody] Productos producto)
        {
            producto.FechaCreacion = DateTime.UtcNow;
            _context.Productos.Add(producto);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = producto.Id }, producto);
        }

        // PUT: api/productos/{id}
        [HttpPut("{id}")]
        public IActionResult Put(Guid id, [FromBody] Productos productoActualizado)
        {
            var producto = _context.Productos.Find(id);
            if (producto == null)
                return NotFound();

            producto.Nombre = productoActualizado.Nombre;
            producto.Descripcion = productoActualizado.Descripcion;
            producto.Precio = productoActualizado.Precio;
            producto.Estado = productoActualizado.Estado;
            producto.UsuarioModificacion = productoActualizado.UsuarioModificacion;
            producto.FechaModificacion = DateTime.UtcNow;

            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/productos/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var producto = _context.Productos.Find(id);
            if (producto == null)
                return NotFound();

            _context.Productos.Remove(producto);
            _context.SaveChanges();
            return NoContent();
        }

        // Get: api/productos/reporte-pdf
        [HttpGet("reporte-pdf")]
        public IActionResult GenerarReportePDF()
        {
            var productos = _context.Productos.ToList();
            var pdfBytes = ProductoReport.Generate(productos);

            return File(pdfBytes, "application/pdf", "ReporteProductos.pdf");
        }

    }
}
