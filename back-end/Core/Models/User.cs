using Microsoft.AspNetCore.Identity;
using System.Reflection.Metadata;

namespace clinic_schedule.Core.Models
{
    public class User : IdentityUser
    {
        public string? Thumbnail { get; set; }
        public string FullName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? IdentityCard {  get; set; }
        public string? EthnicGroup { get; set; }
        public string? Address { get; set; } 
        public bool IsActivated { get; set; }
        public bool IsChangedPassword { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsOnline { get; set; }
        public DateTime RecentOnlineTime { get; set; }
        public Manager Manager { get; set; }
        public Patient Patient { get; set; }
        public Administrator Administrator { get; set; }
        public Doctor Doctor { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
        public ICollection<Group> Groups { get; set; }
        public ICollection<DeviceToken> DeviceTokens { get; set; }
        public ICollection<Notification> Notifications { get; set; }
    }
}
