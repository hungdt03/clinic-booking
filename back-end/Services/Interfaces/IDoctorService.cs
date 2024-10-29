using clinic_schedule.Core.Requests;
using clinic_schedule.Core.Requests.Doctor;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IDoctorService
    {
        Task<BaseResponse> CreateDoctorOwner(CreateDoctorOwnerRequest request);
        Task<BaseResponse> CreateDoctorEmployee(CreateDoctorEmployeeRequest request);
        Task<BaseResponse> GetAllDoctorOwners();
        Task<BaseResponse> SearchDoctorOwners(string keyword, string speciality);
        Task<BaseResponse> GetAllDoctorEmployee();
        Task<BaseResponse> GetAllDoctorEmployeesByBrandId(int brandId);
        Task<BaseResponse> GetAllDoctorByClinicId(string clinicId);
        Task<BaseResponse> GetDoctorById(string doctorId);
        Task<BaseResponse> GetDoctorDetails();
        Task<BaseResponse> UpdateIntroduction(IntroductionRequest request);
        Task<BaseResponse> UpdateBasicInfomation(BasicInfoRequest request);
        Task<BaseResponse> UpdateEducations(EducationRequest request);
        Task<BaseResponse> UpdateWorkExperiences(WorkExperienceRequest request);
        Task<BaseResponse> UpdateAwardAndResearches(AwardRequest request);
    }
}
