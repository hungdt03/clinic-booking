using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Specialization
{
    public class AddSpecializationRequest
    {
        [Required(ErrorMessage = "Chưa chọn chuyên khám nào")]
        public List<int> SpecializationIds { get; set; }
    }
}
