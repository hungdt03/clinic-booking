using clinic_schedule.Core.Requests.Setting;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingController : ControllerBase
    {
        private readonly ISettingService _settingService;

        public SettingController(ISettingService settingService)
        {
            _settingService = settingService;
        }

        [Authorize(Roles = "MANAGER")]
        [HttpPost("exception-date-clinic")]
        public async Task<IActionResult> CreateExceptionDateForClinic([FromBody] ExceptionDateRequest request)
        {
            var response = await _settingService.CreateExceptionDateForClinic(request);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpPost("exception-date-doctor")]
        public async Task<IActionResult> CreateExceptionDateForDoctor([FromBody] ExceptionDateRequest request)
        {
            var response = await _settingService.CreateExceptionDateForDoctor(request);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpGet("exception-date-clinic")]
        public async Task<IActionResult> GetAllExceptionDateByClinic()
        {
            var response = await _settingService.GetAllExceptionDatesByClinic();
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpDelete("exception-date-clinic/{id}")]
        public async Task<IActionResult> RemoveExceptionDateClinicById([FromRoute] int id)
        {
            var response = await _settingService.DeleteExceptionDayClinicById(id);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpDelete("exception-date-doctor/{id}")]
        public async Task<IActionResult> RemoveExceptionDateDoctorById([FromRoute] int id)
        {
            var response = await _settingService.DeleteExceptionDayDoctorById(id);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpGet("exception-date-doctor")]
        public async Task<IActionResult> GetAllExceptionDateByDoctoc()
        {
            var response = await _settingService.GetAllExceptionDatesByDoctor();
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpPost("save-note-doctor")]
        public async Task<IActionResult> SaveNoteDoctor([FromBody] NoteRequest request)
        {
            var response = await _settingService.SaveNoteDoctor(request);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpPost("save-note-clinic")]
        public async Task<IActionResult> SaveNoteClinic([FromBody] NoteRequest request)
        {
            var response = await _settingService.SaveNoteClinic(request);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpGet("note-doctor")]
        public async Task<IActionResult> GetNoteDoctor()
        {
            var response = await _settingService.GetNoteDoctor();
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpGet("note-clinic")]
        public async Task<IActionResult> GetNoteClinic()
        {
            var response = await _settingService.GetNoteClinic();
            return Ok(response);
        }

        [HttpGet("note-doctor/{id}")]
        public async Task<IActionResult> GetNoteDoctorById([FromRoute] string id)
        {
            var response = await _settingService.GetNoteDoctorByDoctorId(id);
            return Ok(response);
        }

        [HttpGet("note-clinic/{id}")]
        public async Task<IActionResult> GetNoteClinicByClinicId([FromRoute] string id)
        {
            var response = await _settingService.GetNoteClinicByClinicId(id);
            return Ok(response);
        }
    }
}
