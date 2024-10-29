using clinic_schedule.Core.Requests.Specialization;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface ISpecializationService
    {
        Task<BaseResponse> CreateSpecialization(SpecializationRequest request);
        Task<BaseResponse> GetAllSpecializationsByDoctorId(string id);
        Task<BaseResponse> GetAllSpecializationsByClinicId(string id);
        Task<BaseResponse> AddSpecializationsForDoctor(AddSpecializationRequest request);
        Task<BaseResponse> AddSpecializationsForClinic(AddSpecializationRequest request);
        Task<BaseResponse> DeleteSpecializationDoctor(int id);
        Task<BaseResponse> DeleteSpecializationClinic(int id);
        Task<BaseResponse> DeleteSpecialization(int id);
        Task<BaseResponse> GetAllSpecializations();
    }
}
