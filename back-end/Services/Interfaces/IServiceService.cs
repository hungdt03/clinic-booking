using clinic_schedule.Core.Requests.Service;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IServiceService
    {
        Task<BaseResponse> GetAllServicesByServiceType(int serviceType);    
        Task<BaseResponse> GetAllServiceByClinicId(string clinicId);
        Task<BaseResponse> GetAllServices();
        Task<BaseResponse> CreateService(ServiceRequest request);
        Task<BaseResponse> UpdateService(int id, ServiceRequest request);
    }
}
