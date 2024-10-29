using clinic_schedule.Core.Models;

namespace clinic_schedule.Core.Response.Resources
{
    public class GroupResource
    {
        public string GroupName { get; set; }
        public MessageResource Message { get; set; }
        public int TotalUnReadMessages { get; set; }
        public DateTime AvailableTo { get; set; }
        public bool IsAvailable { get; set; }
        public string? ClinicId { get; set; }
        public ClinicResource? Clinic { get; set; }
        public UserResource FirstUser { get; set; }
        public UserResource LastUser { get; set; }
    }
}
