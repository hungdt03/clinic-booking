using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/token")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly ITokenService tokenService;

        public TokenController(ITokenService tokenService)
        {
            this.tokenService = tokenService;
        }

        [HttpGet("user-login")]
        public async Task<IActionResult> AuthenticateTokenLogin([FromQuery] string email, [FromQuery] string activationToken)
        {
            var response = await tokenService.AuthenticateTokenLogin(email, activationToken);
            return Ok(response);
        }
    }
}
