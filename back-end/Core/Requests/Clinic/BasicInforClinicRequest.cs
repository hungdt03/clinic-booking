namespace clinic_schedule.Core.Requests.Clinic
{
    public class BasicInforClinicRequest
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public IFormFile? Thumbnail { get; set; }
        public List<IFormFile> Images { get; set; }
        public List<string> RemoveImages { get; set; }
        public bool IsRemoveThumbnail { get; set; }
    }
}
