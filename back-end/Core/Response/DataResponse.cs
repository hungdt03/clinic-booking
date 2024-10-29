namespace clinic_schedule.Core.Response
{
    public class DataResponse<T> : BaseResponse
    {
        public T Data { get; set; }
    }
}
