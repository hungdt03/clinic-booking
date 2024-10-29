using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Patient
{
    public class ProfileRequest
    {
        [Required(ErrorMessage = "Họ và tên là bắt buộc")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Ngày sinh là bắt buộc")]
        public DateTime DateOfBirth { get; set; }
        [Required(ErrorMessage = "Giới tính là bắt buộc")]
        public string Gender { get; set; }
        public string IdentityCard { get; set; }
        public string Address { get; set; }
        public string Major { get; set; }
        public string Email { get; set; }
        public string Relationship { get; set; }
        public string EthnicGroup { get; set; }
      
    }
}
