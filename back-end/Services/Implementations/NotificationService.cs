using clinic_schedule.Core.Constants;
using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly AppMapping appMapping;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public NotificationService(ApplicationDbContext context, AppMapping appMapping, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            this.appMapping = appMapping;
            _httpContextAccessor = contextAccessor;
        }

        public async Task<Notification> CreateNotification(Notification notification)
        {
            var savedNotification = await _context.Notifications.AddAsync(notification);
            int rows = await _context.SaveChangesAsync();
            if (rows == 0) throw new Exception("Thất bại khi tạo thông báo");
            await _context.Entry(savedNotification.Entity).Reference(n => n.Recipient).LoadAsync();
            return savedNotification.Entity;
        }

        public async Task<BaseResponse> DeleteNotification(int notificationId)
        {
            var notification = await _context.Notifications
                .SingleOrDefaultAsync(n => n.Id == notificationId)
                    ?? throw new AppException("Thông báo không tồn tại");

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return new BaseResponse()
            {
                Message = "Xóa thông báo thành công",
                StatusCode = System.Net.HttpStatusCode.NoContent,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllNotificationMessages()
        {
            var userId = _httpContextAccessor.HttpContext.User.GetUserID();
            var notifications = await _context.Notifications
                .Include(n => n.Recipient)
                .Where(n => n.RecipientId == userId && n.NotificationType == NotificationType.NOTIFICATION_MESSAGE)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            var resources = new List<NotificationResource>();
            foreach (var notification in notifications)
            {
                var resource = await appMapping.MapToNotificationResource(notification);
                resources.Add(resource);
            }

            return new DataResponse<List<NotificationResource>>
            {
                Data = resources,
                Message = "Lấy danh sách thông báo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllNotificationsByLoggedInUser()
        {
            var userId = _httpContextAccessor.HttpContext.User.GetUserID();
            var notifications = await _context.Notifications
                .Include(n => n.Recipient)
                .Where(n => n.RecipientId == userId && n.NotificationType != NotificationType.NOTIFICATION_MESSAGE)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            var resources = new List<NotificationResource>();
            foreach(var notification in notifications)
            {
                var resource = await appMapping.MapToNotificationResource(notification);
                resources.Add(resource);
            }

            return new DataResponse<List<NotificationResource>>
            {
                Data = resources,
                Message = "Lấy danh sách thông báo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> UpdateAllNotificationHaveRead()
        {
            var userId = _httpContextAccessor.HttpContext.User.GetUserID();

            var result = await _context.Notifications
                .Where(n => n.RecipientId == userId && !n.HaveRead && n.NotificationType != NotificationType.NOTIFICATION_MESSAGE) 
                .ExecuteUpdateAsync(n => n.SetProperty(n => n.HaveRead, true));

            return new BaseResponse()
            {
                Message = "Cập nhật thông báo thành công",
                StatusCode = System.Net.HttpStatusCode.NoContent,
                Success = true
            };
        }

        public async Task<BaseResponse> UpdateNotification(int notificationId)
        {
            var notification = await _context.Notifications
                .SingleOrDefaultAsync(n => n.Id == notificationId)
                    ?? throw new AppException("Thông báo không tồn tại");

            notification.HaveRead = !notification.HaveRead;

            await _context.SaveChangesAsync();
            return new BaseResponse()
            {
                Message = "Cập nhật thông báo thành công",
                StatusCode = System.Net.HttpStatusCode.NoContent,
                Success = true
            };
        }
    }
}
