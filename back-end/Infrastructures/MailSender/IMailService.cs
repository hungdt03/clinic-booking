namespace clinic_schedule.Infrastructures.MailSender
{
    public interface IMailService
    {
        bool SendMail(string to, string body, string subject);
    }
}
