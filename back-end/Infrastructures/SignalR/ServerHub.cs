using clinic_schedule.Core.Constants;
using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.Message;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.Extensions;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace clinic_schedule.Infrastructures.SignalR
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ServerHub : Hub
    {
        private readonly IMessageService messageService;
        private readonly ConnectionManager connectionManager;
        private readonly UserManager<User> _userManager;
        private readonly IGroupService _groupService;

        public ServerHub(UserManager<User> userManager, IMessageService messageService, ConnectionManager connectionManager, IGroupService groupService)
        {
            this.messageService = messageService;
            _userManager = userManager;
            this.connectionManager = connectionManager;
            _groupService = groupService;
        }

        public override async Task OnConnectedAsync()
        
        {
            var userId = Context.User.GetUserID();
            User user = await _userManager.FindByIdAsync(userId);
            user.IsOnline = true;
            var updateResult = await _userManager.UpdateAsync(user);
            if (updateResult.Succeeded)
            {
                await connectionManager.UserConnected(userId, Context.ConnectionId);
            }

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(MessageRequest messageRequest)
        {
            var currentUser = Context.User.GetUserID();

            if (currentUser == messageRequest.RecipientId)
            {
                throw new Exception("Không thể gửi tin nhắn cho chính mình");
            }

            User senderUser = await _userManager.FindByIdAsync(currentUser)
                ?? throw new AppException("Thông tin người gửi không tồn tại");
            User recipientUser = await _userManager.FindByIdAsync(messageRequest.RecipientId)
                ?? throw new AppException("Thông tin người nhận không tồn tại");

            if (recipientUser == null)
                throw new Exception("Người nhận không tồn tại");

            var groupName = GetGroupName(senderUser.Id, recipientUser.Id);

            var group = await _groupService.GetGroupByName(groupName);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            if (!group.IsAvailable && group.Message.MessageType != MessageType.WARNING)
            {
                Message message = new Message
                {
                    Content = "Tin nhắn gửi đi thất bại. Bạn không có 'Lịch khám/Lịch tư vấn trong thời gian 7 ngày gần đây với bác sĩ/phòng khám. Vui lòng đặt lịch để được chat với bác sĩ/phòng khám",
                    MessageType = MessageType.WARNING,
                    IsVisibleToRecipient = false,
                    HaveRead = false,
                    RecipientId = messageRequest.RecipientId,
                    SenderId = currentUser,
                    SendAt = DateTime.Now,
                    Group = group,
                };

                var messageResource = await messageService.SaveMessage(message);
                await Clients.Caller.SendAsync("NewMessage", messageResource);
            } else if(group.IsAvailable)
            {
                var recipientConnections = await connectionManager.GetConnectionsForUser(recipientUser.Id);
                if (recipientConnections != null && recipientConnections.Any())
                {
                    foreach (var connectionId in recipientConnections)
                    {
                        await Groups.AddToGroupAsync(connectionId, groupName);
                    }
                }

                MessageDTO messageDTO = new MessageDTO
                {
                    SenderId = senderUser.Id,
                    RecipientId = recipientUser.Id,
                    Content = messageRequest.Content,
                    GroupName = groupName,
                };

                MessageResource messageResource = await messageService.CreateNewMessage(messageDTO);

                await Clients.Group(groupName).SendAsync("NewMessage", messageResource);
            }
        }


        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User.GetUserID();
            User? user = await _userManager.FindByIdAsync(userId);
            user.IsOnline = false;
            user.RecentOnlineTime = DateTime.Now;
            var updateResult = await _userManager.UpdateAsync(user);
            if(updateResult.Succeeded)
            {
                await connectionManager.UserDisconnected(userId, Context.ConnectionId);
            }
            
            await base.OnDisconnectedAsync(exception);
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }

    }

    public class MessageDTO
    {
        public string SenderId { get; set; }
        public string Content { get; set; }
        public string RecipientId { get; set; }
        public string GroupName { get; set; }
        public bool HaveRead { get; set; }
        public DateTime ReadAt { get; set; }
    }
}
