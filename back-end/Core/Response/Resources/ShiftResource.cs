namespace clinic_schedule.Core.Response.Resources
{
    public class ShiftResource
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
