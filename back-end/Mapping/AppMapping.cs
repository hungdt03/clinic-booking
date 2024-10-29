using clinic_schedule.Core.Models;
using clinic_schedule.Core.Response.Resources;
using Microsoft.AspNetCore.Identity;
using System.Numerics;

namespace clinic_schedule.Mapping
{
    public class AppMapping
    {
        private readonly UserManager<User> _userManager;

        public AppMapping(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<NotificationResource> MapToNotificationResource(Notification notification)
        {
            return new NotificationResource()
            {
                Id = notification.Id,
                Title = notification.Title,
                Content = notification.Description,
                CreatedAt = notification.CreatedAt,
                Recipient = await MapToUserResource(notification.Recipient),
                HaveRead = notification.HaveRead,
                ReferenceId = notification.ReferenceId,
                NotificationType = notification.NotificationType,
            };
        }

        public async Task<UserResource> MapToUserResource(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            return new UserResource
            {
                Address = user.Address,
                DateOfBirth = user.DateOfBirth.GetValueOrDefault(),
                Email = user.Email,
                EthnicGroup = user.EthnicGroup,
                FullName = user.FullName,
                Gender = user.Gender,
                IdentityCard = user.IdentityCard,
                Id = user.Id,
                PhoneNumber = user.PhoneNumber,
                Role = roles[0],
                UserName = user.UserName,
                Thumbnail = user.Thumbnail,
                IsOnline  = user.IsOnline,
                RecentOnlineTime = user.RecentOnlineTime,
                IsPasswordChanged = user.IsChangedPassword
            };

        }

        public async Task<MessageResource> MapToMessageResource(Message message)
        {
            return new MessageResource
            {
                Id = message.Id,
                Content = message.Content,
                SentAt = message.SendAt,
                Sender = message.Sender != null ? await MapToUserResource(message.Sender) : null,
                Recipient = message.Recipient != null ? await MapToUserResource(message.Recipient) : null,
                IsVisibleToRecipient = message.IsVisibleToRecipient,
                IsVisibleToSender = message.IsVisibleToSender,
                MessageType = message.MessageType,
                HaveRead = message.HaveRead,
            };
        }

        public async Task<GroupResource> MapToGroupResource(Group group)
        {
            return new GroupResource
            {
                GroupName = group.GroupName,
                AvailableTo = group.AvailableTo,
                Clinic = group.Clinic != null ? MapToClinicResource(group.Clinic) : null,
                FirstUser = group.FirstUser != null ? await MapToUserResource(group.FirstUser) : null,
                LastUser = group.LastUser != null ? await MapToUserResource(group.LastUser) : null,
                IsAvailable = group.IsAvailable,
                Message = group.Message != null ? await MapToMessageResource(group.Message) : null,
                TotalUnReadMessages = group.TotalUnReadMessages,
            };
        }

        public async Task<DoctorOwner> MapToDoctorOwner(Doctor doctor)
        {
            return new DoctorOwner
            {
                Details = new DoctorResource
                {
                    AcademicTitle = doctor.AcademicTitle,
                    Address = doctor.Address,
                    CurrentWorkPlace = doctor.CurrentWorkPlace,
                    Degree = doctor.Degree,
                    ExperienceYears = doctor.ExperienceYears.GetValueOrDefault(),
                    Position = doctor.Position,
                    IntroductionHtml = doctor.IntroductionHtml,
                    IntroductionPlain = doctor.IntroductionPlain
                },
                Images = doctor.DoctorImages != null ? doctor.DoctorImages.Select(d => d.Url).ToList() : new List<string>(),
                User = await MapToUserResource(doctor.User),
                Specializations = doctor.Specializations != null ? doctor.Specializations.Select(spec => MapToSpecializationResource(spec)).ToList() : new List<SpecializationResource>(),
                AwardsAndResearches = doctor.AwardsAndResearches != null ? doctor.AwardsAndResearches.Select(spec => MapToAwardResource(spec)).ToList() : new List<AwardResource>(),
                Educations = doctor.Educations != null ? doctor.Educations.Select(spec => MapToEducationResource(spec)).ToList() : new List<EducationResource>(),
                WorkExperiences = doctor.WorkExperiences != null ? doctor.WorkExperiences.Select(spec => MapToWorkExperienceResource(spec)).ToList() : new List<WorkExperienceResource>()
            };
        }

        public WorkExperienceResource MapToWorkExperienceResource(WorkExperience workExperience)
        {
            return new WorkExperienceResource
            {
                Id = workExperience.Id,
                FromYear = workExperience.FromYear,
                ToYear = workExperience.ToYear,
                WorkPlace = workExperience.WorkPlace
            };
        }

        public EducationResource MapToEducationResource(Education education)
        {
            return new EducationResource
            {
                Id = education.Id,
                ToYear = education.ToYear,
                FromYear = education.FromYear,
                StudyPlace = education.StudyPlace,
            };
        }

        public AwardResource MapToAwardResource(AwardsAndResearch awardsAndResearch)
        {
            return new AwardResource
            {
                Content = awardsAndResearch.Content,
                Id = awardsAndResearch.Id,
                Year = awardsAndResearch.Year,
            };
        }

        public ProcessResource MapToProcessResource(BookingProcess process, int orderNumer)
        {
            return new ProcessResource
            {
                Id = process.Id,
                Name = process.Name,
                OrderNumber = orderNumer
            };
        }

        public async Task<DoctorEmployee> MapToDoctorEmployee(Doctor doctor)
        {
            return new DoctorEmployee
            {
                Details = new DoctorResource
                {
                    AcademicTitle = doctor.AcademicTitle,
                    Address = doctor.Address,
                    CurrentWorkPlace = doctor.CurrentWorkPlace,
                    Degree = doctor.Degree,
                    ExperienceYears = doctor.ExperienceYears.GetValueOrDefault(),
                    Position = doctor.Position,
                },
                User = await MapToUserResource(doctor.User),
                Clinic = MapToClinicResource(doctor.Clinic)
            };
        }



        public SpecializationResource MapToSpecializationResource(Specialization specialization)
        {
            return new SpecializationResource
            {
                Id = specialization.Id,
                Name = specialization.Name,
                Thumbnail = specialization.Thumbnail,
                Description = specialization.Description,
            };
        }

        public ClinicResource MapToClinicResource(Clinic clinic)
        {
            return new ClinicResource
            {
                Id = clinic.Id,
                Name = clinic.Name,
                Address = clinic.Address,
                ThumbnailUrl = clinic.Thumbnail,
                IntroductionHtml = clinic.IntroductionHtml,
                IntroductionPlain = clinic.IntroductionPlain,
                Specializations = clinic.Specializations != null ? clinic.Specializations.Select(spec => MapToSpecializationResource(spec)).ToList() : new List<SpecializationResource>(),
                Images = clinic.Images != null ? clinic.Images.Select(c => c.Url).ToList() : new List<string>()
            };
        }

        public async Task<ManagerResource> MapToManagerResource(Manager manager)
        {
            return new ManagerResource
            {
                Clinic = MapToClinicResource(manager.Clinic),
                User = await MapToUserResource(manager.User),
            };
        }

        public NoteResource MapToNoteResource(Note note)
        {
            return new NoteResource
            {
                Content = note.Content,
            };
        }

        public ShiftResource MapToShiftResource(Shift shift)
        {
            return new ShiftResource
            {
                Id = shift.Id,
                EndTime = shift.EndTime,
                StartTime = shift.StartTime,
                Type = shift.Type,
            };
        }

        public BrandResource MapToBrandResource(Brand brand)
        {
            return new BrandResource
            {
                Id = brand.Id,
                Name = brand.Name,
                Address = brand.Address,
            };
        }

        public ProfileResource MapToProfileResource(Profile profile)
        {
            return new ProfileResource
            {
                Id = profile.Id,
                Name = profile.Name,
                Address = profile.Address,
                DateOfBirth = profile.DateOfBirth.GetValueOrDefault(),
                Email = profile.Email,
                EthnicGroup = profile.EthnicGroup,
                Gender = profile.Gender,
                IdentityCard = profile.IdentityCard,
                Major = profile.Major,
                PhoneNumber = profile.PhoneNumber,
                Relationship = profile.Relationship,
                IsPrimary = profile.PrimaryProfile,
            };
        }

        public ServiceTypeResource MapToServiceTypeResource(ServiceType serviceType)
        {
            return new ServiceTypeResource
            {
                Id = serviceType.Id,
                Name = serviceType.Name,
                SubName = serviceType.SubName,
                IsIncludeFee = serviceType.IsIncludeFee,
            };
        }

        public ServiceResource MapToServiceResource(Service service)
        {
            return new ServiceResource
            {
                Id = service.Id,
                Fee = service.Fee,
                Name = service.Name,
            };
        }

        public async Task<AppointmentResource> MapToAppointmentResource(Appointment appointment)
        {
            return new AppointmentResource
            {
                Id = appointment.Id,
                AppointmentDate = appointment.AppointmentDate,
                Brand = appointment.Brand != null ? MapToBrandResource(appointment.Brand) : null,
                Clinic = appointment.Clinic != null ? MapToClinicResource(appointment.Clinic) : null,
                CreatedDate = appointment.CreatedDate,
                Doctor = appointment.Doctor != null ? await MapToDoctorOwner(appointment.Doctor) : null,
                Profile = MapToProfileResource(appointment.Profile),
                Service = appointment.Service != null ? MapToServiceResource(appointment.Service) : null,
                ServiceType = appointment.Service != null ? MapToServiceTypeResource(appointment.Service.ServiceType) : null,
                Shift = MapToShiftResource(appointment.Shift),
                Note = appointment.Note,
                FileAttaches = appointment.FileAttaches.Select(s => s.Url).ToList(),
                Status = appointment.Status,
                NumberOrder = appointment.NumberOrder,
            };
        }

        public SpecializedExaminationResource MapToSpecializedExaminationResource(SpecializedExamination specializedExamination)
        {
            return new SpecializedExaminationResource
            {
                Name = specializedExamination.Name,
            };
        }

        public ExceptionDateResource MapToExceptionDate(ExceptionDate exceptionDate)
        {
            return new ExceptionDateResource
            {
                Id = exceptionDate.Id,
                FromDate = exceptionDate.FromDate.GetValueOrDefault(),
                ToDate = exceptionDate.ToDate.GetValueOrDefault(),
                IsFullDay = exceptionDate.IsFullDay,
                IsRepeatAnnually = exceptionDate.IsRepeatAnnually,
                Reason = exceptionDate.Reason,
                Type = exceptionDate.Type,
                UnavailableShifts = exceptionDate.UnavailableShifts != null ? exceptionDate.UnavailableShifts.Select(a => MapToShiftResource(a)).ToList() : new List<ShiftResource>(),
                WeekDays = exceptionDate.WeekDayExceptions != null ? exceptionDate.WeekDayExceptions.Select(a => MapToWeekDayExceptionResource(a)).ToList() : new List<WeekDayExceptionResource>(),
            };
        }

        public WeekDayExceptionResource MapToWeekDayExceptionResource(WeekDayException weekDayException)
        {
            return new WeekDayExceptionResource
            {
                Id = weekDayException.Id,
                DayOfWeek = weekDayException.DayOfWeek,
            };
        }
    }
}
