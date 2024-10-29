using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class ClinicImage
    {
        [Key]
        public int Id { get; set; }
        public string Url { get; set; }
        public string ClinicId { get; set; }
        public Clinic Clinic { get; set; }
    }
}
