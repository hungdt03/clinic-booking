using clinic_schedule.Core.Requests.Manager;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IManagerService
    {
        Task<BaseResponse> CreateManager(CreateManagerRequest request);
        Task<BaseResponse> GetAllManagers();
    }
}
