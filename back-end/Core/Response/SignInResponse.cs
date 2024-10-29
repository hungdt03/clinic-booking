using clinic_schedule.Core.Response.Resources;

namespace clinic_schedule.Core.Response
{
    public class SignInResponse<T>
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public T User { get; set; }
    }
}
