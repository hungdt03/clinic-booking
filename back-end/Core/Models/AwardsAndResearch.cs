using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class AwardsAndResearch
    {
        [Key]
        public int Id { get; set; }
        public string Year { get; set; }
        public string Content { get; set; }
        public string? DoctorId { get; set; }
        public Doctor Doctor { get; set; }
    }
}
