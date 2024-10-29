using clinic_schedule.Core.Requests.Specialization;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Services.Interfaces;
using clinic_schedule.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationController : ControllerBase
    {
        private readonly ISpecializationService specializationService;
        private readonly ApplicationDbContext dbContext;

        public SpecializationController(ISpecializationService specializationService, ApplicationDbContext dbContext)
        {
            this.specializationService = specializationService;
            this.dbContext = dbContext;
        }

        [Authorize(Roles = "MANAGER, DOCTOR_OWNER, ADMIN")]
        [HttpPost]
        [ServiceFilter(typeof(Validation))]
        public async Task<IActionResult> CreateSpecialization([FromForm] SpecializationRequest request)
        {
            var response = await specializationService.CreateSpecialization(request);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSpecializations()
        {
            var response = await specializationService.GetAllSpecializations();
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpPost("add-for-doctor")]
        public async Task<IActionResult> AddSpecializationForDoctor([FromBody] AddSpecializationRequest request)
        {
            var response = await specializationService.AddSpecializationsForDoctor(request);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpPost("add-for-clinic")]
        public async Task<IActionResult> AddSpecializationForClinic([FromBody] AddSpecializationRequest request)
        {
            var response = await specializationService.AddSpecializationsForClinic(request);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpDelete("doctor/{id}")]
        public async Task<IActionResult> DeleteForDoctor([FromRoute] int id)
        {
            var response = await specializationService.DeleteSpecializationDoctor(id);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpDelete("clinic/{id}")]
        public async Task<IActionResult> DeleteForClinic([FromRoute] int id)
        {
            var response = await specializationService.DeleteSpecializationClinic(id);
            return Ok(response);
        }

        [HttpGet("doctor/{id}")]   
        public async Task<IActionResult> GetAllSpecializationsByDoctorId([FromRoute] string id)
        {
            var response = await specializationService.GetAllSpecializationsByDoctorId(id);
            return Ok(response);
        }

        [HttpGet("clinic/{id}")]
        public async Task<IActionResult> GetAllSpecializationsByClinicId([FromRoute] string id)
        {
            var response = await specializationService.GetAllSpecializationsByClinicId(id);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpGet("doctor")]
        public async Task<IActionResult> GetAllSpecializationsByLoggedInDoctor()
        {
            var doctorId = HttpContext.User.GetUserID();
            var response = await specializationService.GetAllSpecializationsByDoctorId(doctorId);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpGet("clinic")]
        public async Task<IActionResult> GetAllSpecializationsByLoggedInClinic()
        {
            var manager = dbContext.Managers.SingleOrDefault(c => c.UserId == HttpContext.User.GetUserID());
            var response = await specializationService.GetAllSpecializationsByClinicId(manager.ClinicId);
            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpecialization([FromRoute] int id)
        {
            var response = await specializationService.DeleteSpecialization(id);
            return Ok(response);
        }
    }
}
