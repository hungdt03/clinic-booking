using clinic_schedule.Core.Requests;
using clinic_schedule.Core.Requests.Doctor;
using clinic_schedule.Services.Interfaces;
using clinic_schedule.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            this.doctorService = doctorService;
        }

        [Authorize(Roles = "MANAGER")]
        [ServiceFilter(typeof(Validation))]
        [HttpPost("employee")]
        public async Task<IActionResult> CreateDoctorEmployee([FromBody] CreateDoctorEmployeeRequest request)
        {
            var response = await doctorService.CreateDoctorEmployee(request);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [ServiceFilter(typeof(Validation))]
        [HttpPost("owner")]
        public async Task<IActionResult> CreateDoctorOwner([FromBody] CreateDoctorOwnerRequest request)
        {
            var response = await doctorService.CreateDoctorOwner(request);
            return Ok(response);
        }

        [HttpGet("owner")]
        public async Task<IActionResult> GetAllOwnerDoctors()
        {
            var response = await doctorService.GetAllDoctorOwners();
            return Ok(response);
        }

        [HttpGet("owner/search")]
        public async Task<IActionResult> SearchOwnerDoctors([FromQuery] string query, [FromQuery] string speciality)
        {
            var response = await doctorService.SearchDoctorOwners(query ?? "", speciality ?? "");
            return Ok(response);
        }

        [HttpGet("owner/{id}")]
        public async Task<IActionResult> GetDoctorById([FromRoute] string id)
        {
            var response = await doctorService.GetDoctorById(id);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpGet("owner/details")]
        public async Task<IActionResult> GetDoctorDetails()
        {
            var response = await doctorService.GetDoctorDetails();
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpPut("owner/update-basic")]
        public async Task<IActionResult> UpdateBasicInformation([FromForm] BasicInfoRequest request)
        {
            var response = await doctorService.UpdateBasicInfomation(request);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpPut("owner/update-education")]
        public async Task<IActionResult> UpdateEducation([FromBody] EducationRequest request)
        {
            var response = await doctorService.UpdateEducations(request);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpPut("owner/update-experience")]
        public async Task<IActionResult> UpdateExperience([FromBody] WorkExperienceRequest request)
        {
            var response = await doctorService.UpdateWorkExperiences(request);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpPut("owner/update-introduction")]
        public async Task<IActionResult> UpdateIntroduction([FromBody] IntroductionRequest request)
        {
            var response = await doctorService.UpdateIntroduction(request);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpPut("owner/update-award")]
        public async Task<IActionResult> UpdateAwardAndResearches([FromBody] AwardRequest request)
        {
            var response = await doctorService.UpdateAwardAndResearches(request);
            return Ok(response);
        }

        [HttpGet("clinic/{id}")]
        public async Task<IActionResult> GetAllDoctorsByClinicId([FromRoute] string id)
        {
            var response = await doctorService.GetAllDoctorByClinicId(id);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpGet("employee")]
        public async Task<IActionResult> GetAllDoctorEmployees()
        {
            var response = await doctorService.GetAllDoctorEmployee();
            return Ok(response);
        }

        [HttpGet("employee/{brandId}")]
        public async Task<IActionResult> GetAllDoctorEmployeesByBrandId([FromRoute] int brandId)
        {
            var response = await doctorService.GetAllDoctorEmployeesByBrandId(brandId);
            return Ok(response);
        }
    }
}
