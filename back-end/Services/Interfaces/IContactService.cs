using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IContactService
    {
        Task<BaseResponse> GetAllContacts();
    }
}
