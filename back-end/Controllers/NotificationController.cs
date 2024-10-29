using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService notificationService;

        public NotificationController(INotificationService notificationService)
        {
            this.notificationService = notificationService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllNotificationsBooking()
        {
            var response = await notificationService.GetAllNotificationsByLoggedInUser();
            return Ok(response);
        }

        [Authorize]
        [HttpGet("message")]
        public async Task<IActionResult> GetAllNotifications()
        {
            var response = await notificationService.GetAllNotificationMessages();
            return Ok(response);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNotification([FromRoute] int id)
        {
            var response = await notificationService.UpdateNotification(id);
            return Ok(response);
        }

        [Authorize]
        [HttpPut("update-all-read")]
        public async Task<IActionResult> UpdateAllNotificationHaveRead()
        {
            var response = await notificationService.UpdateAllNotificationHaveRead();
            return Ok(response);
        }


        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification([FromRoute] int id)
        {
            var response = await notificationService.DeleteNotification(id);
            return Ok(response);
        }
    }
}
