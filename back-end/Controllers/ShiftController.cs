
using clinic_schedule.Core.Requests.Shift;
using clinic_schedule.Core.Response;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : ControllerBase
    {
        private readonly IShiftService _shiftService;

        public ShiftController(IShiftService shiftService)
        {
            _shiftService = shiftService;
        }

        [HttpGet("clinic/{clinicId}")]
        public async Task<IActionResult> GetAllShiftsByClinicId([FromRoute] string clinicId)
        {
            var response = await _shiftService.GetShiftsByClinicId(clinicId);
            return Ok(response);
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetAllShiftsByDoctorId([FromRoute] string doctorId)
        {
            var response = await _shiftService.GetShiftsByDoctorId(doctorId);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER, MANAGER")]
        [HttpGet]
        public async Task<IActionResult> GetAllShiftsByLoggedUser()
        {
            var response = await _shiftService.GetShifts();
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER, MANAGER")]
        [HttpPost]
        public async Task<IActionResult> CreateShift([FromBody] CreateShiftRequest request)
        {
            var (isValid, message) = request.TryParseTimes();
            if (!isValid)
            {
                return BadRequest(new BaseResponse
                {
                    Message = message,
                    StatusCode = System.Net.HttpStatusCode.BadRequest,
                    Success = false
                });
            }

            var response = await _shiftService.CreateShift(request);
            return Ok(response);
        }

        [HttpGet("clinic/{clinicId}/empty-shift-by-date")]
        public async Task<IActionResult> GetEmptyShiftByDateAndClinicId(
            [FromRoute] string clinicId,
            [FromQuery] DateTime date,
            [FromQuery] int? brandId = null,
            [FromQuery] string? doctorId = null
        )
        {
            var response = await _shiftService.GetAllEmptyShiftsByClinic(clinicId, brandId, doctorId, date);
            return Ok(response);
        }

        [HttpGet("clinic/{clinicId}/empty-date")]
        public async Task<IActionResult> GetEmptyDaysInMonth(
            [FromRoute] string clinicId,
            [FromQuery] int month,
            [FromQuery] int year,
            [FromQuery] int? brandId = null,
            [FromQuery] string? doctorId = null
        )
        {
            var response = await _shiftService.GetAllEmptyDaysByClinicAndMonth(clinicId, brandId, doctorId, month, year);
            return Ok(response);
        }

        [HttpGet("clinic/{clinicId}/full-date")]
        public async Task<IActionResult> GetFullDaysInMonth(
            [FromRoute] string clinicId,
            [FromQuery] int month,
            [FromQuery] int year,
            [FromQuery] int? brandId = null,
            [FromQuery] string? doctorId = null
        )
        {
            var response = await _shiftService.GetAllFullDaysByClinicAndMonth(clinicId, brandId, doctorId, month, year);
            return Ok(response);
        }

        [HttpGet("doctor/{doctorId}/empty-date")]
        public async Task<IActionResult> GetEmptyDaysByDoctorId(
            [FromRoute] string doctorId
        )
        {
            var response = await _shiftService.GetAllEmptyDaysByDoctor(doctorId);
            return Ok(response);
        }

        [HttpGet("doctor/{doctorId}/empty-shift-by-date")]
        public async Task<IActionResult> GetEmptyShiftByDateAndDoctorId(
            [FromRoute] string doctorId,
            [FromQuery] DateTime date
        )
        {
            var response = await _shiftService.GetAllEmptyShiftsByDoctorIdAndDate(doctorId, date);
            return Ok(response);
        }
    }
}
