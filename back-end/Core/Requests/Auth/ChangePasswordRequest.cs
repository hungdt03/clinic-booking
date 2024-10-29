using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Auth
{
    public class ChangePasswordRequest
    {
        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string Password { get; set; }
    }
}
