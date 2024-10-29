namespace clinic_schedule.Core.Response.Resources
{
    public class ExceptionDateResource
    {
        public int Id { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Reason { get; set; }
        public bool IsRepeatAnnually { get; set; }
        public bool IsFullDay { get; set; }
        public string Type { get; set; }
        public List<ShiftResource> UnavailableShifts { get; set; }
        public List<WeekDayExceptionResource> WeekDays { get; set; }
    }
}
