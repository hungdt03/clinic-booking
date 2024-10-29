using clinic_schedule.Core.Requests;
using clinic_schedule.Core.Requests.Clinic;
using clinic_schedule.Services.Interfaces;
using clinic_schedule.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClinicController : ControllerBase
    {
        private readonly IClinicService clinicService;

        public ClinicController(IClinicService clinicService)
        {
            this.clinicService = clinicService;
        }

        [Authorize(Roles = "ADMIN")]
        [ServiceFilter(typeof(Validation))]
        [HttpPost]
        public async Task<IActionResult> CreateClinic([FromForm] ClinicRequest request)
        {
            var response = await clinicService.CreateClinic(request);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllClinics()
        {
            var response = await clinicService.GetAllClinics();
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClinicById([FromRoute] string id)
        {
            var response = await clinicService.GetClinicById(id);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpGet("details")]
        public async Task<IActionResult> GetClinicDetails ()
        {
            var response = await clinicService.GetClinicDetails();
            return Ok(response);
        }

        [HttpGet("search")]
        public async Task<IActionResult> GetAllClinics([FromQuery] string query, [FromQuery] string speciality)
        {
            var response = await clinicService.SearchClinics(query ?? "", speciality ?? "");
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpPut("update-introduction")]
        public async Task<IActionResult> UpdateIntroduction([FromBody] IntroductionRequest request)
        {
            var response = await clinicService.UpdateIntroduction(request);
            return Ok(response);
        }


        [Authorize(Roles = "MANAGER")]
        [HttpPut("update-basic-info")]
        public async Task<IActionResult> UpdateBasicInforClinic([FromForm] BasicInforClinicRequest request)
        {
            var response = await clinicService.UpdateBasicInformation(request);
            return Ok(response);
        }
    }
}
