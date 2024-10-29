using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IBookingProcessService
    {
        Task<BaseResponse> GetBookingProcessByClinicId(string clinicId);
    }
}
