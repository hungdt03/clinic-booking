using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IGroupService
    {
        Task<Group> GetGroupByName(string groupName);
        Task<ICollection<Group>> GetAllGroupsByUserId(string userId);
        Task<BaseResponse> GetAllGroupsByPatient(string userId);
        Task<BaseResponse> GetAllGroupsByLoggedInUser(string userId);
    }
}
