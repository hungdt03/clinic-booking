using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Brand
{
    public class BrandRequest
    {
        [Required(ErrorMessage = "Tên chi nhánh/cơ sở là bắt buộc")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Địa chỉ chi nhánh/cơ sở là bắt buộc")]
        public string Address { get; set; }
  
    }
}
