namespace clinic_schedule.Core.Response.Resources
{
    public class ClinicResource
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string ThumbnailUrl { get; set; }
        public string IntroductionHtml { get; set; }
        public string IntroductionPlain {  get; set; }
        public List<SpecializationResource> Specializations { get; set; }
        public List<string> Images { get; set; }
    }
}
