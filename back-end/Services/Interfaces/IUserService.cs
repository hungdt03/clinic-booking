using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IUserService
    {
        Task<BaseResponse> GetUserById(string id);
        Task<BaseResponse> GetProfile();
    }
}
