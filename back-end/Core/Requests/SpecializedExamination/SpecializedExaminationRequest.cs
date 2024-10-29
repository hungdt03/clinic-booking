using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.SpecializedExamination
{
    public class SpecializedExaminationRequest
    {
        [Required(ErrorMessage = "Tên khoa khám là bắt buộc")]
        public string Name { get; set; }
    }
}
