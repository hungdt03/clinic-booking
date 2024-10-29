using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class ExceptionDate
    {
        [Key]
        public int Id { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool IsRepeatAnnually { get; set; }
        public bool IsFullDay { get; set; }
        public string Reason { get; set; }
        public string? ClinicId { get; set; }
        public Clinic? Clinic { get; set; }
        public string? DoctorId { get; set; }
        public Doctor? Doctor { get; set; }
        public string Type { get; set; }
        public ICollection<WeekDayException> WeekDayExceptions { get; set; }
        public ICollection<Shift> UnavailableShifts { get; set; }
    }
}
