using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Specialization
{
    public class SpecializationRequest
    {
        [Required(ErrorMessage = "Tên chuyên khoa không được để trống")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Mô tả chuyên khoa không được để trống")]
        public string Description { get; set; }
        public IFormFile? Thumbnail { get; set; }
    }
}
