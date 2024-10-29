using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public string RecipientId { get; set; }
        public User Recipient { get; set; }
        public bool HaveRead { get; set; }
        public int? ReferenceId { get; set; }
        public string NotificationType { get; set; }
    }
}
