namespace clinic_schedule.Core.Exceptions
{
    public class NoAccessException : Exception
    {
        public NoAccessException(string? message) : base(message)
        {
        }
    }
}
