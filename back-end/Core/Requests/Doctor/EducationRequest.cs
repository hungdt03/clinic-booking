using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Doctor
{
    public class EducationRequest
    {
        public List<EducationType> Educations { get; set; }
    }

    public class EducationType
    {
        public int? Id { get; set; }
        public string FromYear { get; set; }
        public string ToYear { get; set; }
        public string StudyPlace { get; set; }
    }
}
