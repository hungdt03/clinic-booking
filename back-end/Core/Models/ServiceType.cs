using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class ServiceType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string SubName { get; set; }
        public bool IsIncludeFee { get; set; }
        public ICollection<Service> Services { get; set; }
        public string ClinicId { get; set; }
        public Clinic Clinic { get; set; }
    }
}
