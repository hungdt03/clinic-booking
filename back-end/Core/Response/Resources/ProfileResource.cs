namespace clinic_schedule.Core.Response.Resources
{
    public class ProfileResource
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string IdentityCard { get; set; }
        public string Address { get; set; }
        public string Major { get; set; }
        public string Email { get; set; }
        public string Relationship { get; set; }
        public string EthnicGroup { get; set; }
        public bool IsPrimary { get; set; }
    }
}
