using clinic_schedule.Core.Models;

namespace clinic_schedule.Core.Requests.Setting
{
    public class ExceptionDateRequest
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool IsRepeatAnnually { get; set; }
        public bool IsFullDay { get; set; }
        public string Reason { get; set; }
        public string Type { get; set; }
        public ICollection<int> WeekDayIds { get; set; }
        public ICollection<int> UnavailableShiftIds { get; set; }
    }
}
