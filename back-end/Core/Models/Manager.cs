using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Manager
    {
        [Key]
        public string UserId { get; set; }
        public User User { get; set; }
        public string? Thumbnail { get; set; }
        public string ClinicId { get; set; }
        public Clinic Clinic { get; set; }
    }
}
