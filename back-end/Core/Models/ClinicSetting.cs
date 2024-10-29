using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class ClinicSetting
    {
        [Key]
        public int Id { get; set; }
        public DateTime AvailableTo { get; set; }
        public string ClinicId { get; set; }    
        public Clinic? Clinic { get; set; }
        public string DoctorId { get; set; }
        public Doctor? Doctor { get; set; }
    }
}
