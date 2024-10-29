using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Auth
{
    public class SignUpRequest
    {
        [Required(ErrorMessage = "Username không được để trống")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Họ và tên không được để trống")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Địa chỉ email không đúng định dạng")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string Password { get; set; }
    }
}
