using clinic_schedule.Core.Requests.SpecializedExamination;
using clinic_schedule.Core.Response;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Services.Interfaces
{
    public interface ISpecializedExaminationService
    {
        Task<BaseResponse> CreateSpecializedExamination(SpecializedExaminationRequest request);
        Task<BaseResponse> UpdateSpecializedExamination(int id, SpecializedExaminationRequest request);
        Task<BaseResponse> GetAllSpecializedExaminationByClinicId([FromRoute] string clinicId);
        Task<BaseResponse> DeleteSpecializedExaminationClinic(int id);
        Task<BaseResponse> DeleteSpecializedExaminationDoctor(int id);
    }
}
