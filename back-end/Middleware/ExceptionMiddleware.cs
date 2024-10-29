using clinic_schedule.Core.Exceptions;
using clinic_schedule.Core.Response;

namespace clinic_schedule.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            } catch (Exception ex)
            {
                await OnHandleExceptionAsync(ex, context);
            }
        }

        public async Task OnHandleExceptionAsync(Exception ex, HttpContext context)
        {
            var response = new BaseResponse()
            {
                Success = false,
                Message = ex.Message,
            };

            if (ex is NotFoundException)
            {
                response.StatusCode = System.Net.HttpStatusCode.NotFound;
            } else if (ex is UnauthorizedAccessException) {
                response.StatusCode = System.Net.HttpStatusCode.Unauthorized;
            } else if (ex is AppException || ex is ArgumentOutOfRangeException)
            {
                response.StatusCode = System.Net.HttpStatusCode.BadRequest;
            } else if(ex is NoAccessException)
            {
                response.StatusCode= System.Net.HttpStatusCode.Forbidden;
            }
            else
            {
                response.StatusCode = System.Net.HttpStatusCode.InternalServerError;
            }

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
