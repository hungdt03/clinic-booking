using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService searchService;

        public SearchController(ISearchService searchService)
        {
            this.searchService = searchService;
        }

        [HttpGet]
        public async Task<IActionResult> SearchData([FromQuery] string type, [FromQuery] string query, [FromQuery] string speciality)
        {
            var response = await searchService.SearchData(type ?? "all", query ?? "", speciality ?? "");
            return Ok(response);
        }
    }
}
