using clinic_schedule.Core.Constants;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Infrastructures.FCM;
using clinic_schedule.Infrastructures.SignalR;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class MessageService : IMessageService
    {
        private readonly ApplicationDbContext dbContext;
        private readonly AppMapping applicationMapper;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IFirebaseCloudMessagingService fcmService;

        public MessageService(ApplicationDbContext dbContext, AppMapping applicationMapper, IHttpContextAccessor httpContextAccessor, IFirebaseCloudMessagingService fcmService)
        {
            this.dbContext = dbContext;
            this.applicationMapper = applicationMapper;
            this.httpContextAccessor = httpContextAccessor;
            this.fcmService = fcmService;
        }

        public async Task<MessageResource> CreateNewMessage(MessageDTO messageDTO)
        {
            Message message = new Message();
            message.SenderId = messageDTO.SenderId;
            message.RecipientId = messageDTO.RecipientId;
            message.Content = messageDTO.Content;
            message.SendAt = DateTime.Now;
            message.HaveRead = false;
            message.MessageType = MessageType.NORMAL;
            message.IsVisibleToRecipient = true;
            message.IsVisibleToSender = true;

            Group? existedGroup = await dbContext.Groups
                .SingleOrDefaultAsync(g => g.GroupName.Equals(messageDTO.GroupName));

            if (existedGroup == null)
            {
                Group group = new Group()
                {
                    GroupName = messageDTO.GroupName,
                    Message = message,
                    TotalUnReadMessages = 1,
                    FirstUserId = message.SenderId,
                    LastUserId = message.RecipientId,
                };

                await dbContext.Groups.AddAsync(group);
            }
            else
            {
                existedGroup.Message = message;
                existedGroup.TotalUnReadMessages += 1;
            }

            await dbContext.SaveChangesAsync();

            var notification = new Core.DTOs.NotificationDTO();
            notification.NotificationType = NotificationType.NOTIFICATION_MESSAGE;
            notification.ReferenceId = message.Id;
            notification.Content = message.Content;
            notification.Title = "Tin nhắn mới";
            notification.RecipientId = message.RecipientId;
            await fcmService.SendNotification(notification);

            return await applicationMapper.MapToMessageResource(message);
        }

        public async Task<BaseResponse> GetAllMessages(string recipientId)
        {
            var senderId = httpContextAccessor.HttpContext.User.GetUserID();

            List<Message> messages = await dbContext.Messages
                .Include(msg => msg.Sender)
                .Include(msg => msg.Recipient)
                .Where(msg =>
                    msg.RecipientId.Equals(recipientId) && msg.SenderId.Equals(senderId)
                   || msg.RecipientId.Equals(senderId) && msg.SenderId.Equals(recipientId)
                 )
                .ToListAsync();

            var resources = new List<MessageResource>();
            foreach (var message in messages)
            {
                var resource = await applicationMapper.MapToMessageResource(message);
                resources.Add(resource);
            }

            var response = new DataResponse<List<MessageResource>>();
            response.Message = "Lấy danh sách tin nhắn thành công";
            response.StatusCode = System.Net.HttpStatusCode.OK;
            response.Success = true;
            response.Data = resources;
            return response;
        }

        public async Task<MessageResource> SaveMessage(Message message)
        {
            var savedMessage = await dbContext.Messages.AddAsync(message);
            await dbContext.SaveChangesAsync();

            return await applicationMapper.MapToMessageResource(savedMessage.Entity);
        }
    }
}
