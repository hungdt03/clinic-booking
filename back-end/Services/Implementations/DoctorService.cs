using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests;
using clinic_schedule.Core.Requests.Doctor;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Infrastructures.Cloudinary;
using clinic_schedule.Infrastructures.MailSender;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace clinic_schedule.Services.Implementations
{
    public class DoctorService : IDoctorService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly AppMapping appMapping;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUploadService uploadService;
        private readonly IMailService mailService;
        private readonly IConfiguration configuration;

        public DoctorService(ApplicationDbContext context, UserManager<User> userManager, AppMapping appMapping, IHttpContextAccessor httpContext, IUploadService uploadService, IMailService mailService, IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            this.appMapping = appMapping;
            _contextAccessor = httpContext;
            this.uploadService = uploadService;
            this.mailService = mailService;
            this.configuration = configuration;
        }

        public async Task<BaseResponse> CreateDoctorEmployee(CreateDoctorEmployeeRequest request)
        {
            var checkUser = await _userManager.FindByEmailAsync(request.Email);
            if (checkUser != null) throw new AppException("Địa chỉ email đã tồn tại");

            var userID = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                    .SingleOrDefaultAsync(s => s.UserId == userID);
            var splitEmail = request.Email.Split("@")[0];
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                UserName = splitEmail,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            
            var hashedPassword = _userManager.PasswordHasher.HashPassword(user, splitEmail);
            user.PasswordHash = hashedPassword;

            var createResult = await _userManager.CreateAsync(user);

            if (!createResult.Succeeded)
            {
                var error = createResult.Errors.FirstOrDefault().Description;
                if (error != null) throw new AppException($"Lỗi: {error}");
            }

            var assignRoleResult = await _userManager.AddToRoleAsync(user, "DOCTOR_EMPLOYEE");

            if (!assignRoleResult.Succeeded)
            {
                var error = createResult.Errors.FirstOrDefault().Description;
                if (error != null) throw new AppException($"Lỗi: {error}");
            }

            var doctor = new Doctor()
            {
                UserId = user.Id,
                ClinicId = manager.ClinicId,
            };

            var brand = await _context.Brands
                    .SingleOrDefaultAsync(b => b.Id == request.BrandId);

            if (brand != null)
            {
                doctor.BrandId = request.BrandId;
            } else
            {
                brand = await _context.Brands.OrderBy(s => s.Id).FirstOrDefaultAsync();
                doctor.BrandId = brand.Id;
            }

            var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            byte[] bytesToEncode = Encoding.UTF8.GetBytes(code);
            string base64EncodedString = Convert.ToBase64String(bytesToEncode);
            var url = $"{configuration["ClientURL"]}/user-login?email={request.Email}&activationToken={base64EncodedString}";
            var content = $"Here is link for the first login: {url}";
            var subject = "Login our system";
            mailService.SendMail(user.Email, content, subject);

            var existedProcess = await _context.BookingProcesses
                .SingleOrDefaultAsync(c => c.Name.Equals("DOCTOR") && c.ClinicId.Equals(manager.ClinicId));

            if (existedProcess == null)
            {
                var process = new BookingProcess()
                {
                    Name = "DOCTOR",
                    ClinicId = manager.ClinicId,
                    Active = true,
                };

                await _context.BookingProcesses.AddAsync(process);
            }
            else
            {
                existedProcess.Active = true;
            }

            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thêm bác sĩ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> CreateDoctorOwner(CreateDoctorOwnerRequest request)
        {
            var checkUser = await _userManager.FindByEmailAsync(request.Email);
            if (checkUser != null) throw new AppException("Địa chỉ email đã tồn tại");

            var splitEmail = request.Email.Split("@")[0];
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                UserName = splitEmail,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            var hashedPassword = _userManager.PasswordHasher.HashPassword(user, splitEmail);
            user.PasswordHash = hashedPassword;

            var createResult = await _userManager.CreateAsync(user);

            if (!createResult.Succeeded)
            {
                var error = createResult.Errors.FirstOrDefault().Description;
                if (error != null) throw new AppException($"Lỗi: {error}");
            }

            var assignRoleResult = await _userManager.AddToRoleAsync(user, "DOCTOR_OWNER");

            if (!assignRoleResult.Succeeded)
            {
                var error = createResult.Errors.FirstOrDefault().Description;
                if (error != null) throw new AppException($"Lỗi: {error}");
            }

            var doctor = new Doctor()
            {
                UserId = user.Id,
            };

            var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            byte[] bytesToEncode = Encoding.UTF8.GetBytes(code);
            string base64EncodedString = Convert.ToBase64String(bytesToEncode);
            var url = $"{configuration["ClientURL"]}/user-login?email={request.Email}&activationToken={base64EncodedString}";
            var content = $"Here is link for the first login: {url}";
            var subject = "Login our system";
            mailService.SendMail(user.Email, content, subject);

            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thêm bác sĩ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllDoctorByClinicId(string clinicId)
        {
            var doctors = await _context.Doctors
                .Include(d => d.User)
                .Where(d => d.ClinicId == clinicId)
                .ToListAsync();

            var resources = new List<DoctorOwner>();

            foreach(var doctor in doctors)
            {
                var owner = await appMapping.MapToDoctorOwner(doctor);
                resources.Add(owner);
            }

            return new DataResponse<List<DoctorOwner>>
            {
                Data = resources,
                Message = "Lấy tất cả bác sĩ của phòng khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllDoctorEmployee()
        {
            var userID = _contextAccessor.HttpContext.User.GetUserID();
            var isManager = _contextAccessor.HttpContext.User.IsManager();
            var isDoctorEmployee = _contextAccessor.HttpContext.User.IsDoctorEmployee();
            string clinicId = "";

            if(isManager)
            {
                var manager = await _context.Managers
                    .SingleOrDefaultAsync(s => s.UserId == userID);

                clinicId = manager.ClinicId;
            } else if(isDoctorEmployee)
            {
                var doctor = await _context.Doctors
                    .SingleOrDefaultAsync(s => s.UserId == userID);

                clinicId = doctor.ClinicId;
            }

            

            var doctors = await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Clinic)
                .Where(d => d.ClinicId == clinicId).ToListAsync();

            var resources = new List<DoctorEmployee>();
            foreach(var doctor in doctors)
            {
                var resource = await appMapping.MapToDoctorEmployee(doctor);
                resources.Add(resource);
            }

            return new DataResponse<List<DoctorEmployee>>
            {
                Data = resources,
                Message = "Lấy thông tin bác sĩ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };

        }

        public async Task<BaseResponse> GetAllDoctorEmployeesByBrandId(int brandId)
        {
            var doctors = await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Clinic)
                .Where(d => d.BrandId == brandId)
                .ToListAsync();

            var resources = new List<DoctorEmployee>();
            foreach (var doctor in doctors)
            {
                var resource = await appMapping.MapToDoctorEmployee(doctor);
                resources.Add(resource);
            }

            return new DataResponse<List<DoctorEmployee>>
            {
                Data = resources,
                Message = "Lấy thông tin bác sĩ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllDoctorOwners()
        {
            var users = await _context.Doctors
                .Include(d => d.User)
                .ToListAsync(); 

            var doctors = new List<DoctorOwner>();
            foreach (var doctor in users)
            {
                if (await _userManager.IsInRoleAsync(doctor.User, "DOCTOR_OWNER"))
                {
                    var doctorOwner = await appMapping.MapToDoctorOwner(doctor);
                    doctors.Add(doctorOwner);
                }
            }

            return new DataResponse<List<DoctorOwner>>
            {
                Data = doctors,
                Message = "Lấy thông tin tất cả bác sĩ thành công",
                Success = true,
                StatusCode= System.Net.HttpStatusCode.OK
            };
        }

        public async Task<BaseResponse> GetDoctorById(string doctorId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specializations)
                .Include(d => d.AwardsAndResearches)
                .Include(d => d.Educations)
                .Include(d => d.WorkExperiences)
                .SingleOrDefaultAsync(d => d.UserId.Equals(doctorId))
                ?? throw new NotFoundException("Không tìm thấy thông tin bác sĩ");

            var resource = await appMapping.MapToDoctorOwner(doctor);
            return new DataResponse<DoctorOwner>
            {
                Data = resource,
                Message = "Lấy thông tin bác sĩ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> GetDoctorDetails()
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specializations)
                .Include(d => d.AwardsAndResearches)
                .Include(d => d.Educations)
                .Include(d => d.WorkExperiences)
                .Include(d => d.DoctorImages)
                .SingleOrDefaultAsync(d => d.UserId.Equals(userId))
                ?? throw new NotFoundException("Không tìm thấy thông tin bác sĩ");

            var resource = await appMapping.MapToDoctorOwner(doctor);
            return new DataResponse<DoctorOwner>
            {
                Data = resource,
                Message = "Lấy thông tin bác sĩ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> SearchDoctorOwners(string keyword, string speciality)
        {
            var lowerKey = keyword.ToLower();

            var lowerSpeciality = speciality.ToLower();

            var users = await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specializations)
                .Where(d => d.ClinicId == null)
                .Where(c =>
                    c.Specializations.Any(s => s.Name.ToLower().Contains(lowerSpeciality))
                    && c.User.FullName.ToLower().Contains(lowerKey)
                )
                .ToListAsync();

            var doctors = new List<DoctorOwner>();
            foreach (var doctor in users)
            {
                if (await _userManager.IsInRoleAsync(doctor.User, "DOCTOR_OWNER"))
                {
                    var doctorOwner = await appMapping.MapToDoctorOwner(doctor);
                    doctors.Add(doctorOwner);
                }
            }

            return new DataResponse<List<DoctorOwner>>
            {
                Data = doctors,
                Message = "Lấy thông tin tìm kiếm thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        public async Task<BaseResponse> UpdateAwardAndResearches(AwardRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();

            Doctor? doctor = await _context.Doctors
                .Include(d => d.AwardsAndResearches)
                .SingleOrDefaultAsync(x => x.UserId == userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");

            doctor.AwardsAndResearches ??= new List<AwardsAndResearch>();
            var existingAwardDict = doctor.AwardsAndResearches.ToDictionary(e => e.Id);
            var removeRange = doctor.AwardsAndResearches
                .Where(x => x.DoctorId == userId && !request.AwardsAndResearches.Any(a => a.Id == x.Id))
                .ToList();

            foreach (var award in request.AwardsAndResearches)
            {
                if (award.Id.HasValue && award.Id.Value != 0 && existingAwardDict.TryGetValue(award.Id.Value, out var existedAward))
                {
                    existedAward.Year = award.Year;
                    existedAward.Content = award.Content;
                }
                else
                {
                    var newAward = new AwardsAndResearch
                    {
                        Year = award.Year,
                        Content = award.Content,
                        DoctorId = userId
                    };

                    doctor.AwardsAndResearches.Add(newAward);
                }
            }

            

            _context.AwardsAndResearches.RemoveRange(removeRange);

            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Cập nhật thông tin giải thưởng của bác sĩ thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.NoContent
            };
        }

     
        public async Task<BaseResponse> UpdateBasicInfomation(BasicInfoRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();

            var doctor = await _context.Doctors
                .Include(d => d.DoctorImages)
                .SingleOrDefaultAsync(x => x.UserId == userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");

            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new AppException("Người dùng không tồn tại");

            if (request.Thumbnail != null)
            {
                var thumbnail = await uploadService.UploadAsync(request.Thumbnail);
                user.Thumbnail = thumbnail;
            } else
            {
                if (request.IsRemoveThumbnail)
                {
                    user.Thumbnail = null;
                }
            }

            doctor.DoctorImages ??= new List<DoctorImage>();

            if(request.RemoveImages != null)
            {
                var removeImages = doctor.DoctorImages.
                    Where(img => request.RemoveImages.Any(s => s == img.Url))
                    .ToList();
                _context.DoctorImages.RemoveRange(removeImages);
            }
            
            if (request.Images != null && request.Images.Any())
            {
                var urls = await uploadService.MultiUploadAsync(request.Images);
                foreach (var image in urls)
                {
                    var doctorImage = new DoctorImage
                    {
                        Url = image,
                        DoctorId = doctor.UserId
                    };

                    doctor.DoctorImages.Add(doctorImage);
                }
            }

            doctor.Position = request.Position;
            doctor.AcademicTitle = request.AcademicTitle;
            doctor.Degree = request.Degree;
            doctor.Address = request.Address;
            doctor.ExperienceYears = request.ExperienceYears;
            doctor.CurrentWorkPlace = request.CurrentWorkPlace;

            user.FullName = request.Name;
            user.PhoneNumber = request.PhoneNumber;
            user.DateOfBirth = request.DateOfBirth;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new AppException("Cập nhật thông tin bác sĩ thất bại");
            }

           
            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Cập nhật thông tin bác sĩ thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.NoContent
            };
        }

        public async Task<BaseResponse> UpdateEducations(EducationRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();

            Doctor? doctor = await _context.Doctors
                .Include(d => d.Educations)
                .SingleOrDefaultAsync(x => x.UserId == userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");

            doctor.Educations ??= new List<Education>();
            var existingEducationsDict = doctor.Educations.ToDictionary(e => e.Id);
            var removeRange = doctor.Educations
               .Where(x => x.DoctorId == userId && !request.Educations.Any(a => a.Id == x.Id))
               .ToList();

            foreach (var education in request.Educations)
            {
                if (education.Id.HasValue && education.Id.Value != 0 && existingEducationsDict.TryGetValue(education.Id.Value, out var existedEducation))
                {
                    existedEducation.ToYear = education.ToYear;
                    existedEducation.FromYear = education.FromYear;
                    existedEducation.StudyPlace = education.StudyPlace;
                }
                else
                {
                    var newEducation = new Education
                    {
                        StudyPlace = education.StudyPlace,
                        FromYear = education.FromYear,
                        ToYear = education.ToYear,
                        DoctorId = userId
                    };

                    doctor.Educations.Add(newEducation);
                }
            }

           

            _context.Educations.RemoveRange(removeRange);

            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Cập nhật thông tin học vấn của bác sĩ thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.NoContent
            };
        }

        public async Task<BaseResponse> UpdateIntroduction(IntroductionRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            Doctor? doctor = await _context.Doctors
                .SingleOrDefaultAsync(x => x.UserId == userId)
                    ?? throw new AppException("Vui lòng đăng nhập lại");

            doctor.IntroductionPlain = request.IntroductionPlain;
            doctor.IntroductionHtml = request.IntroductionHtml;
            
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Cập nhật thông tin giới thiệu bác sĩ thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.NoContent
            };

        }

        public async Task<BaseResponse> UpdateWorkExperiences(WorkExperienceRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();

            Doctor? doctor = await _context.Doctors
                .Include(d => d.WorkExperiences)
                .SingleOrDefaultAsync(x => x.UserId == userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");

            doctor.WorkExperiences ??= new List<WorkExperience>();
            var existingWorkExperiences = doctor.WorkExperiences.ToDictionary(e => e.Id);
            var removeRange = doctor.WorkExperiences
               .Where(x => x.DoctorId == userId && !request.WorkExperiences.Any(a => a.Id == x.Id))
               .ToList();

            foreach (var workExperience in request.WorkExperiences)
            {
                if (workExperience.Id.HasValue && workExperience.Id.Value != 0 && existingWorkExperiences.TryGetValue(workExperience.Id.Value, out var existingWorkExperience))
                {
                    existingWorkExperience.ToYear = workExperience.ToYear;
                    existingWorkExperience.FromYear = workExperience.FromYear;
                    existingWorkExperience.WorkPlace = workExperience.WorkPlace;
                }
                else
                {
                    var newWorkExperience = new WorkExperience
                    {
                        WorkPlace = workExperience.WorkPlace,
                        FromYear = workExperience.FromYear,
                        ToYear = workExperience.ToYear,
                        DoctorId = userId
                    };

                    doctor.WorkExperiences.Add(newWorkExperience);
                }
            }

            

            _context.WorkExperiences.RemoveRange(removeRange);

            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Cập nhật thông tin kinh nghiệm việc làm của bác sĩ thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.NoContent
            };
        }
    }
}
