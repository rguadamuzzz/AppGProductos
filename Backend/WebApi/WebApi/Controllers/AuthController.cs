using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApi.DataBase;
using WebApi.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Registro de usuario
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
                return BadRequest("El correo ya está registrado.");

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "User"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("Usuario registrado correctamente.");
        }

     

        /*// Listar todos los usuarios (solo para depuración)
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.PasswordHash,
                    u.Role

                })
                .ToList();

            return Ok(users);

         }

        // Eliminar todos los usuarios (solo para pruebas)
        [HttpDelete("delete-all")]
        public IActionResult DeleteAllUsers()
        {
            var allUsers = _context.Users.ToList();

            if (!allUsers.Any())
                return NotFound("No hay usuarios para eliminar.");

            _context.Users.RemoveRange(allUsers);
            _context.SaveChanges();

            return Ok("Todos los usuarios han sido eliminados.");
        }*/


        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            Console.WriteLine($"Intentando login con: {request.Email}");

            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
            {
                Console.WriteLine("Usuario no encontrado.");
                return Unauthorized("Credenciales inválidas.");
            }

            var isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            Console.WriteLine($"Contraseña válida: {isValid}");

            if (!isValid)
                return Unauthorized("Credenciales inválidas.");

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }


        // Generar token JWT
        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
                throw new InvalidOperationException("La clave JWT no está configurada.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // Clase auxiliar para login
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
