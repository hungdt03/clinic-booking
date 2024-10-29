using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.Extensions;
using clinic_schedule.Infrastructures.JsonWebToken;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.Numerics;

namespace clinic_schedule.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;
        private readonly AppMapping appMapping;
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserService(UserManager<User> userManager, AppMapping appMapping, IHttpContextAccessor httpContextAccessor)
        {
            this.userManager = userManager;
            this.appMapping = appMapping;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<BaseResponse> GetProfile()
        {
            var userId = httpContextAccessor.HttpContext.User.GetUserID();
            var user = await userManager.FindByIdAsync(userId);

            if (user == null) throw new UnauthorizedException("Vui lòng đăng nhập lại");

            var resource = await appMapping.MapToUserResource(user);

            return new DataResponse<UserResource>
            {
                Message = "Lấy thông tin user thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Data = resource
            };
        }

        public async Task<BaseResponse> GetUserById(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null)
                throw new AppException("User không tồn tại");

            var resource = await appMapping.MapToUserResource(user);
            return new DataResponse<UserResource>
            {
                Data = resource,
                Message = "Lấy thông tin người dùng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }
    }
}
