using clinic_schedule.Core.Models;

namespace clinic_schedule.Core.Response.Resources
{
    public class AppointmentResource
    {
        public int Id { get; set; }
        public ProfileResource Profile { get; set; }
        public DoctorOwner? Doctor { get; set; }
        public ClinicResource? Clinic { get; set; }
        public BrandResource? Brand { get; set; }
        public ServiceResource? Service { get; set; }
        public ServiceTypeResource? ServiceType { get; set; }
        public DateTime AppointmentDate { get; set; }
        public ShiftResource Shift { get; set; }
        public string Status { get; set; }
        public string Note { get; set; }
        public List<string> FileAttaches { get; set; }
        public DateTime CreatedDate { get; set; }
        public int NumberOrder { get; set; }
    }
}
