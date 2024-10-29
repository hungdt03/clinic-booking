using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Requests.Appointment
{
    public class CancelAppointmentRequest
    {
        public string Reason { get; set; }
    }
}
