using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class SpecializedExamination
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string? DoctorId { get; set; }
        public Doctor? Doctor { get; set; }
        public string? ClinicId { get; set; }
        public Clinic? Clinic { get; set; }
    }
}
