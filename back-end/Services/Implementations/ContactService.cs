using clinic_schedule.Core.Response;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class ContactService : IContactService
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ContactService(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            this.dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<BaseResponse> GetAllContacts()
        {
            return new BaseResponse();
        }
    }
}
