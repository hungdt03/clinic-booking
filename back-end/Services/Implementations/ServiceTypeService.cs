using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.ServiceType;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class ServiceTypeService : IServiceTypeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly AppMapping appMapping;

        public ServiceTypeService(ApplicationDbContext context, IHttpContextAccessor contextAccessor, AppMapping appMapping)
        {
            _context = context;
            _contextAccessor = contextAccessor;
            this.appMapping = appMapping;
        }

        public async Task<BaseResponse> CreateServiceType(ServiceTypeRequest request)
        {
            var managerId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == managerId);

            var serviceType = new ServiceType()
            {
                Name = request.Name,
                SubName = request.SubName,
                ClinicId = manager.ClinicId,
                IsIncludeFee = request.IsIncludeFee,
            };

            var existedProcess = await _context.BookingProcesses
                .SingleOrDefaultAsync(c => c.Name.Equals("SERVICE") && c.ClinicId.Equals(manager.ClinicId));

            if (existedProcess == null)
            {
                var process = new BookingProcess()
                {
                    Name = "SERVICE",
                    ClinicId = manager.ClinicId,
                    Active = true,
                };

                await _context.BookingProcesses.AddAsync(process);
            }
            else
            {
                existedProcess.Active = true;
            }

            await _context.ServiceTypes.AddAsync(serviceType);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thêm loại dịch vụ khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };

        }

        public async Task<BaseResponse> GetAllServiceTypes()
        {
            var managerId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == managerId);

            var resources = await _context.ServiceTypes
               .Where(s => s.ClinicId == manager.ClinicId)
               .Select(s => appMapping.MapToServiceTypeResource(s))
               .ToListAsync();

            return new DataResponse<List<ServiceTypeResource>>
            {
                Data = resources,
                Message = "Lấy tất cả loại dịch vụ khám của phòng khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> GetAllServiceTypesByClinicId(string clinicId)
        {
            var serviceTypes = await _context.ServiceTypes
                .Where(s => s.ClinicId == clinicId)
                .ToListAsync();

            var resources = serviceTypes.Select(s => appMapping.MapToServiceTypeResource(s)).ToList();

            return new DataResponse<List<ServiceTypeResource>>
            {
                Data = resources,
                Message = "Lấy tất cả loại dịch vụ khám của phòng khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> UpdateServiceType(int id, ServiceTypeRequest request)
        {
            var managerId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == managerId);

            var serviceType = await _context.ServiceTypes
                .SingleOrDefaultAsync(s => s.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy loại dịch vụ khám");

            serviceType.Name = request.Name;
            serviceType.SubName = request.SubName;
            serviceType.IsIncludeFee = request.IsIncludeFee;

            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Cập nhật loại dịch vụ khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }
    }
}
