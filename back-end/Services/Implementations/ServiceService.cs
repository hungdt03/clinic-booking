using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.Service;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class ServiceService : IServiceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly AppMapping appMapping;

        public ServiceService(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, AppMapping appMapping)
        {
            _context = context;
            _contextAccessor = httpContextAccessor;
            this.appMapping = appMapping;
        }

        public async Task<BaseResponse> CreateService(ServiceRequest request)
        {
            var managerId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == managerId)
                    ?? throw new NotFoundException("Thông tin QL phòng khám không tồn tại. Vui lòng liên hệ QTV để được hỗ trợ");

            var serviceType = await _context.ServiceTypes
                .SingleOrDefaultAsync(s => s.Id == request.ServiceTypeId && s.ClinicId == manager.ClinicId)
                    ?? throw new NotFoundException("Không tìm thấy loại dịch vụ khám");

            var service = new Service()
            {
                Name = request.Name,
                ServiceTypeId = serviceType.Id,
            };

            if(serviceType.IsIncludeFee)
            {
                service.Fee = request.Fee;
            }

            await _context.Services.AddAsync(service);
            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Thêm dịch vụ khám thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<BaseResponse> GetAllServiceByClinicId(string clinicId)
        {
            var services = await _context.Services
                .Include(s => s.ServiceType)
                .Where(s => s.ServiceType.ClinicId == clinicId)
                .ToListAsync();

            var resources = services.Select(s => appMapping.MapToServiceResource(s)).ToList();

            return new DataResponse<List<ServiceResource>>()
            {
                Data = resources,
                Message = "Lấy các dịch vụ của phòng khám thành công",
                Success = true,
                StatusCode  = System.Net.HttpStatusCode.OK
            };
        }

        public async Task<BaseResponse> GetAllServices()
        {
            var managerId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == managerId)
                    ?? throw new NotFoundException("Thông tin QL phòng khám không tồn tại. Vui lòng liên hệ QTV để được hỗ trợ");

            var resources = await _context.Services
                .Include(s => s.ServiceType)
                .Where(s => s.ServiceType.ClinicId == manager.ClinicId)
                .Select(s => appMapping.MapToServiceResource(s))
                .ToListAsync();

            return new DataResponse<List<ServiceResource>>()
            {
                Data = resources,
                Message = "Lấy các dịch vụ của phòng khám thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        public async Task<BaseResponse> GetAllServicesByServiceType(int serviceTypeId)
        {
            //var managerId = _contextAccessor.HttpContext.User.GetUserID();
            //var manager = await _context.Managers
            //    .SingleOrDefaultAsync(m => m.UserId == managerId)
            //        ?? throw new NotFoundException("Thông tin QL phòng khám không tồn tại. Vui lòng liên hệ QTV để được hỗ trợ");

            ServiceType serviceType = await _context.ServiceTypes
                .SingleOrDefaultAsync(s => s.Id == serviceTypeId)
                    ?? throw new NotFoundException("Không tìm thấy loại dịch vụ khám");

            var services = await _context.Services
                .Include(s => s.ServiceType)
                .Where(s => s.ServiceTypeId == serviceTypeId)
                .Select(s => appMapping.MapToServiceResource(s))
                .ToListAsync();

            return new DataResponse<List<ServiceResource>>
            {
                Message = "Lấy tất cả dịch vụ thành công",
                Data =  services,
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        public async Task<BaseResponse> UpdateService(int id, ServiceRequest request)
        {
            var managerId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == managerId)
                    ?? throw new NotFoundException("Thông tin QL phòng khám không tồn tại. Vui lòng liên hệ QTV để được hỗ trợ");

            var serviceType = await _context.ServiceTypes
                .SingleOrDefaultAsync(s => s.Id == request.ServiceTypeId && s.ClinicId == manager.ClinicId)
                    ?? throw new NotFoundException("Không tìm thấy loại dịch vụ khám");

            var service = await _context.Services
                .SingleOrDefaultAsync(s => s.ServiceTypeId == serviceType.Id && s.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy dịch vụ khám");

            return new BaseResponse
            {
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Cập nhật thông tin dịch vụ khám thành công"
            };
        }
    }
}
