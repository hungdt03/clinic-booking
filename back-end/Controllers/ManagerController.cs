using clinic_schedule.Core.Requests.Manager;
using clinic_schedule.Services.Interfaces;
using clinic_schedule.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerService managerService;

        public ManagerController(IManagerService managerService)
        {
            this.managerService = managerService;
        }

        [Authorize(Roles = "ADMIN")]
        [ServiceFilter(typeof(Validation))]
        [HttpPost]
        public async Task<IActionResult> CreateManager([FromBody] CreateManagerRequest request)
        {
            var response = await managerService.CreateManager(request);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<IActionResult> GetAllManagers()
        {
            var response = await managerService.GetAllManagers();
            return Ok(response);
        }
    }
}
