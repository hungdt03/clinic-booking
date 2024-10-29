using clinic_schedule.Core.Requests.Service;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService serviceService;

        public ServiceController(IServiceService serviceService)
        {
            this.serviceService = serviceService;
        }

        [Authorize(Roles = "MANAGER")]
        [HttpGet]
        public async Task<IActionResult> GetAllServices()
        {
            var response = await serviceService.GetAllServices();
            return Ok(response);
        }

        [HttpGet("clinic/{clinicId}")]
        public async Task<IActionResult> GetAllServicesByClinicId([FromRoute] string clinicId)
        {
            var response = await serviceService.GetAllServiceByClinicId(clinicId);
            return Ok(response);
        }

        [HttpGet("{serviceTypeId}")]
        public async Task<IActionResult> GetAllServicesByServiceTypeId([FromRoute] int serviceTypeId)
        {
            var response = await serviceService.GetAllServicesByServiceType(serviceTypeId);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] ServiceRequest request)
        {
            var response = await serviceService.CreateService(request);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService([FromRoute] int id, [FromBody] ServiceRequest request)
        {
            var response = await serviceService.UpdateService(id, request);
            return Ok(response);
        }
    }
}
