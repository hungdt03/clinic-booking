using clinic_schedule.Core.Requests.ServiceType;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceTypeController : ControllerBase
    {
        private readonly IServiceTypeService serviceTypeService;

        public ServiceTypeController(IServiceTypeService serviceTypeService)
        {
            this.serviceTypeService = serviceTypeService;
        }

        [HttpGet("{clinicId}")]
        public async Task<IActionResult> GetAllServiceTypesByClinicId([FromRoute] string clinicId)
        {
            var response = await serviceTypeService.GetAllServiceTypesByClinicId(clinicId);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpGet]
        public async Task<IActionResult> GetAllServiceTypes()
        {
            var response = await serviceTypeService.GetAllServiceTypes();
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpPost]
        public async Task<IActionResult> CreateServiceType([FromBody] ServiceTypeRequest request)
        {
            var response = await serviceTypeService.CreateServiceType(request);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceType([FromRoute] int id, [FromBody] ServiceTypeRequest request)
        {
            var response = await serviceTypeService.UpdateServiceType(id, request);
            return Ok(response);
        }
    }
}
