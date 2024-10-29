using System.ComponentModel.DataAnnotations;


namespace clinic_schedule.Core.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }
        public string SenderId { get; set; }
        public User Sender { get; set; }
        public string RecipientId { get; set; }
        public User Recipient { get; set; }
        public string Content { get; set; }
        public DateTime SendAt { get; set; } = DateTime.Now;
        public bool HaveRead { get; set; }
        public DateTime ReadAt { get; set; }
        public Group Group { get; set; }
        public bool IsVisibleToRecipient { get; set; }
        public bool IsVisibleToSender { get; set; }
        public string MessageType { get; set; }
    }
}
