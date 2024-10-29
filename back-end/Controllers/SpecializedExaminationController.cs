using clinic_schedule.Core.Requests.SpecializedExamination;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializedExaminationController : ControllerBase
    {
        private readonly ISpecializedExaminationService specializedExaminationService;

        public SpecializedExaminationController(ISpecializedExaminationService specializedExaminationService)
        {
            this.specializedExaminationService = specializedExaminationService;
        }

        [HttpGet("{clinicId}")]
        public async Task<IActionResult> GetAllSpecializedExamination([FromRoute] string clinicId)
        {
            var response = await specializedExaminationService.GetAllSpecializedExaminationByClinicId(clinicId);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER, DOCTOR_OWNER")]
        [HttpPost]
        public async Task<IActionResult> CreateSpecializedExamination([FromBody] SpecializedExaminationRequest request)
        {
            var response = await specializedExaminationService.CreateSpecializedExamination(request);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER, DOCTOR_OWNER")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSpecializedExamination([FromRoute] int id, [FromBody] SpecializedExaminationRequest request)
        {
            var response = await specializedExaminationService.UpdateSpecializedExamination(id, request);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpDelete("clinic/{id}")]
        public async Task<IActionResult> DeleteSpecializedExaminationClinic([FromRoute] int id)
        {
            var response = await specializedExaminationService.DeleteSpecializedExaminationClinic(id);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpDelete("doctor/{id}")]
        public async Task<IActionResult> DeleteSpecializedExaminationDoctor([FromRoute] int id)
        {
            var response = await specializedExaminationService.DeleteSpecializedExaminationDoctor(id);
            return Ok(response);
        }

    }
}
