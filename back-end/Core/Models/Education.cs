using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Education
    {
        [Key]
        public int Id { get; set; }
        public string FromYear { get; set; }
        public string ToYear { get; set; }
        public string StudyPlace { get; set; }
        public string? DoctorId { get; set; }
        public Doctor Doctor { get; set; }
    }
}
