using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Appointment
{
    public class AppointmentWithClinicRequest
    {
        [Required(ErrorMessage = "Thông tin phòng khám là bắt buộc")]
        public string ClinicId { get; set; }
        [Required(ErrorMessage = "Thông tin ID hồ sơ là bắt buộc")]
        public string ProfileId { get; set; }
        public string? DoctorId { get; set; }
        public int? ServiceId { get; set; }
        public int? BrandId { get; set; }
        [Required(ErrorMessage = "Ngày đặt hẹn là bắt buộc")]
        public DateTime AppointmentDate { get; set; }
        [Required(ErrorMessage = "Khung giờ đặt hẹn là bắt buộc")]
        public int ShiftId { get; set; }
        public string Note { get; set; }
        public List<IFormFile> FileAttaches { get; set; }
    }
}
