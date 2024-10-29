using clinic_schedule.Core.Requests.Appointment;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace clinic_schedule.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            this.appointmentService = appointmentService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointmentById([FromRoute] int id)
        {
            var response = await appointmentService.GetAppointmentById(id);
            return Ok(response);
        }

        [Authorize]
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetAllAppointmentsByPatientId([FromRoute] string patientId)
        {
            var response = await appointmentService.GetAllAppointmentsByPatientId(patientId);
            return Ok(response);
        }

        [Authorize(Roles = "PATIENT")]
        [HttpGet("patient")]
        public async Task<IActionResult> GetAllAppointmentsByUserLoggedIn([FromQuery] int page = 1, [FromQuery]  int size = 8)
        {
            var response = await appointmentService.GetAllAppointmentsByLoggedInUser(page, size);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_OWNER")]
        [HttpGet("doctor-owner")]
        public async Task<IActionResult> GetAllAppointmentsByDoctorOwnerLoggedIn([FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await appointmentService.GetAllAppointmentByDoctorOwnerLoggedIn(page, size);
            return Ok(response);
        }

        [Authorize(Roles = "DOCTOR_EMPLOYEE")]
        [HttpGet("doctor-employee")]
        public async Task<IActionResult> GetAllAppointmentsByDoctorEmployeeLoggedIn([FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await appointmentService.GetAllAppointmentByDoctorEmployeeLoggedIn(page, size);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER")]
        [HttpGet("clinic")]
        public async Task<IActionResult> GetAllAppointmentsByClinicLoggedIn([FromQuery] int page = 1, [FromQuery] int size = 8)
        {
            var response = await appointmentService.GetAllAppointmentByClinicLoggedIn(page, size);
            return Ok(response);
        }

        [Authorize(Roles = "PATIENT")]
        [HttpPost("clinic")]
        public async Task<IActionResult> CreateAppointmentWithClinic([FromForm] AppointmentWithClinicRequest request)
        {
            var response = await appointmentService.CreateAppointmentWithClinic(request);
            return Ok(response);
        }

        [Authorize(Roles = "PATIENT")]
        [HttpPost("doctor")]
        public async Task<IActionResult> CreateAppointmentWithDoctor([FromForm] AppointmentWithDoctorRequest request)
        {
            var response = await appointmentService.CreateAppointmentWithDoctor(request);
            return Ok(response);
        }

        [Authorize(Roles = "PATIENT, MANAGER, DOCTOR_OWNER, DOCTOR_EMPLOYEE")]
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelAppointmentByPatient([FromRoute] int id, [FromBody] CancelAppointmentRequest request)
        {
            var response = await appointmentService.CancelAppointment(id, request);
            return Ok(response);
        }

        [Authorize(Roles = "MANAGER, DOCTOR_OWNER, DOCTOR_EMPLOYEE")]
        [HttpPut("finish/{id}")]
        public async Task<IActionResult> FinishAppointment([FromRoute] int id)
        {
            var response = await appointmentService.FinishAppointment(id);
            return Ok(response);
        }
    }
}
