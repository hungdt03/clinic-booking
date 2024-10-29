using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.Infrastructures.SignalR;

namespace clinic_schedule.Services.Interfaces
{
    public interface IMessageService
    {
        Task<MessageResource> CreateNewMessage(MessageDTO messageDTO);
        Task<BaseResponse> GetAllMessages(string recipientId);
        Task<MessageResource> SaveMessage(Message message);
    }
}
