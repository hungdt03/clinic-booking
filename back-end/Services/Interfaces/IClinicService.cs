using clinic_schedule.Core.Requests;
using clinic_schedule.Core.Requests.Clinic;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IClinicService
    {
        Task<BaseResponse> CreateClinic(ClinicRequest request);
        Task<BaseResponse> GetAllClinics();
        Task<BaseResponse> GetClinicById(string id);
        Task<BaseResponse> GetClinicDetails();
        Task<BaseResponse> SearchClinics(string keyword, string speciality);
        Task<BaseResponse> UpdateIntroduction(IntroductionRequest request);
        Task<BaseResponse> UpdateBasicInformation(BasicInforClinicRequest request);
    }
}
