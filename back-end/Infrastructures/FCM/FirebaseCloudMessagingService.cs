using clinic_schedule.Core.DTOs;
using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using FirebaseAdmin.Messaging;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace clinic_schedule.Infrastructures.FCM
{
    public class FirebaseCloudMessagingService : IFirebaseCloudMessagingService
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly INotificationService notificationService;
        private readonly AppMapping appMapping;
        private readonly FirebaseMessaging _messaging;
        private readonly ILogger<FirebaseCloudMessagingService> logger;

        public FirebaseCloudMessagingService(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor, INotificationService notificationService, AppMapping appMapping, FirebaseMessaging firebaseMessaging, ILogger<FirebaseCloudMessagingService> logger)
        {
            this.dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
            this.notificationService = notificationService;
            this.appMapping = appMapping;
            _messaging = firebaseMessaging;
            this.logger = logger;
        }

        public async Task<List<string>> GetAllDeviceTokensByUserId(string userId)
        {
            var tokens = await dbContext.DeviceTokens
                .Where(x => x.UserId == userId)
                .Select(x => x.Token)
                .ToListAsync();

            return tokens;
        }

        public async Task SaveTokenDevice(DeviceTokenRequest request)
        {
            var userId = httpContextAccessor.HttpContext.User.GetUserID();
            var existToken = await dbContext.DeviceTokens
                .Where(token => token.Token == request.DeviceToken && token.UserId != userId)
                .OrderByDescending(token => token.Timestamp)
                .ToListAsync();

            if (existToken != null)
            {
                dbContext.DeviceTokens.RemoveRange(existToken);
            }

            var isUserIncludeToken = dbContext
                .DeviceTokens.Any(u => u.Token == request.DeviceToken && u.UserId == userId);

            if (!isUserIncludeToken)
            {
                var newTokenDevice = new DeviceToken()
                {
                    Timestamp = DateTime.Now,
                    UserId = userId,
                    Token = request.DeviceToken,
                };

                await dbContext.DeviceTokens.AddAsync(newTokenDevice);
            }

            await dbContext.SaveChangesAsync();
        }

        public async Task SendNotification(NotificationDTO notificationDTO)
        {
            try
            {
                var tokens = await dbContext.DeviceTokens
                .Where(x => x.UserId == notificationDTO.RecipientId)
                .Select(x => x.Token)
                .ToListAsync();

                if (tokens.Count > 0)
                {
                    Core.Models.Notification notification = new Core.Models.Notification()
                    {
                        CreatedAt = DateTime.Now,
                        Description = notificationDTO.Content,
                        Title = notificationDTO.Title,
                        HaveRead = false,
                        NotificationType = notificationDTO.NotificationType,
                        RecipientId = notificationDTO.RecipientId,
                        ReferenceId = notificationDTO.ReferenceId,
                    };

                    var savedNotification = await notificationService.CreateNotification(notification);
                    var resource = await appMapping.MapToNotificationResource(savedNotification);
                    var recipientJson = JsonConvert.SerializeObject(resource.Recipient);

                    var message = new FirebaseAdmin.Messaging.MulticastMessage()
                    {
                        Tokens = tokens,
                        Data = new Dictionary<string, string>()
                        {
                            { "id", resource.Id.ToString() },
                            { "title", resource.Title },
                            { "content", resource.Content },
                            { "referenceId", resource.ReferenceId?.ToString() },
                            { "recipient", recipientJson },
                            { "createdAt", savedNotification.CreatedAt.ToString("O") },
                            { "haveRead", savedNotification.HaveRead.ToString() },
                            { "notificationType", savedNotification.NotificationType }
                        },
                       
                    };

                    var response = await _messaging.SendEachForMulticastAsync(message);

                    if (response.FailureCount > 0)
                    {
                        var failedTokens = new List<string>();
                        for (int i = 0; i < response.Responses.Count; i++)
                        {
                            if (!response.Responses[i].IsSuccess)
                            {
                                logger.LogError($"Lỗi với token: {tokens[i]}, Lý do: {response.Responses[i].Exception.Message}");
                                failedTokens.Add(tokens[i]);
                            }
                        }

                        logger.LogError($"Có {response.FailureCount} lỗi xảy ra khi gửi thông báo tới các tokens: {string.Join(", ", failedTokens)}");
                        //throw new AppException($"Có {response.FailureCount} lỗi xảy ra khi gửi thông báo tới các tokens: {string.Join(", ", failedTokens)}");
                    }
                }

            }
            catch (FirebaseMessagingException ex)
            {
                throw new Exception($"Lỗi firebase: {ex.Message}");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
