using clinic_schedule.Core.Requests.Brand;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        [HttpGet("{clinicId}")]
        public async Task<IActionResult> GetAllBrandsByClinicId([FromRoute] string clinicId)
        {
            var response = await _brandService.GetAllBrandsByClinicId(clinicId);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpGet]
        public async Task<IActionResult> GetAllBrands()
        {
            var response = await _brandService.GetAllBrands();
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpPost]
        public async Task<IActionResult> CreateBrand([FromBody] BrandRequest request)
        {
            var response = await _brandService.CreateBrand(request);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpPut("{brandId}")]
        public async Task<IActionResult> UpdateBrand([FromRoute] int brandId, [FromBody] BrandRequest request)
        {
            var response = await _brandService.UpdateBrand(brandId, request);
            return Ok(response);
        }
    }
}
