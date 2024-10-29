using clinic_schedule.Core.Constants;
using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.Shift;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace clinic_schedule.Services.Implementations
{
    public class ShiftService : IShiftService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly AppMapping appMapping;

        public ShiftService(ApplicationDbContext context, IHttpContextAccessor contextAccessor, AppMapping appMapping, UserManager<User> userManager)
        {
            _context = context;
            _contextAccessor = contextAccessor;
            this.appMapping = appMapping;
            _userManager = userManager;
        }

        private string GetShiftType(TimeSpan startTime, TimeSpan endTime)
        {
            var morningStart = new TimeSpan(7, 0, 0); 
            var morningEnd = new TimeSpan(12, 0, 0);   
            var afternoonEnd = new TimeSpan(18, 0, 0);

            if (startTime >= morningStart && endTime <= morningEnd)
            {
                return ShiftConstants.SHIFT_MORNING;
            }
            else if (startTime >= morningEnd && endTime <= afternoonEnd)
            {
                return ShiftConstants.SHIFT_AFTERNOON;
            }
            else if (startTime >= afternoonEnd)
            {
                return ShiftConstants.SHIFT_EVENING;
            }

            return "UNKNOWN";
        }

        public async Task<BaseResponse> CreateShift(CreateShiftRequest request)
        {
            var isDoctorOwner = _contextAccessor.HttpContext.User.IsDoctorOwner();
            var userId = _contextAccessor.HttpContext.User.GetUserID();

            string? clinicId = null;
            string? doctorId = null;

            if (isDoctorOwner)
            {
                doctorId = userId;
            }
            else
            {
                var manager = await _context.Managers.SingleOrDefaultAsync(m => m.UserId.Equals(userId))
                    ?? throw new NotFoundException("Thông tin của bạn không tồn tại. Vui lòng liên hệ QTV để được hỗ trợ");
                clinicId = manager.ClinicId;
            }

            var existedShift = await _context.Shifts
                .Where(s => (doctorId != null && s.DoctorId == doctorId) || (clinicId != null && s.ClinicId == clinicId))
                .Where(s => !(request.EndTimeSpan <= s.StartTime || request.StartTimeSpan >= s.EndTime))
                .ToListAsync();

            if (existedShift.Any())
            {
                return new DataResponse<List<ShiftResource>>
                {
                    Data = existedShift.Select(s => appMapping.MapToShiftResource(s)).ToList(),
                    Success = false,
                    StatusCode = System.Net.HttpStatusCode.Conflict,
                    Message = "Khung giờ bị trùng với các khung giờ đã tồn tại"
                };
            }

            var shift = new Shift()
            {
                DoctorId = doctorId,
                ClinicId = clinicId,
                StartTime = request.StartTimeSpan,
                EndTime = request.EndTimeSpan,
                Type = GetShiftType(request.StartTimeSpan, request.EndTimeSpan)
            };

            await _context.Shifts.AddAsync(shift);
            await _context.SaveChangesAsync();

            return new BaseResponse()
            {
                Message = "Thêm khung giờ mới thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }


        private async Task<List<Shift>> GetAllShiftsByClinicId(string clinicId)
        {
            var shifts = await _context.Shifts
                .Where(s => s.ClinicId == clinicId).ToListAsync();

            return shifts;
        }

        private async Task<List<Shift>> GetAllShiftsByDoctorId(string doctorId)
        {
            var shifts = await _context.Shifts
                .Where(s => s.DoctorId == doctorId).ToListAsync();

            return shifts;
        }

        public async Task<BaseResponse> GetAllEmptyShiftsByClinicIdAndDate(string clinicId, DateTime date)
        {
            var clinic = await _context.Clinics.SingleOrDefaultAsync(c => c.Id.Equals(clinicId))
                ?? throw new NotFoundException("Phòng khám không tồn tại");

            var appointments = await _context.Appointments
                    .Where(o =>
                        o.AppointmentDate.Date == date.Date
                        && o.Status.Equals(AppointmentStatus.STATUS_SUCCESS)
                        && o.ClinicId == clinicId
                    ).ToListAsync();

            var shifts = await GetAllShiftsByClinicId(clinicId);

            var emptyShifts = shifts.Where(shift => !appointments.Any(appointment => appointment.ShiftId == shift.Id)).ToList();

            return new DataResponse<List<ShiftResource>>()
            {
                Data = emptyShifts.Select(s => appMapping.MapToShiftResource(s)).ToList(),
                Message = "Lấy tất cả khung giờ trống thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllEmptyShiftsByDoctorIdAndDate(string doctorId, DateTime date)
        {
            var doctor = await _userManager.FindByIdAsync(doctorId);

            if (doctor == null) throw new NotFoundException("Thông tin cơ sở khám của bác sĩ không tồn tại");
            
            var appointments = await _context.Appointments
                    .Where(o =>
                        o.AppointmentDate.Date == date.Date
                        && o.Status.Equals(AppointmentStatus.STATUS_SUCCESS)
                        && o.ClinicId == null
                        && o.DoctorId == doctorId
                    ).ToListAsync();

            var shifts = await GetAllShiftsByDoctorId(doctorId);

            var emptyShifts = shifts.Where(shift => !appointments.Any(appointment => appointment.ShiftId == shift.Id)).ToList();

            return new DataResponse<List<ShiftResource>>()
            {
                Data = emptyShifts.Select(s => appMapping.MapToShiftResource(s)).ToList(),
                Message = "Lấy tất cả khung giờ trống thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllEmptyShiftsByClinic(string clinicId, int? brandId, string? doctorId, DateTime? date)
        {
            var clinic = await _context.Clinics.SingleOrDefaultAsync(c => c.Id.Equals(clinicId))
                ?? throw new NotFoundException("Phòng khám không tồn tại");

            var queryable = _context.Appointments
                    .Where(o => o.ClinicId == clinicId && o.Status.Equals(AppointmentStatus.STATUS_SUCCESS));

            if (brandId != null)
            {
                queryable = queryable.Where(q => q.BrandId == brandId);
            }

            if (!string.IsNullOrEmpty(doctorId))
            {
                queryable = queryable.Where(q => q.DoctorId == doctorId);
            }

            if (date.HasValue)
            {
                queryable = queryable.Where(q => q.AppointmentDate.Date == date.Value.Date);
            }

            var appointments = await queryable.ToListAsync();

            var shifts = await GetAllShiftsByClinicId(clinicId);

            ExceptionDate? exceptionDate = null;
            if(date.HasValue)
            {
                exceptionDate = await _context.ExceptionDates
                        .Include(s => s.UnavailableShifts)
                        .Where(s => s.Type == ExceptionDateType.SOME_SHIFTS)
                        .Where(ex => ex.ClinicId == clinicId
                            && ex.FromDate.HasValue && ex.FromDate.Value.Date <= date.Value.Date
                            && ex.ToDate.HasValue && ex.ToDate.Value.Date >= date.Value.Date
                        ).FirstOrDefaultAsync();
            }

            var emptyShifts = new List<Shift>();
            foreach(var shift in shifts)
            {
                if (exceptionDate != null && exceptionDate.UnavailableShifts.Any(s => s.Id == shift.Id))
                    continue;

                bool isBookedShift = appointments.Any(appointment => appointment.ShiftId == shift.Id);
                if(!isBookedShift)
                {
                    emptyShifts.Add(shift);
                }
            }

            return new DataResponse<List<ShiftResource>>()
            {
                Data = emptyShifts.Select(s => appMapping.MapToShiftResource(s)).ToList(),
                Message = "Lấy tất cả khung giờ trống thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        private List<DateTime> GetAllDaysInMonth(int month, int year)
        {
           
            if (month < 1 || month > 12)
            {
                throw new ArgumentOutOfRangeException("Tháng phải nằm trong khoảng từ 1 đến 12.");
            }

            if (year < DateTime.Now.Year || year > 9999)
            {
                throw new ArgumentOutOfRangeException($"Năm phải nằm trong khoảng từ {DateTime.Now.Year} đến 9999.");
            }

            int daysInMonth = DateTime.DaysInMonth(year, month);

            var allDays = new List<DateTime>();
            var today = DateTime.Now;

            var firstDate = new DateTime(year, month, 1);
            if (today.Month == month && today.Year == year)
            {
                firstDate = today;
            }

            for (int day = firstDate.Day; day <= daysInMonth; day++)
            {
                allDays.Add(new DateTime(year, month, day));
            }

            return allDays;
        }

        public async Task<BaseResponse> GetAllEmptyDaysByClinicAndMonth(string clinicId, int? brandId, string? doctorId, int month, int year)
        {
            var clinic = await _context.Clinics.SingleOrDefaultAsync(c => c.Id.Equals(clinicId))
                ?? throw new NotFoundException("Phòng khám không tồn tại");

            var queryable = _context.Appointments
                    .Where(o => o.ClinicId == clinicId && o.Status.Equals(AppointmentStatus.STATUS_SUCCESS));

            if (brandId != null)
            {
                queryable = queryable.Where(q => q.BrandId == brandId);
            }

            if (!string.IsNullOrEmpty(doctorId))
            {
                queryable = queryable.Where(q => q.DoctorId == doctorId);
            }

            if(month > 0 && year > 0)
            {
                queryable = queryable.Where(q => q.AppointmentDate.Month == month && q.AppointmentDate.Year == year);
            }

            var days = GetAllDaysInMonth(month, year);
            var appointments = await queryable.ToListAsync();
            var shifts = await GetAllShiftsByClinicId(clinicId);

            var emptyDays = days.Where(day =>
                shifts.Any(shift =>
                    !appointments.Any(app => app.AppointmentDate.Date == day.Date && app.ShiftId == shift.Id)
                )
            ).ToList();


            return new DataResponse<List<DateTime>>()
            {
                Data = emptyDays,
                Message = "Lấy tất cả ngày trống trong tháng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetShiftsByDoctorId(string doctorId)
        {
            var shifts = await _context.Shifts
                .Where(s => s.DoctorId != null && s.DoctorId.Equals(doctorId)).ToListAsync(); 
            
            var resources = shifts.Select(s => appMapping.MapToShiftResource(s)).ToList();

            return new DataResponse<List<ShiftResource>>()
            {
                Data = resources,
                Message = "Lấy các khung giờ của cơ sở khám BS thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetShiftsByClinicId(string clinicId)
        {
            var shifts = await _context.Shifts
                .Where(s => s.ClinicId != null && s.ClinicId.Equals(clinicId)).ToListAsync();

            var resources = shifts.Select(s => appMapping.MapToShiftResource(s)).ToList();

            return new DataResponse<List<ShiftResource>>()
            {
                Data = resources,
                Message = "Lấy các khung giờ của phòng khám thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetShifts()
        {
            var isDoctorOwner = _contextAccessor.HttpContext.User.IsDoctorOwner();
            var userId = _contextAccessor.HttpContext.User.GetUserID();

            List<Shift> shifts = new List<Shift>();

            if (isDoctorOwner)
            {
                shifts = await GetAllShiftsByDoctorId(userId);
            }
            else
            {
                var manager = await _context.Managers.SingleOrDefaultAsync(m => m.UserId.Equals(userId))
                    ?? throw new NotFoundException("Thông tin của bạn không tồn tại. Vui lòng liên hệ QTV để được hỗ trợ");
                shifts = await GetAllShiftsByClinicId(manager.ClinicId);
            }

            var resources = shifts.Select(s => appMapping.MapToShiftResource(s)).ToList();

            return new DataResponse<List<ShiftResource>>()
            {
                Data = resources,
                Message = "Lấy các khung giờ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllEmptyDaysByDoctor(string? doctorId)
        {
            var tomorrow = DateTime.Now.AddDays(1);
            var lastDay = tomorrow.AddMonths(1);

            List<DateTime> days = new List<DateTime>();

            for (var date = tomorrow; date <= lastDay; date = date.AddDays(1))
            {
                days.Add(date);
            }

            var appointments = await _context.Appointments
                .Where(app => app.DoctorId == doctorId && app.ClinicId == null && app.Status.Equals(AppointmentStatus.STATUS_SUCCESS)).ToListAsync();

            var shifts = await GetAllShiftsByDoctorId(doctorId);

            var dict = new List<DayShiftResource>();
            var exceptionDates = await _context.ExceptionDates
                .Include(ex => ex.WeekDayExceptions)
                .Where(ex => ex.DoctorId == doctorId)
                .ToListAsync();

            foreach (var day in days)
            {
                bool isAvailable = true;
                bool isTypeSomeShifts = false;
                foreach (var ex in exceptionDates)
                {
                    if (ex.Type == ExceptionDateType.MORE_THAN_ONE_DAY
                        && ex.FromDate.HasValue && ex.FromDate.Value.Date <= day.Date
                        && ex.ToDate.HasValue && ex.ToDate.Value.Date >= day.Date
                    )
                    {
                        isAvailable = false;
                        break;
                    }

                    if (ex.Type == ExceptionDateType.ONE_DAY
                        && ex.FromDate.HasValue && ex.FromDate.Value.Date <= day.Date
                        && ex.ToDate.HasValue && ex.ToDate.Value.Date >= day.Date
                    )
                    {
                        isAvailable = false;
                        break;
                    }

                    if (
                        ex.Type == ExceptionDateType.REPEAT_BY_WEEK
                        && ex.WeekDayExceptions.Any(d => d.DayOfWeek == (int)day.DayOfWeek + 1)
                    )
                    {
                        isAvailable = false;
                        break;
                    }


                    if (ex.Type == ExceptionDateType.SOME_SHIFTS)
                    {
                        isTypeSomeShifts = true;
                    }
                }

                if(isAvailable)
                {
                    var typeSomeShiftsExceptionDate = await _context.ExceptionDates
                        .Include(s => s.UnavailableShifts)
                        .Where(ex => ex.DoctorId == doctorId
                            && ex.FromDate.HasValue && ex.FromDate.Value.Date <= day.Date
                            && ex.ToDate.HasValue && ex.ToDate.Value.Date >= day.Date
                        ).FirstOrDefaultAsync();

                    var emptyShifts = new List<ShiftResource>();
                    foreach (var shift in shifts)
                    {
                        bool isBookedShift = false;
                        if (
                            isTypeSomeShifts
                            && typeSomeShiftsExceptionDate != null
                            && typeSomeShiftsExceptionDate.UnavailableShifts.Any(s => s.Id == shift.Id)
                        )
                        {
                            continue;
                        }

                        foreach (var appointment in appointments)
                        {
                            if (appointment.AppointmentDate.Date == day.Date && appointment.ShiftId == shift.Id)
                            {
                                isBookedShift = true;
                                break;
                            }
                        }

                        if (!isBookedShift || appointments.Count == 0)
                        {
                            var shiftResource = appMapping.MapToShiftResource(shift);
                            emptyShifts.Add(shiftResource);
                        }
                    }

                    var dayShift = new DayShiftResource
                    {
                        Day = day.Date,
                        Shifts = emptyShifts
                    };

                    dict.Add(dayShift);
                }
            }

            return new DataResponse<List<DayShiftResource>>
            {
                Data = dict,
                Message = "Lấy danh sách các ngày có ca trống thành công",
                Success = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<BaseResponse> GetAllFullDaysByClinicAndMonth(string clinicId, int? brandId, string? doctorId, int month, int year)
        {
            var clinic = await _context.Clinics.SingleOrDefaultAsync(c => c.Id.Equals(clinicId))
                ?? throw new NotFoundException("Phòng khám không tồn tại");

            var queryable = _context.Appointments
                    .Where(o => o.ClinicId == clinicId && o.Status.Equals(AppointmentStatus.STATUS_SUCCESS));

            if (brandId != null && brandId != 0)
            {
                queryable = queryable.Where(q => q.BrandId == brandId);
            } else
            {
                var brand = await _context.Brands
                    .Where(br => br.ClinicId == clinicId)
                    .FirstOrDefaultAsync();

                queryable = queryable.Where(q => q.BrandId == brand.Id);
            }

            if (!string.IsNullOrEmpty(doctorId))
            {
                queryable = queryable.Where(q => q.DoctorId == doctorId);
            }

            if (month > 0 && year > 0)
            {
                queryable = queryable.Where(q => q.AppointmentDate.Month == month && q.AppointmentDate.Year == year);
            }

            var days = GetAllDaysInMonth(month, year);
            var exceptionDates = await _context.ExceptionDates
                .Include(ex => ex.WeekDayExceptions)
                .Where(ex => ex.ClinicId == clinicId)
                .ToListAsync();

            var unavailableDates = new List<UnavailableDateResource>();
            var appointments = await queryable.ToListAsync();
            var shifts = await GetAllShiftsByClinicId(clinicId);

            foreach (var day in days)
            {
                bool isAvailable = true;
                string title = "Đã đầy lịch";
                bool isTypeSomeShifts = false;

                foreach(var ex in exceptionDates)
                {
                    if(ex.Type == ExceptionDateType.MORE_THAN_ONE_DAY
                        && ex.FromDate.HasValue && ex.FromDate.Value.Date <= day.Date
                        && ex.ToDate.HasValue && ex.ToDate.Value.Date >= day.Date
                    )
                    {
                        title = ex.Reason;
                        isAvailable = false;
                        break;
                    }

                    if (ex.Type == ExceptionDateType.ONE_DAY
                        && ex.FromDate.HasValue && ex.FromDate.Value.Date <= day.Date
                        && ex.ToDate.HasValue && ex.ToDate.Value.Date >= day.Date
                    )
                    {
                        title = ex.Reason;
                        isAvailable = false;
                        break;
                    }

                    if(
                        ex.Type == ExceptionDateType.REPEAT_BY_WEEK
                        && ex.WeekDayExceptions.Any(d => d.DayOfWeek == (int)day.DayOfWeek + 1)
                    )
                    {
                        title = ex.Reason;
                        isAvailable = false;
                        break;
                    }


                    if(ex.Type == ExceptionDateType.SOME_SHIFTS)
                    {
                        isTypeSomeShifts = true;
                    }
                }

                if(isAvailable)
                {
                    var countShift = 0;
                    var typeSomeShiftsExceptionDate = await _context.ExceptionDates
                        .Include(s => s.UnavailableShifts)
                        .Where(ex => ex.ClinicId == clinicId
                            && ex.FromDate.HasValue && ex.FromDate.Value.Date <= day.Date
                            && ex.ToDate.HasValue && ex.ToDate.Value.Date >= day.Date
                        ).FirstOrDefaultAsync();
                    var isExceptionDate = true;

                    foreach(var shift in shifts) { 
                        if(
                            isTypeSomeShifts 
                            && typeSomeShiftsExceptionDate != null
                            && typeSomeShiftsExceptionDate.UnavailableShifts.Any(s => s.Id == shift.Id)
                        )
                        {
                            countShift++; 
                        } else if (appointments.Any(app => app.AppointmentDate.Date == day.Date && app.ShiftId == shift.Id))
                        {
                            countShift++;
                            isExceptionDate = false;
                        }
                    }

                    if(countShift == shifts.Count)
                    {
                        var newDay = new UnavailableDateResource
                        {
                            Day = day,
                            IsExceptionDate = isExceptionDate,
                            Title = typeSomeShiftsExceptionDate?.Reason ?? title
                        };

                        unavailableDates.Add(newDay);
                    }
                } else
                {
                    var newDay = new UnavailableDateResource
                    {
                        Day = day,
                        IsExceptionDate = true,
                        Title = title
                    };

                    unavailableDates.Add(newDay);
                }
                
            }

            return new DataResponse<List<UnavailableDateResource>>()
            {
                Data = unavailableDates,
                Message = "Lấy tất cả ngày đã full ca trong tháng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true
            };
        }
    }
}
