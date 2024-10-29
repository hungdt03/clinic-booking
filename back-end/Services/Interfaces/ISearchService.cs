using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface ISearchService
    {
        Task<BaseResponse> SearchData(string type, string query, string speciality);
    }
}
