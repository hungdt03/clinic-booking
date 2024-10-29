namespace clinic_schedule.Core.Response.Resources
{
    public class UserResource
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Thumbnail {  get; set; }
        public string PhoneNumber { get; set; }
        public bool IsOnline { get; set; }
        public DateTime RecentOnlineTime { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string IdentityCard { get; set; }
        public string EthnicGroup { get; set; }
        public string Address { get; set; }
        public string Role { get; set; }
        public bool IsPasswordChanged { get; set; }
    }

    public class ManagerResource {
        public ClinicResource Clinic { get; set; }
        public UserResource User { get; set; }
    }

    public class DoctorResource {
        public string Position { get; set; }
        public string AcademicTitle { get; set; }
        public string Degree { get; set; }
        public string CurrentWorkPlace { get; set; }
        public int ExperienceYears { get; set; }
        public string Address { get; set; }
        public string IntroductionPlain { get; set; }
        public string IntroductionHtml { get; set; }
    }


    public class DoctorEmployee
    {
        public DoctorResource Details { get; set; }
        public UserResource User { get; set; }
        public ClinicResource Clinic { get; set; }
    }

    public class DoctorOwner
    {
        public DoctorResource Details { get; set; }
        public UserResource User { get; set; }
        public List<SpecializationResource> Specializations { get; set; }
        public List<AwardResource> AwardsAndResearches { get; set; }
        public List<EducationResource> Educations { get; set; }
        public List<WorkExperienceResource> WorkExperiences { get; set; }
        public List<string> Images { get; set; }
    }
}
