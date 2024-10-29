using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Doctor
{
    public class CreateDoctorEmployeeRequest
    {
        public int BrandId { get; set; }
        [Required(ErrorMessage = "Họ và tên không được để trống")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Địa chỉ email không được để trống")]
        [EmailAddress(ErrorMessage = "Địa chỉ email không đúng định dạng")]
        public string Email { get; set; }
      
    }
}
