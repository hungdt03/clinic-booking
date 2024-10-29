using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Profile
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? IdentityCard { get; set; }
        public string? Address { get; set; }
        public string? Major {  get; set; }
        public string Email { get; set; }
        public string? Relationship { get; set; }
        public string? EthnicGroup { get; set; }
        public string? PatientId { get; set; }
        public bool PrimaryProfile { get; set; }
        public Patient Patient { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
    }
}
