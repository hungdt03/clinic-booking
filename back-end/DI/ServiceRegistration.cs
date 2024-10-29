using clinic_schedule.DI.Options;
using clinic_schedule.Infrastructures.Cloudinary;
using clinic_schedule.Infrastructures.JsonWebToken;
using clinic_schedule.Infrastructures.SignalR;
using clinic_schedule.Mapping;
using clinic_schedule.Services.Implementations;
using clinic_schedule.Services.Interfaces;
using clinic_schedule.Validations;
using FirebaseAdmin.Messaging;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Mvc;
using clinic_schedule.Infrastructures.FCM;
using clinic_schedule.Infrastructures.MailSender;

namespace clinic_schedule.DI
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddServiceRegistration(this IServiceCollection services, IConfiguration configuration)
        {
            var cloudinarySettings = new CloudinarySettings();
            configuration.GetSection(nameof(cloudinarySettings)).Bind(cloudinarySettings);
            services.AddSingleton(cloudinarySettings);

            services.AddSingleton<FirebaseMessaging>(provider =>
            {
                if (FirebaseApp.DefaultInstance == null)
                {
                    var defaultApp = FirebaseApp.Create(new AppOptions
                    {
                        Credential = GoogleCredential.FromFile(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "firebase-service-account.json")),
                    });

                    Console.WriteLine(defaultApp.Name);
                }

                return FirebaseMessaging.DefaultInstance;
            });

            services.AddHttpContextAccessor();
            services.AddScoped<Validation>();
            services.Configure<ApiBehaviorOptions>(options
                => options.SuppressModelStateInvalidFilter = true);
            services.AddScoped<JwtService>();
            services.AddScoped<AppMapping>();

            services.AddScoped<IUploadService, UploadService>();

            services.AddScoped<IDoctorService, DoctorService>();
            services.AddScoped<IBookingProcessService, BookingProcessService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IManagerService, ManagerService>();
            services.AddScoped<ISpecializationService, SpecializationService>();
            services.AddScoped<ISpecializedExaminationService, SpecializedExaminationService>();
            services.AddScoped<IClinicService, ClinicService>();
            services.AddScoped<IShiftService, ShiftService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IBrandService, BrandService>();
            services.AddScoped<IServiceTypeService, ServiceTypeService>();
            services.AddScoped<IServiceService, ServiceService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddScoped<ISettingService, SettingService>();
            services.AddScoped<ISearchService, SearchService>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<IGroupService, GroupService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IFirebaseCloudMessagingService, FirebaseCloudMessagingService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IMailService, MailService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddSingleton<ConnectionManager>();

            return services;
        }
    }
}
