using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Auth
{
    public class SignInRequest
    {
        [Required(ErrorMessage = "Username không được để trống")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string Password { get; set; }
    }
}
