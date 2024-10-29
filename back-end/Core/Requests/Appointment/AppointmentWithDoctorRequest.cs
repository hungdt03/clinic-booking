using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Appointment
{
    public class AppointmentWithDoctorRequest
    {
        [Required(ErrorMessage = "Thông tin bác sĩ là bắt buộc")]
        public string DoctorId { get; set; }
        [Required(ErrorMessage = "Thông tin ID hồ sơ là bắt buộc")]
        public string ProfileId { get; set; }
        [Required(ErrorMessage = "Ngày đặt hẹn là bắt buộc")]
        public DateTime AppointmentDate { get; set; }
        [Required(ErrorMessage = "Khung giờ đặt hẹn là bắt buộc")]
        public int ShiftId { get; set; }
        public string Note { get; set; }
        public List<IFormFile> FileAttaches { get; set; }
    }
}
