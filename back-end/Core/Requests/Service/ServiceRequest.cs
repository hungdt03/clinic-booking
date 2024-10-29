using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Service
{
    public class ServiceRequest
    {
        [Required(ErrorMessage = "Tên dịch vụ là bắt buộc")]
        public string Name { get; set; }
        public double Fee { get; set; }
        [Required(ErrorMessage = "ID loại dịch vụ là bắt buộc")]
        public int ServiceTypeId { get; set; }
    }
}
