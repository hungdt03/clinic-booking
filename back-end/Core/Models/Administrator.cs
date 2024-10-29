using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Administrator
    {
        [Key]
        public string UserId { get; set; }
        public User User { get; set; }
    }
}
