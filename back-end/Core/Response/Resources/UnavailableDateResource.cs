namespace clinic_schedule.Core.Response.Resources
{
    public class UnavailableDateResource
    {
        public DateTime Day { get; set; }
        public string Title { get; set; }
        public bool IsExceptionDate { get; set; }
    }
}
