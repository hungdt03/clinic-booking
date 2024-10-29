using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface ITokenService
    {
        Task<BaseResponse> AuthenticateTokenLogin(string email, string activationToken);
    }
}
