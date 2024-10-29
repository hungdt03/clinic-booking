using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.Auth;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Infrastructures.JsonWebToken;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Numerics;

namespace clinic_schedule.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly JwtService jwtService;
        private readonly AppMapping appMapping;
        private readonly ApplicationDbContext _context;

        public AuthService(JwtService jwtService, UserManager<User> userManager, AppMapping appMapping, ApplicationDbContext context, IHttpContextAccessor contextAccessor)
        {
            _userManager = userManager;
            this.jwtService = jwtService;
            this.appMapping = appMapping;
            _context = context;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> RefreshToken(RefreshTokenRequest request)
        {
            var accessToken = request.AccessToken;
            var tokenInVerification = jwtService.GetPrincipalFromExpiredToken(accessToken);

            var utcExpireDate = long.Parse(tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp).Value);
            var expireDate = ConvertUnixTimeToDateTime(utcExpireDate);
            if (expireDate > DateTime.UtcNow) throw new AppException("Access token chưa hết hiệu lực");

            var storedToken = _context.AppTokens
                .Include(s => s.User)
                .FirstOrDefault(x => x.RefreshToken == request.RefreshToken);

            if (storedToken == null) throw new AppException("Refresh token không tồn tại");

            if (storedToken.ExpiredAt < DateTime.Now)
                throw new AppException("Refresh token đã hết hạn sử dụng");

            if (storedToken.IsUsed)
                throw new AppException("Refresh token đã được sử dụng");

            if (storedToken.IsRevoked)
                throw new AppException("Refresh token đã được thu hồi");

            var jti = tokenInVerification.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti).Value;
            if (storedToken.JwtId != jti)
                throw new AppException("Token không khớp");

            storedToken.IsRevoked = true;
            storedToken.IsUsed = true;
            await _context.SaveChangesAsync();

            var token = await jwtService.GenerateToken(storedToken.User);

            return new DataResponse<RefreshTokenResponse>
            {
                Message = "Đăng nhập thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Data = new RefreshTokenResponse
                {
                    AccessToken = token.AccessToken,
                    RefreshToken = token.RefreshToken,
                }
            };
        }

        private DateTime ConvertUnixTimeToDateTime(long utcExpireDate)
        {
            var dateTimeInterval = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTimeInterval = dateTimeInterval.AddSeconds(utcExpireDate).ToUniversalTime();

            return dateTimeInterval;
        }

        public async Task<BaseResponse> SignInAdministrator(SignInRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null) throw new UnauthorizedException("Tài khoản không tồn tại");

            var checkPassword = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!checkPassword) throw new UnauthorizedException("Mật khẩu không chính xác");

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

        public async Task<BaseResponse> SignInDoctor(SignInRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null) throw new UnauthorizedException("Tài khoản không tồn tại");

            var checkPassword = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!checkPassword) throw new UnauthorizedException("Mật khẩu không chính xác");

            if (!user.IsActivated)
                throw new UnauthorizedException("Vui lòng đăng nhập bằng đường link đã được gửi qua hộp thư email");

            var doctor = await _context.Doctors
                .Include(d => d.User)
                .SingleOrDefaultAsync(d => d.UserId.Equals(user.Id))
                    ?? throw new UnauthorizedException("Không tìm thấy thông tin bác sĩ");
           

            var resource = await appMapping.MapToUserResource(doctor.User);
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

        public async Task<BaseResponse> SignInManager(SignInRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null) throw new UnauthorizedException("Tài khoản không tồn tại");

            var checkPassword = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!checkPassword) throw new UnauthorizedException("Mật khẩu không chính xác");

            if (!user.IsActivated)
                throw new UnauthorizedException("Vui lòng đăng nhập bằng đường link đã được gửi qua hộp thư email");

            var manager = await _context.Managers
                .Include(d => d.User)
                .Include(d => d.Clinic)
                .SingleOrDefaultAsync(d => d.UserId.Equals(user.Id))
                    ?? throw new UnauthorizedException("Không tìm thấy thông tin quản lí");

            var resource = await appMapping.MapToUserResource(manager.User);
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

        public async Task<BaseResponse> SignInPatient(SignInRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null) throw new UnauthorizedException("Tài khoản không tồn tại");

            var checkPassword = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!checkPassword) throw new UnauthorizedException("Mật khẩu không chính xác");

            var patient = await _context.Patients
                .Include(d => d.User)
                .SingleOrDefaultAsync(d => d.UserId.Equals(user.Id))
                    ?? throw new UnauthorizedException("Không tìm thấy thông tin người dùng");
            var resource = await appMapping.MapToUserResource(patient.User);
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

        public async Task<BaseResponse> SignUp(SignUpRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user != null) throw new AppException("Địa chỉ email đã tồn tại");
          
            user = await _userManager.FindByNameAsync(request.UserName);
            if (user != null) throw new AppException("Username đã tồn tại");

            user = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                FullName = request.FullName,
            };

            var passwordHasher = new PasswordHasher<User>();
            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded) throw new AppException("Đăng kí tài khoản thất bại");

            var addRoleResult = await _userManager.AddToRoleAsync(user, "PATIENT");
            if (!addRoleResult.Succeeded) throw new AppException("Cấp quyền cho tài khoản thất bại");

            var patient = new Patient()
            {
                UserId = user.Id,
            };

            patient.Profiles ??= new List<Profile>();

            var profile = new Profile()
            {
                Id = user.Id,
                Email = request.Email,
                Name = request.FullName,
                PrimaryProfile = true
            };

            patient.Profiles.Add(profile);

            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Success = true,
                Message = "Đăng kí tài khoản thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<BaseResponse> ChangePassword(ChangePasswordRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new UnauthorizedException("Vui lòng đăng nhập lại");

            var hashedPassword = _userManager.PasswordHasher.HashPassword(user, request.Password);
            user.PasswordHash = hashedPassword;
            user.IsChangedPassword = true;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                var resource = await appMapping.MapToUserResource(user);
                var token = await jwtService.GenerateToken(user);

                return new DataResponse<SignInResponse<UserResource>>
                {
                    Message = "Thay đổi mật khẩu thành công",
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
            else throw new AppException("Thay đổi mật khẩu thất bại");
        }
    }
}
