using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class DoctorImage
    {
        [Key]
        public int Id { get; set; }
        public string Url { get; set; }
        public string DoctorId { get; set; }
        public Doctor Doctor { get; set; }

    }
}
