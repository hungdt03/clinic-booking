using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.Brand;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class BrandService : IBrandService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly AppMapping appMapping;

        public BrandService(ApplicationDbContext context, IHttpContextAccessor contextAccessor, AppMapping appMapping)
        {
            _context = context;
            _contextAccessor = contextAccessor;
            this.appMapping = appMapping;
        }

        public async Task<BaseResponse> CreateBrand(BrandRequest request)
        {
            var managerId = _contextAccessor?.HttpContext?.User.GetUserID();

            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == managerId)
                    ?? throw new NotFoundException("Thông tin người quản lí không tồn tại. Vui lòng liên hệ QTV để hỗ trợ");

            Clinic clinic = await _context.Clinics
                .SingleOrDefaultAsync(c => c.Id == manager.ClinicId)
                    ?? throw new NotFoundException("Thông tin phòng khám không tồn tại");

            var brand = new Brand()
            {
                Name = request.Name,
                Address = request.Address,
                ClinicId = manager.ClinicId,
            };

            var existedProcess = await _context.BookingProcesses
                .SingleOrDefaultAsync(c => c.Name.Equals("BRAND") && c.ClinicId.Equals(clinic.Id));

            if(existedProcess == null)
            {
                var process = new BookingProcess() { 
                    Name = "BRAND",
                    ClinicId = clinic.Id,
                    Active = true,
                };

                await _context.BookingProcesses.AddAsync(process);
            } else
            {
                existedProcess.Active = true;
            }

            await _context.Brands.AddAsync(brand);
            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Thêm chi nhánh mới thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        public async Task<BaseResponse> GetAllBrands()
        {
            var managerId = _contextAccessor?.HttpContext?.User.GetUserID();

            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == managerId)
                    ?? throw new NotFoundException("Thông tin người quản lí không tồn tại. Vui lòng liên hệ QTV để hỗ trợ");

            var resources = await _context.Brands
                .Where(br => br.ClinicId == manager.ClinicId)
                .Select(br => appMapping.MapToBrandResource(br))
                .ToListAsync();

            return new DataResponse<List<BrandResource>>
            {
                Data = resources,
                Message = "Lấy tất cả chi nhánh của phòng khám thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<BaseResponse> GetAllBrandsByClinicId(string clinicId)
        {
            var brands = await _context.Brands
                .Where(br => br.ClinicId == clinicId).ToListAsync();

            var resources = brands.Select(br => appMapping.MapToBrandResource(br)).ToList();

            return new DataResponse<List<BrandResource>>
            {
                Data = resources,
                Message = "Lấy tất cả chi nhánh của phòng khám thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<BaseResponse> UpdateBrand(int id, BrandRequest request)
        {
            var managerId = _contextAccessor?.HttpContext?.User.GetUserID();

            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == managerId)
                    ?? throw new NotFoundException("Thông tin người quản lí không tồn tại. Vui lòng liên hệ QTV để hỗ trợ");

            Clinic clinic = await _context.Clinics
                .SingleOrDefaultAsync(c => c.Id == manager.ClinicId)
                    ?? throw new NotFoundException("Thông tin phòng khám không tồn tại");

            Brand brand = await _context.Brands
                .SingleOrDefaultAsync(b => b.Id == id && b.ClinicId == manager.ClinicId)
                    ?? throw new NotFoundException("Không tìm thấy chi nhánh nào");

            brand.Name = request.Name;
            brand.Address = request.Address;
            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Cập nhật thông tin chi nhánh thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
