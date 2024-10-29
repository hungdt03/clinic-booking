using clinic_schedule.Extensions;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly IGroupService groupService;

        public GroupController(IGroupService groupService)
        {
            this.groupService = groupService;
        }

        [Authorize(Roles = "PATIENT")]
        [HttpGet("patient")]
        public async Task<IActionResult> GetAllContactsPatient()
        {
            var userId = HttpContext.User.GetUserID();
            var response = await groupService.GetAllGroupsByPatient(userId);
            return Ok(response);
        }

        [Authorize]
        [HttpGet("logged-in-user")]
        public async Task<IActionResult> GetAllContactByLoggedInUser()
        {
            var userId = HttpContext.User.GetUserID();
            var response = await groupService.GetAllGroupsByLoggedInUser(userId);
            return Ok(response);
        }
    }
}
