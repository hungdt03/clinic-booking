namespace clinic_schedule.Core.Response.Resources
{
    public class ServiceResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Fee { get; set; }
        public string Type { get; set; }
        public ServiceTypeResource ServiceType { get; set; }
    }
}
