using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Setting
{
    public class NoteRequest
    {
        [Required(ErrorMessage = "Ghi chú là bắt buộc")]
        public string Note { get; set; }
    }
}
