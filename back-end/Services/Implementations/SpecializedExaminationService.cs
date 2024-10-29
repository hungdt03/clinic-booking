using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.SpecializedExamination;
using clinic_schedule.Core.Response;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class SpecializedExaminationService : ISpecializedExaminationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly AppMapping appMapping;

        public SpecializedExaminationService(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, AppMapping appMapping)
        {
            _context = context;
            _contextAccessor = httpContextAccessor;
            this.appMapping = appMapping;
        }

        public async Task<BaseResponse> CreateSpecializedExamination(SpecializedExaminationRequest request)
        {
            bool isDoctorOwner = _contextAccessor.HttpContext.User.IsDoctorOwner();
            bool isManagerClinic = _contextAccessor.HttpContext.User.IsManager();

            var specializedExamination = new SpecializedExamination()
            {
                Name = request.Name,
            };

            if (isDoctorOwner)
            {
                specializedExamination.DoctorId = _contextAccessor.HttpContext?.User.GetUserID();
            }
            else if (isManagerClinic)
            {
                var managerId = _contextAccessor.HttpContext?.User.GetUserID();
                var manager = await _context.Managers.FirstOrDefaultAsync(x => x.UserId.Equals(managerId))
                    ?? throw new NoAccessException("Bạn không có quyền thêm chuyên khám!");

                specializedExamination.ClinicId = manager.ClinicId;
            }

            await _context.SpecializedExaminations.AddAsync(specializedExamination);
            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Thêm chuyên khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
            
        }

        public async Task<BaseResponse> DeleteSpecializedExaminationClinic(int id)
        {
            var specializedExamination = await _context.SpecializedExaminations
                .SingleOrDefaultAsync(x => x.Id == id)
                    ?? throw new AppException("Không tìm thấy chuyên khám");

            _context.SpecializedExaminations.Remove(specializedExamination);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Success = true,
                Message = "Xóa chuyên khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        public async Task<BaseResponse> DeleteSpecializedExaminationDoctor(int id)
        {
            var specializedExamination = await _context.SpecializedExaminations
                .SingleOrDefaultAsync(x => x.Id == id)
                    ?? throw new AppException("Không tìm thấy chuyên khám");

            _context.SpecializedExaminations.Remove(specializedExamination);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Success = true,
                Message = "Xóa chuyên khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        public async Task<BaseResponse> GetAllSpecializedExaminationByClinicId([FromRoute] string clinicId)
        {
            var specializedExaminations = await _context.SpecializedExaminations
                .Where(s => s.ClinicId == clinicId).ToListAsync();

            var resources = specializedExaminations.Select(a => appMapping.MapToSpecializedExaminationResource(a)).ToList();

            return new BaseResponse
            {
                Message = "Lấy tất cả các chuyên khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
                
        }

        public async Task<BaseResponse> UpdateSpecializedExamination(int id, SpecializedExaminationRequest request)
        {
            bool isDoctorOwner = _contextAccessor.HttpContext.User.IsDoctorOwner();
            bool isManagerClinic = _contextAccessor.HttpContext.User.IsManager();

            var specializedExamination = await _context.SpecializedExaminations
                .SingleOrDefaultAsync(s => s.Id == id)
                    ?? throw new NotFoundException("Không tìm thấy chuyên khám");

            if ((specializedExamination.ClinicId == null && isDoctorOwner) || (specializedExamination.DoctorId == null && isManagerClinic))
                throw new NoAccessException("Bạn không có quyền cập nhật chuyên khám này");

            specializedExamination.Name = request.Name;

            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Cập nhật chuyên khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }
    }
}
