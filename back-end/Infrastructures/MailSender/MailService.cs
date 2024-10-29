using System.Net.Mail;
using System.Net;

namespace clinic_schedule.Infrastructures.MailSender
{
    public class MailService : IMailService
    {
        public bool SendMail(string to, string body, string subject)
        {
            string emailFrom = "cskhshop5@gmail.com";
            string password = "shinvmqupbvnptud";

            try
            {
                SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(emailFrom, password);

                MailMessage mailMessage = new MailMessage(emailFrom, to, subject, body);
                client.Send(mailMessage);

                return true;
            }
            catch (Exception ex)
            {

                Console.WriteLine("Error sending email: " + ex.Message);
                return false;
            }
        }
    }
}
