using clinic_schedule.Core.Requests.Auth;
using clinic_schedule.Services.Interfaces;
using clinic_schedule.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("sign-up")]
        [ServiceFilter(typeof(Validation))]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            var response = await _authService.SignUp(request);
            return Ok(response);
        }

        [HttpPost("administrator")]
        [ServiceFilter(typeof(Validation))]
        public async Task<IActionResult> SignInAdministrator([FromBody] SignInRequest request)
        {
            var response = await _authService.SignInAdministrator(request);
            return Ok(response);
        }

        [HttpPost("patient")]
        [ServiceFilter(typeof(Validation))]
        public async Task<IActionResult> SignInPatient([FromBody] SignInRequest request)
        {
            var response = await _authService.SignInPatient(request);
            return Ok(response);
        }

        [HttpPost("doctor")]
        [ServiceFilter(typeof(Validation))]
        public async Task<IActionResult> SignInDoctor([FromBody] SignInRequest request)
        {
            var response = await _authService.SignInDoctor(request);
            return Ok(response);
        }

        [HttpPost("manager")]
        [ServiceFilter(typeof(Validation))]
        public async Task<IActionResult> SignInManager([FromBody] SignInRequest request)
        {
            var response = await _authService.SignInManager(request);
            return Ok(response);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var response = await _authService.RefreshToken(request);
            return Ok(response);
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePasswordFirstLogin([FromBody] ChangePasswordRequest request)
        {
            var response = await _authService.ChangePassword(request);
            return Ok(response);
        }
    }
}
