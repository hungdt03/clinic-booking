using clinic_schedule.Core.Requests.Appointment;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Services.Interfaces
{
    public interface IAppointmentService
    {
        Task<BaseResponse> CreateAppointmentWithClinic(AppointmentWithClinicRequest request);
        Task<BaseResponse> CreateAppointmentWithDoctor(AppointmentWithDoctorRequest request);
        Task<BaseResponse> GetAllAppointmentsByPatientId(string patientId);
        Task<BaseResponse> GetAllAppointmentsByLoggedInUser(int page = 1, int size = 8);
        Task<BaseResponse> GetAllAppointmentByDoctorOwnerLoggedIn(int page = 1, int size = 8);
        Task<BaseResponse> GetAllAppointmentByDoctorEmployeeLoggedIn(int page = 1, int size = 8);
        Task<BaseResponse> GetAllAppointmentByClinicLoggedIn(int page = 1, int size = 8);
        Task<BaseResponse> GetAppointmentById(int id);
        Task<BaseResponse> CancelAppointment(int appointmentId, CancelAppointmentRequest request);
        Task<BaseResponse> FinishAppointment(int appointmentId);
    }
}
