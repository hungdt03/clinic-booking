namespace clinic_schedule.Core.DTOs
{
    public class NotificationDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string RecipientId { get; set; }
        public string NotificationType { get; set; }
        public int ReferenceId { get; set; }
    }
}
