using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.ServiceType
{
    public class ServiceTypeRequest
    {
        [Required(ErrorMessage = "Tên dịch vụ khám là bắt buộc")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Tên subname dịch vụ khám là bắt buộc")]
        public string SubName { get; set; }
        public bool IsIncludeFee { get; set; } = false;
    }
}
