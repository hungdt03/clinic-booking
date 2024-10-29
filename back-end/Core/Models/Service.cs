using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Service
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public double Fee { get; set; }
        public int ServiceTypeId { get; set; }
        public ServiceType ServiceType { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
    }
}
