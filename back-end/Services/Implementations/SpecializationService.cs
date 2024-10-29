using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.Specialization;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Infrastructures.Cloudinary;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace clinic_schedule.Services.Implementations
{
    public class SpecializationService : ISpecializationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUploadService uploadService;
        private readonly AppMapping appMapping;

        public SpecializationService(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, AppMapping appMapping, IUploadService uploadService)
        {
            _context = context;
            _contextAccessor = httpContextAccessor;
            this.appMapping = appMapping;
            this.uploadService = uploadService;
        }

        public async Task<BaseResponse> AddSpecializationsForClinic(AddSpecializationRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == userId);

            var clinic = await _context.Clinics
                .Include(c => c.Specializations)
                .SingleOrDefaultAsync(c => c.Id.Equals(manager.ClinicId))
                    ?? throw new NotFoundException("Không tìm thấy phòng khám");

            clinic.Specializations ??= new List<Specialization>();

            foreach(int specializationId in request.SpecializationIds)
            {
                var specilization = await _context.Specializations
                    .SingleOrDefaultAsync(s => s.Id == specializationId)
                        ?? throw new NotFoundException($"Không tìm thấy chuyên khoa có ID = {specializationId}");

                if (clinic.Specializations.Any(s => s.Id == specializationId))
                    continue;

                clinic.Specializations.Add(specilization);
            }

            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thêm chuyên khoa cho phòng khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> AddSpecializationsForDoctor(AddSpecializationRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var doctor = await _context.Doctors
                .Include(c => c.Specializations)
                .SingleOrDefaultAsync(c => c.UserId.Equals(userId) && c.ClinicId == null)
                    ?? throw new NotFoundException("Không tìm thấy bác sĩ");

            doctor.Specializations ??= new List<Specialization>();

            foreach (int specializationId in request.SpecializationIds)
            {
                var specilization = await _context.Specializations
                    .SingleOrDefaultAsync(s => s.Id == specializationId)
                        ?? throw new NotFoundException($"Không tìm thấy chuyên khoa có ID = {specializationId}");

                if (doctor.Specializations.Any(s => s.Id == specializationId))
                    continue; 

                doctor.Specializations.Add(specilization);
            }

            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thêm chuyên khoa cho bác sĩ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> CreateSpecialization(SpecializationRequest request)
        {
            
            var specialization = new Specialization()
            {
                Name = request.Name,
                Description = request.Description,
            };

            if (request.Thumbnail != null)
            {
                var thumbnailUrl = await uploadService.UploadAsync(request.Thumbnail);
                specialization.Thumbnail = thumbnailUrl;
            }

            await _context.AddAsync(specialization);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Thêm chuyên khoa thành công",
                Success = true
            };
        }

        public async Task<BaseResponse> DeleteSpecialization(int id)
        {
            var speciality = await _context.Specializations
                .Include(s => s.Doctors)
                .Include(s => s.Clinics)
                .SingleOrDefaultAsync(s => s.Id == id)
                    ?? throw new AppException("Không tìm thấy chuyên khoa");

            if (
                (speciality.Doctors != null && speciality.Doctors.Count > 0)
                || (speciality.Clinics != null && speciality.Clinics.Count > 0)
            )
                throw new AppException("Không thể xóa chuyên khoa");

            _context.Specializations.Remove(speciality);
            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Success = true,
                Message = "Xóa chuyên khoa thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        public async Task<BaseResponse> DeleteSpecializationClinic(int id)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(m => m.UserId == userId);

            var clinic = await _context.Clinics
                .Include(c => c.Specializations)
                .SingleOrDefaultAsync(c => c.Id.Equals(manager.ClinicId))
                    ?? throw new NotFoundException("Không tìm thấy phòng khám");

            var specialization = await _context.Specializations
                .SingleOrDefaultAsync(s => s.Id == id)
                    ?? throw new AppException("Không tìm thấy chuyên khoa");

            if (clinic.Specializations.Count > 0)
            {
                clinic.Specializations.Remove(specialization);
                await _context.SaveChangesAsync();
            }

            return new BaseResponse()
            {
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Xóa chuyên khoa thành công"
            };
        }

        public async Task<BaseResponse> DeleteSpecializationDoctor(int id)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var doctor = await _context.Doctors
                .Include(c => c.Specializations)
                .SingleOrDefaultAsync(c => c.UserId.Equals(userId) && c.ClinicId == null)
                    ?? throw new NotFoundException("Không tìm thấy bác sĩ");

            var specialization = await _context.Specializations
                .SingleOrDefaultAsync(s => s.Id == id)
                    ?? throw new AppException("Không tìm thấy chuyên khoa");

            if(doctor.Specializations.Count > 0)
            {
                doctor.Specializations.Remove(specialization);
                await _context.SaveChangesAsync();
            }

            return new BaseResponse()
            {
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Xóa chuyên khoa thành công"
            };
        }

        public async Task<BaseResponse> GetAllSpecializations()
        {
            var specializations = await _context.Specializations
                .Select(s => appMapping.MapToSpecializationResource(s))
                .ToListAsync();

            return new DataResponse<List<SpecializationResource>>
            {
                Data = specializations,
                Message = "Lấy tất cả chuyên khoa thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };

        }

        public async Task<BaseResponse> GetAllSpecializationsByClinicId(string id)
        {
            var specializations = await _context.Specializations
                    .Include(s => s.Clinics)
                    .Where(sp => sp.Clinics.Any(s => s.Id.Equals(id))).ToListAsync();

            var resources = specializations.Select(sp => appMapping.MapToSpecializationResource(sp)).ToList();
            return new DataResponse<List<SpecializationResource>>
            {
                Data = resources,
                Message = "Lấy tất cả thông tin chuyên khoa thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllSpecializationsByDoctorId(string id)
        {
            var specializations = await _context.Specializations
                    .Include(s => s.Doctors)
                    .Where(sp => sp.Doctors.Any(s => s.UserId.Equals(id))).ToListAsync();
          
            var resources = specializations.Select(sp => appMapping.MapToSpecializationResource(sp)).ToList();
            return new DataResponse<List<SpecializationResource>>
            {
                Data = resources,
                Message = "Lấy tất cả thông tin chuyên khoa thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }
    }
}
