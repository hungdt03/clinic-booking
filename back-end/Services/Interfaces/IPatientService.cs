using clinic_schedule.Core.Requests.Patient;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IPatientService
    {
        Task<BaseResponse> CreateProfile(ProfileRequest request);
        Task<BaseResponse> EditProfile(string profileId, ProfileRequest request);
        Task<BaseResponse> GetAllProfilesByPatient();
    }
}
