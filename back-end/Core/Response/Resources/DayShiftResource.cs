namespace clinic_schedule.Core.Response.Resources
{
    public class DayShiftResource
    {
        public DateTime Day { get; set; }
        public bool IsExceptionDate { get; set; }
        public string Title { get; set; }
        public List<ShiftResource> Shifts { get; set; }
    }
}
