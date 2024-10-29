using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Clinic
{
    public class ClinicRequest
    {
        [Required(ErrorMessage = "Tên phòng khám không được để trống")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Địa chỉ phòng khám không được để trống")]
        public string Address { get; set; }
        public IFormFile? Thumbnail { get; set; }
    }

    public class BrandRequest
    {
        public string Name { get; set; }
        public string Address { get; set; }
    }
}
