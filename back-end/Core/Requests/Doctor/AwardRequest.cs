namespace clinic_schedule.Core.Requests.Doctor
{
    public class AwardRequest
    {
        public List<AwardType> AwardsAndResearches {  get; set; }
    }

    public class AwardType
    {
        public int? Id { get; set; }
        public string Year { get; set; }
        public string Content { get; set; }
    }
}
