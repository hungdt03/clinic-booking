using System.Net;

namespace clinic_schedule.Core.Response
{
    public class BaseResponse
    {
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; }
        public bool Success { get; set; }
    }
}
