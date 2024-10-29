using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class SearchService : ISearchService
    {
        private readonly ApplicationDbContext _context;
        private readonly AppMapping appMapping;
        private readonly UserManager<User> userManager;

        public SearchService(ApplicationDbContext context, AppMapping appMapping, UserManager<User> userManager)
        {
            _context = context;
            this.appMapping = appMapping;
            this.userManager = userManager;
        }
        public async Task<BaseResponse> SearchData(string type, string query, string speciality)
        {
            var lowerKey = query.ToLower();
            var lowerSpeciality = speciality.ToLower();

            // Tạo các danh sách clinics và doctors rỗng ban đầu
            var clinics = new List<SearchResource>();
            var doctorOwners = new List<SearchResource>();

            // Kiểm tra giá trị của 'type' để quyết định lấy dữ liệu nào
            if (type == "all" || type == "clinic")
            {
                // Lấy danh sách phòng khám
                clinics = await _context.Clinics
                    .Include(c => c.Specializations)
                    .Where(c => c.Specializations.Any(s => s.Name.ToLower().Contains(lowerSpeciality))
                                && c.Name.ToLower().Contains(lowerKey))
                    .Select(c => new SearchResource
                    {
                        Data = appMapping.MapToClinicResource(c),
                        Type = "CLINIC"
                    })
                    .ToListAsync();
            }

            if (type == "all" || type == "doctor")
            {
                // Lấy danh sách bác sĩ
                var doctors = await _context.Doctors
                    .Include(d => d.User)
                    .Include(d => d.Specializations)
                    .Where(d => d.ClinicId == null
                                && d.Specializations.Any(s => s.Name.ToLower().Contains(lowerSpeciality))
                                && d.User.FullName.ToLower().Contains(lowerKey))
                    .ToListAsync();

                // Lọc ra các bác sĩ có vai trò DOCTOR_OWNER và chuyển đổi sang DoctorOwnerResource

                foreach (var doctor in doctors)
                {
                    if (await userManager.IsInRoleAsync(doctor.User, "DOCTOR_OWNER"))
                    {
                        var doctorOwner = await appMapping.MapToDoctorOwner(doctor);
                        doctorOwners.Add(new SearchResource
                        {
                            Data = doctorOwner,
                            Type = "DOCTOR"
                        });
                    }
                }
            }

            // Gộp dữ liệu clinics và doctors nếu type = 'all'
            var data = clinics.Concat(doctorOwners).ToList();

            // Trả về kết quả
            return new DataResponse<List<SearchResource>>
            {
                Data = data,
                Message = data.Any() ? "Lấy dữ liệu tìm kiếm thành công" : "Không tìm thấy kết quả",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

    }
}
