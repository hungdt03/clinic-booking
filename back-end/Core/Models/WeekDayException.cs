using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace clinic_schedule.Core.Models
{
    public class WeekDayException
    {
        [Key]
        public int Id { get; set; }

        [Range(1, 7, ErrorMessage = "DayOfWeek must be between 1 and 7.")]
        public int DayOfWeek { get; set; }
        public ICollection<ExceptionDate> ExceptionDates { get; set; }
    }
}
