using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Manager
{
    public class CreateManagerRequest
    {
        [Required(ErrorMessage = "ID phòng khám là bắt buộc")]
        public string ClinicId { get; set; }
        [Required(ErrorMessage = "Họ và tên không được để trống")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Địa chỉ email không được để trống")]
        [EmailAddress(ErrorMessage = "Địa chỉ email không đúng định dạng")]
        public string Email { get; set; }
        //[Required(ErrorMessage = "UserName không được để trống")]
        //public string UserName { get; set; }
        //[Required(ErrorMessage = "Mật khẩu không được để trống")]
        //public string Password { get; set; }
    }
}
