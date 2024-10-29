namespace clinic_schedule.Core.Requests.Doctor
{
    public class WorkExperienceRequest
    {
        public List<WorkExperienceType> WorkExperiences { get; set; }
    }

    public class WorkExperienceType
    {
        public int? Id { get; set; }
        public string FromYear { get; set; }
        public string ToYear { get; set; }
        public string WorkPlace { get; set; }
    }
}
