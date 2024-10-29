using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Doctor
    {
        [Key]
        public string UserId { get; set; }  
        public User User { get; set; }
        public string? Position { get; set; }
        public string? AcademicTitle { get; set; }
        public string? Degree { get; set; }
        public string? CurrentWorkPlace { get; set; }
        public int? ExperienceYears { get; set; }
        public string? Address { get; set; }
        public string? ClinicId { get; set; }
        public bool? IsAvailableBooking { get; set; }
        public Clinic? Clinic { get; set; }
        public ICollection<Specialization> Specializations { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
        public ICollection<SpecializedExamination> SpecializedExaminations { get; set; }
        public ICollection<AwardsAndResearch> AwardsAndResearches { get; set; }
        public ICollection<Education> Educations { get; set; }
        public string? IntroductionPlain { get; set; }
        public string? IntroductionHtml { get; set; }
        public ICollection<WorkExperience> WorkExperiences { get; set; }
        public ICollection<DoctorImage> DoctorImages { get; set; }
        public ICollection<Shift> Shifts { get; set; }
        public ICollection<Patient> Favorites { get; set; }
        public ClinicSetting? ClinicSetting { get; set; }
        public Note? Note { get; set; }
        public Brand? Brand { get; set; }
        public int? BrandId { get; set; }

    }
}
