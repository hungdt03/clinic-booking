using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Patient
    {
        [Key]
        public string UserId { get; set; }
        public User User { get; set; }
        public ICollection<Profile> Profiles { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
        public ICollection<Doctor> FavoriteDoctors { get; set; }
        public ICollection<Clinic> FavoriteClinics { get; set; }
    }
}
