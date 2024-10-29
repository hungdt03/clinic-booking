using clinic_schedule.Core.Requests;
using clinic_schedule.Infrastructures.FCM;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTokenController : ControllerBase
    {
        private readonly IFirebaseCloudMessagingService fcmService;

        public DeviceTokenController(IFirebaseCloudMessagingService fcmService)
        {
            this.fcmService = fcmService;
        }

        [HttpPost]
        public async Task<IActionResult> SaveToken([FromBody] DeviceTokenRequest request)
        {
            await fcmService.SaveTokenDevice(request);
            return Ok();
        }
    }
}
