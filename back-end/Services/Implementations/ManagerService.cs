using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.Manager;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Infrastructures.MailSender;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace clinic_schedule.Services.Implementations
{
    public class ManagerService : IManagerService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> userManager;
        private readonly AppMapping appMapping;
        private readonly IConfiguration _configuration;
        private readonly IMailService mailService;

        public ManagerService(ApplicationDbContext context, UserManager<User> userManager, AppMapping appMapping, IConfiguration configuration, IMailService mailService)
        {
            _context = context;
            this.userManager = userManager;
            this.appMapping = appMapping;
            _configuration = configuration;
            this.mailService = mailService;
        }

        public async Task<BaseResponse> CreateManager(CreateManagerRequest request)
        {
            var clinic = await _context.Clinics
                .Include(c => c.Manager)
                .SingleOrDefaultAsync(c => c.Id.Equals(request.ClinicId))
                    ?? throw new NotFoundException("Phòng khám không tồn tại");

            if (clinic.Manager != null)
                throw new AppException("Phòng khám này đã tồn tại người quản lí");

            var splitEmails = request.Email.Split("@")[0];
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                UserName = splitEmails, 
                CreatedAt = DateTime.Now,  
                UpdatedAt = DateTime.Now,
                IsChangedPassword = false,
                IsActivated = false,
            };

            var hashedPassword = userManager.PasswordHasher.HashPassword(user, splitEmails);
            user.PasswordHash = hashedPassword;

            var createResult = await userManager.CreateAsync(user);

            if (!createResult.Succeeded)
            {
                var error = createResult.Errors.FirstOrDefault().Description;
                if(error != null) throw new AppException($"Lỗi: {error}");
            }

            var assignRoleResult = await userManager.AddToRoleAsync(user, "MANAGER");

            if (!assignRoleResult.Succeeded)
            {
                var error = createResult.Errors.FirstOrDefault().Description;
                if (error != null) throw new AppException($"Lỗi: {error}");
            }

            var manager = new Manager()
            {
                ClinicId = request.ClinicId,
                UserId = user.Id,
            };

            var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
            byte[] bytesToEncode = Encoding.UTF8.GetBytes(code);
            string base64EncodedString = Convert.ToBase64String(bytesToEncode);
            var url = $"{_configuration["ClientURL"]}/user-login?email={request.Email}&activationToken={base64EncodedString}";
            var content = $"Here is link for the first login: {url}";
            var subject = "Login our system";
            mailService.SendMail(user.Email, content, subject);

            await _context.Managers.AddAsync(manager);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thêm người quản lí thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllManagers()
        {
            var managers = new List<ManagerResource>();

            var managerList = await _context.Managers
                .Include(m => m.User)
                .Include(m => m.Clinic)
                .ToListAsync();  

            foreach (var item in managerList)
            {
                var resource = await appMapping.MapToManagerResource(item);
                managers.Add(resource);
            }

            return new DataResponse<List<ManagerResource>>()
            {
                Data = managers,
                Message = "Lấy danh sách người quản lí thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };

        }
    }
}
