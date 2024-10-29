namespace clinic_schedule.Core.Response
{
    public class PaginationResponse<T> : DataResponse<T> where T : class
    {
        public Pagination Pagination { get; set; }
    }

    public class Pagination
    {
        public int Page { get; set; }
        public int Size { get; set; }
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
    }
}
