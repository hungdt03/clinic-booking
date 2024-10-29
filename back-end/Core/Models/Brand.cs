using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Brand
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string ClinicId { get; set; }
        public Clinic Clinic { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
        public ICollection<Doctor> Doctors { get; set; }
    }
}
