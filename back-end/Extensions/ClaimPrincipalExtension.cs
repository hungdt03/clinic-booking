using System.Security.Claims;

namespace clinic_schedule.Extensions
{
    public static class ClaimPrincipalExtension
    {
        public static string GetEmail(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Email)!;
        }

        public static string GetUserID(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Sid)!;
        }

        public static bool IsAdministrator(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Role) == "ADMIN";
        }

        public static bool IsManager(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Role) == "MANAGER";
        }

        public static bool IsPatient(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Role) == "PATIENT";
        }

        public static bool IsDoctorEmployee(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Role) == "DOCTOR_EMPLOYEE";
        }

        public static bool IsDoctorOwner(this ClaimsPrincipal principal)
        {
            return principal.FindFirstValue(ClaimTypes.Role) == "DOCTOR_OWNER";
        }
    }
}
