using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class GroupService : IGroupService
    {
        private readonly ApplicationDbContext dbContext;
        private readonly AppMapping appMapping;

        public GroupService(ApplicationDbContext dbContext, AppMapping appMapping)
        {
            this.dbContext = dbContext;
            this.appMapping = appMapping;
        }

        public async Task<BaseResponse> GetAllGroupsByLoggedInUser(string userId)
        {
            var groups = await dbContext.Groups
                .Include(s => s.Clinic)
                .Include(s => s.Message)
                .Include(s => s.FirstUser)
                .Include(s => s.LastUser)
                .Where(gr => gr.FirstUserId == userId || gr.LastUserId == userId)
                .OrderByDescending(s => s.Message.SendAt)
                .ToListAsync();

            var resources = new List<GroupResource>();
            foreach (var group in groups)
            {
                var resource = await appMapping.MapToGroupResource(group);
                resources.Add(resource);
            }

            return new DataResponse<List<GroupResource>>
            {
                Data = resources,
                Message = "Lấy danh sách liên hệ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllGroupsByPatient(string userId)
        {
            var groups = await dbContext.Groups
                .Include(s => s.Clinic)
                .Include(s => s.Message)
                .Include(s => s.FirstUser)
                .Include(s => s.LastUser)
                .Where(gr => gr.FirstUserId == userId || gr.LastUserId == userId).ToListAsync();

            var resources = new List<GroupResource>();
            foreach (var group in groups)
            {
                var resource = await appMapping.MapToGroupResource(group);
                resources.Add(resource);
            }

            return new DataResponse<List<GroupResource>>
            {
                Data = resources,
                Message = "Lấy danh sách liên hệ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<ICollection<Group>> GetAllGroupsByUserId(string userId)
        {
            var groups = await dbContext.Groups
                .Include(s => s.Message)
                .Where(gr => gr.FirstUserId == userId || gr.LastUserId == userId).ToListAsync();

            return groups;
        }

        public async Task<Group?> GetGroupByName(string groupName)
        {
            return await dbContext.Groups
                .Include(s => s.Message)
                .SingleOrDefaultAsync(s => s.GroupName.Equals(groupName));
        }
    }
}
