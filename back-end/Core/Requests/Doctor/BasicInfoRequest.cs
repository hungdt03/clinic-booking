namespace clinic_schedule.Core.Requests.Doctor
{
    public class BasicInfoRequest
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string AcademicTitle { get; set; }
        public string Degree { get; set; }
        public string CurrentWorkPlace { get; set; }
        public string Position { get; set; }
        public int ExperienceYears { get; set; }
        public string Address { get; set; }
        public IFormFile? Thumbnail { get; set; }
        public List<IFormFile> Images { get; set; }
        public List<string> RemoveImages { get; set; }
        public bool IsRemoveThumbnail {  get; set; }
    }
}
