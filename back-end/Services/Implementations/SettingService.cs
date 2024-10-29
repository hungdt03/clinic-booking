using clinic_schedule.Core.Constants;
using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.Setting;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace clinic_schedule.Services.Implementations
{
    public class SettingService : ISettingService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly AppMapping appMapping;
        
        public SettingService(ApplicationDbContext context, IHttpContextAccessor contextAccessor, AppMapping appMapping)
        {
            _context = context;
            _contextAccessor = contextAccessor;
            this.appMapping = appMapping;
        }

        public async Task<BaseResponse> CreateExceptionDateForClinic(ExceptionDateRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers.SingleOrDefaultAsync(m => m.UserId == userId);

            var exceptionDate = new ExceptionDate
            {
                FromDate = request.FromDate, 
                ToDate = request.ToDate, 
                IsRepeatAnnually = request.IsRepeatAnnually,
                Reason = request.Reason,
                ClinicId = manager.ClinicId,
                IsFullDay = true,
                Type = request.Type
            };

            if(request.Type == ExceptionDateType.ONE_DAY)
            {
                var existingOneDayException = await _context.ExceptionDates
                    .Where(e => e.ClinicId == manager.ClinicId)
                    .Where(e => e.FromDate.HasValue && e.ToDate.HasValue)
                    .Where(e => request.FromDate.HasValue && e.FromDate.Value.Date == request.FromDate.Value.Date
                        && request.ToDate.HasValue && e.ToDate.Value.Date == request.ToDate.Value.Date)
                    .FirstOrDefaultAsync();

                if (existingOneDayException != null)
                    throw new AppException("Đã tồn tại ngày nghỉ cho ngày này.");
              
            }
            else if (request.Type == ExceptionDateType.MORE_THAN_ONE_DAY)
            {
                // Bước 1: Kiểm tra xem khoảng thời gian đã có ngày nghỉ trùng với các ngày này cho phòng khám chưa
                var existingMultiDayException = await _context.ExceptionDates
                    .Where(e => e.ClinicId == manager.ClinicId)
                    .Where(e =>
                        (request.FromDate >= e.FromDate && request.FromDate <= e.ToDate) || // Ngày bắt đầu nằm trong khoảng
                        (request.ToDate >= e.FromDate && request.ToDate <= e.ToDate) || // Ngày kết thúc nằm trong khoảng
                        (request.FromDate <= e.FromDate && request.ToDate >= e.ToDate)) // Khoảng ngày bao trùm hoàn toàn khoảng đã tồn tại
                    .FirstOrDefaultAsync();

                // Bước 2: Nếu đã có dữ liệu tương tự, trả về lỗi
                if (existingMultiDayException != null)
                    throw new AppException("Đã tồn tại ngày nghỉ cho khoảng thời gian này.");

            }
            else if (request.Type == ExceptionDateType.REPEAT_BY_WEEK && request.WeekDayIds != null && request.WeekDayIds.Any())
            {
                var existingException = await _context.ExceptionDates
                    .Include(e => e.WeekDayExceptions)
                    .Where(e => e.ClinicId == manager.ClinicId && e.Type == ExceptionDateType.REPEAT_BY_WEEK)
                    .Where(e => e.WeekDayExceptions.Any(w => request.WeekDayIds.Contains(w.Id)))
                    .FirstOrDefaultAsync();

                if (existingException != null)
                    throw new AppException("Đã tồn tại ngày nghỉ lặp lại cho tuần này.");

                var weekDayExceptions = await _context.WeekDayExceptions
                    .Where(w => request.WeekDayIds.Contains(w.DayOfWeek))
                    .ToListAsync();

                exceptionDate.WeekDayExceptions = weekDayExceptions;
            }
            else if (request.Type == ExceptionDateType.SOME_SHIFTS && request.UnavailableShiftIds != null && request.UnavailableShiftIds.Any())
            {
                var existingShiftException = await _context.ExceptionDates
                    .Include(e => e.UnavailableShifts)
                    .Where(e => e.ClinicId == manager.ClinicId)
                    .Where(e => e.FromDate.HasValue && e.ToDate.HasValue)
                    .Where(e => request.FromDate.HasValue && e.FromDate.Value.Date == request.FromDate.Value.Date
                        && request.ToDate.HasValue && e.ToDate.Value.Date == request.ToDate.Value.Date)
                    .Where(e => e.UnavailableShifts.Any(s => request.UnavailableShiftIds.Contains(s.Id)))
                    .FirstOrDefaultAsync();

                if (existingShiftException != null)
                    throw new AppException("Đã tồn tại ngày nghỉ với các ca làm việc đã chọn");

                var shifts = await _context.Shifts
                    .Where(s => request.UnavailableShiftIds.Contains(s.Id))
                    .ToListAsync();

                exceptionDate.IsFullDay = false;
                exceptionDate.UnavailableShifts = shifts;
            }

            await _context.ExceptionDates.AddAsync(exceptionDate);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thiết lập ngày nghỉ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> CreateExceptionDateForDoctor(ExceptionDateRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();

            var exceptionDate = new ExceptionDate
            {
                FromDate = request.FromDate,
                ToDate = request.ToDate,
                IsRepeatAnnually = request.IsRepeatAnnually,
                Reason = request.Reason,
                DoctorId = userId,
                IsFullDay = true,
                Type = request.Type
            };

            if (request.Type == ExceptionDateType.ONE_DAY)
            {
                var existingOneDayException = await _context.ExceptionDates
                    .Where(e => e.DoctorId == userId)
                    .Where(e => e.FromDate.HasValue && e.ToDate.HasValue)
                    .Where(e => request.FromDate.HasValue && e.FromDate.Value.Date == request.FromDate.Value.Date
                        && request.ToDate.HasValue && e.ToDate.Value.Date == request.ToDate.Value.Date)
                    .FirstOrDefaultAsync();

                if (existingOneDayException != null)
                    throw new AppException("Đã tồn tại ngày nghỉ cho ngày này.");

            }
            else if (request.Type == ExceptionDateType.MORE_THAN_ONE_DAY)
            {
                // Bước 1: Kiểm tra xem khoảng thời gian đã có ngày nghỉ trùng với các ngày này cho phòng khám chưa
                var existingMultiDayException = await _context.ExceptionDates
                    .Where(e => e.DoctorId == userId)
                    .Where(e =>
                        (request.FromDate >= e.FromDate && request.FromDate <= e.ToDate) || // Ngày bắt đầu nằm trong khoảng
                        (request.ToDate >= e.FromDate && request.ToDate <= e.ToDate) || // Ngày kết thúc nằm trong khoảng
                        (request.FromDate <= e.FromDate && request.ToDate >= e.ToDate)) // Khoảng ngày bao trùm hoàn toàn khoảng đã tồn tại
                    .FirstOrDefaultAsync();

                // Bước 2: Nếu đã có dữ liệu tương tự, trả về lỗi
                if (existingMultiDayException != null)
                    throw new AppException("Đã tồn tại ngày nghỉ cho khoảng thời gian này.");

            }
            else if (request.Type == ExceptionDateType.REPEAT_BY_WEEK && request.WeekDayIds != null && request.WeekDayIds.Any())
            {
                var existingException = await _context.ExceptionDates
                    .Include(e => e.WeekDayExceptions)
                    .Where(e => e.DoctorId == userId && e.Type == ExceptionDateType.REPEAT_BY_WEEK)
                    .Where(e => e.WeekDayExceptions.Any(w => request.WeekDayIds.Contains(w.Id)))
                    .FirstOrDefaultAsync();

                if (existingException != null)
                    throw new AppException("Đã tồn tại ngày nghỉ lặp lại cho tuần này.");

                var weekDayExceptions = await _context.WeekDayExceptions
                    .Where(w => request.WeekDayIds.Contains(w.DayOfWeek))
                    .ToListAsync();

                exceptionDate.WeekDayExceptions = weekDayExceptions;
            }
            else if (request.Type == ExceptionDateType.SOME_SHIFTS && request.UnavailableShiftIds != null && request.UnavailableShiftIds.Any())
            {
                var existingShiftException = await _context.ExceptionDates
                    .Include(e => e.UnavailableShifts)
                    .Where(e => e.DoctorId == userId)
                    .Where(e => e.FromDate.HasValue && e.ToDate.HasValue)
                    .Where(e => request.FromDate.HasValue && e.FromDate.Value.Date == request.FromDate.Value.Date
                        && request.ToDate.HasValue && e.ToDate.Value.Date == request.ToDate.Value.Date)
                    .Where(e => e.UnavailableShifts.Any(s => request.UnavailableShiftIds.Contains(s.Id)))
                    .FirstOrDefaultAsync();

                if (existingShiftException != null)
                    throw new AppException("Đã tồn tại ngày nghỉ với các ca làm việc đã chọn");

                var shifts = await _context.Shifts
                    .Where(s => request.UnavailableShiftIds.Contains(s.Id))
                    .ToListAsync();

                exceptionDate.IsFullDay = false;
                exceptionDate.UnavailableShifts = shifts;
            }

            await _context.ExceptionDates.AddAsync(exceptionDate);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thiết lập ngày nghỉ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> DeleteExceptionDayClinicById(int id)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers.SingleOrDefaultAsync(m => m.UserId == userId);
            var exceptionDate = await _context.ExceptionDates
                .Include(s => s.WeekDayExceptions)
                .SingleOrDefaultAsync(ex => ex.Id == id && ex.ClinicId == manager.ClinicId) ?? throw new AppException("Không tìm thấy dữ liệu cần xóa");

            _context.ExceptionDates.Remove(exceptionDate);
            int rows = await _context.SaveChangesAsync();

            if (rows == 0) throw new AppException("Xóa dữ liệu ngày nghỉ thất bại");

            return new BaseResponse
            {
                StatusCode = System.Net.HttpStatusCode.NoContent,
                Message = "Xóa dữ liệu ngày nghỉ thành công",
                Success = true,
            };
            
        }

        public async Task<BaseResponse> DeleteExceptionDayDoctorById(int id)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var exceptionDate = await _context.ExceptionDates
                .Include(s => s.WeekDayExceptions)
                .SingleOrDefaultAsync(ex => ex.Id == id && ex.DoctorId == userId) ?? throw new AppException("Không tìm thấy dữ liệu cần xóa");

            if (exceptionDate.WeekDayExceptions != null && exceptionDate.WeekDayExceptions.Count > 0)
            {
                _context.WeekDayExceptions.RemoveRange(exceptionDate.WeekDayExceptions);
            }

            _context.ExceptionDates.Remove(exceptionDate);
            int rows = await _context.SaveChangesAsync();

            if (rows == 0) throw new AppException("Xóa dữ liệu ngày nghỉ thất bại");

            return new BaseResponse
            {
                StatusCode = System.Net.HttpStatusCode.NoContent,
                Message = "Xóa dữ liệu ngày nghỉ thành công",
                Success = true,
            };

        }


        public async Task<BaseResponse> GetAllExceptionDatesByClinic()
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers.SingleOrDefaultAsync(m => m.UserId == userId);

            var exceptionDates = await _context.ExceptionDates
                .Include(s => s.UnavailableShifts)
                .Include(s => s.WeekDayExceptions)
                .Where(s => s.ClinicId == manager.ClinicId)
                .Select(s => appMapping.MapToExceptionDate(s))
                .ToListAsync();

            return new DataResponse<List<ExceptionDateResource>>
            {
                Data = exceptionDates,
                Message = "Lấy danh sách các ngày nghỉ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }

        public async Task<BaseResponse> GetAllExceptionDatesByDoctor()
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var exceptionDates = await _context.ExceptionDates
                .Include(s => s.UnavailableShifts)
                .Include(s => s.WeekDayExceptions)
                .Where(s => s.DoctorId == userId)
                .Select(s => appMapping.MapToExceptionDate(s))
                .ToListAsync();

            return new DataResponse<List<ExceptionDateResource>>
            {
                Data = exceptionDates,
                Message = "Lấy danh sách các ngày nghỉ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };

        }

        public Task<BaseResponse> GetAllWeekDays()
        {
            throw new NotImplementedException();
        }

        public async Task<BaseResponse> GetNoteClinic()
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers.SingleOrDefaultAsync(m => m.UserId == userId);

            var note = await _context.Notes
                .SingleOrDefaultAsync(n => n.ClinicId == manager.ClinicId)
                    ?? throw new AppException("Chưa có ghi chú nào");

            return new DataResponse<NoteResource>
            {
                Data = appMapping.MapToNoteResource(note),
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Lấy ghi chú thành công"
            };
        }

        public async Task<BaseResponse> GetNoteClinicByClinicId(string clinicId)
        {
            var note = await _context.Notes
               .SingleOrDefaultAsync(n => n.ClinicId == clinicId)
                   ?? throw new AppException("Chưa có ghi chú nào");

            return new DataResponse<NoteResource>
            {
                Data = appMapping.MapToNoteResource(note),
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Lấy ghi chú thành công"
            };
        }

        public async Task<BaseResponse> GetNoteDoctor()
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();

            var note = await _context.Notes
                .SingleOrDefaultAsync(n => n.DoctorId == userId)
                    ?? throw new AppException("Chưa có ghi chú nào");

            return new DataResponse<NoteResource>
            {
                Data = appMapping.MapToNoteResource(note),
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Lấy ghi chú thành công"
            };
        }

        public async Task<BaseResponse> GetNoteDoctorByDoctorId(string doctorId)
        {
            var note = await _context.Notes
                .SingleOrDefaultAsync(n => n.DoctorId == doctorId)
                    ?? throw new AppException("Chưa có ghi chú nào");

            return new DataResponse<NoteResource>
            {
                Data = appMapping.MapToNoteResource(note),
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
                Message = "Lấy ghi chú thành công"
            };
        }

        public async Task<BaseResponse> SaveNoteClinic(NoteRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
            var manager = await _context.Managers
                .SingleOrDefaultAsync(c => c.UserId == userId)
                    ?? throw new AppException("Vui lòng đăng nhập lại");

            var existedNote = await _context.Notes
                .SingleOrDefaultAsync(n => n.ClinicId == manager.ClinicId);

            if (existedNote != null)
            {
                existedNote.Content = request.Note;
            } else
            {
                existedNote = new Note()
                {
                    Content = request.Note,
                    ClinicId = manager.ClinicId,
                };

                await _context.Notes.AddAsync(existedNote);
            }

            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Cập nhật ghi chú thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
           
        }

        public async Task<BaseResponse> SaveNoteDoctor(NoteRequest request)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserID();
           
            var existedNote = await _context.Notes
                .SingleOrDefaultAsync(n => n.DoctorId == userId);

            if (existedNote != null)
            {
                existedNote.Content = request.Note;
            }
            else
            {
                existedNote = new Note()
                {
                    Content = request.Note,
                    DoctorId = userId,
                };

                await _context.Notes.AddAsync(existedNote);
            }

            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Message = "Cập nhật ghi chú thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };

        }
    }
}
