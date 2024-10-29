using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Shift
    {
        [Key]
        public int Id { get; set; }
        public string Type { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public string? ClinicId { get; set; }
        public Clinic? Clinic { get; set; }

        public string? DoctorId { get; set; }
        public Doctor? Doctor { get; set; }
        public ICollection<ExceptionDate> ExceptionDates { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
    }
}
