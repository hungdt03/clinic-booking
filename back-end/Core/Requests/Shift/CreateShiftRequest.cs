using clinic_schedule.Core.Constants;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Shift
{
    public class CreateShiftRequest
    {
        [Required(ErrorMessage = "Thời gian bắt đầu là bắt buộc")]
        public string StartTime { get; set; }
        [Required(ErrorMessage = "Thời gian kết thúc là bắt buộc")]
        public string EndTime { get; set; }

        [JsonIgnore]
        public TimeSpan StartTimeSpan { get; private set; }

        [JsonIgnore]
        public TimeSpan EndTimeSpan { get; private set; }

        public (bool IsValid, string Message) TryParseTimes()
        {
            bool isStartTimeValid = TimeSpan.TryParseExact(StartTime, "hh\\:mm", null, out TimeSpan startTimeSpan);
            bool isEndTimeValid = TimeSpan.TryParseExact(EndTime, "hh\\:mm", null, out TimeSpan endTimeSpan);

            if (!isStartTimeValid || !isEndTimeValid)
            {
                return (false, "Định dạng thời gian không hợp lệ. Vui lòng sử dụng định dạng HH:mm");
            }

            if (startTimeSpan >= endTimeSpan)
            {
                return (false, "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");
            }

            StartTimeSpan = startTimeSpan;
            EndTimeSpan = endTimeSpan;

            return (true, "Thời gian hợp lệ.");
        }
    }
}
