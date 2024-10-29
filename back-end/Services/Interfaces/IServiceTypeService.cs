using clinic_schedule.Core.Requests.ServiceType;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IServiceTypeService
    {
        Task<BaseResponse> GetAllServiceTypesByClinicId(string clinicId);
        Task<BaseResponse> GetAllServiceTypes();
        Task<BaseResponse> CreateServiceType(ServiceTypeRequest request);
        Task<BaseResponse> UpdateServiceType(int id, ServiceTypeRequest request);
    }
    
}
