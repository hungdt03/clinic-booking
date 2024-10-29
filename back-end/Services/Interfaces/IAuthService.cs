using clinic_schedule.Core.Requests.Auth;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IAuthService
    {
        Task<BaseResponse> SignInAdministrator(SignInRequest request);
        Task<BaseResponse> SignInDoctor(SignInRequest request);
        Task<BaseResponse> SignInManager(SignInRequest request);
        Task<BaseResponse> SignInPatient(SignInRequest request);
        Task<BaseResponse> SignUp(SignUpRequest request);
        Task<BaseResponse> RefreshToken(RefreshTokenRequest request);
        Task<BaseResponse> ChangePassword(ChangePasswordRequest request);
    }
}
