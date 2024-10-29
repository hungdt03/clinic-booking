using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response;
using clinic_schedule.DbContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace clinic_schedule.Infrastructures.JsonWebToken
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> userManager;
        private readonly ApplicationDbContext _context;

        public JwtService(IConfiguration configuration, UserManager<User> userManager, ApplicationDbContext context)
        {
            _configuration = configuration;
            this.userManager = userManager;
            _context = context;
        }
        public async Task<RefreshTokenResponse> GenerateToken(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var secretKeyBytes = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"] ?? ""));
            var credentials = new SigningCredentials(secretKeyBytes, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim> {
                new Claim(ClaimTypes.GivenName, user.FullName),
                new Claim(ClaimTypes.NameIdentifier, user.UserName),
                new Claim(ClaimTypes.Sid, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var userRoles = await userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            //var token = new JwtSecurityToken(
            //  _configuration["Jwt:Issuer"],
            //  _configuration["Jwt:Audience"],
            //  claims,
            //  expires: DateTime.Now.AddHours(2),
            //  signingCredentials: credentials
            //);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(4),
                SigningCredentials = credentials,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            var accessToken = jwtTokenHandler.WriteToken(token);
            var refreshToken = GenerateRefreshToken();

            var newRefreshToken = new AppToken()
            {
                UserId = user.Id,
                JwtId = token.Id,
                RefreshToken = refreshToken,
                IssuedAt = DateTime.Now,
                ExpiredAt = DateTime.UtcNow.AddHours(5),
                IsRevoked = false,
            };

            await _context.AppTokens.AddAsync(newRefreshToken);
            int rows = await _context.SaveChangesAsync();

            if (rows == 0) throw new AppException("Có lỗi xảy ra khi tạo refresh token");

            return new RefreshTokenResponse
            {
                RefreshToken = refreshToken,
                AccessToken = accessToken,
            };
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true, //you might want to validate the audience and issuer depending on your use case
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!)),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);

            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }
    }
}
