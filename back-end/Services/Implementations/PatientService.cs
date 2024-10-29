using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.Patient;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly AppMapping appMapping;

        public PatientService(ApplicationDbContext context, IHttpContextAccessor contextAccessor, AppMapping appMapping)
        {
            _context = context;
            _contextAccessor = contextAccessor;
            this.appMapping = appMapping;
        }

        public async Task<BaseResponse> CreateProfile(ProfileRequest request)
        {
            var patientId = _contextAccessor.HttpContext.User.GetUserID();

            var checkProfile = await _context.Profiles
                .AnyAsync(s => s.IdentityCard == request.IdentityCard && s.PatientId == patientId);

            if (checkProfile) throw new AppException("CCCD này đã tồn tại");

            Profile profile = new Profile();
            profile.Id = Guid.NewGuid().ToString();
            profile.IdentityCard = request.IdentityCard;
            profile.PatientId = patientId;
            profile.PhoneNumber = request.PhoneNumber;
            profile.Email = request.Email;
            profile.EthnicGroup = request.EthnicGroup;
            profile.Address = request.Address;
            profile.Name = request.Name;
            profile.Gender = request.Gender;
            profile.Relationship = request.Relationship;
            profile.DateOfBirth = request.DateOfBirth;
            profile.Major = request.Major;
            profile.PrimaryProfile = false;

            await _context.Profiles.AddAsync(profile);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thêm hồ sơ mới thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> EditProfile(string profileId, ProfileRequest request)
        {
            var profile = await _context.Profiles
                .SingleOrDefaultAsync(p => p.Id == profileId)
                    ?? throw new AppException("Không tìm thấy thông tin hồ sơ");

            profile.IdentityCard = request.IdentityCard;
            profile.PhoneNumber = request.PhoneNumber;
            profile.Email = request.Email;
            profile.EthnicGroup = request.EthnicGroup;
            profile.Address = request.Address;
            profile.Name = request.Name;
            profile.Gender = request.Gender;
            profile.Relationship = request.Relationship;
            profile.DateOfBirth = request.DateOfBirth;
            profile.Major = request.Major;

            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Cập nhật thông tin hồ sơ thành công",
                StatusCode = System.Net.HttpStatusCode.NoContent,
                Success = true,
            };

        }

        public async Task<BaseResponse> GetAllProfilesByPatient()
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();

            var profiles = await _context.Profiles.Where(p => p.PatientId.Equals(userId))
                .Select(s => appMapping.MapToProfileResource(s))
                .ToListAsync();

            return new DataResponse<List<ProfileResource>>
            {
                Data = profiles,
                Message = "Lấy thông tin hồ sơ bệnh nhân thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
