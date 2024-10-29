namespace clinic_schedule.Core.Response.Resources
{
    public class MessageResource
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public UserResource Sender { get; set; }
        public UserResource Recipient { get; set; }
        public DateTime SentAt { get; set; }
        public bool HaveRead { get; set; }
        public string MessageType { get; set; }
        public bool IsVisibleToRecipient { get; set; }
        public bool IsVisibleToSender { get; set; }
    }
}
