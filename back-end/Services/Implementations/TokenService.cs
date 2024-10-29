using Azure.Core;
using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Infrastructures.JsonWebToken;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.Text;

namespace clinic_schedule.Services.Implementations
{
    public class TokenService : ITokenService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> userManager;
        private readonly IConfiguration _configuration;
        private readonly JwtService jwtService;
        private readonly AppMapping appMapping;

        public TokenService(ApplicationDbContext context, UserManager<User> userManager, IConfiguration configuration, JwtService jwtService, AppMapping appMapping)
        {
            _context = context;
            this.userManager = userManager;
            _configuration = configuration;
            this.jwtService = jwtService;
            this.appMapping = appMapping;
        }

        public async Task<BaseResponse> AuthenticateTokenLogin(string email, string activationToken)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                throw new AppException("Xác thực user không thành công");
            }

            if (user.IsActivated)
            {
                return new BaseResponse
                {
                    Message = "Tài khoản đã được xác thực trước đó",
                    Success = false,
                    StatusCode = System.Net.HttpStatusCode.BadRequest
                };
            }

            byte[] decodedBytes;
            try
            {
                decodedBytes = Convert.FromBase64String(activationToken);
            }
            catch (FormatException)
            {
                throw new AppException("Token không hợp lệ");
            }

            string activationTokenDecode = Encoding.UTF8.GetString(decodedBytes);
            var result = await userManager.ConfirmEmailAsync(user, activationTokenDecode);

            if (!result.Succeeded)
            {
                throw new AppException("Đường dẫn không hợp lệ hoặc token đã được sử dụng");
            }

            user.EmailConfirmed = true;
            user.IsActivated = true;
            await userManager.UpdateAsync(user);

            var resource = await appMapping.MapToUserResource(user);
            var token = await jwtService.GenerateToken(user);

            return new DataResponse<SignInResponse<UserResource>>
            {
                Message = "Đăng nhập thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Data = new SignInResponse<UserResource>
                {
                    AccessToken = token.AccessToken,
                    RefreshToken = token.RefreshToken,
                    User = resource
                }
            };
        }
    }
}
