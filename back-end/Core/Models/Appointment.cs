using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }
        public Profile Profile { get; set; }
        public string ProfileId { get; set; }
        public Patient Patient { get; set; }
        public string PatientId { get; set; }
        public Doctor? Doctor { get; set; }
        public Clinic? Clinic { get; set; }
        public Brand? Brand { get; set; }
        public Service? Service { get; set; }
        public string? DoctorId { get; set; }
        public string? ClinicId { get; set; }
        public int? BrandId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Note { get; set; }
        public Shift Shift { get; set; }
        public int ShiftId { get; set; }
        public string Status { get; set; }
        public int? ServiceId { get; set; }
        public DateTime CreatedDate { get; set; }
        public ICollection<AppointmentHistory> History { get; set; }
        public ICollection<FileAttach> FileAttaches { get; set; }
        public int NumberOrder { get; set; }
    }
}
