using clinic_schedule.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace clinic_schedule.DbContext
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<FileAttach> FileAttaches { get; set; }
        public DbSet<AwardsAndResearch> AwardsAndResearches { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<BookingProcess> BookingProcesses { get; set; }
        public DbSet<Clinic> Clinics { get; set; }
        public DbSet<ClinicImage> ClinicImages { get; set; }
        public DbSet<ClinicSetting> ClinicSettings { get; set; }
        public DbSet<DoctorImage> DoctorImages { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<ExceptionDate> ExceptionDates { get; set; }
        public DbSet<WeekDayException> WeekDayExceptions { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<ServiceType> ServiceTypes { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<SpecializedExamination> SpecializedExaminations { get; set; }
        public DbSet<WorkExperience> WorkExperiences { get; set; }
        public DbSet<Manager> Managers { get; set; }
        public DbSet<Administrator> Administrators { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<AppointmentHistory> AppointmentHistories { get; set; }
        public DbSet<AppToken> AppTokens { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<DeviceToken> DeviceTokens { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            foreach(var entityType in builder.Model.GetEntityTypes())
            {
                var table = entityType.GetTableName();
                if(table!.StartsWith("AspNet"))
                {
                    entityType.SetTableName(table.Substring(6));
                }

                // Quan hệ 1-1 giữa User và Manager
                builder.Entity<Manager>()
                    .HasOne(m => m.User)
                    .WithOne(u => u.Manager)
                    .HasForeignKey<Manager>(m => m.UserId);

                // Quan hệ 1-1 giữa User và Patient
                builder.Entity<Patient>()
                    .HasOne(p => p.User)
                    .WithOne(u => u.Patient)
                    .HasForeignKey<Patient>(p => p.UserId);

                // Quan hệ 1-1 giữa User và Administrator
                builder.Entity<Administrator>()
                    .HasOne(a => a.User)
                    .WithOne(u => u.Administrator)
                    .HasForeignKey<Administrator>(a => a.UserId);

                builder.Entity<Specialization>()
                    .HasMany(s => s.Clinics)
                    .WithMany(c => c.Specializations);

                builder.Entity<Specialization>()
                    .HasMany(s => s.Doctors)
                    .WithMany(c => c.Specializations);

                builder.Entity<WeekDayException>()
                    .HasIndex(s => s.DayOfWeek)
                    .IsUnique();

                builder.Entity<Message>()
                   .HasOne(u => u.Recipient)
                   .WithMany(m => m.MessagesReceived)
                   .OnDelete(DeleteBehavior.Restrict);

                builder.Entity<Message>()
                    .HasOne(u => u.Sender)
                    .WithMany(m => m.MessagesSent)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.Entity<Group>()
                    .HasOne(g => g.LastUser)
                    .WithMany()
                    .HasForeignKey(g => g.LastUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.Entity<Group>()
                   .HasOne(g => g.FirstUser)
                   .WithMany()
                   .HasForeignKey(g => g.FirstUserId)
                   .OnDelete(DeleteBehavior.Restrict);

                builder.Entity<Clinic>()
                    .HasMany(c => c.Favorites)
                    .WithMany(p => p.FavoriteClinics)
                        .UsingEntity<Dictionary<string, object>>(
                                "ClinicPatient",
                                j => j
                                    .HasOne<Patient>()
                                    .WithMany()
                                    .HasForeignKey("PatientId")
                                    .OnDelete(DeleteBehavior.Restrict),
                                j => j
                                    .HasOne<Clinic>()
                                    .WithMany()
                                    .HasForeignKey("ClinicId")
                                    .OnDelete(DeleteBehavior.Restrict)
                            );

                builder.Entity<Doctor>()
                   .HasMany(c => c.Favorites)
                   .WithMany(p => p.FavoriteDoctors)
                   .UsingEntity<Dictionary<string, object>>(
                        "DoctorPatient",
                        j => j
                            .HasOne<Patient>()
                            .WithMany()
                            .HasForeignKey("PatientId")
                            .OnDelete(DeleteBehavior.Restrict), 
                        j => j
                            .HasOne<Doctor>()
                            .WithMany()
                            .HasForeignKey("DoctorId")
                            .OnDelete(DeleteBehavior.Restrict) 
                    );

            }

            SeedingData(builder);
        }

        public void SeedingData(ModelBuilder builder)
        {
            var roles = new List<IdentityRole>()
            {
                new IdentityRole() { Name = "ADMIN", ConcurrencyStamp = "1", NormalizedName = "ADMIN" },
                new IdentityRole() { Name = "DOCTOR_EMPLOYEE", ConcurrencyStamp = "1", NormalizedName = "DOCTOR_EMPLOYEE" },
                new IdentityRole() { Name = "DOCTOR_OWNER", ConcurrencyStamp = "1", NormalizedName = "DOCTOR_OWNER" },
                new IdentityRole() { Name = "MANAGER", ConcurrencyStamp = "1", NormalizedName = "MANAGER" },
                new IdentityRole() { Name = "PATIENT", ConcurrencyStamp = "1", NormalizedName = "PATIENT" }
            };

            // ROLE
            builder.Entity<IdentityRole>().HasData(roles);

            // USER
            var appUser = new User
            {
                FullName = "Đạo Thanh Hưng",
                Email = "hungktpm1406@gmail.com",
                NormalizedEmail = "HUNGKTPM1406@GMAIL.COM",
                EmailConfirmed = true,
                UserName = "admin",
                NormalizedUserName = "ADMIN",
                IsActivated = true,
                IsChangedPassword = true,
                PhoneNumber = "0394488235",
            };

            PasswordHasher<User> hashedPassword = new PasswordHasher<User>();
            appUser.PasswordHash = hashedPassword.HashPassword(appUser, "12345678");
            builder.Entity<User>().HasData(appUser);

            var administrator = new Administrator()
            {
                UserId = appUser.Id,
            };

            builder.Entity<Administrator>().HasData(administrator);
            

            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>() { UserId = appUser.Id, RoleId = roles[0].Id }
            );

        }
    }
}
