using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class BookingProcessService : IBookingProcessService
    {
        private readonly ApplicationDbContext context;
        private readonly AppMapping appMapping;

       

        public BookingProcessService(ApplicationDbContext context, AppMapping appMapping)
        {
            this.context = context;
            this.appMapping = appMapping;
        }

        public async Task<BaseResponse> GetBookingProcessByClinicId(string clinicId)
        {
            
            var processes = await context.BookingProcesses
                .Where(p => p.ClinicId == clinicId && p.Active).ToListAsync();

            var processResources = new ProcessResource[]
            {
               new ProcessResource {  Name = "BRAND", OrderNumber = 1 },
               new ProcessResource {  Name = "SERVICE", OrderNumber = 2 },
               new ProcessResource {  Name = "DOCTOR", OrderNumber = 3 }
            };

            var resources = new List<ProcessResource>();

            int count = 1;
            foreach(var process in processResources)
            {
                var existedProcess = processes.FirstOrDefault(p => p.Name.Equals(process.Name));
                if (existedProcess != null)
                {
                    var resource = appMapping.MapToProcessResource(existedProcess, count);
                    resources.Add(resource);
                    count++;
                }
            }

            resources.Add(new ProcessResource { Name = "DATE", OrderNumber = count });
            resources.Add(new ProcessResource { Name = "SHIFT", OrderNumber = ++count });
            resources.Add(new ProcessResource { Name = "PROFILE", OrderNumber = ++count });

            return new DataResponse<List<ProcessResource>>
            {
                Data = resources,
                Message = "Lấy dữ liệu quy trình",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };

        }
    }
}
