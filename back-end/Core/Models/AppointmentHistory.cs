using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class AppointmentHistory
    {
        [Key]
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Description { get; set; }
        public string CreatedBy { get; set; }
    }
}
