namespace clinic_schedule.Core.Response.Resources
{
    public class NotificationResource
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int? ReferenceId { get; set; }
        public UserResource Recipient { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool HaveRead { get; set; }
        public string NotificationType { get; set; }
    }
}
