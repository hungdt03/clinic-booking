using clinic_schedule.Core.Requests.Setting;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface ISettingService
    {
        Task<BaseResponse> CreateExceptionDateForClinic(ExceptionDateRequest request);
        Task<BaseResponse> CreateExceptionDateForDoctor(ExceptionDateRequest request);
        Task<BaseResponse> GetAllExceptionDatesByClinic();
        Task<BaseResponse> GetAllExceptionDatesByDoctor();
        Task<BaseResponse> GetAllWeekDays();
        Task<BaseResponse> DeleteExceptionDayClinicById(int id);
        Task<BaseResponse> DeleteExceptionDayDoctorById(int id);
        Task<BaseResponse> SaveNoteClinic(NoteRequest request);
        Task<BaseResponse> SaveNoteDoctor(NoteRequest request);
        Task<BaseResponse> GetNoteDoctor();
        Task<BaseResponse> GetNoteClinic();
        Task<BaseResponse> GetNoteDoctorByDoctorId(string doctorId);
        Task<BaseResponse> GetNoteClinicByClinicId(string clinicId);
    }
}
