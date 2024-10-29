using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class Clinic
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Thumbnail { get; set; }
        public string Address { get; set; }
        public Note? Note { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
        public ICollection<Specialization> Specializations { get; set; }
        public ICollection<SpecializedExamination> SpecializedExaminations { get; set; }
        public ICollection<Doctor> Doctors { get; set; }
        public string? IntroductionPlain { get; set; }
        public string? IntroductionHtml { get; set; }
        public ICollection<Brand> Brands { get; set; }
        public ICollection<ServiceType> ServiceTypes { get; set; }
        public ICollection<ExceptionDate> HolidayDays { get; set; }
        public ICollection<Shift> Shifts { get; set; }
        public ICollection<ClinicImage> Images { get; set; }
        public ClinicSetting? ClinicSetting { get; set; }
        public ICollection<Patient> Favorites { get; set; }
        public Manager Manager { get; set; }
        public ICollection<Group> Groups { get; set; }
        public BookingProcess BookingProcess { get; set; }

    }
}
