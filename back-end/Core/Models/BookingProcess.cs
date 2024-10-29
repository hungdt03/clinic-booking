using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class BookingProcess
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        public string ClinicId { get; set; }
        public Clinic Clinic { get; set; }
    }
}
