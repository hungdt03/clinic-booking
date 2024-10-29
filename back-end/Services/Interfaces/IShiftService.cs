using clinic_schedule.Core.Requests.Shift;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IShiftService
    {
        Task<BaseResponse> GetShiftsByDoctorId(string doctorId); 
        Task<BaseResponse> GetShifts();
        Task<BaseResponse> GetShiftsByClinicId(string clinicId);
        Task<BaseResponse> CreateShift(CreateShiftRequest request);
        Task<BaseResponse> GetAllEmptyShiftsByClinicIdAndDate(string clinicId, DateTime date);
        Task<BaseResponse> GetAllEmptyShiftsByDoctorIdAndDate(string doctorId, DateTime date);
        Task<BaseResponse> GetAllEmptyShiftsByClinic(string clinicId, int? brandId, string? doctorId, DateTime? date);
        Task<BaseResponse> GetAllEmptyDaysByClinicAndMonth(string clinicId, int? brandId, string? doctorId, int month, int year);
        Task<BaseResponse> GetAllFullDaysByClinicAndMonth(string clinicId, int? brandId, string? doctorId, int month, int year);
        Task<BaseResponse> GetAllEmptyDaysByDoctor(string? doctorId);
    }
}
