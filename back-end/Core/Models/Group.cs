using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Group
    {
        [Key]
        public string GroupName { get; set; }
        public Message Message { get; set; }
        
        public int MessageId { get; set; }
        public int TotalUnReadMessages { get; set; }
        public DateTime AvailableTo { get; set; }
        public bool IsAvailable { get; set; }
        public string? ClinicId { get; set; }
        public Clinic? Clinic { get; set; }
        public User FirstUser { get; set; }
        public string FirstUserId { get; set; }
        public User LastUser { get; set; }
        public string LastUserId { get; set; }
    }
}
