using Azure.Core;
using clinic_schedule.Core.Constants;
using clinic_schedule.Core.DTOs;
using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Models;
using clinic_schedule.Core.Requests.Appointment;
using clinic_schedule.Core.Response;
using clinic_schedule.Core.Response.Resources;
using clinic_schedule.DbContext;
using clinic_schedule.Extensions;
using clinic_schedule.Infrastructures.Cloudinary;
using clinic_schedule.Infrastructures.FCM;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Interfaces;
using clinic_schedule.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace clinic_schedule.Services.Implementations
{
    public class AppointmentService : IAppointmentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly AppMapping appMapping;
        private readonly IUploadService uploadService;
        private readonly IFirebaseCloudMessagingService fcmService;

        public AppointmentService(ApplicationDbContext context, IHttpContextAccessor contextAccessor, UserManager<User> userManager, AppMapping appMapping, IUploadService uploadService, IFirebaseCloudMessagingService fcmService)
        {
            _context = context;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            this.appMapping = appMapping;
            this.uploadService = uploadService;
            this.fcmService = fcmService;
        }

        public async Task<BaseResponse> CancelAppointment(int appointmentId, CancelAppointmentRequest request)
        {
            var appointment = await _context.Appointments
                .Include(app => app.Profile)
                .Include(app => app.History)
                .Include(app => app.Clinic)
                    .ThenInclude(app => app.Manager)
                .Include(app => app.Doctor)
                    .ThenInclude(app => app.User)
                .SingleOrDefaultAsync(app => app.Id == appointmentId)
                    ?? throw new AppException("Lịch khám bệnh không tồn tại");

            if (appointment.Status.Equals(AppointmentStatus.STATUS_CANCEL))
                throw new AppException("Lịch đặt khám đã được hủy trước đó");

            if (appointment.Status.Equals(AppointmentStatus.STATUS_EXPIRE))
                throw new AppException("Lịch đặt khám đã bị quá hạn");

            if (appointment.Status.Equals(AppointmentStatus.STATUS_FINISH))
                throw new AppException("Lịch đặt khám đã được khám xong");

            if (appointment.Status.Equals(AppointmentStatus.STATUS_SUCCESS))
            {
                appointment.Status = AppointmentStatus.STATUS_CANCEL;

                var clinicName = appointment.Clinic != null ? appointment.Clinic.Name : appointment.Doctor.User.FullName;
                var content = request.Reason ?? $"Lịch khám đã đăng kí của {appointment.Profile.Name} với {clinicName} vào ngày {appointment.AppointmentDate.ToString("dd:MM:yyyy")} được hủy theo yêu cầu của bạn";
               
                var appHistory = new AppointmentHistory
                {
                    CreatedAt = DateTime.Now,
                    Description = content,
                    Status = AppointmentStatus.STATUS_CANCEL,
                    CreatedBy= request.Reason != null ? "ADMIN" : "PATIENT"
                };

                appointment.History.Add(appHistory);

                var userId = _contextAccessor.HttpContext.User.GetUserID();
                var targetId = appointment.Clinic != null ? appointment.Clinic.Manager.UserId : appointment.DoctorId;
                var groupName = GroupName.GetGroupName(userId, targetId);

                Group? existedGroup = await _context.Groups
                   .SingleOrDefaultAsync(g => g.GroupName.Equals(groupName));
                
                Core.Models.Message message = new Core.Models.Message
                {
                    Content = content,
                    HaveRead = false,
                    MessageType = MessageType.NOTIFICATION,
                    IsVisibleToRecipient = true,
                    RecipientId = userId,
                    SendAt = DateTime.Now,
                    SenderId = targetId,
                    IsVisibleToSender = false,
                };

                if (existedGroup == null)
                {
                    Group group = new Group()
                    {
                        GroupName = groupName,
                        Message = message,
                        TotalUnReadMessages = 1,
                        FirstUserId = message.SenderId,
                        IsAvailable = false,
                        AvailableTo = DateTime.Now,
                        LastUserId = message.RecipientId,
                        ClinicId = appointment.ClinicId,
                    };

                    await _context.Groups.AddAsync(group);
                }
                else
                {
                    existedGroup.Message = message;
                    existedGroup.IsAvailable = false;
                    existedGroup.AvailableTo = DateTime.Now;
                    existedGroup.TotalUnReadMessages += 1;
                }

                await _context.SaveChangesAsync();

                var recipientId = appointment.ClinicId != null ? appointment.Clinic.Manager.ClinicId : appointment.DoctorId;
                NotificationDTO notification = new NotificationDTO()
                {
                    Content = content,
                    NotificationType = NotificationType.NOTIFICATION_BOOKING_CANCEL,
                    RecipientId = request.Reason != null ? appointment.PatientId : recipientId,
                    ReferenceId = appointmentId,
                    Title = "Hủy lịch khám bệnh"
                };

                await fcmService.SendNotification(notification);
            }

            return new BaseResponse()
            {
                Message = "Hủy lịch khám thành công",
                StatusCode = System.Net.HttpStatusCode.NoContent,
                Success = true
            };
        }

        public async Task<BaseResponse> CreateAppointmentWithClinic(AppointmentWithClinicRequest request)
        {
            var patientId = _contextAccessor.HttpContext.User.GetUserID();
            var profile = await _context.Profiles
                .SingleOrDefaultAsync(p => p.PatientId == patientId && p.Id == request.ProfileId)
                    ?? throw new NotFoundException("Hồ sơ khám không tồn tại");

            var queryable = _context.Appointments
                .Where(app => 
                    app.AppointmentDate.Date == request.AppointmentDate.Date 
                    && app.Status.Equals(AppointmentStatus.STATUS_SUCCESS)
                );

            Appointment appointment = new Appointment();

            Clinic clinic = await _context.Clinics
                    .Include(c => c.Manager)
                    .SingleOrDefaultAsync(c => c.Id == request.ClinicId)
                        ?? throw new NotFoundException("Thông tin phòng khám không tồn tại");

            queryable = queryable.Where(app => app.ClinicId == request.ClinicId);
            appointment.ClinicId = request.ClinicId;

            if (request.BrandId != null && request.BrandId != 0)
            {
                Brand brand = await _context.Brands
                    .SingleOrDefaultAsync(c => c.Id == request.BrandId && c.ClinicId == request.ClinicId)
                        ?? throw new NotFoundException("Thông tin chi nhánh không tồn tại");

                queryable = queryable.Where(app => app.BrandId == request.BrandId);
                appointment.BrandId = request.BrandId;
            } 

            int countAppointment = await queryable.CountAsync();

            if(request.ServiceId != null && request.ServiceId != 0)
            {
                Service service = await _context.Services
                    .Include(s => s.ServiceType)
                    .SingleOrDefaultAsync(c => c.Id == request.ServiceId && c.ServiceType.ClinicId == request.ClinicId)
                        ?? throw new NotFoundException("Thông tin dịch vụ khám không tồn tại");

                queryable = queryable.Where(app => app.ServiceId == request.ServiceId);
                appointment.ServiceId = request.ServiceId;
            }

            if (!string.IsNullOrEmpty(request.DoctorId))
            {
                Doctor doctor = await _context.Doctors
                    .SingleOrDefaultAsync(c => c.UserId == request.DoctorId && c.ClinicId == request.ClinicId)
                        ?? throw new NotFoundException("Thông tin bác sĩ không tồn tại");


                queryable = queryable.Where(app => app.DoctorId == request.DoctorId);
                appointment.DoctorId = request.DoctorId;
            }


            Shift shift = await _context.Shifts
                .SingleOrDefaultAsync(c => c.Id == request.ShiftId && c.ClinicId == request.ClinicId)
                    ?? throw new NotFoundException("Khung giờ không tồn tại");

            var isAvalable = queryable.All(c => c.ShiftId != request.ShiftId) || queryable.Count() == 0;
            if (!isAvalable) throw new AppException("Khung giờ này đã được đặt. Vui lòng chọn khung giờ/ngày khác");

            appointment.CreatedDate = DateTime.Now;
            appointment.AppointmentDate = request.AppointmentDate;
            appointment.Status = AppointmentStatus.STATUS_SUCCESS;
            appointment.ShiftId = request.ShiftId;
            appointment.ProfileId = request.ProfileId;
            appointment.PatientId = patientId;

            if (request.FileAttaches != null && request.FileAttaches.Count > 0)
            {
                appointment.FileAttaches ??= new List<FileAttach>();
                var thumbnailUrls = await uploadService.MultiUploadAsync(request.FileAttaches);
                foreach ( var thumbnailUrl in thumbnailUrls )
                {
                    var fileAttach = new FileAttach();
                    fileAttach.Url = thumbnailUrl;
                    fileAttach.Type = "image";
                    appointment.FileAttaches.Add(fileAttach);
                }
            }

            appointment.NumberOrder = countAppointment + 1;

            if (!string.IsNullOrEmpty(request.Note))
            {
                appointment.Note = request.Note;
            }

            var historyItem = new AppointmentHistory
            {
                CreatedAt = DateTime.Now,
                Appointment = appointment,
                Description = "Đặt lịch hẹn thành công",
                Status = appointment.Status,
                CreatedBy = "PATIENT"
            };

            appointment.History ??= new List<AppointmentHistory>();
            appointment.History.Add(historyItem);

            var groupName = GroupName.GetGroupName(patientId, clinic.Manager.UserId);

            Group? existedGroup = await _context.Groups
               .SingleOrDefaultAsync(g => g.GroupName.Equals(groupName));

            Core.Models.Message message = new Core.Models.Message
            {
                Content = $"Lịch khám của anh/chị tại {clinic.Name} được đặt thành công. Thời gian khám dự kiến là  {shift.StartTime.ToString(@"hh\:mm")}-{shift.EndTime.ToString(@"hh\:mm")}. Anh/chị có thể sử dụng tính năng \"Chat với bác sĩ\" đến hết ngày {appointment.AppointmentDate.AddDays(7):dd/MM/yyyy}",
                HaveRead = false,
                MessageType = MessageType.NOTIFICATION,
                IsVisibleToRecipient = true,
                RecipientId = patientId,
                SendAt = DateTime.Now,
                SenderId = clinic.Manager.UserId,
                IsVisibleToSender = false,

            };

            if (existedGroup == null)
            {
                Group group = new Group()
                {
                    GroupName = groupName,
                    Message = message,
                    TotalUnReadMessages = 1,
                    FirstUserId = message.SenderId,
                    IsAvailable = true,
                    AvailableTo = appointment.AppointmentDate.AddDays(7),
                    LastUserId = message.RecipientId,
                    ClinicId = clinic.Id,
                };

                await _context.Groups.AddAsync(group);
            }
            else
            {
                existedGroup.Message = message;
                existedGroup.IsAvailable = true;
                existedGroup.AvailableTo = appointment.AppointmentDate.AddDays(7);
                existedGroup.TotalUnReadMessages += 1;
            }

            var savedAppointment = await _context.AddAsync(appointment);
            await _context.SaveChangesAsync();

            NotificationDTO notification = new NotificationDTO()
            {
                Content = $"{profile.Name} vừa đặt lịch khám bệnh vào lúc {shift.StartTime.ToString(@"hh\:mm")}-{shift.EndTime.ToString(@"hh\:mm")} ngày {appointment.AppointmentDate:dd/MM/yyyy}",
                NotificationType = NotificationType.NOTIFICATION_BOOKING_SUCCESS,
                RecipientId = clinic.Manager.UserId,
                ReferenceId = savedAppointment.Entity.Id,
                Title = "Đặt lịch khám thành công"
            };

            await fcmService.SendNotification(notification);

            return new BaseResponse()
            {
                Success = true,
                Message = "Đặt lịch hẹn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<BaseResponse> CreateAppointmentWithDoctor(AppointmentWithDoctorRequest request)
        {
            var patientId = _contextAccessor.HttpContext.User.GetUserID();
            var profile = await _context.Profiles
                .SingleOrDefaultAsync(p => p.PatientId == patientId && p.Id == request.ProfileId)
                    ?? throw new NotFoundException("Hồ sơ khám không tồn tại");

            Doctor doctor = await _context.Doctors
                    .Include(d => d.User)
                    .SingleOrDefaultAsync(c => c.UserId == request.DoctorId)
                        ?? throw new NotFoundException("Thông tin bác sĩ không tồn tại");

            var checkRole = await _userManager.IsInRoleAsync(doctor.User, "DOCTOR_OWNER");
            if (!checkRole) throw new AppException("Bác sĩ này không có phòng khám");

            Shift shift = await _context.Shifts
                .SingleOrDefaultAsync(c => c.Id == request.ShiftId && c.DoctorId == request.DoctorId)
                    ?? throw new NotFoundException("Khung giờ không tồn tại");
            var queryable = _context.Appointments
                .Where(app =>
                    app.AppointmentDate.Date == request.AppointmentDate.Date
                    && app.Status.Equals(AppointmentStatus.STATUS_SUCCESS)
                    && app.ClinicId == null
                    && app.DoctorId == request.DoctorId
                );

            var isAvailable = queryable.All(c => c.ShiftId != request.ShiftId) || queryable.Count() == 0;

            if (!isAvailable) throw new AppException("Khung giờ này đã được đặt. Vui lòng chọn khung giờ/ngày khác");

            var userId = _contextAccessor?.HttpContext?.User.GetUserID();

            var appointmentsInDate = await _context.Appointments
                .Where(a => a.ClinicId == null && a.DoctorId.Equals(request.DoctorId) && a.AppointmentDate.Date == request.AppointmentDate.Date && a.Status == AppointmentStatus.STATUS_SUCCESS).CountAsync();

            var appointment = new Appointment()
            {
                DoctorId = request.DoctorId,
                AppointmentDate = request.AppointmentDate,
                ProfileId = request.ProfileId,
                PatientId = patientId,
                NumberOrder = appointmentsInDate + 1,
                CreatedDate = DateTime.Now,
                ShiftId = request.ShiftId,
                Status = AppointmentStatus.STATUS_SUCCESS,
            };


            if (request.FileAttaches != null && request.FileAttaches.Count > 0)
            {
                appointment.FileAttaches ??= new List<FileAttach>();
                var thumbnailUrls = await uploadService.MultiUploadAsync(request.FileAttaches);
                foreach (var thumbnailUrl in thumbnailUrls)
                {
                    var fileAttach = new FileAttach();
                    fileAttach.Url = thumbnailUrl;
                    fileAttach.Type = "image";
                    appointment.FileAttaches.Add(fileAttach);
                }
            }

            var historyItem = new AppointmentHistory
            {
                CreatedAt = DateTime.Now,
                Appointment = appointment,
                Description = "Đặt lịch hẹn thành công",
                Status = appointment.Status,
                CreatedBy = "PATIENT"
            };

            appointment.History ??= new List<AppointmentHistory>();
            appointment.History.Add(historyItem);

            var groupName = GroupName.GetGroupName(patientId, doctor.UserId);

            Group? existedGroup = await _context.Groups
               .SingleOrDefaultAsync(g => g.GroupName.Equals(groupName));

            Core.Models.Message message = new Core.Models.Message
            {
                Content = $"Lịch khám của anh/chị tại {doctor.User.FullName} được đặt thành công. Thời gian khám dự kiến là {shift.StartTime.ToString(@"hh\:mm")}-{shift.EndTime.ToString(@"hh\:mm")}. Anh/chị có thể sử dụng tính năng \"Chat với bác sĩ\" đến hết ngày {appointment.AppointmentDate.AddDays(7):dd/MM/yyyy}",
                HaveRead = false,
                MessageType = MessageType.NOTIFICATION,
                IsVisibleToRecipient = true,
                RecipientId = patientId,
                SendAt = DateTime.Now,
                SenderId = doctor.UserId,
                IsVisibleToSender = false,
            };

            if (existedGroup == null)
            {
                Group group = new Group()
                {
                    GroupName = groupName,
                    Message = message,
                    TotalUnReadMessages = 1,
                    FirstUserId = message.SenderId,
                    IsAvailable = true,
                    AvailableTo = appointment.AppointmentDate.AddDays(7),
                    LastUserId = message.RecipientId,
                };

                await _context.Groups.AddAsync(group);
            }
            else
            {
                existedGroup.Message = message;
                existedGroup.IsAvailable = true;
                existedGroup.AvailableTo = appointment.AppointmentDate.AddDays(7);
                existedGroup.TotalUnReadMessages += 1;
            }

            var savedAppointment = await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();

            NotificationDTO notification = new NotificationDTO()
            {
                Content = $"{profile.Name} vừa đặt lịch khám bệnh vào lúc {shift.StartTime.ToString(@"hh\:mm")}-{shift.EndTime.ToString(@"hh\:mm")} ngày {appointment.AppointmentDate:dd/MM/yyyy}",
                NotificationType = NotificationType.NOTIFICATION_BOOKING_SUCCESS,
                RecipientId = request.DoctorId,
                ReferenceId = savedAppointment.Entity.Id,
                Title = "Đặt lịch khám thành công"
            };

            await fcmService.SendNotification(notification);

            return new BaseResponse()
            {
                Success = true,
                Message = "Đặt lịch hẹn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<BaseResponse> FinishAppointment(int appointmentId)
        {
            var appointment = await _context.Appointments
                .Include(app => app.Profile)
                .Include(app => app.History)
                .Include(app => app.Clinic)
                    .ThenInclude(app => app.Manager)
                .Include(app => app.Doctor)
                    .ThenInclude(app => app.User)
                .SingleOrDefaultAsync(app => app.Id == appointmentId)
                    ?? throw new AppException("Lịch khám bệnh không tồn tại");

            if (appointment.Status.Equals(AppointmentStatus.STATUS_CANCEL))
                throw new AppException("Lịch đặt khám đã được hủy trước đó");

            if (appointment.Status.Equals(AppointmentStatus.STATUS_EXPIRE))
                throw new AppException("Lịch đặt khám đã bị quá hạn");


            if (appointment.Status.Equals(AppointmentStatus.STATUS_SUCCESS))
            {
                appointment.Status = AppointmentStatus.STATUS_FINISH;

                var clinicName = appointment.Clinic != null ? appointment.Clinic.Name : appointment.Doctor.User.FullName;
                var content = $"Lịch khám của {appointment.Profile.Name} với {clinicName} vào ngày {appointment.AppointmentDate.ToString("dd:MM:yyyy")} đã được khám hoàn tất";

                var appHistory = new AppointmentHistory
                {
                    CreatedAt = DateTime.Now,
                    Description = content,
                    Status = AppointmentStatus.STATUS_FINISH,
                    CreatedBy = "ADMIN"
                };

                appointment.History.Add(appHistory);

            
                await _context.SaveChangesAsync();

                NotificationDTO notification = new NotificationDTO()
                {
                    Content = content,
                    NotificationType = NotificationType.NOTIFICATION_BOOKING_FINISH,
                    RecipientId = appointment.PatientId,
                    ReferenceId = appointmentId,
                    Title = "Hoàn tất khám bệnh"
                };

                await fcmService.SendNotification(notification);
            }

            return new BaseResponse()
            {
                Message = "Hoàn tất khám thành công",
                StatusCode = System.Net.HttpStatusCode.NoContent,
                Success = true
            };
        }

        public async Task<BaseResponse> GetAllAppointmentByClinicLoggedIn(int page = 1, int size = 8)
        {
            var userId = _contextAccessor?.HttpContext?.User.GetUserID();
            var manager = await _context.Managers.SingleOrDefaultAsync(s => s.UserId == userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");

            await _context.Appointments
               .Where(a => a.ClinicId == manager.ClinicId && a.Status.Equals(AppointmentStatus.STATUS_SUCCESS) && a.AppointmentDate < DateTime.Now)
               .ExecuteUpdateAsync(a => a.SetProperty(x => x.Status, AppointmentStatus.STATUS_EXPIRE));

            var appointments = await _context.Appointments
                .Include(p => p.Profile)
                .Include(p => p.FileAttaches)
                .Include(p => p.Brand)
                .Include(p => p.Doctor)
                    .ThenInclude(p => p.User)
                .Include(p => p.Shift)
                .Include(p => p.Service)
                    .ThenInclude(p => p.ServiceType)
                .Where(app => app.ClinicId == manager.ClinicId)
                 .OrderByDescending(p => p.CreatedDate)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            var totalItems = await _context.Appointments.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (size * 1.0));

            var resources = new List<AppointmentResource>();
            foreach (var appointment in appointments)
            {
                var appointmentResource = await appMapping.MapToAppointmentResource(appointment);
                resources.Add(appointmentResource);
            }

            return new PaginationResponse<List<AppointmentResource>>()
            {
                Data = resources,
                Message = "Lấy thông tin đặt lịch hẹn khám bệnh thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
                Pagination = new Pagination
                {
                    Page = page,
                    Size = size,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                }
            };
        }

        public async Task<BaseResponse> GetAllAppointmentByDoctorEmployeeLoggedIn(int page = 1, int size = 8)
        {
            var userId = _contextAccessor?.HttpContext?.User.GetUserID();

            await _context.Appointments
               .Where(a => a.ClinicId != null && a.DoctorId == userId && a.Status.Equals(AppointmentStatus.STATUS_SUCCESS) && a.AppointmentDate < DateTime.Now)
               .ExecuteUpdateAsync(a => a.SetProperty(x => x.Status, AppointmentStatus.STATUS_EXPIRE));

            var appointments = await _context.Appointments
                .Include(p => p.Profile)
                .Include(p => p.FileAttaches)
                .Include(p => p.Brand)
                .Include(p => p.Doctor)
                    .ThenInclude(p => p.User)
                .Include(p => p.Shift)
                .Include(p => p.Service)
                    .ThenInclude(p => p.ServiceType)
                .Where(app => app.ClinicId != null && app.DoctorId == userId)
                 .OrderByDescending(p => p.CreatedDate)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            var totalItems = await _context.Appointments.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (size * 1.0));

            var resources = new List<AppointmentResource>();
            foreach (var appointment in appointments)
            {
                var appointmentResource = await appMapping.MapToAppointmentResource(appointment);
                resources.Add(appointmentResource);
            }

            return new PaginationResponse<List<AppointmentResource>>()
            {
                Data = resources,
                Message = "Lấy thông tin đặt lịch hẹn khám bệnh thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
                Pagination = new Pagination
                {
                    Page = page,
                    Size = size,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                }
            };
        }

        public async Task<BaseResponse> GetAllAppointmentByDoctorOwnerLoggedIn(int page = 1, int size = 8)
        {
            var userId = _contextAccessor?.HttpContext?.User.GetUserID();

            await _context.Appointments
                .Where(a => a.ClinicId == null && a.DoctorId == userId && a.Status.Equals(AppointmentStatus.STATUS_SUCCESS) && a.AppointmentDate < DateTime.Now)
                .ExecuteUpdateAsync(a => a.SetProperty(x => x.Status, AppointmentStatus.STATUS_EXPIRE));

            var appointments = await _context.Appointments
                .Include(p => p.Profile)
                .Include(p => p.FileAttaches)
                .Include(p => p.Brand)
                .Include(p => p.Doctor)
                    .ThenInclude(p => p.User)
                .Include(p => p.Shift)
                .Include(p => p.Service)
                    .ThenInclude(p => p.ServiceType)
                .Where(app => app.ClinicId == null && app.DoctorId == userId)
                .OrderByDescending(p => p.CreatedDate)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            var totalItems = await _context.Appointments.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (size * 1.0));

            var resources = new List<AppointmentResource>();
            foreach (var appointment in appointments)
            {
                var appointmentResource = await appMapping.MapToAppointmentResource(appointment);
                resources.Add(appointmentResource);
            }

            return new PaginationResponse<List<AppointmentResource>>()
            {
                Data = resources,
                Message = "Lấy thông tin đặt lịch hẹn khám bệnh thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
                Pagination = new Pagination
                {
                    Page = page,
                    Size = size,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                }
            };
        }

        public async Task<BaseResponse> GetAllAppointmentsByLoggedInUser(int page = 1, int size = 8)
        {
            var userId = _contextAccessor?.HttpContext?.User.GetUserID();

            await _context.Appointments
                .Include(p => p.Profile)
                .Where(a => a.Profile.PatientId == userId && a.Status.Equals(AppointmentStatus.STATUS_SUCCESS) && a.AppointmentDate < DateTime.Now)
                .ExecuteUpdateAsync(a => a.SetProperty(x => x.Status, AppointmentStatus.STATUS_EXPIRE));

            var appointments = await _context.Appointments
                .Include(p => p.Clinic)
                .Include(p => p.Profile)
                .Include(p => p.FileAttaches)
                .Include(p => p.Brand)
                .Include(p => p.Doctor)
                    .ThenInclude(p => p.User)
                .Include(p => p.Shift)
                .Include(p => p.Service)
                    .ThenInclude(p => p.ServiceType)
                .Where(app => app.Profile.PatientId == userId)
                .OrderByDescending(p => p.CreatedDate)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            var totalItems = await _context.Appointments.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (size * 1.0));

            var resources = new List<AppointmentResource>();
            foreach (var appointment in appointments)
            {
                var appointmentResource = await appMapping.MapToAppointmentResource(appointment);
                resources.Add(appointmentResource);
            }

            return new PaginationResponse<List<AppointmentResource>>()
            {
                Data = resources,
                Message = "Lấy thông tin đặt lịch hẹn khám bệnh thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
                Pagination = new Pagination
                {
                    Page = page,
                    Size = size,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                }
            };
        }

        public async Task<BaseResponse> GetAllAppointmentsByPatientId(string patientId)
        {
            var appointments = await _context.Appointments
                .Include(p => p.Profile)
                .Include(p => p.FileAttaches)
                .Include(p => p.Brand)
                .Include(p => p.Doctor)
                    .ThenInclude(p => p.User)
                .Include(p => p.Shift)
                .Include(p => p.Service)
                    .ThenInclude(p => p.ServiceType)
                .Where(app => app.Profile.PatientId == patientId)
                .ToListAsync();

            var resources = new List<AppointmentResource>();    
            foreach(var appointment in appointments)
            {
                var appointmentResource = await appMapping.MapToAppointmentResource(appointment);
                resources.Add(appointmentResource);
            }

            return new DataResponse<List<AppointmentResource>>()
            {
                Data = resources,
                Message = "Lấy thông tin đặt lịch hẹn khám bệnh thành công",
                StatusCode=System.Net.HttpStatusCode.OK,
                Success = true,

            };
        }

        public async Task<BaseResponse> GetAppointmentById(int id)
        {
            
            var appointment = await _context.Appointments
                .Include(p => p.Profile)
                .Include(p => p.FileAttaches)
                .Include(p => p.Brand)
                .Include(p => p.Doctor)
                    .ThenInclude(p => p.User)
                .Include(p => p.Shift)
                .Include(p => p.Service)
                    .ThenInclude(p => p.ServiceType)
                .SingleOrDefaultAsync(app => app.Id == id)
                    ?? throw new AppException("Không tìm thấy lịch đặt hẹn nào");

            if(appointment.Status.Equals(AppointmentStatus.STATUS_SUCCESS) && appointment.AppointmentDate < DateTime.Now)
            {
                appointment.Status = AppointmentStatus.STATUS_EXPIRE;
                await _context.SaveChangesAsync();
            }

            var resource = await appMapping.MapToAppointmentResource(appointment);

            return new DataResponse<AppointmentResource>()
            {
                Data = resource,
                Message = "Lấy thông tin đặt lịch hẹn khám bệnh thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Success = true,
            };
        }
    }
}
