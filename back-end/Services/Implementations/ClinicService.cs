using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests;
using clinic_schedule.Core.Requests.Clinic;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Infrastructures.Cloudinary;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class ClinicService : IClinicService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUploadService _uploadService;
        private readonly AppMapping appMapping;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ClinicService(ApplicationDbContext context, IUploadService uploadService, AppMapping appMapping, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _uploadService = uploadService;
            this.appMapping = appMapping;
            _httpContextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> CreateClinic(ClinicRequest request)
        {
            var clinic = new Clinic();
            clinic.Id = Guid.NewGuid().ToString();
            clinic.Name = request.Name;
            clinic.Address = request.Address;

            if(request.Thumbnail != null)
            {
                var thumbnailUrl = await _uploadService.UploadAsync(request.Thumbnail);
                clinic.Thumbnail = thumbnailUrl;
            }

            var brand = new Brand()
            {
                Address = request.Address,
                Name = request.Name,
            };

            clinic.Brands ??= new List<Brand>();
            clinic.Brands.Add(brand);

            await _context.AddAsync(clinic);
            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Thêm phòng khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };

        }

        public async Task<BaseResponse> GetAllClinics()
        {
            var clinics = await _context.Clinics.ToArrayAsync();
            var resources = clinics.Select(c => appMapping.MapToClinicResource(c)).ToList();

            return new DataResponse<List<ClinicResource>>
            {
                Data = resources,
                Message = "Lấy tất cả phòng khám thành công",
                StatusCode=System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> GetClinicById(string id)
        {
            var clinic = await _context.Clinics
                .Include(c => c.Images)
                .Include(c => c.Specializations)
                .SingleOrDefaultAsync(c => c.Id == id)
                    ?? throw new AppException("Không tìm thấy phòng khám");

            var resource = appMapping.MapToClinicResource(clinic);
            return new DataResponse<ClinicResource>
            {
                Data = resource,
                Message = "Lấy thông tin phòng khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> GetClinicDetails()
        {
            var userId = _httpContextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(s => s.UserId == userId)
                    ?? throw new AppException("Vui lòng đăng nhập lại");

            var clinic = await _context.Clinics
                .Include(c => c.Images)
                .Include(c => c.Specializations)
                .SingleOrDefaultAsync(c => c.Id == manager.ClinicId)
                    ?? throw new AppException("Không tìm thấy phòng khám");

            var resource = appMapping.MapToClinicResource(clinic);
            return new DataResponse<ClinicResource>
            {
                Data = resource,
                Message = "Lấy thông tin phòng khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> SearchClinics(string keyword, string speciality)
        {
            var lowerKey = keyword.ToLower();
            var lowerSpeciality = speciality.ToLower();

            var clinics = await _context.Clinics
                .Include(c => c.Specializations)
                .Where(c =>
                    c.Specializations.Any(s => s.Name.ToLower().Contains(lowerSpeciality))
                    && c.Name.ToLower().Contains(lowerKey)
                )
                .Select(c => appMapping.MapToClinicResource(c))
                .ToListAsync();

            return new DataResponse<List<ClinicResource>>
            {
                Data = clinics,
                Message = "Lấy dữ liệu tìm kiếm phòng khám",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> UpdateBasicInformation(BasicInforClinicRequest request)
        {
            var userId = _httpContextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(s => s.UserId == userId)
                    ?? throw new AppException("Vui lòng đăng nhập lại");

            Clinic? clinic = await _context.Clinics
                .SingleOrDefaultAsync(s => s.Id == manager.ClinicId)
                     ?? throw new AppException("Vui lòng đăng nhập lại");

            if(request.Thumbnail != null)
            {
                var thumbnail = await _uploadService.UploadAsync(request.Thumbnail);
                clinic.Thumbnail = thumbnail;
            } else
            {
                if(request.IsRemoveThumbnail)
                {
                    clinic.Thumbnail = null;
                }
            }

            clinic.Address =  request.Address;
            clinic.Name = request.Name;

            clinic.Images ??= new List<ClinicImage>();
            var removeRange = clinic.Images
                .Where(x => request.RemoveImages.Contains(x.Url)).ToList();

            _context.ClinicImages.RemoveRange(removeRange);

            if(request.Images != null && request.Images.Any()) {
                
                var urls = await _uploadService.MultiUploadAsync(request.Images);


                foreach(var image in urls)
                {
                    var clinicImage = new ClinicImage {
                         Url = image,
                         ClinicId = clinic.Id
                    };

                    clinic.Images.Add(clinicImage);
                }
            }

            await _context.SaveChangesAsync();
            return new BaseResponse
            {
                StatusCode = System.Net.HttpStatusCode.NoContent,
                Message = "Cập nhật thông tin phòng khám thành công",
                Success = true
            };

        }

        public async Task<BaseResponse> UpdateIntroduction(IntroductionRequest request)
        {
            var userId = _httpContextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(s => s.UserId == userId)
                    ?? throw new AppException("Vui lòng đăng nhập lại");

            Clinic? clinic = await _context.Clinics
                .SingleOrDefaultAsync(s => s.Id == manager.ClinicId)
                     ?? throw new AppException("Vui lòng đăng nhập lại");

            clinic.IntroductionPlain = request.IntroductionPlain;
            clinic.IntroductionHtml = request.IntroductionHtml;

            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Cập nhật thông tin giới thiệu phòng khám thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.NoContent
            };
        }
    }
}
