namespace clinic_schedule.Core.Models
{
    public class FileAttach
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Type { get; set; }
        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
    }
}
