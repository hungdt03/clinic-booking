using clinic_schedule.Core.DTOs;
using clinic_schedule.Core.Requests;

namespace clinic_schedule.Infrastructures.FCM
{
    public interface IFirebaseCloudMessagingService
    {
        Task SaveTokenDevice(DeviceTokenRequest request);
        Task<List<string>> GetAllDeviceTokensByUserId(string userId);
        Task SendNotification(NotificationDTO notificationDTO);
    }
}
