using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Note
    {
        [Key]
        public int Id { get; set; }
        public string Content { get; set; }
        public string? ClinicId { get; set; }
        public Clinic? Clinic { get; set; }

        public string? DoctorId { get; set; }
        public Doctor? Doctor { get; set; }
    }
}
