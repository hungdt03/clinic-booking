using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Specialization
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Thumbnail { get; set; }
        public string Description { get; set; }
        public ICollection<Doctor> Doctors { get; set; }
        public ICollection<Clinic> Clinics { get; set; }
       
    }
}
