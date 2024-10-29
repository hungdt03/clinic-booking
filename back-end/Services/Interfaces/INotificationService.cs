using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface INotificationService
    {
        Task<Notification> CreateNotification(Notification notification);
        Task<BaseResponse> GetAllNotificationsByLoggedInUser();
        Task<BaseResponse> GetAllNotificationMessages();
        Task<BaseResponse> UpdateNotification(int notificationId);
        Task<BaseResponse> UpdateAllNotificationHaveRead();
        Task<BaseResponse> DeleteNotification(int notificationId);
    }
}
