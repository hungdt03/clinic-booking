using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class AppToken
    {
        [Key]
        public string RefreshToken { get; set; }
        public bool IsRevoked { get; set; }
        public string JwtId { get; set; }
        public bool IsUsed { get; set; }
        public DateTime IssuedAt { get; set; }
        public DateTime ExpiredAt { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}
