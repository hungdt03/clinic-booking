using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProcessController : ControllerBase
    {
        private readonly IBookingProcessService processService;

        public ProcessController(IBookingProcessService processService)
        {
            this.processService = processService;
        }

        [HttpGet("{clinicId}")]
        public async Task<IActionResult> GetProcessByClinicId([FromRoute] string clinicId)
        {
            var response = await processService.GetBookingProcessByClinicId(clinicId);
            return Ok(response);
        }

    }
}
