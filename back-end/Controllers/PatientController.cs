using clinic_schedule.Core.Requests.Patient;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService patientService;

        public PatientController(IPatientService patientService)
        {
            this.patientService = patientService;
        }

        [HttpGet("profile")]
        [Authorize(Roles = "PATIENT")]
        public async Task<IActionResult> GetAllProfiles()
        {
            var response = await patientService.GetAllProfilesByPatient();
            return Ok(response);
        }

        [HttpPost("profile")]
        [Authorize(Roles = "PATIENT")]
        public async Task<IActionResult> CreateProfile([FromBody] ProfileRequest request)
        {
            var response = await patientService.CreateProfile(request);
            return Ok(response);
        }

        [HttpPut("profile/{id}")]
        [Authorize(Roles = "PATIENT")]
        public async Task<IActionResult> EditProfile([FromRoute] string id, [FromBody] ProfileRequest request)
        {
            var response = await patientService.EditProfile(id, request);
            return Ok(response);
        }
    }
}
